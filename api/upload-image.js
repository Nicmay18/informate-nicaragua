export default async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { imagen, nombre } = req.body;
    if (!imagen) return res.status(400).json({ error: 'Falta imagen' });

    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const REPO = 'Nicmay18/informate-nicaragua';
    const BRANCH = 'main';

    // imagen viene como base64 puro (sin el prefijo data:image/...;base64,)
    const base64 = imagen.includes(',') ? imagen.split(',')[1] : imagen;
    const ext = imagen.includes('data:image/') ? imagen.split(';')[0].split('/')[1] : 'jpg';
    const filename = `public/images/${Date.now()}_${(nombre||'img').replace(/[^a-zA-Z0-9]/g,'_')}.${ext}`;

    const apiUrl = `https://api.github.com/repos/${REPO}/contents/${filename}`;

    const response = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
        'User-Agent': 'informate-nicaragua'
      },
      body: JSON.stringify({
        message: `img: subir ${filename}`,
        content: base64,
        branch: BRANCH
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({ error: data.message || 'Error GitHub' });
    }

    // URL pública directa
    const url = `https://raw.githubusercontent.com/${REPO}/${BRANCH}/${filename}`;
    return res.status(200).json({ success: true, url });

  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
