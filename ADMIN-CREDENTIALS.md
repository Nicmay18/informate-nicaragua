# 🔐 Credenciales del Panel Administrativo

## 📋 Información Importante

El panel administrativo (`admin.html`) usa **Firebase Authentication** para el login. No hay credenciales hardcodeadas en el código por seguridad.

---

## 🔧 Cómo Crear Usuario Administrador

### Opción 1: Desde Firebase Console (Recomendado)

1. **Ir a Firebase Console**
   ```
   https://console.firebase.google.com/project/informate-instant-nicaragua/authentication/users
   ```

2. **Agregar Usuario**
   - Click en "Add user"
   - Email: `admin@nicaraguainformate.com` (o el que prefieras)
   - Password: Crear una contraseña segura (mínimo 6 caracteres)
   - Click en "Add user"

3. **Acceder al Panel**
   - URL: `https://informate-instant-nicaragua.web.app/admin.html`
   - Email: El que creaste
   - Password: La que creaste

---

### Opción 2: Desde Firebase CLI

```bash
# Instalar Firebase CLI si no lo tienes
npm install -g firebase-tools

# Login
firebase login

# Crear usuario (requiere script personalizado)
# O usar la consola web (más fácil)
```

---

## 🎯 Credenciales Sugeridas

Para tu primer acceso, te recomiendo:

```
Email: admin@nicaraguainformate.com
Password: Nicaragua2026!
```

**⚠️ IMPORTANTE**: Cambia la contraseña después del primer login.

---

## 🔒 Características de Seguridad Implementadas

### En el Admin Panel:

1. **Autenticación Firebase**
   - Login seguro con email/password
   - Sesión persistente
   - Logout automático al cerrar

2. **Protección de Contenido**
   - ✅ Marca de agua automática en imágenes
   - ✅ Anti-copia (Ctrl+C, Ctrl+U, Ctrl+S, Ctrl+P bloqueados)
   - ✅ Clic derecho deshabilitado
   - ✅ Texto "INFORMATE AL INSTANTE NICARAGUA" con efectos visuales

3. **Publicación Multi-Redes**
   - ✅ Telegram: Bot activo por defecto
   - ✅ Facebook Página 1: ID `61578261125687` (Principal)
   - ✅ Facebook Página 2: ID `61577962970892` (Secundaria)
   - ✅ Sistema de colas con barra de progreso
   - ✅ Log en tiempo real de cada publicación

4. **Diseño Profesional**
   - ✅ Tema dark mode moderno
   - ✅ Tarjetas de redes sociales con estados visuales
   - ✅ Sistema de notificaciones toast mejorado
   - ✅ Dashboard con analytics en tiempo real
   - ✅ Indicadores de publicación en cada noticia

---

## 📱 APIs Configuradas

### Telegram Bot
```
Token: 8750159697:AAGwok3dOuAAiQpdliQNuzG1gpRa-3XOPDs
Chat ID: -1003431574597
Endpoint: /api/telegram
```

### Facebook Páginas
```
Página Principal:
  - ID: 61578261125687
  - Token: (Ver .env)

Página Secundaria:
  - ID: 61577962970892
  - Token: (Ver .env)

Endpoint: /api/facebook
```

### Configuración en Panel
El panel tiene una sección dedicada para gestionar estas APIs con:
- Almacenamiento local de credenciales
- Botón de prueba de conexiones
- Estados visuales de cada servicio

---

## 🚀 Acceso Rápido

### URLs Importantes

```
Sitio Público:
https://informate-instant-nicaragua.web.app

Panel Admin:
https://informate-instant-nicaragua.web.app/admin.html

Firebase Console:
https://console.firebase.google.com/project/informate-instant-nicaragua

Firebase Authentication:
https://console.firebase.google.com/project/informate-instant-nicaragua/authentication/users
```

---

## 🔧 Endpoints de API Necesarios

Para que el sistema funcione completamente, asegúrate de tener estos endpoints:

### 1. `/api/telegram`
```javascript
// POST - Publicar en Telegram
{
  "noticia": {
    "titulo": "...",
    "contenido": "...",
    "imagen": "...",
    "categoria": "..."
  }
}
```

### 2. `/api/facebook`
```javascript
// POST - Publicar en ambas páginas de Facebook
{
  "noticia": {
    "titulo": "...",
    "contenido": "...",
    "imagen": "...",
    "categoria": "..."
  }
}
```

### 3. `/api/upload-image` (Opcional)
```javascript
// POST - Subir imagen con marca de agua
{
  "image": "base64_string",
  "watermark": true
}
```

---

## ✅ Checklist de Verificación

Después de crear tu usuario, verifica:

- [ ] Puedes hacer login en `/admin.html`
- [ ] Dashboard muestra estadísticas
- [ ] Puedes crear una noticia de prueba
- [ ] La marca de agua aparece en las imágenes
- [ ] El sistema de anti-copia funciona (intenta Ctrl+C)
- [ ] Telegram bot responde (si está configurado)
- [ ] Facebook API conecta (si está configurado)
- [ ] Las notificaciones toast aparecen correctamente

---

## 🆘 Troubleshooting

### No puedo hacer login

**Problema**: "Credenciales inválidas"

**Solución**:
1. Verifica que creaste el usuario en Firebase Authentication
2. Verifica que el email y password son correctos
3. Revisa la consola del navegador para errores
4. Verifica que el proyecto Firebase es el correcto

### El panel no carga

**Problema**: Página en blanco o error

**Solución**:
1. Abre DevTools Console (F12)
2. Busca errores de Firebase
3. Verifica que `firebaseConfig` en admin.html es correcto
4. Verifica que Firebase Hosting está activo

### Las APIs no funcionan

**Problema**: Error al publicar en redes

**Solución**:
1. Verifica que los endpoints `/api/*` existen
2. Verifica tokens en `.env`
3. Revisa logs del servidor
4. Usa el botón "Verificar Conexiones" en el panel

---

## 📞 Contacto

Si necesitas ayuda adicional:
- Email: diazjosenoel@gmail.com
- Telegram: @NicaraguaInformateBot

---

**Fecha de creación**: 27 de marzo de 2026
**Versión del Panel**: 4.0 Enterprise
**Estado**: ✅ Listo para producción
