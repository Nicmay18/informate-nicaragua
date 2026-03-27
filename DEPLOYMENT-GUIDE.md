# 🚀 Guía de Despliegue - Nicaragua Informate

## Sistema Completo de Monetización

---

## 📋 Pre-requisitos

1. **Node.js** (v18 o superior)
2. **Firebase CLI** instalado globalmente
3. **Cuenta de Firebase** con proyecto creado
4. **Cuenta de Resend** para emails
5. **Cuenta de Google AdSense** aprobada

---

## 🔧 Instalación Inicial

### Paso 1: Instalar Firebase CLI

```bash
npm install -g firebase-tools
```

### Paso 2: Login a Firebase

```bash
firebase login
```

### Paso 3: Inicializar Proyecto

```bash
# Ya está configurado, pero si necesitas reiniciar:
firebase init

# Seleccionar:
# - Hosting
# - Functions
# - Firestore
```

---

## 📦 Configurar Cloud Functions

### Paso 1: Instalar Dependencias

```bash
cd functions
npm install
```

### Paso 2: Configurar Variables de Entorno

```bash
# API Key de Resend
firebase functions:config:set resend.api_key="re_YOUR_API_KEY_HERE"

# Verificar configuración
firebase functions:config:get
```

**Obtener API Key de Resend**:
1. Ir a https://resend.com/api-keys
2. Crear nueva API key
3. Copiar y usar en el comando anterior

### Paso 3: Configurar AdSense

Editar `public/index.html` y reemplazar:
```html
<!-- Buscar todas las instancias de -->
data-ad-client="ca-pub-4115203339551838"

<!-- Reemplazar con tu Publisher ID -->
data-ad-client="ca-pub-TU_PUBLISHER_ID"
```

---

## 🔥 Desplegar a Firebase

### Opción 1: Despliegue Completo

```bash
# Desde la raíz del proyecto
firebase deploy
```

Esto desplegará:
- ✅ Hosting (sitio web)
- ✅ Functions (Cloud Functions)
- ✅ Firestore Rules
- ✅ Firestore Indexes

### Opción 2: Despliegue Selectivo

```bash
# Solo hosting
firebase deploy --only hosting

# Solo functions
firebase deploy --only functions

# Solo firestore
firebase deploy --only firestore
```

---

## 🔗 Configurar Webhooks de Resend

### Paso 1: Obtener URL de Function

Después del despliegue, Firebase mostrará la URL:
```
https://YOUR_REGION-YOUR_PROJECT.cloudfunctions.net/resendWebhook
```

### Paso 2: Configurar en Resend

1. Ir a https://resend.com/webhooks
2. Click en "Add Webhook"
3. Configurar:
   - **URL**: La URL de tu function
   - **Events**: Seleccionar:
     - `email.sent`
     - `email.delivered`
     - `email.opened`
     - `email.clicked`
     - `email.bounced`
     - `email.complained`
4. Guardar

---

## 📊 Verificar Despliegue

### 1. Verificar Hosting

```bash
# Abrir en navegador
firebase open hosting:site
```

**Checklist**:
- [ ] Página carga correctamente
- [ ] Widget de newsletter visible
- [ ] Ads de AdSense aparecen
- [ ] No hay errores en Console

### 2. Verificar Functions

```bash
# Ver logs
firebase functions:log

# Ver funciones desplegadas
firebase functions:list
```

**Functions esperadas**:
- `onArticlePublished`
- `dailyNewsletter`
- `resendWebhook`

### 3. Verificar Firestore

```bash
# Abrir Firestore en consola
firebase open firestore
```

**Colecciones esperadas**:
- `noticias`
- `newsletter_subscribers`
- `newsletter_campaigns`
- `newsletter_sponsors`

---

## 🧪 Testing

### Test 1: Newsletter Widget

1. Abrir sitio web
2. Scroll hasta widget de newsletter
3. Ingresar email de prueba
4. Click en "Suscribirme gratis"
5. Verificar en Firestore: `newsletter_subscribers/{email}`

**Resultado esperado**:
- ✅ Mensaje de éxito
- ✅ Email guardado en Firestore
- ✅ Evento en Google Analytics

### Test 2: Sistema de Ads

1. Abrir DevTools Console
2. Buscar logs: `[AdManager] Inicializado con X slots`
3. Verificar métricas: `window.adManager.metrics`
4. Scroll y verificar que ads cargan (lazy loading)

**Resultado esperado**:
- ✅ AdManager inicializado
- ✅ Slots detectados
- ✅ Ads cargan al hacer scroll
- ✅ Viewability tracking activo

### Test 3: Cloud Functions (Local)

```bash
# Iniciar emuladores
firebase emulators:start

# En otra terminal, probar function
curl http://localhost:5001/YOUR_PROJECT/us-central1/resendWebhook \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"type":"email.opened","email":"test@example.com","tags":[{"name":"campaign_id","value":"test123"}]}'
```

**Resultado esperado**:
- ✅ Function responde con 200 OK
- ✅ Stats actualizadas en Firestore

### Test 4: Newsletter Diaria (Manual)

```bash
# Trigger manual de newsletter diaria
firebase functions:shell

# En el shell:
dailyNewsletter()
```

**Resultado esperado**:
- ✅ Campaña creada en Firestore
- ✅ Emails enviados (verificar en Resend dashboard)

---

## 📈 Monitoreo

### Google Analytics

Eventos trackeados:
- `newsletter_subscribe` - Suscripción a newsletter
- `ad_loaded` - Ad cargado
- `ad_viewable` - Ad viewable (IAB)
- `ad_clicked` - Click en ad
- `ad_refreshed` - Ad refrescado

**Ver en GA4**:
1. Ir a Google Analytics
2. Events → Ver todos los eventos
3. Buscar eventos personalizados

### Firebase Functions Logs

```bash
# Ver logs en tiempo real
firebase functions:log --only dailyNewsletter

# Ver logs de todas las functions
firebase functions:log
```

### Resend Dashboard

1. Ir a https://resend.com/emails
2. Ver emails enviados
3. Métricas: delivered, opened, clicked

---

## 🔒 Seguridad

### Firestore Rules

Las reglas ya están configuradas en `firestore.rules`:
- ✅ Noticias: lectura pública, escritura admin
- ✅ Newsletter subscribers: usuarios pueden suscribirse
- ✅ Campaigns: solo admin
- ✅ Analytics: solo Cloud Functions

### API Keys

**NUNCA** commitear API keys al repositorio:
- ✅ Resend API key en Firebase config
- ✅ AdSense Publisher ID es público (OK)
- ✅ Firebase config es público (OK)

---

## 🐛 Troubleshooting

### Error: "Permission denied" en Firestore

**Solución**:
```bash
# Redesplegar reglas
firebase deploy --only firestore:rules
```

### Error: "Function not found"

**Solución**:
```bash
# Redesplegar functions
firebase deploy --only functions
```

### Error: Ads no cargan

**Posibles causas**:
1. AdSense no aprobado → Esperar aprobación
2. Publisher ID incorrecto → Verificar en index.html
3. Ad blocker activo → Desactivar para testing

**Solución**:
```bash
# Ver errores en Console
# Buscar: "adsbygoogle"
```

### Error: Newsletter no se envía

**Posibles causas**:
1. API key de Resend incorrecta
2. No hay artículos en Firestore
3. Cron job no configurado

**Solución**:
```bash
# Verificar config
firebase functions:config:get

# Ver logs
firebase functions:log --only dailyNewsletter

# Trigger manual
firebase functions:shell
> dailyNewsletter()
```

---

## 📊 Métricas Esperadas

### Después de 1 Semana

- Newsletter subscribers: 50-100
- Ad impressions: 10,000-20,000
- Viewability rate: 60-70%
- Newsletter open rate: 35-45%

### Después de 1 Mes

- Newsletter subscribers: 500-1,000
- Ad impressions: 100,000-200,000
- Revenue estimado: $150-300
- Newsletter open rate: 40-50%

### Después de 3 Meses

- Newsletter subscribers: 2,000-5,000
- Ad impressions: 500,000-1,000,000
- Revenue estimado: $800-1,500
- Newsletter open rate: 42-52%

---

## 🎯 Optimizaciones Post-Despliegue

### Semana 1-2: Monitoreo

- [ ] Verificar que newsletter diaria se envía
- [ ] Monitorear open rate y click rate
- [ ] Verificar viewability de ads
- [ ] Revisar errores en Functions logs

### Semana 3-4: Ajustes

- [ ] Ajustar horario de newsletter si es necesario
- [ ] Optimizar posiciones de ads
- [ ] A/B testing de subject lines
- [ ] Refinar targeting contextual

### Mes 2: Expansión

- [ ] Agregar más slots de ads
- [ ] Implementar newsletter semanal
- [ ] Buscar primeros sponsors
- [ ] Crear media kit

---

## 📞 Soporte

### Documentación

- **Sistema completo**: `IMPLEMENTATION-COMPLETE.md`
- **Sistema de ads**: `public/js/ads/README.md`
- **Resumen ejecutivo**: `ADS-SYSTEM-SUMMARY.md`

### Comandos Útiles

```bash
# Ver estado del proyecto
firebase projects:list

# Ver funciones desplegadas
firebase functions:list

# Ver logs en tiempo real
firebase functions:log

# Abrir consola de Firebase
firebase open

# Abrir Firestore
firebase open firestore

# Abrir Functions
firebase open functions
```

### Recursos

- Firebase Docs: https://firebase.google.com/docs
- Resend Docs: https://resend.com/docs
- AdSense Help: https://support.google.com/adsense

---

## ✅ Checklist Final

### Pre-Despliegue
- [ ] Node.js instalado
- [ ] Firebase CLI instalado
- [ ] Proyecto Firebase creado
- [ ] Cuenta Resend creada
- [ ] AdSense aprobado

### Configuración
- [ ] `functions/package.json` dependencies instaladas
- [ ] Resend API key configurada
- [ ] AdSense Publisher ID actualizado
- [ ] Firebase project ID correcto en `.firebaserc`

### Despliegue
- [ ] `firebase deploy` ejecutado sin errores
- [ ] Hosting desplegado
- [ ] Functions desplegadas
- [ ] Firestore rules desplegadas

### Post-Despliegue
- [ ] Sitio web accesible
- [ ] Newsletter widget funciona
- [ ] Ads cargan correctamente
- [ ] Webhooks de Resend configurados
- [ ] Google Analytics recibiendo eventos

### Testing
- [ ] Test de suscripción a newsletter
- [ ] Test de sistema de ads
- [ ] Test de Cloud Functions
- [ ] Verificación de logs

---

**¡Sistema listo para producción!** 🎉

Para cualquier duda, revisar la documentación completa en `IMPLEMENTATION-COMPLETE.md`
