// api/facebook.js
module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { noticia, config } = req.body;
  
  // Usar tokens del config (desde admin) o del .env (fallback)
  const FB_PAGE_ACCESS_TOKEN = config?.facebook?.page1?.token || process.env.FB_PAGE_ACCESS_TOKEN;
  const FB_PAGE_ID = config?.facebook?.page1?.id || process.env.FB_PAGE_ID || '741453509043658';
  const FB_PAGE_2_TOKEN = config?.facebook?.page2?.token || process.env.FB_PAGE_ACCESS_TOKEN;
  const FB_PAGE_2_ID = config?.facebook?.page2?.id || '';

  if (!FB_PAGE_ACCESS_TOKEN) {
    return res.status(500).json({ error: 'Token no configurado' });
  }

  try {
    const mensaje = `${noticia.titulo}\n\n${noticia.resumen || noticia.contenido?.substring(0, 500) || ''}\n\n#${(noticia.categoria || 'Noticias').replace(/\s+/g, '')} #Nicaragua #InformateAlInstante`;
    const esBase64 = (noticia.imagen || '').startsWith('data:');
    const tieneUrl = noticia.imagen && !esBase64;
    
    const results = [];

    // Publicar en Página 1
    const fbUrl1 = tieneUrl
      ? `https://graph.facebook.com/v18.0/${FB_PAGE_ID}/photos`
      : `https://graph.facebook.com/v18.0/${FB_PAGE_ID}/feed`;
    const body1 = tieneUrl
      ? { url: noticia.imagen, caption: mensaje, access_token: FB_PAGE_ACCESS_TOKEN }
      : { message: mensaje, access_token: FB_PAGE_ACCESS_TOKEN };
    
    const r1 = await fetch(fbUrl1, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body1) });
    const data1 = await r1.json();

    console.log('[FB Page 1] Respuesta:', JSON.stringify(data1));

    if (data1.id) {
      results.push({ pageId: FB_PAGE_ID, postId: data1.id, status: 'published' });
    } else {
      results.push({ pageId: FB_PAGE_ID, status: 'error', details: data1 });
    }

    // Publicar en Página 2 si está configurada
    if (FB_PAGE_2_ID && FB_PAGE_2_TOKEN) {
      const fbUrl2 = tieneUrl
        ? `https://graph.facebook.com/v18.0/${FB_PAGE_2_ID}/photos`
        : `https://graph.facebook.com/v18.0/${FB_PAGE_2_ID}/feed`;
      const body2 = tieneUrl
        ? { url: noticia.imagen, caption: mensaje, access_token: FB_PAGE_2_TOKEN }
        : { message: mensaje, access_token: FB_PAGE_2_TOKEN };
      
      const r2 = await fetch(fbUrl2, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body2) });
      const data2 = await r2.json();

      console.log('[FB Page 2] Respuesta:', JSON.stringify(data2));

      if (data2.id) {
        results.push({ pageId: FB_PAGE_2_ID, postId: data2.id, status: 'published' });
      } else {
        results.push({ pageId: FB_PAGE_2_ID, status: 'error', details: data2 });
      }
    }

    return res.json({ success: true, results });
  } catch (error) {
    console.error('[FB] Error:', error);
    res.status(500).json({ error: error.message });
  }
}