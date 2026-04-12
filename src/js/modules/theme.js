/**
 * Módulo de Tema - Nicaragua Informate
 * Maneja el modo oscuro/claro
 */

export class ThemeManager {
  constructor() {
    this.toggleBtn = null;
    this.prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
  }

  init() {
    this.toggleBtn = document.getElementById('darkToggle');
    this.cargarTemaGuardado();
    this.setupEventListeners();
  }

  cargarTemaGuardado() {
    const savedTheme = localStorage.getItem('theme');
    const systemDark = this.prefersDark.matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemDark)) {
      this.activarOscuro();
    } else {
      this.activarClaro();
    }
  }

  activarOscuro() {
    document.documentElement.setAttribute('data-theme', 'dark');
    if (this.toggleBtn) this.toggleBtn.textContent = '☀️';
    localStorage.setItem('theme', 'dark');
  }

  activarClaro() {
    document.documentElement.removeAttribute('data-theme');
    if (this.toggleBtn) this.toggleBtn.textContent = '🌙';
    localStorage.setItem('theme', 'light');
  }

  toggle() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (isDark) {
      this.activarClaro();
    } else {
      this.activarOscuro();
    }
  }

  setupEventListeners() {
    if (this.toggleBtn) {
      this.toggleBtn.addEventListener('click', () => this.toggle());
    }

    // Escuchar cambios del sistema
    this.prefersDark.addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        if (e.matches) {
          this.activarOscuro();
        } else {
          this.activarClaro();
        }
      }
    });
  }
}
