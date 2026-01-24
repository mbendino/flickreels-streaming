const API_URL = 'https://captain.sapimu.au/flickreels/api/v1'
const TOKEN = process.env.AUTH_TOKEN

export default async function handler(req, res) {
  const { lang = 'id' } = req.query
  try {
    const response = await fetch(`${API_URL}/hot-rank?lang=${lang}`, {
      headers: { Authorization: `Bearer ${TOKEN}`, 'User-Agent': 'Mozilla/5.0' }
    })
    const json = await response.json()
    const dramas = (json.data || []).flatMap(cat => (cat.data || []).map(i => ({ id: i.playlet_id || i.id, title: i.title, cover: i.cover, episodes: i.upload_num })))
    res.json({ data: dramas })
  } catch (err) { res.status(500).json({ error: err.message }) }
}
