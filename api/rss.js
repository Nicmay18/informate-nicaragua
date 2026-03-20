module.exports = async (req, res) => {
  try {
    const PROJECT = 'informate-instant-nicaragua';
    const url = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents/noticias?orderBy=fecha%20desc&pageSize=20`;

    const r = await fetch(url);
    if (!r.ok) throw new Error(`Firestore REST ${r.status}`);
    const data = await r.json();

    const BASE = 'https://informate-nicaragua.vercel.app';
    const docs = data.documents || [];

    const items = docs.map(doc => {
      const f = doc.fields || {};
      const id = doc.name.split('/').pop();
      const titulo = esc(f.titulo?.stringValue || '');
      const resumen = esc((f.resumen?.stringValue || f.contenido?.stringValue || '').substring(0, 300));
      const categoria = esc(f.categoria?.stringValue || 'General');
      const imagen = f.imagen?.stringValue || '';
      const ts = f.fecha?.timestampValue || f.fecha?.stringValue;
      const fecha = ts ? new Date(ts) : new Date();
      const link = `${BASE}/noticia.html?id=${id}`;
      const img = imagen && !imagen.startsWith('data:') && !imagen.includes('fbcdn')
        ? `<enclosure url="${esc(imagen)}" type="image/jpeg"/>`
        : '';

      return `<item>
      <title>${titulo}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description>${resumen}</description>
      <category>${categoria}</category>
      <pubDate>${fecha.toUTCString()}</pubDate>
      ${img}
    </item>`;
    }).join('\n');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Nicaragua Informate</title>
    <link>${BASE}</link>
    <description>Noticias de Nicaragua al instante</description>
    <language>es</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${BASE}/api/rss" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;

    res.setHeader('Content-Type', 'application/rss+xml; charset=utf-8');
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).send(xml);

  } catch (e) {
    res.setHeader('Content-Type', 'application/rss+xml; charset=utf-8');
    res.status(500).send(`<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Error</title><description>${e.message}</description></channel></rss>`);
  }
};

function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
