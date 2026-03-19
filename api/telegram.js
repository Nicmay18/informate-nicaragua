module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { noticia } = req.body || {};
    const TG_TOKEN = process.env.TG_TOKEN;
    const TG_CHAT_ID = process.env.TG_CHAT_ID;

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

    const titulo = (noticia.titulo || '').substring(0, 150);
    const resumen = (noticia.resumen || '').substring(0, 150);
    const cat = (noticia.categoria?.toUpperCase() || 'NOTICIA').substring(0, 30);
    const slug = noticia.slug || noticia.id || Date.now().toString(36);
    const url = `https://informate-nicaragua.vercel.app/`;

    const text = `${emoji[noticia.categoria] || '📰'} ${cat}\n\n${titulo}\n\n${resumen}\n\n📰 ${url}`.slice(0, 800);

    let telegramUrl, body;
    
    if (noticia.imagen) {
      telegramUrl = `https://api.telegram.org/bot${TG_TOKEN}/sendPhoto`;
      body = {
        chat_id: TG_CHAT_ID,
        photo: noticia.imagen,
        caption: text.slice(0, 900),
        reply_markup: {
          inline_keyboard: [[{ text: "📰 Leer más", url: url }]]
        }
      };
    } else {
      telegramUrl = `https://api.telegram.org/bot${TG_TOKEN}/sendMessage`;
      body = {
        chat_id: TG_CHAT_ID,
        text: text.slice(0, 3500),
        reply_markup: {
          inline_keyboard: [[{ text: "📰 Leer más", url: url }]]
        }
      };
    }

    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const data = await response.json();

    if (!data.ok) {
      return res.status(500).json({ 
        error: 'Telegram API error', 
        details: data.description 
      });
    }

    return res.status(200).json({ 
      success: true, 
      messageId: data.result.message_id 
    });

  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};