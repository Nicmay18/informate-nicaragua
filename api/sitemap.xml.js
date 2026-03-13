const { db } = require('../lib/firebase-admin');

module.exports = async (req, res) => {
  try {
    const snapshot = await db.collection('noticias')
      .orderBy('fecha', 'desc')
      .limit(100)
      .get();

    const noticias = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        slug: data.slug || doc.id,
        fecha: data.fecha?.toDate?.() || new Date()
      };
    });

    const baseUrl = 'https://informate-instant-nicaragua.vercel.app';
    const today = new Date().toISOString().split('T')[0];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>hourly</changefreq>
    <priority>1.0</priority>
  </url>
  ${noticias.map(n => `
  <url>
    <loc>${baseUrl}/noticia/${n.slug}</loc>
    <lastmod>${n.fecha.toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`).join('')}
</urlset>`;

    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.status(200).send(sitemap);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};