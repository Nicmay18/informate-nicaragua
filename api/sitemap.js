export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/xml');
  res.setHeader('Cache-Control', 's-maxage=3600');

  const BASE = 'https://nicaraguainformate.com';
  const now = new Date().toISOString();

  // Páginas estáticas
  const paginas = [
    { loc: BASE, lastmod: now, changefreq: 'hourly', priority: '1.0' },
    { loc: `${BASE}/privacidad.html`, lastmod: now, changefreq: 'monthly', priority: '0.3' },
    { loc: `${BASE}/terminos.html`, lastmod: now, changefreq: 'monthly', priority: '0.3' },
    { loc: `${BASE}/contacto.html`, lastmod: now, changefreq: 'monthly', priority: '0.4' },
  ];

  // Noticias desde Firestore REST API
  let noticiasUrls = [];
  try {
    const PROJECT = 'informate-instant-nicaragua';
    const url = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents/noticias?pageSize=100`;
    const r = await fetch(url);
    if (r.ok) {
      const data = await r.json();
      const docs = data.documents || [];
      noticiasUrls = docs.map(doc => {
        const id = doc.name.split('/').pop();
        const ts = doc.fields?.fecha?.timestampValue || doc.fields?.fecha?.stringValue;
        const lastmod = ts ? new Date(ts).toISOString() : now;
        return { loc: `${BASE}/noticia.html?id=${id}`, lastmod, changefreq: 'weekly', priority: '0.8' };
      });
    }
  } catch(e) {}

  const allUrls = [...paginas, ...noticiasUrls];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  res.status(200).send(xml);
}
