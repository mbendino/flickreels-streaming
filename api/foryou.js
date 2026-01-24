const API_URL = 'https://captain.sapimu.au/flickreels/api/v1'
const TOKEN = process.env.AUTH_TOKEN
const HEADERS = {
  Authorization: `Bearer ${TOKEN}`,
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  'Accept': 'application/json',
  'Accept-Language': 'en-US,en;q=0.9'
}

export default async function handler(req, res) {
  const { page = '1', lang = 'id' } = req.query
  try {
    const response = await fetch(`${API_URL}/for-you?page=${page}&lang=${lang}`, { headers: HEADERS })
    const json = await response.json()
    const dramas = (json.data?.list || []).map(i => ({ id: i.playlet_id, title: i.playlet_title || i.title, cover: i.cover, episodes: i.chapter_num || i.upload_num }))
    res.json({ data: dramas })
  } catch (err) { res.status(500).json({ error: err.message }) }
}
