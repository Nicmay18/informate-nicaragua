/**
 * Módulo de Radio - Nicaragua Informate
 * Maneja el reproductor de radio en vivo
 */

export class RadioManager {
  constructor() {
    this.audio = null;
    this.activa = false;
  }

  init() {
    this.audio = document.getElementById('radioAudio');
    this.setupErrorHandler();
  }

  setupErrorHandler() {
    if (!this.audio) return;
    
    this.audio.addEventListener('error', () => {
      this.activa = false;
      this.actualizarUI('play');
      this.actualizarNombre('⚠️ Sin señal, prueba otra');
    });
  }

  toggle() {
    if (this.activa) {
      this.pausar();
    } else {
      this.reproducir();
    }
  }

  pausar() {
    if (!this.audio) return;
    this.audio.pause();
    this.audio.src = '';
    this.activa = false;
    this.actualizarUI('play');
    this.actualizarNombre('Selecciona y dale play');
  }

  async reproducir() {
    const select = document.getElementById('radioSelect');
    if (!select || !select.value || !this.audio) return;

    const nombre = select.options[select.selectedIndex].text.replace('📻 ', '');
    this.actualizarNombre('⏳ Conectando...');
    
    this.audio.src = select.value;
    
    try {
      await this.audio.play();
      this.activa = true;
      this.actualizarUI('pause');
      this.actualizarNombre('🎵 ' + nombre);
    } catch (err) {
      this.activa = false;
      this.actualizarNombre('⚠️ Sin señal, prueba otra');
    }
  }

  cambiarEstacion() {
    if (this.activa) {
      this.pausar();
      this.reproducir();
    }
  }

  actualizarUI(icono) {
    const icon = document.getElementById('radioIcon');
    if (icon) {
      icon.className = icono === 'play' ? 'fas fa-play' : 'fas fa-pause';
    }
  }

  actualizarNombre(texto) {
    const nombre = document.getElementById('radioNombre');
    if (nombre) nombre.textContent = texto;
  }
}
