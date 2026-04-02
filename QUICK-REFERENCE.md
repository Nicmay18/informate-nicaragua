# ⚡ Quick Reference - Diseño Editorial

## 🚀 Despliegue Rápido

```bash
# Verificar archivos
ls public/css/editorial.css  # Debe existir (13KB)

# Desplegar
firebase deploy --only hosting
# o
vercel --prod
# o
netlify deploy --prod --dir=public

# Verificar
curl https://tu-sitio.com/css/editorial.css  # Status 200
```

## ✅ Checklist de 30 Segundos

- [ ] `editorial.css` existe en `public/css/`
- [ ] Vinculado en `index.html` después de Font Awesome
- [ ] Títulos en serif (Merriweather)
- [ ] Imágenes sin blur
- [ ] Categorías sin fondo
- [ ] Tarjetas con borde inferior
- [ ] Responsive funciona

## 🎨 Variables Clave

```css
/* Tipografía */
--font-headline: 'Merriweather', Georgia, serif;
--font-body: 'Inter', sans-serif;

/* Colores */
--color-text-primary: #1a1a1a;
--color-accent-red: #dc2626;

/* Espaciado */
--space-editorial-md: 1.5rem;
--space-editorial-lg: 2rem;
```

## 🐛 Troubleshooting Rápido

### Fuentes no cargan
```bash
# Limpiar caché
Ctrl+Shift+R (Chrome)
Cmd+Shift+R (Mac)
```

### Imágenes borrosas
```bash
# Verificar en DevTools
getComputedStyle(document.querySelector('.card-image-wrapper img')).filter
# Debe ser: "none"
```

### Estilos no aplican
```bash
# Verificar orden de carga
curl https://tu-sitio.com | grep -A5 "editorial.css"
# Debe estar DESPUÉS de Font Awesome
```

## 📊 Métricas de Éxito

```
Lighthouse Score:
- Performance: >85
- Accessibility: >90
- Best Practices: >90
- SEO: >90

Google Analytics (después de 1 semana):
- Bounce Rate: <50%
- Avg. Session: >90s
- Pages/Session: >2.5
```

## 🔗 Documentación Completa

- **Implementación**: `EDITORIAL-DESIGN-IMPLEMENTATION.md`
- **Imágenes**: `GUIA-IMAGENES.md`
- **Despliegue**: `INSTRUCCIONES-DESPLIEGUE-DISENO.md`
- **Visual**: `ANTES-DESPUES-VISUAL.md`
- **Resumen**: `RESUMEN-DISENO-EDITORIAL.md`

## 📞 Soporte Rápido

1. Revisar Console (F12) → No debe haber errores
2. Verificar Network → `editorial.css` Status 200
3. Inspeccionar elemento → Font-family debe ser Merriweather
4. Si falla, hacer rollback: comentar link a `editorial.css`

## ✨ Resultado

**Antes**: Blog amateur
**Después**: Medio profesional tipo Confidencial

---

**Estado**: ✅ Listo para producción
**Versión**: 1.0.0
**Fecha**: 27 marzo 2026
