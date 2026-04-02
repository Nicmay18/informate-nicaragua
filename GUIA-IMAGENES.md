# 📸 Guía de Imágenes - Nicaragua Informate

## 🎯 Reglas de Oro

### 1. Tamaño Mínimo
- **Noticias regulares**: 800px de ancho mínimo
- **Carrusel principal**: 1200px de ancho mínimo
- **Artículos destacados**: 1400px de ancho recomendado

### 2. Formato
- **Preferido**: WebP (mejor compresión)
- **Alternativo**: JPEG (calidad 85%)
- **Evitar**: PNG para fotos (muy pesado)

### 3. Proporción
- **Estándar**: 16:9 (1600x900px ideal)
- **Carrusel**: 16:9 o 21:9
- **Destacados**: 4:3 también funciona

### 4. Peso
- **Máximo**: 300KB por imagen
- **Recomendado**: 150-200KB
- **Herramientas**: TinyPNG, Squoosh, ImageOptim

---

## ❌ Errores Comunes

### 1. Imágenes Muy Pequeñas
```
❌ MAL: imagen-300x200.jpg
✅ BIEN: imagen-1200x675.jpg
```

**Problema**: Se ve pixelada al escalar
**Solución**: Usar imágenes de alta resolución

### 2. Imágenes Muy Pesadas
```
❌ MAL: foto.jpg (2.5MB)
✅ BIEN: foto-optimizada.webp (180KB)
```

**Problema**: Carga lenta, consume datos
**Solución**: Comprimir con TinyPNG o Squoosh

### 3. Proporciones Inconsistentes
```
❌ MAL: Mix de 4:3, 16:9, 1:1
✅ BIEN: Todas 16:9
```

**Problema**: Layout inconsistente
**Solución**: Recortar todas a 16:9

### 4. Imágenes Borrosas
```
❌ MAL: Aplicar blur en CSS
✅ BIEN: Imagen nítida sin filtros
```

**Problema**: Se ve poco profesional
**Solución**: NUNCA usar filter: blur()

---

## 🛠️ Herramientas Recomendadas

### Compresión
1. **TinyPNG** (https://tinypng.com)
   - Gratis hasta 20 imágenes
   - Reduce 60-70% sin pérdida visible
   - Soporta PNG y JPEG

2. **Squoosh** (https://squoosh.app)
   - Gratis, sin límites
   - Convierte a WebP
   - Control total de calidad

3. **ImageOptim** (Mac)
   - App nativa
   - Batch processing
   - Lossless y lossy

### Edición
1. **Photopea** (https://photopea.com)
   - Gratis, online
   - Similar a Photoshop
   - Recortar, redimensionar, ajustar

2. **GIMP** (https://gimp.org)
   - Gratis, desktop
   - Potente editor
   - Batch processing

### Conversión a WebP
```bash
# Con cwebp (Google)
cwebp -q 85 input.jpg -o output.webp

# Con ImageMagick
convert input.jpg -quality 85 output.webp
```

---

## 📐 Especificaciones por Sección

### Carrusel Principal
```
Tamaño: 1600x900px (16:9)
Formato: WebP o JPEG
Calidad: 85%
Peso: 200-250KB
Foco: Centro superior (rostros)
```

### Tarjetas de Noticias
```
Tamaño: 1200x675px (16:9)
Formato: WebP o JPEG
Calidad: 80%
Peso: 150-180KB
Foco: Centro superior
```

### Artículos Destacados
```
Tamaño: 1400x1050px (4:3) o 1600x900px (16:9)
Formato: WebP o JPEG
Calidad: 85%
Peso: 200-250KB
Foco: Centro
```

### Modal de Noticia
```
Tamaño: 1200x675px (16:9)
Formato: WebP o JPEG
Calidad: 85%
Peso: 180-220KB
Foco: Centro superior
```

---

## 🎨 Optimización de Imágenes

### Paso 1: Redimensionar
```
Objetivo: 1600x900px para carrusel, 1200x675px para noticias
Herramienta: Photopea, GIMP, o ImageMagick
Método: Recortar desde el centro, mantener rostros visibles
```

### Paso 2: Comprimir
```
Objetivo: Reducir peso sin perder calidad visible
Herramienta: TinyPNG o Squoosh
Configuración: Calidad 80-85%
```

### Paso 3: Convertir a WebP (opcional)
```
Objetivo: Mejor compresión (30% más ligero)
Herramienta: Squoosh o cwebp
Configuración: Calidad 85%
Fallback: Mantener JPEG para navegadores antiguos
```

### Paso 4: Verificar
```
Checklist:
✓ Tamaño correcto (1200x675px mínimo)
✓ Peso aceptable (<250KB)
✓ Nitidez buena (sin blur)
✓ Proporción 16:9
✓ Foco en rostros/acción
```

---

## 📊 Ejemplos Prácticos

### Ejemplo 1: Noticia de Sucesos
```
Imagen original: incendio-granada.jpg (3000x2000px, 2.8MB)

Paso 1: Recortar a 1600x900px (16:9)
Paso 2: Comprimir con TinyPNG → 180KB
Paso 3: Convertir a WebP → 120KB
Resultado: incendio-granada.webp (1600x900px, 120KB)

Ahorro: 95% de peso, calidad excelente
```

### Ejemplo 2: Carrusel Principal
```
Imagen original: chico-lopez.jpg (4000x3000px, 3.5MB)

Paso 1: Recortar a 1600x900px (enfocar rostro)
Paso 2: Ajustar brillo/contraste
Paso 3: Comprimir con Squoosh (calidad 85%) → 220KB
Resultado: chico-lopez-hero.webp (1600x900px, 220KB)

Ahorro: 94% de peso, calidad profesional
```

### Ejemplo 3: Artículo Destacado
```
Imagen original: deportes-seleccion.jpg (2400x1600px, 1.8MB)

Paso 1: Ya tiene buena proporción (3:2)
Paso 2: Redimensionar a 1400x933px
Paso 3: Comprimir con TinyPNG → 195KB
Resultado: deportes-seleccion-opt.jpg (1400x933px, 195KB)

Ahorro: 89% de peso, calidad excelente
```

---

## 🚀 Workflow Recomendado

### Para Nuevas Noticias
1. Recibir imagen del reportero/fuente
2. Abrir en Photopea o GIMP
3. Recortar a 1600x900px (16:9)
4. Ajustar brillo/contraste si es necesario
5. Exportar como JPEG calidad 85%
6. Comprimir con TinyPNG
7. Subir a `/public/images/`
8. Usar en noticia

### Para Actualizar Imágenes Existentes
1. Identificar imágenes pequeñas (<800px)
2. Buscar versión original de mayor resolución
3. Si no existe, buscar imagen alternativa
4. Seguir workflow de nuevas noticias
5. Reemplazar en Firestore

---

## 📱 Responsive Images (Avanzado)

### Usando srcset
```html
<img 
  src="noticia-1200.webp"
  srcset="
    noticia-600.webp 600w,
    noticia-900.webp 900w,
    noticia-1200.webp 1200w,
    noticia-1600.webp 1600w
  "
  sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
  alt="Descripción de la noticia"
  loading="lazy"
>
```

### Beneficios
- Móvil carga imagen pequeña (600px)
- Tablet carga imagen mediana (900px)
- Desktop carga imagen grande (1200px+)
- Ahorro de datos: 60-80%

---

## ✅ Checklist de Calidad

Antes de publicar una noticia, verificar:

- [ ] Imagen mínimo 1200x675px
- [ ] Proporción 16:9
- [ ] Peso menor a 250KB
- [ ] Formato WebP o JPEG
- [ ] Sin blur ni filtros
- [ ] Foco en rostros/acción principal
- [ ] Nitidez buena (no pixelada)
- [ ] Contraste adecuado
- [ ] Nombre descriptivo (no IMG_1234.jpg)
- [ ] Alt text descriptivo

---

## 🎓 Recursos Adicionales

### Tutoriales
- [Optimización de imágenes web](https://web.dev/fast/#optimize-your-images)
- [Guía de WebP](https://developers.google.com/speed/webp)
- [Responsive images](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)

### Herramientas Online
- TinyPNG: https://tinypng.com
- Squoosh: https://squoosh.app
- Photopea: https://photopea.com
- Remove.bg: https://remove.bg (quitar fondos)

### Bancos de Imágenes (si necesitas placeholder)
- Unsplash: https://unsplash.com
- Pexels: https://pexels.com
- Pixabay: https://pixabay.com

---

## 📞 Soporte

Si tienes dudas sobre optimización de imágenes:
1. Revisa esta guía
2. Prueba con TinyPNG primero
3. Si el problema persiste, consulta con el equipo técnico

**Recuerda**: Imágenes de calidad = Sitio profesional = Más lectores
