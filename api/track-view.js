const { db } = require('../lib/firebase-admin');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { noticiaId, referrer = 'direct' } = req.body || {};
    
    if (!noticiaId) return res.status(400).json({ error: 'Falta noticiaId' });

    await db.collection('analytics').add({
      noticiaId,
      referrer,
      userAgent: req.headers['user-agent']?.substring(0, 200) || 'unknown',
      country: req.headers['x-vercel-ip-country'] || 'unknown',
      timestamp: new Date()
    });

    await db.collection('noticias').doc(noticiaId).update({
      vistas: require('firebase-admin').firestore.FieldValue.increment(1)
    });

    res.status(200).json({ success: true });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};