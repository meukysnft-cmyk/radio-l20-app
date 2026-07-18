const GRAPH_API_VERSION = 'v21.0'
const GRAPH_API_BASE = `https://graph.instagram.com/${GRAPH_API_VERSION}`

type GraphMedia = {
  id: string
  shortcode: string
  caption: string
  media_type: string
  media_product_type: string
  media_url: string
  thumbnail_url: string
  permalink: string
  timestamp: string
  username: string
  like_count: number
  comments_count: number
}

type GraphInsights = {
  views: number | null
  reach: number | null
}

export type GraphApiResult = {
  likes: number | null
  comments: number | null
  views: number | null
  saves: number | null
  shares: number | null
  reach: number | null
  author: string
  thumbnailUrl: string
  caption: string
  type: string
  hashtags: string[]
  mediaUrl: string
  timestamp: string
}

const safeToken = (token: string) => encodeURIComponent(token)

async function graphFetch<T>(path: string, token: string): Promise<T | null> {
  const url = `${GRAPH_API_BASE}${path}${path.includes('?') ? '&' : '?'}access_token=${safeToken(token)}`
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'RadioL20-Analyzer/1.0' },
      signal: AbortSignal.timeout(15_000),
    })
    const data = await res.json() as Record<string, unknown>
    if (data.error) return null
    return data as T
  } catch {
    return null
  }
}

async function listUserMedia(
  igUserId: string,
  shortcode: string,
  token: string,
): Promise<string | null> {
  let after: string | undefined

  for (let page = 0; page < 10; page++) {
    const qs = `?fields=id,shortcode&limit=100${after ? `&after=${after}` : ''}`
    const data = await graphFetch<{ data: Array<{ id: string; shortcode: string }>; paging?: { cursors?: { after?: string } } }>(
      `/${igUserId}/media${qs}`,
      token,
    )

    if (!data?.data) return null

    for (const item of data.data) {
      if (item.shortcode === shortcode) return item.id
    }

    after = data.paging?.cursors?.after
    if (!after) break
  }

  return null
}

async function getMediaInsights(graphId: string, token: string): Promise<GraphInsights> {
  const data = await graphFetch<{ data: Array<{ name: string; values: Array<{ value: number }> }> }>(
    `/${graphId}/insights?metric=views,reach`,
    token,
  )

  const result: GraphInsights = { views: null, reach: null }

  if (!data?.data) return result

  for (const item of data.data) {
    const val = item.values?.[0]?.value
    if (item.name === 'views' && val != null) result.views = val
    if (item.name === 'reach' && val != null) result.reach = val
  }

  return result
}

function extractHashtags(text: string): string[] {
  const tags = text.match(/#[\w\u00C0-\u017F]+/g) || []
  return [...new Set(tags)]
}

export async function fetchGraphApiData(
  shortcode: string,
  accessToken: string,
  igAccountId: string,
): Promise<GraphApiResult | null> {
  let graphId = await listUserMedia(igAccountId, shortcode, accessToken)
  if (!graphId) graphId = shortcode

  const media = await graphFetch<GraphMedia>(
    `/${graphId}?fields=id,shortcode,caption,media_type,media_product_type,media_url,thumbnail_url,permalink,timestamp,username,like_count,comments_count`,
    accessToken,
  )

  if (!media) return null

  const insights = await getMediaInsights(graphId, accessToken)

  const hashtags = media.caption ? extractHashtags(media.caption) : []

  return {
    likes: media.like_count ?? null,
    comments: media.comments_count ?? null,
    views: insights.views,
    saves: null,
    shares: null,
    reach: insights.reach,
    author: media.username || '',
    thumbnailUrl: media.thumbnail_url || '',
    caption: media.caption || '',
    type: media.media_product_type === 'REELS' ? 'Reels' : media.media_type || 'IMAGE',
    hashtags,
    mediaUrl: media.media_url || '',
    timestamp: media.timestamp || '',
  }
}
