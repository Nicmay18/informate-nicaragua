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
  const FB_PAGE_ID_2 = process.env.FB_PAGE_ID_2 || '61578261125687';

  if (!FB_PAGE_ACCESS_TOKEN) {
    return res.status(500).json({ error: 'Token no configurado' });
  }

  async function publicarEnPagina(pageId) {
    const mensaje = `${noticia.titulo}\n\n${noticia.resumen || noticia.contenido?.substring(0, 500) || ''}\n\n#${(noticia.categoria || 'Noticias').replace(/\s+/g, '')} #Nicaragua #InformateAlInstante`;
    const esBase64 = (noticia.imagen || '').startsWith('data:');
    const tieneUrl = noticia.imagen && !esBase64;
    const fbUrl = tieneUrl
      ? `https://graph.facebook.com/v18.0/${pageId}/photos`
      : `https://graph.facebook.com/v18.0/${pageId}/feed`;
    const body = tieneUrl
      ? { url: noticia.imagen, caption: mensaje, access_token: FB_PAGE_ACCESS_TOKEN }
      : { message: mensaje, access_token: FB_PAGE_ACCESS_TOKEN };
    const r = await fetch(fbUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    return r.json();
  }

  try {
    const [data1, data2] = await Promise.allSettled([
      publicarEnPagina(FB_PAGE_ID),
      publicarEnPagina(FB_PAGE_ID_2)
    ]);

    const r1 = data1.status === 'fulfilled' ? data1.value : { error: data1.reason };
    const r2 = data2.status === 'fulfilled' ? data2.value : { error: data2.reason };

    console.log('[FB] Pagina1:', JSON.stringify(r1), '| Pagina2:', JSON.stringify(r2));

    if (r1.id || r2.id) {
      return res.json({ success: true, pagina1: r1.id || null, pagina2: r2.id || null });
    } else {
      return res.status(400).json({ error: 'Error en ambas páginas', p1: r1, p2: r2 });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}