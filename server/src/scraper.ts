import { fetchGraphApiData } from './graphApi.js'

type ScrapedMetrics = {
  likes: number | null
  comments: number | null
  views: number | null
  viewsUnavailable: boolean
  author: string
  caption: string
  thumbnailUrl: string
  type: string
  hashtags: string[]
  source: string
}

function parseCount(text: string): number | null {
  const clean = text.trim().replace(/,/g, '').toLowerCase()
  try {
    if (clean.endsWith('k')) return Math.round(parseFloat(clean.slice(0, -1)) * 1000)
    if (clean.endsWith('m')) return Math.round(parseFloat(clean.slice(0, -1)) * 1_000_000)
    return Math.round(parseFloat(clean))
  } catch {
    return null
  }
}

function extractShortcode(url: string): string {
  try {
    const path = new URL(url).pathname
    const parts = path.split('/').filter(Boolean)
    return parts[parts.length - 1] || ''
  } catch {
    return ''
  }
}

function extractMeta(html: string, prop: string): string {
  const patterns = [
    new RegExp(`<meta\\s+property="${prop}"\\s+content="([^"]*)"`, 'i'),
    new RegExp(`<meta\\s+content="([^"]*)"\\s+property="${prop}"`, 'i'),
    new RegExp(`<meta\\s+name="${prop}"\\s+content="([^"]*)"`, 'i'),
    new RegExp(`<meta\\s+content="([^"]*)"\\s+name="${prop}"`, 'i'),
  ]
  for (const p of patterns) {
    const m = html.match(p)
    if (m?.[1]) return m[1]
  }
  return ''
}

function extractEmbeddedMetrics(html: string): { likes: number | null; comments: number | null; views: number | null } {
  const result = { likes: null as number | null, comments: null as number | null, views: null as number | null }

  const hasEmbedded = /"like_count"\s*:\s*\d+/.test(html)
  if (!hasEmbedded) return result

  const kwMap: Record<string, keyof typeof result> = {
    like_count: 'likes',
    comment_count: 'comments',
    view_count: 'views',
    video_view_count: 'views',
    play_count: 'views',
  }

  for (const [kw, field] of Object.entries(kwMap)) {
    if (result[field] != null) continue
    const m = html.match(new RegExp(`"${kw}"\\s*:\\s*(\\d+)`))
    if (m) result[field] = parseInt(m[1], 10)
  }

  return result
}

export async function scrapeInstagram(url: string): Promise<ScrapedMetrics> {
  const shortcode = extractShortcode(url)
  const isReel = url.includes('/reel/')

  let html = ''
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      signal: AbortSignal.timeout(15_000),
      redirect: 'follow',
    })
    html = await res.text()
  } catch {
    throw new Error('Não foi possível acessar a URL do Instagram')
  }

  const ogTitle = extractMeta(html, 'og:title')
  const ogImage = extractMeta(html, 'og:image') || extractMeta(html, 'og:video')
  const ogDesc = extractMeta(html, 'og:description') || extractMeta(html, 'description')

  let likes = extractMeta(html, 'likes').match(/[\d,.]+[KkMm]?/)?.[0]
    ? parseCount(ogDesc.match(/([\d,.]+[KkMm]?)\s+likes?/i)?.[1] || '')
    : null

  let comments = ogDesc.match(/([\d,.]+[KkMm]?)\s+comments?/i)?.[1]
    ? parseCount(ogDesc.match(/([\d,.]+[KkMm]?)\s+comments?/i)![1])
    : null

  let views = ogDesc.match(/([\d,.]+[KkMm]?)\s+views?/i)?.[1]
    ? parseCount(ogDesc.match(/([\d,.]+[KkMm]?)\s+views?/i)![1])
    : null

  let author = ''
  const authorMatch = ogTitle.match(/"([^"]+) on Instagram/)
  if (authorMatch) author = authorMatch[1]
  if (!author) {
    const descAuthor = ogDesc.match(/([\w.]+)\s+on\s+/)
    if (descAuthor) author = descAuthor[1]
  }

  const embedded = extractEmbeddedMetrics(html)
  if (likes == null && embedded.likes != null) likes = embedded.likes
  if (comments == null && embedded.comments != null) comments = embedded.comments
  if (views == null && embedded.views != null) views = embedded.views

  const viewsUnavailable = views == null && /"view_count"\s*:\s*null/.test(html)

  const hashtags = ogDesc ? [...new Set(ogDesc.match(/#[\w\u00C0-\u017F]+/g) || [])] : []

  let mediaType = isReel ? 'Reels' : 'Post'
  if (html.includes('"media_product_type":"REELS"')) mediaType = 'Reels'

  return {
    likes,
    comments,
    views,
    viewsUnavailable,
    author,
    caption: ogDesc,
    thumbnailUrl: ogImage,
    type: mediaType,
    hashtags,
    source: 'scraping',
  }
}

export async function analyzePost(
  url: string,
  accessToken: string | null,
  igAccountId: string | null,
) {
  const shortcode = extractShortcode(url)
  const scraped = await scrapeInstagram(url)

  let finalMetrics = { ...scraped }

  if (accessToken && igAccountId) {
    const graphResult = await fetchGraphApiData(shortcode, accessToken, igAccountId)
    if (graphResult) {
      finalMetrics = {
        likes: graphResult.likes ?? scraped.likes,
        comments: graphResult.comments ?? scraped.comments,
        views: graphResult.views ?? scraped.views,
        viewsUnavailable: false,
        author: graphResult.author || scraped.author,
        caption: graphResult.caption || scraped.caption,
        thumbnailUrl: graphResult.thumbnailUrl || scraped.thumbnailUrl,
        type: graphResult.type || scraped.type,
        hashtags: graphResult.hashtags.length ? graphResult.hashtags : scraped.hashtags,
        source: 'graph_api',
      }
    }
  }

  const metrics = {
    likes: finalMetrics.likes ?? 0,
    comments: finalMetrics.comments ?? 0,
    shares: 0,
    saves: 0,
    views: finalMetrics.views ?? 0,
    engagementRate: 0,
  }

  const totalEngagement = metrics.likes + metrics.comments + metrics.shares + metrics.saves
  metrics.engagementRate = metrics.views > 0
    ? Math.round((totalEngagement / metrics.views) * 10000) / 100
    : 0

  return {
    id: shortcode,
    url,
    shortcode,
    caption: finalMetrics.caption,
    timestamp: new Date().toISOString(),
    metrics,
    mediaType: finalMetrics.type.toLowerCase() as 'image' | 'video' | 'carousel' | 'unknown',
    imageUrl: finalMetrics.thumbnailUrl,
    analyzedAt: new Date().toISOString(),
    analyzedBy: 'backend',
  }
}
