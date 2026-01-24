import express from 'express'
import { config } from 'dotenv'

config()

const app = express()
const API_URL = 'https://captain.sapimu.au/flickreels/api/v1'
const TOKEN = process.env.AUTH_TOKEN

app.get('/api/foryou', async (req, res) => {
  const { page = '1', lang = 'id' } = req.query
  try {
    const response = await fetch(`${API_URL}/for-you?page=${page}&lang=${lang}`, {
      headers: { Authorization: `Bearer ${TOKEN}` }
    })
    const json = await response.json()
    const dramas = (json.data?.list || []).map(i => ({ id: i.playlet_id, title: i.playlet_title || i.title, cover: i.cover, episodes: i.chapter_num || i.upload_num }))
    res.json({ data: dramas })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.get('/api/rank', async (req, res) => {
  const { lang = 'id' } = req.query
  try {
    const response = await fetch(`${API_URL}/hot-rank?lang=${lang}`, {
      headers: { Authorization: `Bearer ${TOKEN}` }
    })
    const json = await response.json()
    const dramas = (json.data || []).flatMap(cat => (cat.data || []).map(i => ({ id: i.playlet_id || i.id, title: i.title, cover: i.cover, episodes: i.upload_num })))
    res.json({ data: dramas })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.get('/api/search', async (req, res) => {
  const { q, lang = 'id' } = req.query
  if (!q) return res.status(400).json({ error: 'Missing query' })
  try {
    const response = await fetch(`${API_URL}/search?q=${encodeURIComponent(q)}&page=1&lang=${lang}`, {
      headers: { Authorization: `Bearer ${TOKEN}` }
    })
    const json = await response.json()
    const dramas = (json.data || []).map(i => ({ id: i.playlet_id, title: i.title, cover: i.cover, episodes: i.upload_num }))
    res.json({ data: dramas })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.get('/api/chapters', async (req, res) => {
  const { id, lang = 'id' } = req.query
  if (!id) return res.status(400).json({ error: 'Missing id' })
  try {
    const response = await fetch(`${API_URL}/chapters/${id}?lang=${lang}`, {
      headers: { Authorization: `Bearer ${TOKEN}` }
    })
    res.json(await response.json())
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.get('/api/stream', async (req, res) => {
  const { id, ep, lang = 'id' } = req.query
  if (!id || !ep) return res.status(400).json({ error: 'Missing id or ep' })
  try {
    const response = await fetch(`${API_URL}/stream/${id}/${ep}?lang=${lang}`, {
      headers: { Authorization: `Bearer ${TOKEN}` }
    })
    res.json(await response.json())
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.get('/api/video', async (req, res) => {
  const { url } = req.query
  if (!url) return res.status(400).json({ error: 'Missing url' })
  try {
    const response = await fetch(url)
    if (url.includes('.m3u8')) {
      let m3u8 = await response.text()
      // Rewrite .ts to proxy
      m3u8 = m3u8.replace(/^([^#\n].+\.ts)$/gm, (match) => {
        const urlObj = new URL(url)
        const baseUrl = urlObj.origin + urlObj.pathname.substring(0, urlObj.pathname.lastIndexOf('/') + 1)
        const tsUrl = baseUrl + match
        return `/api/video?url=${encodeURIComponent(tsUrl)}`
      })
      res.set('Content-Type', 'application/vnd.apple.mpegurl')
      res.send(m3u8)
    } else {
      res.set('Content-Type', response.headers.get('content-type') || 'video/mp2t')
      res.send(Buffer.from(await response.arrayBuffer()))
    }
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.use(express.static('dist'))
app.get('/{*path}', (req, res) => res.sendFile('index.html', { root: 'dist' }))

app.listen(3003, () => console.log('FlickReels server running on port 3003'))
