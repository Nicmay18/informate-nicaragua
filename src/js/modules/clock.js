/**
 * Módulo de Reloj - Nicaragua Informate
 * Maneja la hora actual en el header
 */

export class ClockManager {
  constructor() {
    this.el = null;
    this.interval = null;
  }

  init() {
    this.el = document.getElementById('hora');
    this.actualizar();
    this.interval = setInterval(() => this.actualizar(), 1000);
  }

  actualizar() {
    if (!this.el) return;
    
    try {
      const ahora = new Date();
      this.el.textContent = ahora.toLocaleDateString('es-NI', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      // Silenciar errores
    }
  }

  destroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
}
