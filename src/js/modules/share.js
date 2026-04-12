/**
 * Módulo de Compartir - Nicaragua Informate
 * Maneja las funciones de compartir en redes sociales
 */

import { showToast } from './utils.js';

export class ShareManager {
  constructor() {
    this.currentNoticia = null;
  }

  setCurrentNoticia(noticia) {
    this.currentNoticia = noticia;
  }

  shareFacebook() {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'width=600,height=400');
  }

  shareTwitter() {
    if (!this.currentNoticia) return;
    const text = encodeURIComponent(this.currentNoticia.titulo);
    const url = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank', 'width=600,height=400');
  }

  shareWhatsApp() {
    if (!this.currentNoticia) return;
    const text = encodeURIComponent(`${this.currentNoticia.titulo} - ${window.location.href}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  }

  async copyLink() {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      showToast('Enlace copiado al portapapeles', 'success');
    } catch (err) {
      // Fallback para navegadores antiguos
      const input = document.createElement('input');
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      showToast('Enlace copiado al portapapeles', 'success');
    }
  }

  sharePage() {
    if (navigator.share) {
      navigator.share({
        title: 'Nicaragua Informate',
        text: 'Noticias de Nicaragua al momento',
        url: window.location.href
      }).catch(() => {});
    } else {
      this.shareFacebook();
    }
  }
}
