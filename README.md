# Nicaragua Informate 3.0 🇳🇮

<p align="center">
  <img src="public/logo.png" alt="Nicaragua Informate Logo" width="200">
</p>

<p align="center">
  <strong>Periodismo de Precisión</strong> | Portal de noticias de Nicaragua con tecnología de punta
</p>

<p align="center">
  <a href="#características">Características</a> •
  <a href="#tecnologías">Tecnologías</a> •
  <a href="#instalación">Instalación</a> •
  <a href="#uso">Uso</a> •
  <a href="#estructura">Estructura</a>
</p>

---

## 🚀 Características

### Informate 3.0 incluye:

- ✅ **Firebase Firestore** - Noticias en tiempo real desde la base de datos
- ✅ **Imágenes WebP** - Optimizadas para carga rápida
- ✅ **6 Categorías** - Sucesos, Nacionales, Deportes, Internacionales, Espectáculo, Premium
- ✅ **Contador de Vistas** - Sistema de analytics local por noticia
- ✅ **Clima en Tiempo Real** - 12 ciudades de Nicaragua (Open-Meteo API)
- ✅ **Diseño Premium** - Estilo CNN/BBC con tipografía profesional
- ✅ **Responsive** - Optimizado para móvil, tablet y desktop
- ✅ **PWA Ready** - Service Worker incluido
- ✅ **Modo Oscuro** - Toggle de tema claro/oscuro
- ✅ **Radio Online** - 5 emisoras nicaragüenses

---

## 🛠️ Tecnologías

| Frontend | Backend | Servicios |
|----------|---------|-----------|
| HTML5 | Firebase Firestore | Open-Meteo API |
| CSS3 (Variables) | Firebase Storage | picsum.photos |
| JavaScript ES6+ | Firebase Hosting | Font Awesome |
| Google Fonts | Realtime Updates | LocalStorage |

### Categorías con Colores

```
🔴 Sucesos       #dc2626 - Emergencias, Policía
🔵 Nacionales    #1e40af - Gobierno, Instituciones  
🟢 Deportes      #047857 - Fútbol, Béisbol
🟣 Internacionales #7c3aed - Mundo, Exportaciones
🩷 Espectáculo   #db2777 - Cine, Teatro, Arte
🟠 Premium       #d97706 - Análisis exclusivo
```

---

## 📦 Instalación

### Requisitos
- Node.js 18+ (para servidor local)
- Navegador moderno con soporte ES6
- Conexión a internet (para Firebase)

### Clonar repositorio

```bash
git clone https://github.com/tuusuario/informate-nicaragua.git
cd informate-nicaragua
```

### Opción 1: Servidor con Node.js

```bash
npm install -g serve
npx serve -l 3000
```

### Opción 2: Servidor con Python

```bash
# Python 3
python -m http.server 3000

# Python 2
python -m SimpleHTTPServer 3000
```

### Opción 3: Usar scripts incluidos

```bash
# Windows
INICIAR-SERVIDOR.bat
```

Abrir en navegador: `http://localhost:3000`

---

## 📂 Estructura del Proyecto

```
informate-nicaragua/
├── index.html              # Página principal (Informate 3.0)
├── public/
│   ├── images/            # Imágenes WebP optimizadas
│   ├── js/                # Scripts adicionales
│   └── logo.png           # Logo del portal
├── src/
│   └── js/               # Módulos JavaScript
│       ├── app.js        # App principal con Firebase
│       └── modules/      # Módulos: news, weather, etc.
├── functions/            # Cloud Functions de Firebase
├── firebase.json         # Configuración Firebase
└── README.md            # Este archivo
```

---

## 🔥 Firebase Configuración

El proyecto usa Firebase real con la siguiente configuración:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyDVsqRGr7dtdi5ecO14THIdbnEzKKOJxcA",
  authDomain: "informate-instant-nicaragua.firebaseapp.com",
  projectId: "informate-instant-nicaragua",
  storageBucket: "informate-instant-nicaragua.firebasestorage.app",
  messagingSenderId: "24988088146",
  appId: "1:24988088146:web:d26a207508da055668ec8b",
  measurementId: "G-W1B5J61WEP"
};
```

### Colecciones en Firestore:

- `noticias` - Artículos con: título, resumen, contenido, categoría, imagen, fecha
- `indicadores` - Precios del dólar, combustibles
- `config` - Configuración del portal

---

## 🖼️ Imágenes WebP

Las imágenes se almacenan en `public/images/` en formato WebP para optimización:

| Formato | Tamaño típico | Uso |
|---------|---------------|-----|
| WebP | ~30-150KB | Producción |
| JPEG/PNG (fallback) | ~200-500KB | Respaldo |

### Procesar nuevas imágenes:

```bash
# Usar el script incluido
node convert-to-webp.js
```

---

## 📱 Uso

### Navegación

1. **Inicio** - Noticias destacadas y hero principal
2. **Categorías** - Filtrar por: Sucesos, Nacionales, Deportes, etc.
3. **Búsqueda** - Buscar en títulos y resúmenes
4. **Más Leídas** - Ranking por contador de vistas

### Funcionalidades Premium

- **Contador de Vistas**: Cada noticia muestra cuántas veces ha sido leída
- **Noticias Relacionadas**: Al final de cada artículo
- **Compartir**: Botones para Facebook, Twitter, WhatsApp
- **Tiempo de Lectura**: Estimación en minutos
- **Modo Offline**: Datos de ejemplo si Firebase no responde

---

## 🌤️ Clima en Tiempo Real

Widget de clima con datos de Open-Meteo API para 12 ciudades:

1. Managua
2. León
3. Granada
4. Masaya
5. Estelí
6. Matagalpa
7. Chinandega
8. Bluefields
9. Rivas
10. Jinotepe
11. Jinotega
12. Nueva Segovia

Rotación automática cada 10 segundos.

---

## 📊 Analytics Locales

El sistema incluye contador de vistas usando localStorage:

```javascript
// Guardado en el navegador
localStorage.getItem('ni_views');
// Formato: { "noticiaId": cantidadVistas }
```

---

## 🎨 Design System

### Paleta de Colores

```css
--color-primary: #c41e3a;        /* Rojo periodístico */
--color-primary-hover: #9b1830;
--font-display: 'Playfair Display'; /* Títulos */
--font-body: 'Source Sans 3';       /* Contenido */
```

### Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

---

## 🤝 Contribuir

1. Fork el repositorio
2. Crear rama: `git checkout -b feature/nueva-funcionalidad`
3. Commit cambios: `git commit -am 'Agregar función X'`
4. Push a la rama: `git push origin feature/nueva-funcionalidad`
5. Crear Pull Request

---

## 📝 Changelog

### Versión 3.0 (Abril 2026)

- 🔥 Integración con Firebase Firestore
- 🖼️ Soporte para imágenes WebP locales
- 📊 Sistema de contador de vistas
- 🌤️ Widget de clima en tiempo real (12 ciudades)
- 🎨 Rediseño premium estilo CNN/BBC
- 📱 Optimizaciones móvil
- 🌙 Modo oscuro mejorado

---

## 📄 Licencia

© 2026 Nicaragua Informate. Todos los derechos reservados.

---

<p align="center">
  <strong>Hecho con ❤️ en Nicaragua</strong>
</p>

<p align="center">
  <a href="https://nicaraguainformate.com">🌐 nicaraguainformate.com</a>
</p>
