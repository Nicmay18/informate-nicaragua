export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/xml');
  res.setHeader('Cache-Control', 's-maxage=3600');

  // URLs estáticas
  const staticUrls = [
    { url: 'https://nicaraguainformate.com/', priority: '1.0', changefreq: 'hourly' },
    { url: 'https://nicaraguainformate.com/noticia.html', priority: '0.8', changefreq: 'daily' },
    { url: 'https://nicaraguainformate.com/privacidad.html', priority: '0.3', changefreq: 'monthly' },
    { url: 'https://nicaraguainformate.com/terminos.html', priority: '0.3', changefreq: 'monthly' },
    { url: 'https://nicaraguainformate.com/contacto.html', priority: '0.4', changefreq: 'monthly' },
  ];

  const now = new Date().toISOString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${staticUrls.map(u => `  <url>
    <loc>${u.url}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  res.status(200).send(xml);
}
