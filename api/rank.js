const API_URL = 'https://captain.sapimu.au/flickreels/api/v1'
const TOKEN = process.env.AUTH_TOKEN
const HEADERS = { Authorization: `Bearer ${TOKEN}`, 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 'Accept': 'application/json', 'Accept-Language': 'en-US,en;q=0.9' }

export default async function handler(req, res) {
  const { lang = 'id' } = req.query
  try {
    const response = await fetch(`${API_URL}/hot-rank?lang=${lang}`, {
      headers: HEADERS
    })
    const json = await response.json()
    const dramas = (json.data || []).flatMap(cat => (cat.data || []).map(i => ({ id: i.playlet_id || i.id, title: i.title, cover: i.cover, episodes: i.upload_num })))
    res.json({ data: dramas })
  } catch (err) { res.status(500).json({ error: err.message }) }
}
