/**
 * Módulo de Noticias - Nicaragua Informate
 * Maneja la carga, filtrado y renderizado de noticias
 */

import { 
  sanitizarImagen, 
  getColorCategoria, 
  formatearFecha,
  calcularLectura,
  getNoticiasEjemplo 
} from './utils.js';

export class NewsManager {
  constructor(firebaseDB) {
    this.db = firebaseDB;
    this.todas = [];
    this.filtradas = [];
    this.categoria = 'Todas';
    this.searchQuery = '';
    this.paginaActual = 0;
    this.POR_PAGINA = 8;
    this.currentNoticia = null;
  }

  async init() {
    await this.cargar();
    this.setupEventListeners();
  }

  async cargar() {
    try {
      const { collection, query, orderBy, onSnapshot } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
      
      const q = query(collection(this.db, 'noticias'), orderBy('fecha', 'desc'));
      
      onSnapshot(q, (snap) => {
        this.todas = [];
        snap.forEach((d, idx) => {
          const data = d.data();
          data.id = d.id;
          const rawImg = data.imagen || data.image || data.img || data.urlImagen || data.photo || data.foto || '';
          data.imagen = sanitizarImagen(rawImg, data.categoria, idx);
          this.todas.push(data);
        });
        
        if (!this.todas.length) {
          this.todas = getNoticiasEjemplo();
        }
        
        this.pintar();
        this.actualizarPopulares();
        this.actualizarTrending();
      }, (err) => {
        console.error('Error en snapshot:', err);
        if (!this.todas.length) {
          this.todas = getNoticiasEjemplo();
          this.pintar();
        }
      });
    } catch (e) {
      console.error('Error cargando noticias:', e);
      this.todas = getNoticiasEjemplo();
      this.pintar();
    }
  }

  getFiltradas() {
    let datos = this.categoria === 'Todas' ? this.todas : this.todas.filter(n => n.categoria === this.categoria);
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      datos = datos.filter(n => n.titulo?.toLowerCase().includes(q) || n.resumen?.toLowerCase().includes(q));
    }
    return datos;
  }

  pintar() {
    const portada = document.getElementById('portada');
    const lista = document.getElementById('lista');
    const loadMoreBtn = document.getElementById('loadMoreBtn');

    if (!portada || !lista) return;

    this.filtradas = this.getFiltradas();
    this.paginaActual = 0;
    portada.innerHTML = '';
    lista.innerHTML = '';

    if (!this.filtradas.length) {
      lista.innerHTML = '<div class="no-results"><div class="icon">📭</div><p>No hay noticias en esta categoría</p></div>';
      loadMoreBtn.style.display = 'none';
      return;
    }

    const principal = this.filtradas[0];
    const laterales = this.filtradas.slice(1, 4);
    const resto = this.filtradas.slice(4, 4 + this.POR_PAGINA);

    // Hero principal
    if (principal) {
      const heroImg = sanitizarImagen(principal.imagen, principal.categoria, 0);
      const hero = document.createElement('div');
      hero.className = 'hero-layout';
      hero.innerHTML = `
        <div class="hero-main" onclick="app.abrirNoticia('${principal.id}')" role="button" tabindex="0" aria-label="Leer: ${principal.titulo}">
          <img src="${heroImg}" alt="${principal.titulo}" onerror="this.src='${sanitizarImagen('', principal.categoria, 1)}'" loading="eager">
          <div class="hero-content">
            <span class="hero-badge" style="background:${getColorCategoria(principal.categoria)}">${principal.categoria}</span>
            <h2>${principal.titulo}</h2>
            <p>${principal.resumen || ''}</p>
            <div class="hero-meta"><span>📅 ${formatearFecha(principal.fecha)}</span></div>
          </div>
        </div>
        <div class="hero-side">
          ${laterales.map((n, idx) => {
            const img = sanitizarImagen(n.imagen, n.categoria, idx + 1);
            return `<div class="side-item" onclick="app.abrirNoticia('${n.id}')" role="button" tabindex="0" aria-label="Leer: ${n.titulo}">
              <img src="${img}" alt="${n.titulo}" onerror="this.src='${sanitizarImagen('', n.categoria, idx + 2)}'" loading="lazy">
              <div class="side-content">
                <span class="side-tag" style="background:${getColorCategoria(n.categoria)}">${n.categoria}</span>
                <h3>${n.titulo}</h3>
              </div>
            </div>`;
          }).join('')}
        </div>`;
      portada.appendChild(hero);
    }

    // Grid de cards
    this.renderCards(resto, lista);
    this.paginaActual = 1;

    const hayMas = this.filtradas.length > 4 + this.POR_PAGINA;
    loadMoreBtn.style.display = hayMas ? 'block' : 'none';
  }

  renderCards(items, container) {
    items.forEach((n, idx) => {
      const img = sanitizarImagen(n.imagen, n.categoria, idx + 4);
      const card = document.createElement('div');
      card.className = 'card';
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-label', `Leer: ${n.titulo}`);
      card.onclick = () => this.abrirPorId(n.id);
      card.onkeydown = (e) => { if (e.key === 'Enter') this.abrirPorId(n.id); };
      card.innerHTML = `
        <div class="card-image-wrapper">
          <img src="${img}" alt="${n.titulo}" onerror="this.src='${sanitizarImagen('', n.categoria, idx + 5)}'" loading="lazy">
          <div class="card-overlay" aria-hidden="true"></div>
        </div>
        <div class="card-body">
          <span class="tag ${n.categoria}">${n.categoria}</span>
          <h3>${n.titulo}</h3>
          <p>${n.resumen || ''}</p>
          <div class="card-footer">
            <span>${formatearFecha(n.fecha)}</span>
            <span class="read-more" aria-hidden="true">Leer más →</span>
          </div>
        </div>`;
      container.appendChild(card);
    });
  }

  cargarMas() {
    const btn = document.getElementById('loadMoreBtn');
    if (!btn) return;
    
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin" aria-hidden="true"></i> Cargando...';

    const inicio = 4 + this.paginaActual * this.POR_PAGINA;
    const fin = inicio + this.POR_PAGINA;
    const mas = this.filtradas.slice(inicio, fin);

    this.renderCards(mas, document.getElementById('lista'));
    this.paginaActual++;

    const hayMas = this.filtradas.length > 4 + (this.paginaActual * this.POR_PAGINA);
    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-plus" aria-hidden="true"></i> Cargar más noticias';
    btn.style.display = hayMas ? 'block' : 'none';
  }

  actualizarPopulares() {
    const container = document.getElementById('popularPosts');
    if (!container) return;
    
    const items = this.todas.slice(0, 5);
    if (!items.length) {
      container.innerHTML = '<p style="color:#94a3b8;font-size:13px;">No hay noticias aún</p>';
      return;
    }
    
    container.innerHTML = items.map((n, idx) => {
      const img = sanitizarImagen(n.imagen, n.categoria, idx);
      return `<div style="display:flex;gap:12px;margin-bottom:16px;cursor:pointer;" onclick="app.abrirNoticia('${n.id}')" role="button" tabindex="0" aria-label="Leer: ${n.titulo}">
        <div style="width:60px;height:60px;border-radius:8px;overflow:hidden;flex-shrink:0;background:var(--border);">
          <img src="${img}" style="width:100%;height:100%;object-fit:cover;" onerror="this.src='${sanitizarImagen('', n.categoria, idx + 1)}'" loading="lazy" alt="">
        </div>
        <div style="flex:1;">
          <div style="font-size:13px;font-weight:600;line-height:1.4;color:var(--text);display:-webkit-box;-webkit-line-clamp:2;line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">${n.titulo}</div>
          <div style="font-size:11px;color:#94a3b8;margin-top:4px;">${n.categoria}</div>
        </div>
      </div>`;
    }).join('');
  }

  actualizarTrending() {
    const container = document.getElementById('trendingContainer');
    if (!container) return;
    
    const items = this.todas.slice(0, 3);
    if (!items.length) {
      container.innerHTML = '<div class="trending-item">No hay noticias aún</div>';
      return;
    }
    
    container.innerHTML = items.map((n, i) => `
      <div class="trending-item" onclick="app.abrirNoticia('${n.id}')" role="button" tabindex="0" aria-label="Leer: ${n.titulo}">
        <div class="trending-number">${i + 1}</div>
        <div class="trending-title">${n.titulo}</div>
        <div class="trending-meta"><i class="fas fa-clock" aria-hidden="true"></i> ${formatearFecha(n.fecha)} • ${n.categoria}</div>
      </div>`).join('');
  }

  abrirPorId(id) {
    const n = this.todas.find(x => x.id === id);
    if (n) this.abrir(n);
  }

  abrir(n) {
    this.currentNoticia = n;
    const mCat = document.getElementById('mCat');
    const mTitulo = document.getElementById('mTitulo');
    const mImg = document.getElementById('mImg');
    const mCont = document.getElementById('mCont');
    const mFecha = document.getElementById('mFecha');
    const mReadTime = document.getElementById('mReadTime');
    const modal = document.getElementById('modal');

    if (!mCat || !modal) return;

    mCat.className = 'tag ' + n.categoria;
    mCat.textContent = n.categoria;
    mTitulo.textContent = n.titulo;
    
    // calcularLectura y formatearFecha ya están importados
    // getImagenRespaldo se obtiene desde utils
    const img = sanitizarImagen(n.imagen, n.categoria, 0);
    mImg.src = img;
    mImg.alt = n.titulo;
    mImg.onerror = () => { 
      mImg.onerror = null; 
      // Fallback a imagen de respaldo
      const seeds = {'Sucesos':[101,102,103],'Deportes':[201,202,203],'Internacionales':[301,302,303],'Tecnología':[401,402,403],'Tecnologia':[401,402,403],'default':[10,20,30]};
      const catSeeds = seeds[n.categoria] || seeds['default'];
      mImg.src = `https://picsum.photos/seed/${catSeeds[1]}/800/500`;
    };
    
    mCont.textContent = n.contenido || n.resumen || 'Contenido no disponible';
    mFecha.textContent = '📅 ' + formatearFecha(n.fecha);
    mReadTime.textContent = calcularLectura(n.contenido || n.resumen);
    
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    history.pushState({ id: n.id }, n.titulo, '#' + n.id);
    const modalContent = document.getElementById('modalContent');
    if (modalContent) modalContent.focus();
  }

  cerrarModal() {
    const modal = document.getElementById('modal');
    if (modal) {
      modal.classList.remove('open');
      document.body.style.overflow = '';
      history.pushState({}, document.title, window.location.pathname);
      this.currentNoticia = null;
    }
  }

  cambiarCategoria(cat) {
    this.categoria = cat;
    this.searchQuery = '';
    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.value = '';
    this.pintar();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  buscar(query) {
    this.searchQuery = query.trim();
    this.pintar();
  }

  setupEventListeners() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => this.buscar(e.target.value));
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.cerrarModal();
    });

    window.addEventListener('popstate', () => {
      if (!location.hash) this.cerrarModal();
    });
  }
}
