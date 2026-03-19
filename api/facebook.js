// api/facebook.js
module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { noticia } = req.body;
  
  // Token desde variables de entorno (seguro)
  const FB_PAGE_ACCESS_TOKEN = process.env.FB_PAGE_ACCESS_TOKEN;
  const FB_PAGE_ID = process.env.FB_PAGE_ID || '61578261125687';

  if (!FB_PAGE_ACCESS_TOKEN) {
    return res.status(500).json({ error: 'Token no configurado' });
  }

  try {
    const mensaje = `${noticia.titulo}

${noticia.resumen || noticia.contenido?.substring(0, 500) || ''}

#${(noticia.categoria || 'Noticias').replace(/\s+/g, '')} #Nicaragua #InformateAlInstante`;

    // Publicar en Facebook
    const url = `https://graph.facebook.com/v18.0/${FB_PAGE_ID}/photos`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: noticia.imagen,
        caption: mensaje,
        access_token: FB_PAGE_ACCESS_TOKEN
      })
    });

    const data = await response.json();
    
    if (data.id) {
      res.json({ success: true, postId: data.id });
    } else {
      res.status(400).json({ error: data.error?.message || 'Error desconocido' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}