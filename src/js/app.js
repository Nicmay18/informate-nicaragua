/**
 * Nicaragua Informate - Aplicación Principal
 * Coordinador de todos los módulos
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { NewsManager } from './modules/news.js';
import { RadioManager } from './modules/radio.js';
import { ThemeManager } from './modules/theme.js';
import { WeatherManager } from './modules/weather.js';
import { IndicadoresManager } from './modules/indicadores.js';
import { ShareManager } from './modules/share.js';
import { VisitsManager } from './modules/visits.js';
import { TickerManager } from './modules/ticker.js';
import { ClockManager } from './modules/clock.js';
import { showToast, formatearFecha, calcularLectura, getImagenRespaldo, sanitizarImagen } from './modules/utils.js';

// Configuración Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDVsqRGr7dtdi5ecO14THIdbnEzKKOJxcA",
  authDomain: "informate-instant-nicaragua.firebaseapp.com",
  projectId: "informate-instant-nicaragua",
  storageBucket: "informate-instant-nicaragua.firebasestorage.app",
  messagingSenderId: "24988088146",
  appId: "1:24988088146:web:d26a207508da055668ec8b",
  measurementId: "G-W1B5J61WEP"
};

class App {
  constructor() {
    this.firebase = null;
    this.db = null;
    this.newsManager = null;
    this.radioManager = null;
    this.themeManager = null;
    this.weatherManager = null;
    this.indicadoresManager = null;
    this.shareManager = null;
    this.visitsManager = null;
    this.tickerManager = null;
    this.clockManager = null;
  }

  async init() {
    console.log('🚀 Iniciando Nicaragua Informate...');

    try {
      // 1. Inicializar Firebase
      this.firebase = initializeApp(firebaseConfig);
      this.db = getFirestore(this.firebase);

      // 2. Inicializar módulos
      this.newsManager = new NewsManager(this.db);
      this.radioManager = new RadioManager();
      this.themeManager = new ThemeManager();
      this.weatherManager = new WeatherManager();
      this.indicadoresManager = new IndicadoresManager(this.db);
      this.shareManager = new ShareManager();
      this.visitsManager = new VisitsManager();
      this.tickerManager = new TickerManager(this.newsManager);
      this.clockManager = new ClockManager();

      // 3. Iniciar módulos independientes primero
      this.themeManager.init();
      this.visitsManager.init();
      this.clockManager.init();
      this.weatherManager.init();
      this.indicadoresManager.init();
      this.radioManager.init();

      // 4. Iniciar noticias (esto también inicializa el ticker)
      await this.newsManager.init();
      this.tickerManager.init();

      // 5. Configurar eventos globales
      this.setupGlobalEvents();

      // 6. Registrar Service Worker
      this.registerSW();

      console.log('✅ App lista');
    } catch (error) {
      console.error('Error inicializando app:', error);
      showToast('Error al cargar la aplicación', 'error');
    }
  }

  setupGlobalEvents() {
    // Escape para cerrar modal
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.cerrarModal();
    });

    // Cambio de hash
    window.addEventListener('popstate', () => {
      if (!location.hash) this.cerrarModal();
    });

    // Online/Offline
    window.addEventListener('online', () => {
      showToast('Conexión restaurada', 'success');
    });

    window.addEventListener('offline', () => {
      showToast('Modo offline - Usando caché', 'warning');
    });
  }

  registerSW() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }
  }

  // Métodos expuestos globalmente para onclick inline
  cambiarCategoria(cat, btn) {
    this.newsManager.cambiarCategoria(cat);
    
    // Actualizar estado visual de botones
    document.querySelectorAll('.menu button').forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-pressed', 'false');
    });
    
    if (btn) {
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
    }
  }

  cargarMas() {
    this.newsManager.cargarMas();
  }

  abrirNoticia(id) {
    this.newsManager.abrirPorId(id);
    this.shareManager.setCurrentNoticia(this.newsManager.currentNoticia);
  }

  cerrarModal() {
    this.newsManager.cerrarModal();
  }

  // Radio
  toggleRadio() {
    this.radioManager.toggle();
  }

  cambiarRadio() {
    this.radioManager.cambiarEstacion();
  }

  // Share
  shareFacebook() {
    this.shareManager.shareFacebook();
  }

  shareTwitter() {
    this.shareManager.shareTwitter();
  }

  shareWhatsApp() {
    this.shareManager.shareWhatsApp();
  }

  copyLink() {
    this.shareManager.copyLink();
  }

  sharePage() {
    this.shareManager.sharePage();
  }
}

// Crear instancia global
const app = new App();

// Exponer funciones necesarias para onclick inline
window.app = app;
window.cambiar = (cat, btn) => app.cambiarCategoria(cat, btn);
window.cargarMas = () => app.cargarMas();
window.abrirPorId = (id) => app.abrirNoticia(id);
window.cerrarModal = () => app.cerrarModal();
window.toggleRadio = () => app.toggleRadio();
window.cambiarRadio = () => app.cambiarRadio();
window.shareFacebook = () => app.shareFacebook();
window.shareTwitter = () => app.shareTwitter();
window.shareWhatsApp = () => app.shareWhatsApp();
window.copyLink = () => app.copyLink();
window.sharePage = () => app.sharePage();
window.imgError = (el, cat, idx) => {
  el.onerror = null;
  el.src = getImagenRespaldo(cat, idx);
};

// Iniciar cuando DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => app.init());
} else {
  app.init();
}
