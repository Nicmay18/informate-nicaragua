/**
 * Utilidades compartidas - Nicaragua Informate
 */

// Imágenes de respaldo por categoría
export const IMAGENES_RESPALDO = {
  'Sucesos': [101, 102, 103, 104],
  'Deportes': [201, 202, 203],
  'Internacionales': [301, 302, 303],
  'Tecnología': [401, 402, 403],
  'Tecnologia': [401, 402, 403],
  'default': [10, 20, 30]
};

const FB_PATTERNS = ['facebook.com', 'fbcdn.net', 'fbcdn.com', 'scontent-', 'scontent.', 'instagram.com', 'cdninstagram', 'fbstatic', 'fbsbx.com', 'fb.com', 'xx.fbcdn'];

export function esFacebookCDN(url) {
  if (!url || typeof url !== 'string') return true;
  const u = url.toLowerCase();
  return FB_PATTERNS.some(p => u.includes(p));
}

export function getImagenRespaldo(cat, idx = 0) {
  const seeds = IMAGENES_RESPALDO[cat] || IMAGENES_RESPALDO['default'];
  const seed = seeds[Math.abs(idx) % seeds.length];
  return `https://picsum.photos/seed/${seed}/800/500`;
}

export function sanitizarImagen(url, cat, idx = 0) {
  if (!url || typeof url !== 'string' || !url.startsWith('http')) return getImagenRespaldo(cat, idx);
  if (esFacebookCDN(url)) return getImagenRespaldo(cat, idx);
  return url;
}

// Handler global de error de imagen
export function imgError(el, cat, idx) {
  el.onerror = null;
  el.src = getImagenRespaldo(cat, idx);
}

export function getColorCategoria(cat) {
  const c = {
    'Sucesos': '#c62828',
    'Deportes': '#2e7d32',
    'Internacionales': '#6a1b9a',
    'Tecnología': '#0288d1',
    'Tecnologia': '#0288d1'
  };
  return c[cat] || '#0d47a1';
}

export function formatearFecha(fecha) {
  if (!fecha) return 'Fecha no disponible';
  try {
    const d = fecha.toDate ? fecha.toDate() : (fecha instanceof Date ? fecha : new Date(fecha));
    if (!isNaN(d.getTime())) return d.toLocaleString('es-NI', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  } catch (e) {}
  return 'Fecha no disponible';
}

export function calcularLectura(texto) {
  if (!texto) return 1;
  return Math.max(1, Math.ceil(texto.split(/\s+/).length / 200));
}

export function showToast(msg, type = 'default', duration = 3000) {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  const icon = type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle';
  toast.innerHTML = `<i class="fas fa-${icon}" aria-hidden="true"></i> ${msg}`;
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'toastOut .3s ease-in forwards';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

export function getNoticiasEjemplo() {
  const ahora = new Date();
  return [
    { id: '1', titulo: 'Gobierno anuncia nuevas medidas económicas para 2025', categoria: 'Sucesos', imagen: getImagenRespaldo('Sucesos', 0), resumen: 'El gobierno de Nicaragua presentó un paquete de medidas destinadas a impulsar el crecimiento económico.', contenido: 'El gobierno de Nicaragua presentó este martes un paquete de medidas económicas destinadas a impulsar el crecimiento y la inversión extranjera directa en el país.', fecha: { toDate: () => ahora } },
    { id: '2', titulo: 'Selección Nicaragüense se prepara para eliminatorias', categoria: 'Deportes', imagen: getImagenRespaldo('Deportes', 0), resumen: 'La selección nacional intensifica su preparación de cara a los próximos partidos.', contenido: 'La selección nacional de fútbol de Nicaragua intensifica su preparación en el Centro de Alto Rendimiento.', fecha: { toDate: () => new Date(ahora - 3600000) } },
    { id: '3', titulo: 'Avances en tecnología: Nicaragua conecta más comunidades', categoria: 'Tecnología', imagen: getImagenRespaldo('Tecnología', 0), resumen: 'Nuevas torres de telecomunicaciones permitirán llevar internet a zonas rurales.', contenido: 'El Instituto Nicaragüense de Telecomunicaciones anunció la instalación de nuevas torres.', fecha: { toDate: () => new Date(ahora - 7200000) } },
    { id: '4', titulo: 'Descubrimiento arqueológico en ruinas precolombinas', categoria: 'Internacionales', imagen: getImagenRespaldo('Internacionales', 0), resumen: 'Arqueólogos descubrieron nuevos vestigios de más de 1000 años de antigüedad.', contenido: 'Un equipo de arqueólogos realizó un importante descubrimiento en el sitio arqueológico.', fecha: { toDate: () => new Date(ahora - 10800000) } },
    { id: '5', titulo: 'Nicaragua lidera exportaciones de café en Centroamérica', categoria: 'Internacionales', imagen: getImagenRespaldo('Internacionales', 1), resumen: 'Las exportaciones de café nicaragüense alcanzaron un récord histórico este año.', contenido: 'Nicaragua se posiciona como el mayor exportador de café de la región centroamericana.', fecha: { toDate: () => new Date(ahora - 14400000) } },
    { id: '6', titulo: 'Nuevo estadio de béisbol en Managua', categoria: 'Deportes', imagen: getImagenRespaldo('Deportes', 1), resumen: 'El gobierno anunció la construcción de un moderno estadio de béisbol en la capital.', contenido: 'Las obras del nuevo estadio de béisbol comenzarán el próximo mes.', fecha: { toDate: () => new Date(ahora - 18000000) } },
    { id: '7', titulo: 'Innovación tecnológica en el sector agrícola', categoria: 'Tecnología', imagen: getImagenRespaldo('Tecnología', 1), resumen: 'Agricultores nicaragüenses adoptan drones para mejorar sus cosechas.', contenido: 'El uso de tecnología de precisión está transformando la agricultura en Nicaragua.', fecha: { toDate: () => new Date(ahora - 21600000) } },
    { id: '8', titulo: 'Operativo policial en Managua deja varios detenidos', categoria: 'Sucesos', imagen: getImagenRespaldo('Sucesos', 1), resumen: 'La Policía Nacional realizó un operativo en el barrio Oriental.', contenido: 'Un operativo policial en el mercado Oriental resultó en la detención de varios sospechosos.', fecha: { toDate: () => new Date(ahora - 25200000) } }
  ];
}
