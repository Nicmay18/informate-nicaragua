// api/facebook.js
module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { noticia } = req.body;
  
  const FB_PAGE_ACCESS_TOKEN = process.env.FB_PAGE_ACCESS_TOKEN;
  const FB_PAGE_ID = process.env.FB_PAGE_ID || '741453509043658';

  if (!FB_PAGE_ACCESS_TOKEN) {
    return res.status(500).json({ error: 'Token no configurado' });
  }

  try {
    const mensaje = `${noticia.titulo}\n\n${noticia.resumen || noticia.contenido?.substring(0, 500) || ''}\n\n#${(noticia.categoria || 'Noticias').replace(/\s+/g, '')} #Nicaragua #InformateAlInstante`;
    const esBase64 = (noticia.imagen || '').startsWith('data:');
    const tieneUrl = noticia.imagen && !esBase64;
    const fbUrl = tieneUrl
      ? `https://graph.facebook.com/v18.0/${FB_PAGE_ID}/photos`
      : `https://graph.facebook.com/v18.0/${FB_PAGE_ID}/feed`;
    const body = tieneUrl
      ? { url: noticia.imagen, caption: mensaje, access_token: FB_PAGE_ACCESS_TOKEN }
      : { message: mensaje, access_token: FB_PAGE_ACCESS_TOKEN };
    
    const r = await fetch(fbUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const data = await r.json();

    console.log('[FB] Respuesta:', JSON.stringify(data));

    if (data.id) {
      return res.json({ success: true, postId: data.id });
    } else {
      return res.status(400).json({ error: 'Error al publicar', details: data });
    }
  } catch (error) {
    console.error('[FB] Error:', error);
    res.status(500).json({ error: error.message });
  }
}