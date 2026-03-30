export default async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { noticia, config } = req.body || {};
    
    const TG_TOKEN = config?.telegram?.token || process.env.TG_TOKEN;
    const TG_CHAT_ID = config?.telegram?.chatId || process.env.TG_CHAT_ID;

    if (!TG_TOKEN || !TG_CHAT_ID) {
      return res.status(400).json({ error: 'Telegram no configurado' });
    }
    if (!noticia?.titulo) {
      return res.status(400).json({ error: 'Falta título' });
    }

    const emoji = {
      'Sucesos': '🚨', 'Nacionales': '🇳🇮', 'Economía': '💰', 'Cultura': '🎨',
      'Espectáculos': '⭐', 'Deportes': '⚽', 'Tecnología': '💻', 'Internacionales': '🌍'
    };

    const titulo = (noticia.titulo || '').substring(0, 200);
    const resumenCompleto = noticia.resumen || noticia.contenido || '';
    let resumen = resumenCompleto.substring(0, 300);
    const ultimoPunto = resumen.lastIndexOf('.');
    if (ultimoPunto > 100) resumen = resumen.substring(0, ultimoPunto + 1);
    const cat = (noticia.categoria?.toUpperCase() || 'NOTICIA').substring(0, 30);
    const url = `https://nicaraguainformate.com/noticia?id=${noticia.id || noticia.slug || Date.now().toString(36)}`;
    const text = `${emoji[noticia.categoria] || '📰'} *${cat}*\n\n*${titulo}*\n\n${resumen}\n\n🔗 [Leer noticia completa](${url})`;
    const boton = { reply_markup: { inline_keyboard: [[{ text: "📰 Leer noticia completa", url }]] } };

    // Intentar con foto si la imagen es una URL válida (no base64)
    const imagenValida = noticia.imagen && 
      !noticia.imagen.startsWith('data:') && 
      (noticia.imagen.startsWith('http://') || noticia.imagen.startsWith('https://'));

    if (imagenValida) {
      const fotoResp = await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendPhoto`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TG_CHAT_ID,
          photo: noticia.imagen,
          caption: text.slice(0, 1024),
          parse_mode: 'Markdown',
          ...boton
        })
      });
      const fotoData = await fotoResp.json();
      if (fotoData.ok) {
        return res.status(200).json({ success: true, messageId: fotoData.result.message_id });
      }
      // Si falla la foto, cae al mensaje de texto
    }

    // Enviar solo texto
    const msgResp = await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TG_CHAT_ID,
        text: text.slice(0, 4096),
        parse_mode: 'Markdown',
        ...boton
      })
    });
    const msgData = await msgResp.json();

    if (!msgData.ok) {
      return res.status(500).json({ error: 'Telegram API error', details: msgData.description });
    }

    return res.status(200).json({ success: true, messageId: msgData.result.message_id });

  } catch (e) {
    console.error('[Telegram] Error:', e);
    return res.status(500).json({ error: e.message });
  }
};
