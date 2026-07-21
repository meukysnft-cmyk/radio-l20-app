export type VideoPlatform = 'youtube' | 'instagram' | 'tiktok' | 'facebook'

const YOUTUBE_REGEX = /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
const INSTAGRAM_REEL_REGEX = /(?:instagram\.com\/(?:reel|p)\/)([a-zA-Z0-9_-]+)/
const TIKTOK_REGEX = /(?:tiktok\.com\/@[\w.-]+\/video\/|tiktok\.com\/embed\/v2\/)(\d+)/
const FACEBOOK_REGEX = /(?:facebook\.com\/(?:watch\/?\?v=|[\w.]+\/videos\/))(\d+)/

export function detectPlatform(url: string): VideoPlatform {
  if (YOUTUBE_REGEX.test(url)) return 'youtube'
  if (INSTAGRAM_REEL_REGEX.test(url)) return 'instagram'
  if (TIKTOK_REGEX.test(url)) return 'tiktok'
  if (FACEBOOK_REGEX.test(url)) return 'facebook'
  return 'youtube'
}

export function getVideoEmbedUrl(url: string, platform?: VideoPlatform): string {
  const plat = platform || detectPlatform(url)
  if (!url) return ''

  try {
    switch (plat) {
      case 'youtube': {
        const match = url.match(YOUTUBE_REGEX)
        if (match?.[1]) return `https://www.youtube-nocookie.com/embed/${match[1]}`
        return ''
      }
      case 'instagram': {
        const match = url.match(INSTAGRAM_REEL_REGEX)
        if (match?.[1]) return `https://www.instagram.com/${url.includes('reel') ? 'reel' : 'p'}/${match[1]}/embed`
        return ''
      }
      case 'tiktok': {
        const match = url.match(TIKTOK_REGEX)
        if (match?.[1]) return `https://www.tiktok.com/embed/v2/${match[1]}`
        return ''
      }
      case 'facebook': {
        return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}`
      }
    }
  } catch {
    return ''
  }
}

export function getPlatformLabel(platform: VideoPlatform): string {
  const labels: Record<VideoPlatform, string> = {
    youtube: 'YouTube / Shorts',
    instagram: 'Instagram Reel',
    tiktok: 'TikTok',
    facebook: 'Facebook',
  }
  return labels[platform]
}
