export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { username, password } = req.body;
  // TODO: Mover a variables de entorno en Vercel Dashboard
  const ADMIN_USER = process.env.ADMIN_USER || 'admin@nicaraguainformate.com';
  const ADMIN_PASS = process.env.ADMIN_PASS || 'NicaInfo2026Admin';

  if (username !== ADMIN_USER || password !== ADMIN_PASS) {
    return res.status(401).json({ error: 'Credenciales incorrectas' });
  }

  const token = Buffer.from(`${username}:${Date.now()}`).toString('base64');
  return res.status(200).json({ success: true, token, user: username });
}
