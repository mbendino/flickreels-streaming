const API_URL = 'https://captain.sapimu.au/flickreels/api/v1'
const TOKEN = process.env.AUTH_TOKEN

export default async function handler(req, res) {
  const { id, ep, lang = 'id' } = req.query
  if (!id || !ep) return res.status(400).json({ error: 'Missing id or ep' })
  try {
    const response = await fetch(`${API_URL}/stream/${id}/${ep}?lang=${lang}`, {
      headers: { Authorization: `Bearer ${TOKEN}`, 'User-Agent': 'Mozilla/5.0' }
    })
    res.json(await response.json())
  } catch (err) { res.status(500).json({ error: err.message }) }
}
