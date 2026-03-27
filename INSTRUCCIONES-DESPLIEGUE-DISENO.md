# 🚀 Instrucciones de Despliegue - Diseño Editorial

## ✅ Estado Actual

**Archivos listos para producción:**
- ✅ `public/css/editorial.css` (13.17 KB)
- ✅ `public/index.html` (modificado)
- ✅ Documentación completa

**Cambios implementados:**
- Sistema tipográfico editorial (serif + sans-serif)
- Imágenes sin filtros blur
- Tarjetas estilo Confidencial
- Grid editorial de 3 columnas
- Header limpio y profesional

---

## 🔍 Pre-Despliegue: Verificación Local

### 1. Verificar Archivos
```bash
# Verificar que editorial.css existe
ls -la public/css/editorial.css

# Verificar tamaño (debe ser ~13KB)
du -h public/css/editorial.css
```

### 2. Probar Localmente
```bash
# Si usas servidor local
npm start
# o
python -m http.server 8000
# o
php -S localhost:8000
```

### 3. Abrir en Navegador
```
http://localhost:8000
```

### 4. Verificar en DevTools (F12)

#### Console
- ✓ No debe haber errores de carga de CSS
- ✓ No debe haber errores 404

#### Network
- ✓ `editorial.css` debe cargar (Status 200)
- ✓ Fuentes de Google Fonts deben cargar

#### Elements
- ✓ Inspeccionar un título: debe tener `font-family: Merriweather`
- ✓ Inspeccionar categoría: debe tener `text-transform: uppercase`
- ✓ Inspeccionar imagen: NO debe tener `filter: blur`

---

## 🚀 Despliegue a Producción

### Opción 1: Firebase Hosting

```bash
# 1. Instalar Firebase CLI (si no lo tienes)
npm install -g firebase-tools

# 2. Login
firebase login

# 3. Verificar proyecto
firebase projects:list

# 4. Desplegar solo hosting
firebase deploy --only hosting

# 5. Verificar URL
# https://nicaragua-informate.web.app
```

**Tiempo estimado**: 2-3 minutos

### Opción 2: Vercel

```bash
# 1. Instalar Vercel CLI (si no lo tienes)
npm install -g vercel

# 2. Login
vercel login

# 3. Desplegar
vercel --prod

# 4. Verificar URL
# https://tu-proyecto.vercel.app
```

**Tiempo estimado**: 1-2 minutos

### Opción 3: Netlify

```bash
# 1. Instalar Netlify CLI (si no lo tienes)
npm install -g netlify-cli

# 2. Login
netlify login

# 3. Desplegar
netlify deploy --prod --dir=public

# 4. Verificar URL
# https://tu-proyecto.netlify.app
```

**Tiempo estimado**: 1-2 minutos

### Opción 4: GitHub Pages

```bash
# 1. Commit cambios
git add .
git commit -m "feat: implementar diseño editorial profesional"

# 2. Push a GitHub
git push origin main

# 3. Configurar GitHub Pages
# Settings → Pages → Source: main branch → /public folder

# 4. Verificar URL
# https://tu-usuario.github.io/informate-nicaragua
```

**Tiempo estimado**: 3-5 minutos

---

## 🧪 Post-Despliegue: Testing

### 1. Verificación Visual

#### Desktop (>900px)
- [ ] Títulos en serif (Merriweather)
- [ ] Cuerpo en sans-serif (Inter)
- [ ] Categorías uppercase sin fondo
- [ ] Imágenes nítidas (no borrosas)
- [ ] Tarjetas con borde inferior sutil
- [ ] Grid de 3 columnas funciona
- [ ] Sidebar visible

#### Tablet (600-900px)
- [ ] Layout se adapta a 1 columna
- [ ] Tipografía se reduce apropiadamente
- [ ] Imágenes mantienen proporción
- [ ] Navegación funciona

#### Mobile (<600px)
- [ ] Layout de 1 columna
- [ ] Tipografía legible
- [ ] Imágenes cargan rápido
- [ ] Navegación colapsable funciona

### 2. Verificación Técnica

#### Performance (Lighthouse)
```bash
# Abrir Chrome DevTools → Lighthouse
# Ejecutar audit para:
- Performance: >85
- Accessibility: >90
- Best Practices: >90
- SEO: >90
```

#### Fuentes
```javascript
// En Console de DevTools
getComputedStyle(document.querySelector('.card h3')).fontFamily
// Debe retornar: "Merriweather, Georgia, Times New Roman, serif"

getComputedStyle(document.querySelector('.card p')).fontFamily
// Debe retornar: "Inter, -apple-system, BlinkMacSystemFont, ..."
```

#### Imágenes
```javascript
// En Console de DevTools
document.querySelectorAll('.card-image-wrapper img').forEach(img => {
  console.log(img.style.filter); // Debe ser "" o "none"
});
```

### 3. Verificación Cross-Browser

#### Chrome/Edge (Chromium)
- [ ] Diseño correcto
- [ ] Fuentes cargan
- [ ] Imágenes nítidas

#### Firefox
- [ ] Diseño correcto
- [ ] Fuentes cargan
- [ ] Imágenes nítidas

#### Safari (Mac/iOS)
- [ ] Diseño correcto
- [ ] Fuentes cargan
- [ ] Imágenes nítidas

---

## 🐛 Troubleshooting

### Problema 1: Fuentes no se cargan

**Síntoma**: Títulos siguen en sans-serif

**Solución**:
```bash
# 1. Verificar que editorial.css está vinculado
curl https://tu-sitio.com | grep "editorial.css"

# 2. Verificar que Google Fonts responde
curl -I "https://fonts.googleapis.com/css2?family=Merriweather"

# 3. Limpiar caché del navegador
# Chrome: Ctrl+Shift+Delete → Clear cache
```

### Problema 2: Imágenes siguen borrosas

**Síntoma**: Blur todavía visible

**Solución**:
```bash
# 1. Limpiar caché del navegador (Ctrl+Shift+R)

# 2. Verificar que editorial.css se cargó después del CSS inline
# En DevTools → Sources → index.html
# Buscar: <link rel="stylesheet" href="/css/editorial.css">
# Debe estar DESPUÉS de los estilos inline

# 3. Verificar en DevTools → Elements
# Inspeccionar imagen → Computed → filter
# Debe ser "none"
```

### Problema 3: Estilos no se aplican

**Síntoma**: Diseño no cambia

**Solución**:
```bash
# 1. Verificar que editorial.css existe en servidor
curl https://tu-sitio.com/css/editorial.css

# 2. Verificar que no hay errores 404
# DevTools → Network → Filter: CSS
# editorial.css debe tener Status 200

# 3. Verificar orden de carga
# editorial.css debe cargarse DESPUÉS de design-system.css
# para que los !important funcionen
```

### Problema 4: Layout roto en móvil

**Síntoma**: Elementos se salen de la pantalla

**Solución**:
```bash
# 1. Verificar viewport meta tag
# Debe estar en <head>:
# <meta name="viewport" content="width=device-width, initial-scale=1.0">

# 2. Verificar media queries
# DevTools → Toggle device toolbar (Ctrl+Shift+M)
# Probar diferentes tamaños

# 3. Verificar que no hay CSS inline con width fijo
# Buscar: style="width: 1200px" (esto rompe responsive)
```

---

## 📊 Monitoreo Post-Despliegue

### Día 1: Verificación Inmediata
- [ ] Sitio carga correctamente
- [ ] No hay errores en Console
- [ ] Fuentes se ven bien
- [ ] Imágenes nítidas
- [ ] Responsive funciona

### Semana 1: Métricas de Usuario
```javascript
// Google Analytics
// Verificar:
- Bounce Rate (objetivo: <50%)
- Avg. Session Duration (objetivo: >90s)
- Pages per Session (objetivo: >2.5)
```

### Mes 1: Optimización
- Analizar heatmaps (Hotjar)
- Revisar feedback de usuarios
- Ajustar tipografía si es necesario
- Optimizar imágenes lentas

---

## 🔄 Rollback (Si algo sale mal)

### Opción 1: Revertir Commit (Git)
```bash
# 1. Ver historial
git log --oneline

# 2. Revertir al commit anterior
git revert HEAD

# 3. Push
git push origin main

# 4. Re-desplegar
firebase deploy --only hosting
```

### Opción 2: Desactivar CSS Editorial
```html
<!-- En index.html, comentar la línea: -->
<!-- <link rel="stylesheet" href="/css/editorial.css"> -->
```

### Opción 3: Restaurar Backup
```bash
# Si hiciste backup antes de desplegar
cp backup/index.html public/index.html
firebase deploy --only hosting
```

---

## ✅ Checklist Final

Antes de dar por terminado el despliegue:

- [ ] Sitio desplegado en producción
- [ ] URL funciona correctamente
- [ ] Verificación visual completada (desktop, tablet, mobile)
- [ ] Verificación técnica completada (Lighthouse >85)
- [ ] Cross-browser testing completado
- [ ] No hay errores en Console
- [ ] Fuentes cargan correctamente
- [ ] Imágenes se ven nítidas
- [ ] Responsive funciona en todos los dispositivos
- [ ] Google Analytics registra visitas
- [ ] Backup del código anterior guardado

---

## 📞 Contacto de Emergencia

Si encuentras problemas críticos después del despliegue:

1. **Rollback inmediato** (ver sección Rollback)
2. **Documentar el problema** (screenshots, errores de Console)
3. **Revisar documentación** (`EDITORIAL-DESIGN-IMPLEMENTATION.md`)
4. **Consultar con equipo técnico**

---

## 🎉 ¡Listo!

Si completaste todos los pasos, tu sitio ahora tiene un diseño editorial profesional.

**Próximos pasos**:
1. Monitorear métricas en Google Analytics
2. Recopilar feedback de usuarios
3. Optimizar imágenes existentes (ver `GUIA-IMAGENES.md`)
4. Planear mejoras futuras

**¡Felicidades! 🚀**

---

**Última actualización**: 27 de marzo de 2026
**Versión**: 1.0.0
**Estado**: ✅ Listo para producción
