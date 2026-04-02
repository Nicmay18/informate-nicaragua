import { initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { cert } from 'firebase-admin/app';

// Inicializar Firebase Admin solo una vez
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID || 'informate-instant-nicaragua',
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    })
  });
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const { id, slug } = req.query;
  const lookup = id || slug;
  if (!lookup) return res.redirect('/noticia.html');

  try {
    const db = getFirestore();
    let docData = null;
    let docId = null;

    // Try direct ID lookup first
    if (id) {
      const docSnap = await db.collection('noticias').doc(id).get();
      if (docSnap.exists) { docData = docSnap.data(); docId = docSnap.id; }
    }

    // Fallback: query by slug
    if (!docData && slug) {
      const q = await db.collection('noticias').where('slug', '==', slug).limit(1).get();
      if (!q.empty) { docData = q.docs[0].data(); docId = q.docs[0].id; }
    }

    if (!docData) {
      return res.redirect('/noticia.html?id=' + lookup);
    }

    const n = docData;
    const titulo = n.titulo || 'Nicaragua Informate';
    const descripcion = n.resumen || (n.contenido || '').substring(0, 200);
    const imagen = n.imagen?.startsWith('data:') ? 'https://nicaraguainformate.com/logo.png' : (n.imagen || 'https://nicaraguainformate.com/logo.png');
    const canonicalUrl = n.slug
      ? `https://nicaraguainformate.com/noticia/${n.slug}`
      : `https://nicaraguainformate.com/noticia.html?id=${docId}`;
    const url = canonicalUrl;

    const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${titulo} | Nicaragua Informate</title>
<meta name="description" content="${descripcion}">
<meta property="og:title" content="${titulo}">
<meta property="og:description" content="${descripcion}">
<meta property="og:image" content="${imagen}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:url" content="${url}">
<meta property="og:type" content="article">
<meta property="og:site_name" content="Nicaragua Informate">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${titulo}">
<meta name="twitter:description" content="${descripcion}">
<meta name="twitter:image" content="${imagen}">
<meta http-equiv="refresh" content="0;url=${url}">
</head>
<body>
<script>window.location.href = "${url}";</script>
</body>
</html>`;

    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Cache-Control', 's-maxage=300');
    return res.status(200).send(html);

  } catch (e) {
    return res.redirect('/noticia.html?id=' + id);
  }
}
