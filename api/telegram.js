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
      return res.status(400).json({ error: 'Token o Chat ID faltante', token: !!TG_TOKEN, chatId: !!TG_CHAT_ID });
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
    const url = `https://nicaraguainformate.com/noticia?id=${noticia.id || Date.now().toString(36)}`;
    const text = `${emoji[noticia.categoria] || '📰'} *${cat}*\n\n*${titulo}*\n\n${resumen}\n\n🔗 [Leer noticia completa](${url})`;
    const boton = { reply_markup: { inline_keyboard: [[{ text: "📰 Leer noticia completa", url }]] } };

    // Siempre enviar solo texto (más confiable)
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
      return res.status(500).json({ 
        error: 'Telegram API error', 
        details: msgData.description,
        error_code: msgData.error_code,
        chat_id: TG_CHAT_ID
      });
    }

    return res.status(200).json({ success: true, messageId: msgData.result.message_id });

  } catch (e) {
    console.error('[Telegram] Error:', e);
    return res.status(500).json({ error: e.message });
  }
};
