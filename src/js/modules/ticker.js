/**
 * Módulo de Ticker - Nicaragua Informate
 * Maneja el ticker de noticias en la parte superior
 */

export class TickerManager {
  constructor(newsManager) {
    this.newsManager = newsManager;
    this.container = null;
  }

  init() {
    this.container = document.querySelector('.ticker-content');
    this.render();
  }

  render() {
    if (!this.container) return;

    const noticias = this.newsManager?.todas?.slice(0, 5) || [];
    const fecha = new Date().toLocaleDateString('es-NI', { weekday: 'long', day: 'numeric', month: 'long' });
    
    const items = noticias.map(n => `
      <div class="ticker-item">
        <span>🔥</span> ${n.titulo}
      </div>
    `).join('');

    // Duplicar items para animación continua
    this.container.innerHTML = `
      <div class="ticker-item"><span>📅</span> ${fecha}</div>
      ${items}
      <div class="ticker-item"><span>📅</span> ${fecha}</div>
      ${items}
    `;
  }

  actualizar() {
    this.render();
  }
}
