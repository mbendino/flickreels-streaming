const API_URL = 'https://captain.sapimu.au/flickreels/api/v1'
const TOKEN = process.env.AUTH_TOKEN

export default async function handler(req, res) {
  const { page = '1', lang = 'id' } = req.query
  try {
    const response = await fetch(`${API_URL}/for-you?page=${page}&lang=${lang}`, {
      headers: { Authorization: `Bearer ${TOKEN}`, 'User-Agent': 'Mozilla/5.0' }
    })
    const json = await response.json()
    const dramas = (json.data?.list || []).map(i => ({ id: i.playlet_id, title: i.playlet_title || i.title, cover: i.cover, episodes: i.chapter_num || i.upload_num }))
    res.json({ data: dramas })
  } catch (err) { res.status(500).json({ error: err.message }) }
}
