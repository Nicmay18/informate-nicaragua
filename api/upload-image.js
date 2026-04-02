export default async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { imagen, nombre } = req.body;
    if (!imagen) return res.status(400).json({ error: 'Falta imagen' });

    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const REPO = 'Nicmay18/informate-nicaragua';
    const BRANCH = 'main';

    // Comprimir imagen antes de subir
    const imagenComprimida = await comprimirImagen(imagen);

    // imagen viene como base64 puro (sin el prefijo data:image/...;base64,)
    const base64 = imagenComprimida.includes(',') ? imagenComprimida.split(',')[1] : imagenComprimida;
    const ext = imagenComprimida.includes('data:image/') ? imagenComprimida.split(';')[0].split('/')[1] : 'webp';
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

/**
 * Comprime una imagen usando Canvas HTML5
 * Redimensiona a máximo 1200px de ancho manteniendo aspect ratio
 * Convierte a WebP con calidad 0.85
 */
async function comprimirImagen(base64Image) {
  return new Promise((resolve, reject) => {
    try {
      const img = new Image();
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Calcular nuevas dimensiones (máximo 1200px de ancho)
        const MAX_WIDTH = 1200;
        let width = img.width;
        let height = img.height;
        
        if (width > MAX_WIDTH) {
          height = (height * MAX_WIDTH) / width;
          width = MAX_WIDTH;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Dibujar imagen redimensionada
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convertir a WebP con calidad 0.85 (85%)
        const comprimida = canvas.toDataURL('image/webp', 0.85);
        resolve(comprimida);
      };
      
      img.onerror = () => {
        // Si falla, devolver imagen original
        resolve(base64Image);
      };
      
      img.src = base64Image;
      
    } catch (error) {
      // Si hay error, devolver imagen original
      resolve(base64Image);
    }
  });
}
