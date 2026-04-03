// API Proxy para streams de radio de Nicaragua
// Esto evita problemas de CORS y permite reproducir radios en el navegador

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { radio } = req.query;

  // URLs VERIFICADAS de streams de radios de Nicaragua
  const RADIOS_NICARAGUA = {
    'radioya': 'https://stream.ecmdigital.net:8010/radioya',
    'buenisima': 'https://stream.zeno.fm/f24tdg9bq68uv',
    'pachanguera': 'https://stream.zeno.fm/8qhxqhx2gg0uv',
    'futura': 'https://stream.zeno.fm/nqhxqhx2gg0uv',
    'vivafm': 'https://stream.zeno.fm/aqf8fnx2gg0uv'
  };

  const streamUrl = RADIOS_NICARAGUA[radio];

  if (!streamUrl) {
    return res.status(400).json({ error: 'Radio no encontrada' });
  }

  try {
    // Hacer fetch al stream de radio
    const response = await fetch(streamUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': '*/*',
        'Connection': 'keep-alive'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Copiar headers importantes
    res.setHeader('Content-Type', response.headers.get('content-type') || 'audio/mpeg');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Stream el audio al cliente
    const reader = response.body.getReader();
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      res.write(value);
    }
    
    res.end();

  } catch (error) {
    console.error('Error streaming radio:', error);
    res.status(500).json({ 
      error: 'Error al conectar con la radio',
      details: error.message 
    });
  }
}
