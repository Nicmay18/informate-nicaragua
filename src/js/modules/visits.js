/**
 * Módulo de Visitas - Nicaragua Informate
 * Maneja el contador de visitas
 */

export class VisitsManager {
  constructor() {
    this.KEY_VISITAS = 'visitasTotalNI';
    this.KEY_ULTIMA = 'ultimaVisitaNI';
    this.BASE_VISITAS = 1250;
  }

  init() {
    this.incrementar();
  }

  incrementar() {
    try {
      const hoy = new Date().toDateString();
      const ultima = localStorage.getItem(this.KEY_ULTIMA);
      let visitas = parseInt(localStorage.getItem(this.KEY_VISITAS) || this.BASE_VISITAS.toString());
      
      if (ultima !== hoy) {
        localStorage.setItem(this.KEY_ULTIMA, hoy);
        visitas++;
        localStorage.setItem(this.KEY_VISITAS, visitas.toString());
      }
      
      this.actualizarUI(visitas);
    } catch (e) {
      this.actualizarUI(this.BASE_VISITAS);
    }
  }

  actualizarUI(visitas) {
    const el = document.getElementById('visitCount');
    if (el) {
      el.textContent = visitas.toLocaleString();
    }
  }

  getVisitas() {
    try {
      return parseInt(localStorage.getItem(this.KEY_VISITAS) || this.BASE_VISITAS.toString());
    } catch (e) {
      return this.BASE_VISITAS;
    }
  }
}
