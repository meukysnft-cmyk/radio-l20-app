import express from 'express'
import cors from 'cors'
import { analyzePost } from './scraper.js'

const app = express()
const PORT = parseInt(process.env.PORT || '5000', 10)

app.use(cors({ origin: true }))
app.use(express.json())

function ok<T>(data: T) {
  return { ok: true, data }
}

function fail(error: string) {
  return { ok: false, error }
}

app.get('/api/health', (_req, res) => {
  res.json(ok({ status: 'ok', uptime: process.uptime() }))
})

app.get('/api/config', (_req, res) => {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN || ''
  const igAccountId = process.env.INSTAGRAM_ACCOUNT_ID || ''

  res.json(ok({
    igAccountId,
    hasAccessToken: !!accessToken,
    backendVersion: '1.0.0',
  }))
})

app.post('/api/analyze', async (req, res) => {
  const { url } = req.body

  if (!url || typeof url !== 'string') {
    res.status(400).json(fail('URL é obrigatória'))
    return
  }

  if (!url.includes('instagram.com')) {
    res.status(400).json(fail('URL deve ser do Instagram'))
    return
  }

  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN || null
  const igAccountId = process.env.INSTAGRAM_ACCOUNT_ID || null

  try {
    const post = await analyzePost(url, accessToken, igAccountId)
    res.json(ok(post))
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro ao analisar post'
    res.status(500).json(fail(message))
  }
})

app.get('/api/posts', async (_req, res) => {
  res.json(ok([]))
})

app.listen(PORT, () => {
  const parts: string[] = []
  if (process.env.INSTAGRAM_ACCESS_TOKEN) parts.push('Graph API ativa')
  console.log(`Radio L20 Word of Life Server v1.0.0 - http://0.0.0.0:${PORT}${parts.length ? ` (${parts.join(', ')})` : ''}`)
})
