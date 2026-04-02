# 🔧 Configuración de PayPal y Amazon Affiliates

## ✅ Cambios Aplicados

He actualizado el código para usar:
- **PayPal** en lugar de Buy Me a Coffee
- **Amazon Affiliates** con placeholders para tu ID

---

## 📝 PASO 1: Configurar Amazon Associates

### Crear cuenta:
1. Ve a: https://affiliate-program.amazon.com/
2. Click en "Join Now for Free"
3. Completa el registro con tus datos
4. Proporciona información de tu sitio: `nicaraguainformate.com`
5. Describe tu sitio: "Portal de noticias de Nicaragua"

### Obtener tu Amazon Associate ID:
- Después de aprobar tu cuenta, te darán un ID como: `nicaraguainform-20`
- Este ID lo necesitas para reemplazar en el código

### Reemplazar en el código:
Busca en `public/index.html` y reemplaza:
```
TU_AMAZON_TAG_AQUI
```
Por tu ID real, ejemplo:
```
nicaraguainform-20
```

**Ubicaciones a cambiar:**
- Línea ~488: Banner de afiliados
- Cualquier otro link de Amazon que agregues

---

## 💰 PASO 2: Configurar PayPal

### Opción A: PayPal Donate Button (Recomendado)

1. Ve a: https://www.paypal.com/donate/buttons
2. Inicia sesión con tu cuenta PayPal
3. Click en "Create Donation Button"
4. Personaliza:
   - Nombre: "Nicaragua Informate"
   - Descripción: "Apoya el periodismo independiente"
   - Moneda: USD
5. Click en "Create Button"
6. Copia el "Hosted Button ID" (ejemplo: ABCD1234EFGH)

### Opción B: PayPal.me (Más simple)

1. Ve a: https://www.paypal.me/
2. Crea tu link personalizado: `paypal.me/tunombre`
3. Usa este link directamente

### Reemplazar en el código:

**Si usas Donate Button:**
Busca y reemplaza:
```
https://www.paypal.com/donate/?hosted_button_id=TU_BUTTON_ID_AQUI
```
Por:
```
https://www.paypal.com/donate/?hosted_button_id=TU_ID_REAL
```

**Si usas PayPal.me:**
Reemplaza por:
```
https://www.paypal.me/tunombre
```

**Ubicaciones a cambiar:**
- Línea ~567: Donation box en sidebar
- Línea ~714: Footer

---

## 🚀 PASO 3: Desplegar Cambios

Después de hacer los reemplazos:

```bash
firebase deploy --only hosting
```

---

## 💡 Tips para Maximizar Ingresos

### Amazon Affiliates:
- Promociona productos relevantes para tu audiencia
- Usa links en artículos relacionados con tecnología
- Crea secciones de "Productos Recomendados"
- Comisión típica: 1-10% según categoría

### PayPal Donaciones:
- Menciona en artículos importantes
- Agrega mensaje de agradecimiento
- Sé transparente sobre el uso de fondos
- Ofrece beneficios a donantes (menciones, etc.)

### Google AdSense:
- Ya configurado: `ca-pub-4115203339551838`
- Optimiza ubicación de anuncios
- Mantén contenido de calidad
- CPM típico en Nicaragua: $1-5

---

## 📊 Tracking de Conversiones

El código ya incluye tracking de Google Analytics para:
- Clicks en links de Amazon
- Clicks en botón de PayPal
- Visualizaciones de banners

Revisa en Google Analytics:
- Events > affiliate_click
- Events > donation_click

---

## ⚠️ Importante

### Amazon Associates:
- Necesitas generar al menos 3 ventas en los primeros 180 días
- Si no, tu cuenta se cierra (pero puedes volver a aplicar)
- Cumple con sus términos de servicio

### PayPal:
- Verifica tu cuenta para recibir pagos
- Configura retiros a tu banco nicaragüense
- Considera fees de conversión USD a NIO

---

## 🔍 Verificar que Funciona

1. Abre tu sitio
2. Busca el banner amarillo de Amazon
3. Click en "Ver ofertas en Amazon"
4. Verifica que el link incluya tu tag: `?tag=tu-id-20`
5. Busca el box verde de PayPal
6. Click en "Donar con PayPal"
7. Verifica que te lleve a tu página de donaciones

---

## 📞 Soporte

Si tienes problemas:
- Amazon Associates: https://affiliate-program.amazon.com/help
- PayPal: https://www.paypal.com/ni/smarthelp/home

---

**Fecha:** 27 de marzo de 2026
**Estado:** ⏳ Pendiente de configurar IDs reales
