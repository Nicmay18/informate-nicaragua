/**
 * App - Entry point de la aplicación
 * @module app
 */

import CONFIG from './core/config.js';
import { initializeFirebase, NewsRepository } from './core/api.js';
import { NewsCarousel } from './components/Carousel.js';
import { NewsGrid } from './components/NewsCard.js';
import { Modal } from './components/Modal.js';
import { initAdManager } from './features/ads-manager.js';

/**
 * Aplicación principal
 */
class App {
  constructor() {
    this.db = null;
    this.newsRepo = null;
    this.carousel = null;
    this.newsGrid = null;
    this.modal = null;
    this.noticias = [];
    this.categoriaActual = 'Todas';
  }

  /**
   * Inicializa la aplicación
   */
  async init() {
    try {
      console.log('🚀 Inicializando Nicaragua Informate v2.0...');

      // 1. Inicializar Firebase
      await this.initFirebase();

      // 2. Inicializar componentes
      this.initComponents();

      // 3. Cargar noticias
      await this.loadNews();

      // 4. Configurar event listeners
      this.setupEventListeners();

      // 5. Inicializar features
      this.initFeatures();

      // 6. Inicializar AdManager
      initAdManager({
        viewabilityThreshold: 0.5,
        refreshInterval: 30000,
        maxRefreshes: 3
      });

      console.log('✅ Aplicación inicializada correctamente');

    } catch (error) {
      console.error('❌ Error inicializando aplicación:', error);
      this.handleInitError(error);
    }
  }

  /**
   * Inicializa Firebase
   * @private
   */
  async initFirebase() {
    try {
      this.db = await initializeFirebase();
      this.newsRepo = new NewsRepository(this.db);
      console.log('✅ Firebase inicializado');
    } catch (error) {
      console.error('❌ Error inicializando Firebase:', error);
      throw error;
    }
  }

  /**
   * Inicializa componentes
   * @private
   */
  initComponents() {
    // Carousel
    this.carousel = new NewsCarousel('carouselNoticias', {
      interval: 15000,
      autoplay: true,
      onSlideClick: (id) => this.openNoticia(id)
    });

    // News Grid
    this.newsGrid = new NewsGrid('lista', {
      itemsPerPage: CONFIG.pagination.itemsPerPage,
      onCardClick: (id) => this.openNoticia(id)
    });

    // Modal
    this.modal = new Modal('modal', {
      closeOnEscape: true,
      closeOnBackdrop: true
    });

    console.log('✅ Componentes inicializados');
  }

  /**
   * Carga noticias desde Firestore
   * @private
   */
  async loadNews() {
    try {
      // Mostrar skeleton loaders
      this.showSkeletonLoaders();

      // Cargar noticias
      this.noticias = await this.newsRepo.getLatest({
        limit: 100,
        useCache: true
      });

      if (!this.noticias || this.noticias.length === 0) {
        this.showEmptyState();
        return;
      }

      // Renderizar componentes
      this.carousel.init(this.noticias.slice(0, CONFIG.pagination.carouselItems));
      this.newsGrid.render(this.noticias);

      // Actualizar trending y populares
      this.updateSidebar();

      // Actualizar contador de visitas
      this.updateVisitCounter();

      console.log(`✅ Cargadas ${this.noticias.length} noticias`);

    } catch (error) {
      console.error('❌ Error cargando noticias:', error);
      this.showErrorState();
    }
  }

  /**
   * Configura event listeners
   * @private
   */
  setupEventListeners() {
    // Menú de categorías
    const menuButtons = document.querySelectorAll('.menu button');
    menuButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const categoria = e.target.textContent.trim().split(' ').pop();
        this.filterByCategory(categoria);
      });
    });

    // Búsqueda
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.handleSearch(e.target.value);
      });
    }

    // Scroll infinito
    this.setupInfiniteScroll();

    // Botón volver arriba
    this.setupBackToTop();

    console.log('✅ Event listeners configurados');
  }

  /**
   * Filtra noticias por categoría
   * @param {string} categoria - Categoría a filtrar
   */
  filterByCategory(categoria) {
    this.categoriaActual = categoria;

    // Actualizar botones activos
    document.querySelectorAll('.menu button').forEach(btn => {
      btn.classList.remove('active');
    });
    event.target.classList.add('active');

    // Mostrar/ocultar carousel
    const carousel = document.getElementById('carouselNoticias');
    if (carousel) {
      carousel.style.display = categoria === 'Todas' ? 'block' : 'none';
    }

    // Filtrar grid
    if (categoria === 'Todas') {
      this.newsGrid.render(this.noticias);
    } else {
      const filtradas = this.noticias.filter(n => n.categoria === categoria);
      this.newsGrid.render(filtradas);
    }

    // Scroll al inicio
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /**
   * Maneja búsqueda
   * @param {string} query - Término de búsqueda
   */
  handleSearch(query) {
    const term = query.trim().toLowerCase();
    
    if (!term) {
      this.hideSearchResults();
      return;
    }

    const resultados = this.noticias.filter(n =>
      (n.titulo || '').toLowerCase().includes(term) ||
      (n.resumen || '').toLowerCase().includes(term) ||
      (n.categoria || '').toLowerCase().includes(term)
    ).slice(0, 6);

    this.showSearchResults(resultados, term);
  }

  /**
   * Muestra resultados de búsqueda
   * @private
   */
  showSearchResults(resultados, term) {
    const searchResults = document.getElementById('searchResults');
    if (!searchResults) return;

    if (resultados.length === 0) {
      searchResults.innerHTML = `
        <div class="search-no-results">
          😕 Sin resultados para "<strong>${term}</strong>"
        </div>
      `;
    } else {
      searchResults.innerHTML = resultados.map(n => `
        <div class="search-result-item" onclick="app.openNoticia('${n.id}')">
          <img class="search-result-img" 
               src="${n.imagen}" 
               onerror="this.style.display='none'">
          <div>
            <div class="search-result-title">${n.titulo}</div>
            <div class="search-result-cat">${n.categoria}</div>
          </div>
        </div>
      `).join('');
    }

    searchResults.style.display = 'block';
  }

  /**
   * Oculta resultados de búsqueda
   * @private
   */
  hideSearchResults() {
    const searchResults = document.getElementById('searchResults');
    if (searchResults) {
      searchResults.style.display = 'none';
    }
  }

  /**
   * Abre una noticia en el modal
   * @param {string} id - ID de la noticia
   */
  openNoticia(id) {
    const noticia = this.noticias.find(n => n.id === id);
    if (noticia) {
      this.modal.openWithNoticia(noticia);
      
      // Incrementar vistas
      this.newsRepo.incrementViews(id);
    }
  }

  /**
   * Configura scroll infinito
   * @private
   */
  setupInfiniteScroll() {
    const sentinel = document.getElementById('scrollSentinel');
    if (!sentinel) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        const hasMore = this.newsGrid.loadMore();
        if (!hasMore) {
          observer.disconnect();
        }
      }
    }, { rootMargin: '200px' });

    observer.observe(sentinel);
  }

  /**
   * Configura botón volver arriba
   * @private
   */
  setupBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;

    window.addEventListener('scroll', () => {
      btn.style.display = window.scrollY > 400 ? 'flex' : 'none';
    });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /**
   * Actualiza sidebar (trending, populares)
   * @private
   */
  updateSidebar() {
    const trending = this.noticias.slice(0, CONFIG.pagination.trendingItems);
    const container = document.getElementById('trendingContainer');
    
    if (container && trending.length > 0) {
      container.innerHTML = trending.map((n, i) => `
        <div class="trending-item" onclick="app.openNoticia('${n.id}')">
          <div class="trending-number">${String(i + 1).padStart(2, '0')}</div>
          <div style="flex:1;">
            <div class="trending-title">${n.titulo}</div>
            <div class="trending-meta">
              <i class="far fa-clock"></i> ${this.formatFecha(n.fecha)}
            </div>
          </div>
        </div>
      `).join('');
    }
  }

  /**
   * Actualiza contador de visitas
   * @private
   */
  updateVisitCounter() {
    const total = this.noticias.reduce((sum, n) => sum + (parseInt(n.vistas) || 0), 0);
    const formatted = this.formatNumber(total);
    
    const counter = document.getElementById('visitCount');
    if (counter) {
      counter.textContent = formatted;
    }
  }

  /**
   * Inicializa features adicionales
   * @private
   */
  initFeatures() {
    // Reloj
    this.updateClock();
    setInterval(() => this.updateClock(), 60000);

    // Clima
    this.updateWeather();
    setInterval(() => this.updateWeather(), 8000);
  }

  /**
   * Actualiza reloj
   * @private
   */
  updateClock() {
    const ahora = new Date();
    const hora = ahora.toLocaleTimeString('es-NI', { hour: '2-digit', minute: '2-digit' });
    const fecha = ahora.toLocaleDateString('es-NI', { weekday: 'short', day: 'numeric', month: 'short' });
    
    const el = document.getElementById('hora');
    if (el) {
      el.textContent = `🕐 ${hora} | ${fecha}`;
    }
  }

  /**
   * Actualiza clima
   * @private
   */
  async updateWeather() {
    // Implementación simple - puede mejorarse
    const el = document.getElementById('clima');
    if (el) {
      el.textContent = '📍 Managua: 28°C';
    }
  }

  /**
   * Muestra skeleton loaders
   * @private
   */
  showSkeletonLoaders() {
    // Ya están en el HTML
  }

  /**
   * Muestra estado vacío
   * @private
   */
  showEmptyState() {
    const grid = document.getElementById('lista');
    if (grid) {
      grid.innerHTML = `
        <div style="grid-column:1/-1;text-align:center;padding:40px;">
          <div style="font-size:48px;margin-bottom:16px;">📭</div>
          <p>No hay noticias disponibles</p>
        </div>
      `;
    }
  }

  /**
   * Muestra estado de error
   * @private
   */
  showErrorState() {
    const grid = document.getElementById('lista');
    if (grid) {
      grid.innerHTML = `
        <div style="grid-column:1/-1;text-align:center;padding:40px;">
          <div style="font-size:48px;margin-bottom:16px;">⚠️</div>
          <p>Error cargando noticias. Por favor, recarga la página.</p>
        </div>
      `;
    }
  }

  /**
   * Maneja error de inicialización
   * @private
   */
  handleInitError(error) {
    console.error('Error crítico:', error);
    // Mostrar mensaje al usuario
    document.body.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:center;height:100vh;text-align:center;padding:20px;">
        <div>
          <h1 style="font-size:48px;margin-bottom:20px;">⚠️</h1>
          <h2>Error al cargar la aplicación</h2>
          <p>Por favor, recarga la página o intenta más tarde.</p>
          <button onclick="location.reload()" style="margin-top:20px;padding:10px 20px;font-size:16px;cursor:pointer;">
            Recargar
          </button>
        </div>
      </div>
    `;
  }

  /**
   * Utilidades
   */
  formatFecha(fecha) {
    // Usar utilidad del módulo utils
    return fecha ? new Date(fecha).toLocaleDateString('es-NI') : '';
  }

  formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1).replace('.0', '') + 'M+';
    if (num >= 1000) return (num / 1000).toFixed(1).replace('.0', '') + 'K+';
    return num.toLocaleString() + '+';
  }
}

// Inicializar aplicación
const app = new App();

// Exponer globalmente para uso en HTML
window.app = app;

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => app.init());
} else {
  app.init();
}

export default app;
