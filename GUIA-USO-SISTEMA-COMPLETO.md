# 📚 GUÍA COMPLETA - SISTEMA DE NOTICIAS PROFESIONAL

## 🎯 CÓMO USAR EL SISTEMA PASO A PASO

### 1️⃣ CREAR NOTICIA NORMAL

1. **Ve al admin**: `nicaraguainformate.com/admin/`
2. **Llena el formulario**:
   ```
   Título: Tu título aquí
   Categoría: Selecciona una
   Resumen: Breve descripción
   Contenido: Escribe 5-6 párrafos
   ```

3. **IMPORTANTE - Selecciona el tipo de collage**:
   ```
   🎨 Estilo del Collage:
   ● 📰 Noticia Normal          ← SELECCIONA ESTE
   ○ 🎗️ Noticia de Luto
   ```

4. **Sube la imagen**:
   - Haz clic en "Arrastra imagen o haz clic para subir"
   - Selecciona tu foto
   - El sistema aplicará automáticamente:
     * Marco profesional con degradado
     * Logo circular en esquina inferior izquierda
     * Fecha y hora en esquina inferior derecha

5. **Opciones adicionales**:
   ```
   ☐ Marcar como destacada
   ☐ 👑 Noticia Premium
   ```

6. **Publica**

---

### 2️⃣ CREAR NOTICIA DE LUTO (FALLECIDO)

1. **Ve al admin**
2. **Llena el formulario**:
   ```
   Título: Fallece [nombre de la persona]
   Categoría: Sucesos
   Contenido: Obituario completo
   ```

3. **IMPORTANTE - Selecciona el tipo de luto**:
   ```
   🎨 Estilo del Collage:
   ○ 📰 Noticia Normal
   ● 🎗️ Noticia de Luto          ← SELECCIONA ESTE
   ```

4. **Sube la foto del fallecido**:
   - El sistema aplicará automáticamente:
     * Marco profesional
     * Logo circular
     * Fecha y hora
     * **🎗️ CINTA NEGRA DE LUTO** en esquina superior derecha

5. **NO marques premium** (para que todos puedan leerla)

6. **Publica**

---

### 3️⃣ CREAR NOTICIA PREMIUM

1. **Ve al admin**
2. **Llena el formulario** (contenido extenso, 8-10 párrafos)
3. **Selecciona tipo de collage** (Normal o Luto según corresponda)
4. **Sube la imagen**
5. **MARCA EL CHECKBOX**:
   ```
   ☑ 👑 Noticia Premium
   ```
6. **Publica**

**RESULTADO**:
- En el index: Badge "💎 PREMIUM"
- Al hacer clic: Solo 2 párrafos visibles + paywall
- Botón: "Suscribirme por $5/mes"

---

## 🖼️ TIPOS DE COLLAGE

### NOTICIA NORMAL:
```
┌─────────────────────────────────┐
│ ╔═══════════════════════════╗   │
│ ║                           ║   │
│ ║   [IMAGEN DE LA NOTICIA]  ║   │
│ ║                           ║   │
│ ║                           ║   │
│ ║  🔵 Logo      📅 2 abr 26 ║   │
│ ║  INFORMATE    ⏰ 11:36 PM ║   │
│ ╚═══════════════════════════╝   │
└─────────────────────────────────┘
```

### NOTICIA DE LUTO:
```
┌─────────────────────────────────┐
│ ╔═══════════════════════════╗🎗️ │ ← Cinta negra
│ ║                           ║   │
│ ║   [FOTO DEL FALLECIDO]    ║   │
│ ║                           ║   │
│ ║                           ║   │
│ ║  🔵 Logo      📅 2 abr 26 ║   │
│ ║  INFORMATE    ⏰ 11:36 PM ║   │
│ ╚═══════════════════════════╝   │
└─────────────────────────────────┘
```

---

## ⚠️ ERRORES COMUNES

### ❌ ERROR: "No veo el selector de tipo de collage"
**SOLUCIÓN**: 
1. Ejecuta `GUARDAR-SISTEMA-COMPLETO.bat`
2. Espera 2-3 minutos
3. Recarga el admin con `Ctrl + Shift + R`

### ❌ ERROR: "La imagen no tiene cinta de luto"
**SOLUCIÓN**: 
- Asegúrate de seleccionar "🎗️ Noticia de Luto" ANTES de subir la imagen
- Si ya subiste la imagen, elimínala y súbela de nuevo

### ❌ ERROR: "No veo el badge premium en el index"
**SOLUCIÓN**: 
- Es problema de caché de Vercel
- El paywall SÍ funciona en la página individual
- El badge aparecerá cuando expire el caché

---

## 📊 RESUMEN VISUAL DEL FLUJO

```
ADMIN:
┌─────────────────────────────────┐
│ Título: [___________________]   │
│ Categoría: [Nacionales ▼]      │
│ Contenido: [________________]   │
│                                 │
│ 🎨 Estilo del Collage:          │
│ ● 📰 Normal  ○ 🎗️ Luto          │
│                                 │
│ [Subir Imagen]                  │
│                                 │
│ ☐ Destacada                     │
│ ☐ 👑 Premium                    │
│                                 │
│ [Publicar Noticia]              │
└─────────────────────────────────┘
        ↓
    RESULTADO
        ↓
┌─────────────────────────────────┐
│ INDEX (Lista):                  │
│ [Imagen con marco + logo]       │
│ 💎 PREMIUM (si marcaste)        │
│ Título...                       │
└─────────────────────────────────┘
        ↓
    CLICK
        ↓
┌─────────────────────────────────┐
│ NOTICIA INDIVIDUAL:             │
│ [Imagen con marco + logo]       │
│ Párrafo 1...                    │
│ Párrafo 2...                    │
│ [PAYWALL si es premium]         │
└─────────────────────────────────┘
```

---

## 🎨 ELEMENTOS DEL COLLAGE PROFESIONAL

1. **Marco degradado**: Fondo oscuro (#0f172a → #1e293b)
2. **Borde brillante**: Color cyan (#00d4ff)
3. **Logo circular**: "INFORMATE AL INSTANTE NICARAGUA"
4. **Fecha**: Formato "2 abr 2026"
5. **Hora**: Formato "11:36 PM" en color cyan
6. **Cinta de luto** (solo si seleccionas): Lazo negro realista

---

## 💡 CONSEJOS PROFESIONALES

### Para noticias normales:
- ✅ Usa imágenes de alta calidad
- ✅ Evita imágenes muy oscuras
- ✅ Asegúrate de que la imagen sea relevante

### Para noticias de luto:
- ✅ Usa foto formal del fallecido
- ✅ Fondo neutro preferiblemente
- ✅ Evita fotos borrosas o pixeladas
- ✅ Respeta la dignidad de la persona

### Para noticias premium:
- ✅ Contenido extenso y de calidad
- ✅ Análisis profundos
- ✅ Información exclusiva
- ✅ Mínimo 8-10 párrafos

---

**¿Dudas? Revisa este documento antes de publicar.**
