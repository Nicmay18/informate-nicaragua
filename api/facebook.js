module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { noticia } = req.body || {};
    const FB_PAGE_ID = process.env.FB_PAGE_ID;
    const FB_PAGE_ACCESS_TOKEN = process.env.FB_PAGE_ACCESS_TOKEN;

    console.log('FB Config:', { 
      hasPageId: !!FB_PAGE_ID, 
      hasToken: !!FB_PAGE_ACCESS_TOKEN,
      tokenLength: FB_PAGE_ACCESS_TOKEN?.length 
    });

    if (!FB_PAGE_ID || !FB_PAGE_ACCESS_TOKEN) {
      return res.status(400).json({ 
        error: 'Facebook no configurado',
        details: { hasPageId: !!FB_PAGE_ID, hasToken: !!FB_PAGE_ACCESS_TOKEN }
      });
    }

    if (!noticia?.titulo) {
      return res.status(400).json({ error: 'Falta título de noticia' });
    }

    const emoji = {
      'Sucesos': '🚨', 'Nacionales': '🇳🇮', 'Economía': '💰', 'Cultura': '🎨',
      'Espectáculos': '⭐', 'Deportes': '⚽', 'Tecnología': '💻', 'Internacionales': '🌍'
    };

    const slug = noticia.slug || noticia.id || Date.now().toString(36);
    const urlNoticia = `https://informate-instant-nicaragua.vercel.app/noticia/${slug}`;

    const mensaje = 
`${emoji[noticia.categoria] || '📰'} ${noticia.categoria?.toUpperCase() || 'NOTICIA'}

${noticia.titulo}

${noticia.resumen || ''}

🔗 ${urlNoticia}`;

    const params = new URLSearchParams();
    params.set('message', mensaje);
    params.set('access_token', FB_PAGE_ACCESS_TOKEN);
    
    if (noticia.imagen) {
      params.set('link', urlNoticia);
    }

    const fbUrl = `https://graph.facebook.com/v18.0/${FB_PAGE_ID}/feed`;
    
    console.log('Posting to Facebook:', fbUrl);

    const response = await fetch(fbUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString()
    });

    const data = await response.json();
    console.log('Facebook response:', data);

    if (!response.ok || data.error) {
      return res.status(500).json({ 
        error: 'Facebook API Error',
        message: data.error?.message || 'Unknown error',
        code: data.error?.code,
        type: data.error?.type
      });
    }

    return res.status(200).json({ 
      success: true, 
      postId: data.id,
      url: `https://facebook.com/${data.id}`
    });

  } catch (e) {
    console.error('Server error:', e);
    return res.status(500).json({ error: e.message });
  }
};