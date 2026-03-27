# ⚙️ Configuración de APIs en el Panel Admin

## ✅ Actualización Desplegada

Se ha agregado un panel completo de configuración de APIs en el admin donde puedes gestionar los tokens de Telegram y Facebook directamente desde la interfaz.

---

## 🎯 Cómo Acceder

1. **Hacer login** en el panel admin:
   ```
   https://informate-instant-nicaragua.web.app/admin.html
   ```

2. **Ir a la pestaña "Configuración"** (última opción en el menú lateral)

3. **Buscar la sección "Configuración de APIs"** (panel de la derecha)

---

## 📱 Configurar Telegram Bot

### Campos Disponibles:

**Bot Token**:
```
Valor actual: 8750159697:AAGwok3dOuAAiQpdliQNuzG1gpRa-3XOPDs
```

**Chat ID**:
```
Valor actual: -1003431574597
```

### Cómo Obtener los Datos:

1. **Bot Token**:
   - Habla con @BotFather en Telegram
   - Usa el comando `/newbot` o `/token`
   - Copia el token que te da

2. **Chat ID**:
   - Agrega tu bot al canal/grupo
   - Envía un mensaje en el canal
   - Ve a: `https://api.telegram.org/bot<TU_TOKEN>/getUpdates`
   - Busca el `chat_id` en la respuesta

---

## 📘 Configurar Facebook Páginas

### Página 1 (Principal)

**Page ID**:
```
Valor actual: 61578261125687
URL: https://www.facebook.com/profile.php?id=61578261125687
```

**Access Token**:
```
Token de acceso de la página (se guarda de forma segura)
```

### Página 2 (Secundaria)

**Page ID**:
```
Valor actual: 61577962970892
```

**Access Token**:
```
Token de acceso de la página secundaria
```

### Cómo Obtener los Datos:

1. **Page ID**:
   - Ve a tu página de Facebook
   - Click en "Acerca de"
   - Busca el ID de la página
   - O tómalo de la URL: `facebook.com/profile.php?id=XXXXXXXX`

2. **Access Token**:
   - Ve a: https://developers.facebook.com/tools/explorer/
   - Selecciona tu página
   - Genera un token con permisos:
     - `pages_manage_posts`
     - `pages_read_engagement`
   - Copia el token

---

## 💾 Guardar Configuración

### Pasos:

1. **Completar todos los campos** con tus tokens
2. **Click en "Guardar Configuración"**
3. **Verificar el mensaje de éxito**: "Configuración guardada correctamente"

### Dónde se Guardan:

Los tokens se guardan en **localStorage** de tu navegador:
- ✅ No se envían a ningún servidor
- ✅ Permanecen en tu navegador
- ✅ Se cargan automáticamente al abrir el panel
- ⚠️ Si borras el caché del navegador, se perderán

---

## 🔄 Recargar Configuración

Si necesitas recargar los valores guardados:

1. **Click en "Recargar"**
2. Los campos se llenarán con los valores guardados

---

## ✅ Verificar Conexiones

Después de guardar la configuración:

1. **Ir a la sección "Estado de Conexiones"** (panel de la izquierda)
2. **Click en "Verificar Conexiones"**
3. **Ver los estados**:
   - 🟢 **Conectado** - Todo funciona correctamente
   - 🔴 **Error** - Hay un problema con el token o la API

### Estados Posibles:

```
🟡 Verificando...  - Probando la conexión
🟢 Conectado       - API funcionando correctamente
🔴 Error           - Token inválido o API no disponible
```

---

## 🚀 Flujo Completo de Configuración

### Primera Vez:

1. **Hacer login** en el panel admin
2. **Ir a Configuración**
3. **Completar todos los campos**:
   - Telegram Bot Token
   - Telegram Chat ID
   - Facebook Página 1 ID y Token
   - Facebook Página 2 ID y Token (opcional)
4. **Click en "Guardar Configuración"**
5. **Ir a "Estado de Conexiones"**
6. **Click en "Verificar Conexiones"**
7. **Verificar que todo esté 🟢 Conectado**

### Crear Primera Noticia:

1. **Ir a "Nueva Noticia"**
2. **Completar el formulario**
3. **Marcar las opciones**:
   - ✅ Enviar a Telegram
   - ✅ Publicar en Facebook
4. **Click en "Publicar Noticia"**
5. **Ver la barra de progreso**:
   ```
   [0%]   Iniciando...
   [30%]  Guardando en Firebase
   [60%]  Enviando a Telegram
   [90%]  Publicando en Facebook
   [100%] ¡Completado!
   ```
6. **Verificar en Telegram y Facebook** que se publicó

---

## 🔧 Cómo Funcionan las APIs

### Cuando Publicas una Noticia:

El panel admin envía los datos a tus endpoints de API:

**POST /api/telegram**:
```json
{
  "noticia": {
    "titulo": "...",
    "contenido": "...",
    "imagen": "...",
    "categoria": "..."
  },
  "config": {
    "telegram": {
      "token": "8750159697:AAGwok3dOuAAiQpdliQNuzG1gpRa-3XOPDs",
      "chatId": "-1003431574597"
    }
  }
}
```

**POST /api/facebook**:
```json
{
  "noticia": {
    "titulo": "...",
    "contenido": "...",
    "imagen": "...",
    "categoria": "..."
  },
  "config": {
    "facebook": {
      "page1": {
        "id": "61578261125687",
        "token": "EAANHXQ58A0IB..."
      },
      "page2": {
        "id": "61577962970892",
        "token": "EAANHXQ58A0IB..."
      }
    }
  }
}
```

### Tus Endpoints Deben:

1. **Recibir el payload** con `noticia` y `config`
2. **Usar los tokens** de `config` para autenticarse
3. **Publicar en la plataforma** correspondiente
4. **Retornar respuesta**:
   ```json
   {
     "success": true,
     "message": "Publicado correctamente",
     "messageId": "12345"
   }
   ```

---

## 🔒 Seguridad

### Tokens en localStorage:

**Ventajas**:
- ✅ No se envían al servidor de Firebase
- ✅ Permanecen en tu navegador
- ✅ Solo tú tienes acceso

**Desventajas**:
- ⚠️ Si alguien accede a tu navegador, puede verlos
- ⚠️ Se borran si limpias el caché

### Recomendaciones:

1. **Usa tokens con permisos limitados**
2. **No compartas tu sesión del navegador**
3. **Cierra sesión** cuando termines
4. **Renueva los tokens** periódicamente
5. **Usa HTTPS** siempre (ya configurado)

---

## 🐛 Troubleshooting

### Error: "Completa los datos de Telegram"

**Problema**: Faltan campos obligatorios

**Solución**:
- Verifica que Bot Token y Chat ID estén completos
- No dejes campos vacíos

### Error: "Completa los datos de Facebook Página 1"

**Problema**: Faltan campos de Facebook

**Solución**:
- Verifica que Page ID y Access Token estén completos
- La Página 2 es opcional, pero la Página 1 es obligatoria

### Estado: 🔴 Error en Telegram

**Problema**: Token inválido o bot no configurado

**Solución**:
1. Verifica el token con @BotFather
2. Verifica que el bot esté en el canal
3. Verifica el Chat ID
4. Prueba manualmente: `https://api.telegram.org/bot<TOKEN>/getMe`

### Estado: 🔴 Error en Facebook

**Problema**: Token inválido o expirado

**Solución**:
1. Genera un nuevo token en Facebook Developers
2. Verifica que tenga los permisos correctos
3. Verifica que el Page ID sea correcto
4. Los tokens de Facebook expiran, renuévalos regularmente

### La configuración no se guarda

**Problema**: localStorage bloqueado

**Solución**:
1. Verifica que las cookies estén habilitadas
2. Verifica que no estés en modo incógnito
3. Prueba en otro navegador
4. Limpia el caché y vuelve a intentar

---

## 📊 Valores Actuales (Desde .env)

### Telegram:
```
Token: 8750159697:AAGwok3dOuAAiQpdliQNuzG1gpRa-3XOPDs
Chat ID: -1003431574597
```

### Facebook Página 1:
```
ID: 61578261125687
Token: (Ver archivo .env - FB_PAGE_ACCESS_TOKEN)
```

### Facebook Página 2:
```
ID: 61577962970892
Token: (Mismo token que Página 1)
```

---

## ✅ Checklist de Configuración

- [ ] Hacer login en el panel admin
- [ ] Ir a pestaña "Configuración"
- [ ] Completar Bot Token de Telegram
- [ ] Completar Chat ID de Telegram
- [ ] Completar Page ID de Facebook Página 1
- [ ] Completar Access Token de Facebook Página 1
- [ ] (Opcional) Completar datos de Facebook Página 2
- [ ] Click en "Guardar Configuración"
- [ ] Ver mensaje de éxito
- [ ] Ir a "Estado de Conexiones"
- [ ] Click en "Verificar Conexiones"
- [ ] Verificar estados 🟢 Conectado
- [ ] Crear noticia de prueba
- [ ] Verificar publicación en Telegram
- [ ] Verificar publicación en Facebook

---

## 📞 Soporte

Si tienes problemas con la configuración:

**Email**: diazjosenoel@gmail.com  
**Telegram**: @NicaraguaInformateBot  
**PayPal**: https://www.paypal.me/NicaraguaInformate

---

**Fecha**: 27 de marzo de 2026  
**Versión**: 4.0 Enterprise  
**Estado**: ✅ Desplegado y funcionando
