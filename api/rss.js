const { db } = require('../lib/firebase-admin');

module.exports = async (req, res) => {
  try {
    const snap = await db.collection('noticias')
      .orderBy('fecha', 'desc')
      .limit(20)
      .get();

    const BASE = 'https://informate-nicaragua.vercel.app';
    const ahora = new Date().toUTCString();

    const items = snap.docs.map(doc => {
      const n = doc.data();
      const fecha = n.fecha?.toDate ? n.fecha.toDate() : new Date(n.fecha?.seconds * 1000 || Date.now());
      const titulo = esc(n.titulo || '');
      const resumen = esc((n.resumen || n.contenido || '').substring(0, 300));
      const link = `${BASE}/noticia.html?id=${doc.id}`;
      const img = n.imagen && !n.imagen.startsWith('data:') ? `<enclosure url="${esc(n.imagen)}" type="image/jpeg"/>` : '';

      return `<item>
      <title>${titulo}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description>${resumen}</description>
      <category>${esc(n.categoria || 'General')}</category>
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
    <lastBuildDate>${ahora}</lastBuildDate>
    <atom:link href="${BASE}/api/rss" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;

    res.setHeader('Content-Type', 'application/rss+xml; charset=utf-8');
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');
    res.status(200).send(xml);

  } catch (e) {
    res.status(500).send(`<?xml version="1.0"?><error>${e.message}</error>`);
  }
};

function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
