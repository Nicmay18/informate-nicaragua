export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { titulo, categoria, palabras = 400 } = req.body;
  if (!titulo) return res.status(400).json({ error: 'Falta el titular' });

  const GEMINI_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_KEY) return res.status(500).json({ error: 'API key no configurada' });

  const prompt = `Eres un periodista profesional de Nicaragua Informate. Redacta una noticia completa en español, estilo BBC/CNN en Español, sobre: "${titulo}". Categoría: ${categoria || 'General'}.

Requisitos:
- Primer párrafo impactante con datos clave
- 3-4 párrafos de desarrollo con contexto
- Párrafo final con perspectiva
- Tono serio, objetivo, profesional
- Máximo ${palabras} palabras

Devuelve SOLO el contenido, sin título ni encabezados.`;

  try {
    const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 1024 }
      })
    });

    const data = await resp.json();
    if (!resp.ok) throw new Error(data.error?.message || 'Error en Gemini API');

    const texto = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!texto) throw new Error('Respuesta vacía de Gemini');

    return res.status(200).json({
      success: true,
      contenido: texto.trim(),
      tokens: data.usageMetadata?.totalTokenCount
    });

  } catch (error) {
    return res.status(500).json({ error: 'Error al generar contenido', details: error.message });
  }
}
