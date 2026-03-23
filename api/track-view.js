module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { noticiaId } = req.body || {};
  if (!noticiaId) return res.status(400).json({ error: 'Falta noticiaId' });

  const PROJECT = 'informate-instant-nicaragua';
  const BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents`;

  try {
    // Leer vistas actuales
    const r = await fetch(`${BASE}/noticias/${noticiaId}`);
    if (!r.ok) return res.status(404).json({ error: 'Noticia no encontrada' });
    const doc = await r.json();
    const vistasActuales = doc.fields?.vistas?.integerValue
      ? parseInt(doc.fields.vistas.integerValue)
      : 0;

    // Actualizar solo el campo vistas con PATCH
    const patch = await fetch(
      `${BASE}/noticias/${noticiaId}?updateMask.fieldPaths=vistas`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fields: {
            vistas: { integerValue: vistasActuales + 1 }
          }
        })
      }
    );

    if (!patch.ok) {
      const err = await patch.text();
      return res.status(500).json({ error: err });
    }

    res.status(200).json({ success: true, vistas: vistasActuales + 1 });

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
