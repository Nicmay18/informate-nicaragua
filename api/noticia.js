module.exports = async (req, res) => {
  const id = req.query.id || '';
  const BASE = 'https://informate-nicaragua.vercel.app';
  const PROJECT = 'informate-instant-nicaragua';

  if (!id) return res.redirect(302, '/');

  try {
    const r = await fetch(`https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents/noticias/${id}`);
    if (!r.ok) throw new Error('not found');
    const doc = await r.json();
    const f = doc.fields || {};

    const titulo = f.titulo?.stringValue || 'Noticia';
    const contenido = (f.contenido?.stringValue || '').replace(/\n/g, '</p><p>');
    const resumen = f.resumen?.stringValue || contenido.substring(0, 150);
    const categoria = f.categoria?.stringValue || 'General';
    const imagen = f.imagen?.stringValue || '';
    const ts = f.fecha?.timestampValue || f.fecha?.stringValue;
    const fecha = ts ? new Date(ts).toLocaleDateString('es-NI', { year: 'numeric', month: 'long', day: 'numeric' }) : '';
    const url = `${BASE}/noticia.html?id=${id}`;
    const imgTag = imagen ? `<img src="${esc(imagen)}" alt="${esc(titulo)}" class="imagen-principal">` : '';
    const imgMeta = imagen ? `<meta property="og:image" content="${esc(imagen)}"><meta name="twitter:image" content="${esc(imagen)}">` : '';

    const catColor = {
      'Sucesos': '#fee2e2', 'Nacionales': '#ffedd5', 'Economía': '#fef3c7',
      'Deportes': '#d1fae5', 'Tecnología': '#dbeafe', 'Internacionales': '#cffafe',
      'Cultura': '#ede9fe', 'Espectáculos': '#fce7f3'
    };
    const catBg = catColor[categoria] || '#f1f5f9';

    const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(titulo)} | Nicaragua Informate</title>
  <meta name="description" content="${esc(resumen)}">
  <meta property="og:type" content="article">
  <meta property="og:title" content="${esc(titulo)}">
  <meta property="og:description" content="${esc(resumen)}">
  <meta property="og:url" content="${url}">
  <meta property="og:site_name" content="Nicaragua Informate">
  ${imgMeta}
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(titulo)}">
  <meta name="twitter:description" content="${esc(resumen)}">
  <script type="application/ld+json">
  {"@context":"https://schema.org","@type":"NewsArticle","headline":"${esc(titulo)}","description":"${esc(resumen)}","image":"${esc(imagen)}","datePublished":"${ts || ''}","author":{"@type":"Organization","name":"Nicaragua Informate"},"publisher":{"@type":"Organization","name":"Nicaragua Informate","logo":{"@type":"ImageObject","url":"${BASE}/logo.png"}}}
  </script>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:'Segoe UI',sans-serif;line-height:1.6;color:#333;background:#f8fafc}
    header{background:#0d47a1;color:#fff;padding:16px 0;text-align:center}
    header a{color:#fff;text-decoration:none;font-size:1.3em;font-weight:bold}
    .container{max-width:800px;margin:0 auto;padding:20px}
    .categoria{display:inline-block;padding:4px 14px;border-radius:20px;font-size:12px;font-weight:bold;text-transform:uppercase;margin-bottom:12px;background:${catBg}}
    h1{font-size:2em;margin-bottom:12px;line-height:1.3}
    .meta{color:#666;font-size:14px;margin-bottom:20px}
    .imagen-principal{width:100%;max-height:450px;object-fit:cover;border-radius:10px;margin-bottom:24px}
    .contenido{font-size:17px;line-height:1.8}
    .contenido p{margin-bottom:16px}
    .back{display:inline-block;margin:20px 0;color:#0d47a1;text-decoration:none;font-weight:500}
    footer{background:#1e293b;color:#fff;text-align:center;padding:24px;margin-top:40px;font-size:14px}
    footer a{color:#93c5fd;text-decoration:none;margin:0 8px}
  </style>
</head>
<body>
<header><a href="/">🇳🇮 Nicaragua Informate</a></header>
<div class="container">
  <a href="/" class="back">← Volver al inicio</a>
  <article>
    <span class="categoria">${esc(categoria)}</span>
    <h1>${esc(titulo)}</h1>
    <div class="meta">${fecha} | Nicaragua Informate</div>
    ${imgTag}
    <div class="contenido"><p>${contenido}</p></div>
  </article>
</div>
<footer>
  <p>&copy; 2026 Nicaragua Informate</p>
  <a href="/privacidad.html">Privacidad</a>
  <a href="/terminos.html">Términos</a>
  <a href="/contacto.html">Contacto</a>
</footer>
</body>
</html>`;

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    res.status(200).send(html);

  } catch (e) {
    res.redirect(302, '/');
  }
};

function esc(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
