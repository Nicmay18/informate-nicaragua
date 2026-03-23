const FSBASE = 'https://firestore.googleapis.com/v1/projects/informate-instant-nicaragua/databases/(default)/documents';

const CAT_IMG = {
  'Sucesos':        'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80',
  'Nacionales':     'https://images.unsplash.com/photo-1569025690938-a00729c9e1f9?w=800&q=80',
  'Internacionales':'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80',
  'Deportes':       'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80',
  'Tecnología':     'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80',
  'Cultura':        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
  'Economía':       'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80',
  'Espectáculos':   'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80',
};
function fallbackImg(cat) {
  return CAT_IMG[cat] || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80';
}

async function getRelacionadas(id, categoria) {
  try {
    const r = await fetch(`${FSBASE}/noticias?pageSize=20&orderBy=fecha+desc`);
    if (!r.ok) return [];
    const data = await r.json();
    const docs = data.documents || [];
    return docs
      .filter(d => {
        const docId = d.name.split('/').pop();
        return docId !== id && d.fields?.categoria?.stringValue === categoria;
      })
      .slice(0, 3)
      .map(d => ({
        id: d.name.split('/').pop(),
        titulo: d.fields?.titulo?.stringValue || '',
        imagen: d.fields?.imagen?.stringValue || '',
        categoria: d.fields?.categoria?.stringValue || ''
      }));
  } catch(e) { return []; }
}

module.exports = async (req, res) => {
  const id = req.query.id || '';
  const BASE = 'https://nicaraguainformate.com';
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
    const imgTag = imagen ? `<img src="${esc(imagen)}" alt="${esc(titulo)}" class="imagen-principal" onerror="this.src='${fallbackImg(categoria)}'">` : `<img src="${fallbackImg(categoria)}" alt="${esc(titulo)}" class="imagen-principal">`;
    const imgMeta = imagen ? `<meta property="og:image" content="${esc(imagen)}"><meta name="twitter:image" content="${esc(imagen)}">` : '';

    const catColor = {
      'Sucesos': '#fee2e2', 'Nacionales': '#ffedd5', 'Economía': '#fef3c7',
      'Deportes': '#d1fae5', 'Tecnología': '#dbeafe', 'Internacionales': '#cffafe',
      'Cultura': '#ede9fe', 'Espectáculos': '#fce7f3'
    };
    const catBg = catColor[categoria] || '#f1f5f9';

    // Noticias relacionadas de la misma categoría
    const relacionadas = await getRelacionadas(id, categoria);
    const relacionadasHtml = relacionadas.length ? `
    <div style="margin-top:40px;padding-top:32px;border-top:3px solid #e2e8f0;">
      <h3 style="font-size:1.3em;font-weight:800;color:#1e293b;margin-bottom:20px;">📰 Noticias relacionadas</h3>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;">
        ${relacionadas.map(n => `
        <a href="/noticia?id=${n.id}" style="text-decoration:none;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08);border:1px solid #e2e8f0;display:block;transition:transform .2s;" onmouseover="this.style.transform='translateY(-4px)'" onmouseout="this.style.transform='translateY(0)'">
          <img src="${esc(n.imagen)||fallbackImg(n.categoria)}" alt="${esc(n.titulo)}" style="width:100%;height:140px;object-fit:cover;" onerror="this.src='${fallbackImg(n.categoria)}'">
          <div style="padding:12px;">
            <span style="background:${catBg};font-size:10px;font-weight:700;text-transform:uppercase;padding:2px 8px;border-radius:20px;color:#333;">${esc(n.categoria)}</span>
            <p style="margin-top:8px;font-size:14px;font-weight:700;color:#1e293b;line-height:1.4;">${esc(n.titulo)}</p>
          </div>
        </a>`).join('')}
      </div>
    </div>` : '';

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
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4115203339551838" crossorigin="anonymous"></script>
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
    .share-box{background:#fff;border-radius:12px;padding:20px;margin:32px 0;box-shadow:0 2px 8px rgba(0,0,0,.08);border:1px solid #e2e8f0;}
    .share-box h4{font-size:15px;font-weight:700;color:#1e293b;margin-bottom:14px;}
    .share-btns{display:flex;gap:10px;flex-wrap:wrap;}
    .share-btn{display:inline-flex;align-items:center;gap:8px;padding:10px 18px;border-radius:8px;font-size:14px;font-weight:600;text-decoration:none;border:none;cursor:pointer;transition:opacity .2s;}
    .share-btn:hover{opacity:.85;}
    .btn-wa{background:#25d366;color:#fff;}
    .btn-tg{background:#0088cc;color:#fff;}
    .btn-copy{background:#64748b;color:#fff;}
    footer{background:#1e293b;color:#fff;text-align:center;padding:24px;margin-top:40px;font-size:14px}
    footer a{color:#93c5fd;text-decoration:none;margin:0 8px}
    .ad-slot{margin:24px 0;text-align:center;min-height:90px;}
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

    <!-- ADSENSE DENTRO DEL ARTÍCULO -->
    <div class="ad-slot">
      <ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-4115203339551838" data-ad-slot="4727039722" data-ad-format="auto" data-full-width-responsive="true"></ins>
      <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
    </div>

    <!-- COMPARTIR -->
    <div class="share-box">
      <h4>📢 Compartir esta noticia</h4>
      <div class="share-btns">
        <a class="share-btn btn-wa" href="https://wa.me/?text=${encodeURIComponent(titulo + ' - Nicaragua Informate\n\n' + BASE + '/noticia?id=' + id)}" target="_blank">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.855L0 24l6.335-1.508A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.65-.51-5.17-1.395l-.37-.22-3.762.895.952-3.67-.242-.38A9.956 9.956 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
          WhatsApp
        </a>
        <a class="share-btn btn-tg" href="https://t.me/share/url?url=${encodeURIComponent(BASE + '/noticia?id=' + id)}&text=${encodeURIComponent(titulo)}" target="_blank">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
          Telegram
        </a>
        <button class="share-btn btn-copy" onclick="copiarLink()">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
          <span id="copyTxt">Copiar link</span>
        </button>
      </div>
    </div>

    ${relacionadasHtml}
  </article>
</div>
<footer>
  <p>&copy; 2026 Nicaragua Informate</p>
  <a href="/">Inicio</a>
  <a href="/privacidad.html">Privacidad</a>
  <a href="/terminos.html">Términos</a>
  <a href="/contacto.html">Contacto</a>
</footer>
<script>
function copiarLink(){
  navigator.clipboard.writeText('${BASE}/noticia?id=${id}').then(()=>{
    const el=document.getElementById('copyTxt');
    el.textContent='¡Copiado!';
    setTimeout(()=>el.textContent='Copiar link',2000);
  }).catch(()=>alert('${BASE}/noticia?id=${id}'));
}
</script>
</body>
</html>`;

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    res.status(200).send(html);

    // Incrementar vistas en background (fire and forget)
    const PROJECT2 = 'informate-instant-nicaragua';
    const BASE2 = `https://firestore.googleapis.com/v1/projects/${PROJECT2}/databases/(default)/documents`;
    fetch(`${BASE2}/noticias/${id}`)
      .then(r => r.json())
      .then(doc => {
        const v = doc.fields?.vistas?.integerValue ? parseInt(doc.fields.vistas.integerValue) : 0;
        return fetch(`${BASE2}/noticias/${id}?updateMask.fieldPaths=vistas`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fields: { vistas: { integerValue: v + 1 } } })
        });
      })
      .catch(() => {});

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
