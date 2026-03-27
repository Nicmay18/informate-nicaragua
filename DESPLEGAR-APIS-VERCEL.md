# 🚀 Desplegar APIs en Vercel

## ❌ Problema Actual

Firebase Hosting solo sirve archivos estáticos. Los endpoints `/api/telegram` y `/api/facebook` no funcionan porque necesitan un servidor.

## ✅ Solución: Desplegar en Vercel

Vercel soporta serverless functions automáticamente desde la carpeta `/api`.

---

## 📋 Pasos para Desplegar

### 1. Instalar Vercel CLI

```bash
npm install -g vercel
```

### 2. Login en Vercel

```bash
vercel login
```

### 3. Desplegar el Proyecto

```bash
vercel
```

Responde las preguntas:
- Set up and deploy? → **Y**
- Which scope? → Tu cuenta
- Link to existing project? → **N**
- Project name? → **nicaragua-informate-api**
- In which directory? → **./** (raíz)
- Override settings? → **N**

### 4. Configurar Variables de Entorno

```bash
vercel env add TG_TOKEN
```
Pega: `8750159697:AAGwok3dOuAAiQpdliQNuzG1gpRa-3XOPDs`

```bash
vercel env add TG_CHAT_ID
```
Pega: `-1003431574597`

```bash
vercel env add FB_PAGE_ACCESS_TOKEN
```
Pega el token de Facebook

```bash
vercel env add FB_PAGE_ID
```
Pega: `61578261125687`

### 5. Redesplegar con Variables

```bash
vercel --prod
```

---

## 🔧 Actualizar el Admin

Después de desplegar en Vercel, obtendrás una URL como:
```
https://nicaragua-informate-api.vercel.app
```

Necesitas actualizar el admin para que use esa URL en lugar de `/api/`:

En `admin.html`, busca la función `postToApi` y cambia:
```javascript
const resp = await fetch(`/api/${endpoint}`, {
```

Por:
```javascript
const resp = await fetch(`https://tu-proyecto.vercel.app/api/${endpoint}`, {
```

---

## ✅ Verificar que Funciona

### Test Telegram:
```bash
curl -X POST https://tu-proyecto.vercel.app/api/telegram \
  -H "Content-Type: application/json" \
  -d '{
    "noticia": {
      "titulo": "Test",
      "contenido": "Prueba",
      "categoria": "Tecnología",
      "imagen": "https://via.placeholder.com/400"
    },
    "config": {
      "telegram": {
        "token": "8750159697:AAGwok3dOuAAiQpdliQNuzG1gpRa-3XOPDs",
        "chatId": "-1003431574597"
      }
    }
  }'
```

### Test Facebook:
```bash
curl -X POST https://tu-proyecto.vercel.app/api/facebook \
  -H "Content-Type: application/json" \
  -d '{
    "noticia": {
      "titulo": "Test",
      "contenido": "Prueba",
      "categoria": "Tecnología",
      "imagen": "https://via.placeholder.com/400"
    },
    "config": {
      "facebook": {
        "page1": {
          "id": "61578261125687",
          "token": "TU_TOKEN_AQUI"
        }
      }
    }
  }'
```

---

## 🎯 Alternativa Rápida: Usar Vercel sin CLI

1. Ve a: https://vercel.com/new
2. Conecta tu repositorio de GitHub
3. Vercel detectará automáticamente los archivos en `/api`
4. Agrega las variables de entorno en el dashboard
5. Deploy

---

## 📝 Resumen

1. ✅ Instalar Vercel CLI
2. ✅ Login en Vercel
3. ✅ Desplegar proyecto
4. ✅ Configurar variables de entorno
5. ✅ Actualizar URL en admin.html
6. ✅ Redesplegar admin en Firebase
7. ✅ Probar publicación

---

**Tiempo estimado**: 10-15 minutos
