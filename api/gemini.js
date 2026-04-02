export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { titulo, categoria, palabras = 400 } = req.body;
  if (!titulo) return res.status(400).json({ error: 'Falta el titular' });

  const GROQ_KEY = process.env.GROQ_API_KEY;
  if (!GROQ_KEY) return res.status(500).json({ error: 'GROQ_API_KEY no configurada en Vercel' });

  const prompt = `Eres un redactor de noticias para Nicaragua Informate. Redacta una noticia breve y precisa sobre: "${titulo}". Categoría: ${categoria || 'General'}.

Sigue EXACTAMENTE este formato y estilo:

EJEMPLO DE REFERENCIA:
"San Marcos, Nicaragua. – Un motociclista de 68 años resultó lesionado tras ser embestido por un cabezal en el sector conocido como 'Las Tres Cruces', en el departamento de Carazo. La víctima fue impactada por el vehículo pesado mientras este descendía por una pendiente. Testigos indicaron que el cabezal habría perdido el control, presuntamente por fallas en el sistema de frenos. El hecho generó momentos de tensión entre quienes se encontraban en la zona. Equipos de emergencia acudieron al lugar para atender al lesionado, mientras autoridades iniciaron las investigaciones para determinar las causas del accidente."

REGLAS:
- Empieza con el lugar en Nicaragua y un guión: "Managua, Nicaragua. –" o el lugar específico
- Párrafo 1: qué pasó, quién, dónde (datos concretos)
- Párrafo 2: cómo ocurrió, detalles del hecho
- Párrafo 3: reacción, testigos o contexto
- Párrafo 4: autoridades, investigación o estado actual
- Sin adornos, sin opiniones, sin sensacionalismo
- Máximo ${palabras} palabras
- Nombres y datos específicos cuando aplique

Devuelve SOLO el contenido, sin título.`;

  try {
    const resp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 1024
      })
    });

    const data = await resp.json();
    if (!resp.ok) throw new Error(data.error?.message || `Groq status ${resp.status}`);

    const texto = data?.choices?.[0]?.message?.content;
    if (!texto) throw new Error('Respuesta vacia de Groq');

    return res.status(200).json({ success: true, contenido: texto.trim() });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
