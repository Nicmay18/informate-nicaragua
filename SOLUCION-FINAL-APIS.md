# 🚀 Solución Final - APIs de Telegram y Facebook

## ❌ Problema Encontrado

Firebase Functions requiere el plan **Blaze (pago por uso)** para desplegar. Tu proyecto está en el plan gratuito Spark.

---

## ✅ SOLUCIÓN RECOMENDADA: Usar Vercel (Gratis)

Vercel es gratuito y perfecto para serverless functions. Ya tienes los archivos listos en `/api`.

### Pasos Rápidos (5 minutos):

#### 1. Ir a Vercel

Ve a: **https://vercel.com/new**

#### 2. Importar desde GitHub

- Si tu proyecto está en GitHub, conéctalo
- Si no, sube los archivos manualmente

#### 3. Configurar Variables de Entorno

En el dashboard de Vercel, agrega:

```
TG_TOKEN = 8750159697:AAGwok3dOuAAiQpdliQNuzG1gpRa-3XOPDs
TG_CHAT_ID = -1003431574597
FB_PAGE_ACCESS_TOKEN = EAANHXQ58A0IBREqZBMzbZABIxXeZCGMvlTdHmetOUb4R4znecMAzMcc0BwJCgRxrZBg7S2MOjaPSDbjmuSADud2warNxis8mjDZBvGdz9DvBBJf2LLmOTdVAHy73wzPTvkMDXcOKBOz7xepZCRcsNxZB4ZAsHLZAhZAZBFeCTvryoIHuZARyry86UKUxqDpQH4eXIcyE1RneZAu0uGV0CzA8tYNlWZAlen4k1vUhy6ZAvUDIJAZBH2DbQWGaGn4AYbyG1sjUliiMD58jLNjvKGIZD
FB_PAGE_ID = 61578261125687
```

#### 4. Deploy

Click en "Deploy" y espera 1-2 minutos.

#### 5. Obtener URL

Vercel te dará una URL como:
```
https://tu-proyecto.vercel.app
```

#### 6. Actualizar Admin

En `admin.html`, busca la función `postToApi` (línea ~2530) y cambia:

```javascript
const baseUrl = 'https://us-central1-informate-instant-nicaragua.cloudfunctions.net';
```

Por:

```javascript
const baseUrl = 'https://TU-PROYECTO.vercel.app/api';
```

#### 7. Redesplegar Admin

```bash
firebase deploy --only hosting
```

---

## 🎯 Alternativa: Actualizar a Firebase Blaze

Si prefieres usar Firebase Functions:

### Ventajas:
- Todo en un solo lugar
- Integración directa con Firestore
- Gratis hasta 2 millones de invocaciones/mes

### Desventajas:
- Requiere tarjeta de crédito
- Puede generar costos si excedes el límite gratuito

### Pasos:

1. Ve a: https://console.firebase.google.com/project/informate-instant-nicaragua/usage/details
2. Click en "Upgrade to Blaze"
3. Agrega tu tarjeta de crédito
4. Configura límites de gasto (recomendado: $5/mes)
5. Despliega functions:
   ```bash
   firebase deploy --only functions
   ```

### Costos Estimados:

Con tu tráfico esperado:
- **Invocaciones**: ~1,000/mes = **$0.00** (dentro del límite gratuito)
- **Networking**: ~1GB/mes = **$0.12**
- **Total**: **~$0.12/mes**

---

## 📊 Comparación

| Característica | Vercel | Firebase Blaze |
|---|---|---|
| Costo | Gratis | ~$0.12/mes |
| Setup | 5 minutos | 10 minutos |
| Tarjeta requerida | No | Sí |
| Límite gratuito | 100GB bandwidth | 2M invocaciones |
| Velocidad | Muy rápida | Rápida |
| **Recomendación** | ✅ **Mejor opción** | Buena alternativa |

---

## 🚀 Opción Express: Usar los Tokens Directamente

Si quieres probar AHORA MISMO sin desplegar nada:

Los endpoints `/api/telegram` y `/api/facebook` ya están actualizados para recibir los tokens desde el admin. Solo necesitas:

1. **Abrir el admin**
2. **Ir a Configuración**
3. **Pegar los tokens**:
   - Telegram Token: `8750159697:AAGwok3dOuAAiQpdliQNuzG1gpRa-3XOPDs`
   - Telegram Chat: `-1003431574597`
   - Facebook Page 1 ID: `61578261125687`
   - Facebook Page 1 Token: `EAANHXQ58A0IB...`
   - Facebook Page 2 ID: `61577962970892`
   - Facebook Page 2 Token: `EAANHXQ58A0IB...`
4. **Guardar**
5. **Crear una noticia de prueba**

El admin enviará los tokens en cada petición, así que los endpoints los usarán aunque no estén en las variables de entorno del servidor.

---

## ✅ MI RECOMENDACIÓN FINAL

**Usa Vercel** porque:
1. Es gratis
2. Setup en 5 minutos
3. No requiere tarjeta
4. Perfecto para tu caso de uso
5. Ya tienes los archivos listos

---

## 📞 ¿Necesitas Ayuda?

Si quieres que te ayude a desplegar en Vercel, solo dime y te guío paso a paso.

**Email**: diazjosenoel@gmail.com  
**PayPal**: https://www.paypal.me/NicaraguaInformate

---

**Fecha**: 27 de marzo de 2026  
**Estado**: Esperando decisión sobre plataforma de deploy
