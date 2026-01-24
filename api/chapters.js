const API_URL = 'https://captain.sapimu.au/flickreels/api/v1'
const TOKEN = process.env.AUTH_TOKEN
const HEADERS = { Authorization: `Bearer ${TOKEN}`, 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 'Accept': 'application/json', 'Accept-Language': 'en-US,en;q=0.9' }

export default async function handler(req, res) {
  const { id, lang = 'id' } = req.query
  if (!id) return res.status(400).json({ error: 'Missing id' })
  try {
    const response = await fetch(`${API_URL}/chapters/${id}?lang=${lang}`, {
      headers: HEADERS
    })
    res.json(await response.json())
  } catch (err) { res.status(500).json({ error: err.message }) }
}
