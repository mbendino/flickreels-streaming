const API_URL = 'https://captain.sapimu.au/flickreels/api/v1'
const TOKEN = process.env.AUTH_TOKEN

export default async function handler(req, res) {
  const { q, lang = 'id' } = req.query
  if (!q) return res.status(400).json({ error: 'Missing query' })
  try {
    const response = await fetch(`${API_URL}/search?q=${encodeURIComponent(q)}&page=1&lang=${lang}`, {
      headers: { Authorization: `Bearer ${TOKEN}`, 'User-Agent': 'Mozilla/5.0' }
    })
    const json = await response.json()
    const dramas = (json.data || []).map(i => ({ id: i.playlet_id, title: i.title, cover: i.cover, episodes: i.upload_num }))
    res.json({ data: dramas })
  } catch (err) { res.status(500).json({ error: err.message }) }
}
