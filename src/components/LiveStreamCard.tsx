import { useState, useCallback, useRef, useEffect } from 'react'
import { LiveIndicator } from './LiveIndicator'
import type { LiveStreamDocument } from '../types/content'

function extractYouTubeId(url: string): string | null {
  if (!url) return null
  if (/^[A-Za-z0-9_-]{11}$/.test(url)) return url
  try {
    const parsed = new URL(url)
    if (parsed.hostname.includes('youtu.be')) return parsed.pathname.slice(1).split('/')[0]
    if (parsed.searchParams.has('v')) return parsed.searchParams.get('v')
    const segments = parsed.pathname.split('/')
    const embedIdx = segments.indexOf('embed')
    if (embedIdx !== -1 && segments[embedIdx + 1]) return segments[embedIdx + 1]
    const liveIdx = segments.indexOf('live')
    if (liveIdx !== -1 && segments[liveIdx + 1]) return segments[liveIdx + 1]
  } catch {}
  return null
}

function isMobile(): boolean {
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
}

function buildInstagramDeepLink(url: string): string {
  const match = url.match(/\/(?:p|reel|reels|live|tv)\/([A-Za-z0-9_-]+)/)
  if (match) return `instagram://media?id=${match[1]}`
  return 'instagram://user?username=l20radio'
}

function buildInstagramWebUrl(url: string): string {
  if (url.startsWith('http')) return url
  return `https://www.instagram.com/${url.replace('@', '')}/`
}

function formatDate(dateStr: string, timeStr: string): string {
  if (!dateStr) return ''
  try {
    const d = new Date(`${dateStr}T${timeStr || '12:00'}`)
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  } catch {
    return dateStr
  }
}

/* ─── YouTube Card ────────────────────────────────────────────── */
function YouTubeCard({ stream }: { stream: LiveStreamDocument }) {
  const [embedFailed, setEmbedFailed] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const videoId = extractYouTubeId(stream.url)
  const watchUrl = videoId ? `https://www.youtube.com/watch?v=${videoId}` : stream.url
  const thumbUrl = stream.thumbnailUrl || (videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : '')
  const isLive = stream.status === 'live'

  const handleIframeLoad = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      try {
        const iframe = document.querySelector(`#yt-${stream.id}`) as HTMLIFrameElement
        if (iframe?.contentDocument?.body?.querySelector('.ytp-error-content-wrap-reason')) {
          setEmbedFailed(true)
        }
      } catch {}
    }, 3500)
  }, [stream.id])

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current) }, [])

  return (
    <div className={`ls-card ls-yt${isLive ? ' is-live' : ''}`}>
      {isLive && (
        <div className="ls-card-header">
          <span className="ls-live-dot" aria-hidden="true" />
          <span className="ls-live-badge">🔴 AO VIVO</span>
          <LiveIndicator active size="sm" />
        </div>
      )}

      {!embedFailed && videoId ? (
        <div className="ls-embed-wrap">
          <div className="ls-embed-inner">
            <iframe
              id={`yt-${stream.id}`}
              className="ls-embed-frame"
              src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1`}
              title={stream.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              onLoad={handleIframeLoad}
              onError={() => setEmbedFailed(true)}
            />
          </div>
        </div>
      ) : (
        <div className="ls-fallback">
          <div className="ls-fallback-bg">
            {thumbUrl && <img className="ls-fallback-thumb" src={thumbUrl} alt="" loading="lazy" />}
            <div className="ls-fallback-overlay" />
          </div>
          <div className="ls-fallback-content">
            <svg viewBox="0 0 68 48" width="64" height="44">
              <path d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13 6.9 1.55C3.97 2.33 2.27 4.81 1.48 7.74.06 13.05 0 24 0 24s.06 10.95 1.48 16.26c.78 2.93 2.49 5.41 5.42 6.19C12.21 47.87 34 48 34 48s21.79-.13 27.1-1.55c2.93-.78 4.64-3.26 5.42-6.19C67.94 34.95 68 24 68 24s-.06-10.95-1.48-16.26z" fill="red"/>
              <path d="M45 24L27 14v20z" fill="#fff"/>
            </svg>
            {isLive && <p className="ls-fallback-live">🔴 TRANSMISSÃO AO VIVO</p>}
            <h3 className="ls-fallback-title">{stream.title || 'Rádio L20 no YouTube'}</h3>
            <p className="ls-fallback-desc">{isLive ? 'Assista à transmissão ao vivo' : 'Clique para assistir no YouTube'}</p>
            <a className="ls-btn-huge" href={watchUrl} target="_blank" rel="noopener noreferrer">
              ▶ Assistir no YouTube
            </a>
            <button className="ls-btn-retry" type="button" onClick={() => setEmbedFailed(false)}>
              Tentar novamente
            </button>
          </div>
        </div>
      )}

      <div className="ls-card-info">
        <h3 className="ls-card-title">{stream.title}</h3>
        {stream.scheduledDate && <p className="ls-card-date">{formatDate(stream.scheduledDate, stream.scheduledTime)}</p>}
      </div>
    </div>
  )
}

/* ─── Instagram Card ──────────────────────────────────────────── */
function InstagramCard({ stream }: { stream: LiveStreamDocument }) {
  const webUrl = buildInstagramWebUrl(stream.url)
  const deepLink = buildInstagramDeepLink(stream.url)
  const isLive = stream.status === 'live'

  const handleOpen = () => {
    if (isMobile()) {
      window.location.href = deepLink
      setTimeout(() => window.open(webUrl, '_blank', 'noopener,noreferrer'), 2000)
    } else {
      window.open(webUrl, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <div className={`ls-card ls-ig${isLive ? ' is-live' : ''}`}>
      {stream.coverImageUrl && (
        <div className="ls-ig-cover">
          <img className="ls-ig-cover-img" src={stream.coverImageUrl} alt={stream.title} loading="lazy" />
          <div className="ls-ig-cover-overlay" />
        </div>
      )}

      <div className="ls-ig-visual">
        <div className="ls-ig-gradient" aria-hidden="true" />
        <div className="ls-ig-icon-wrap">
          <svg viewBox="0 0 24 24" width="40" height="40" fill="none">
            <rect x="2" y="2" width="20" height="20" rx="5" stroke="url(#ls-ig-grad)" strokeWidth="2"/>
            <circle cx="12" cy="12" r="5" stroke="url(#ls-ig-grad)" strokeWidth="2"/>
            <circle cx="17.5" cy="6.5" r="1.5" fill="url(#ls-ig-grad)"/>
            <defs>
              <linearGradient id="ls-ig-grad" x1="2" y1="22" x2="22" y2="2">
                <stop offset="0%" stopColor="#fd5"/>
                <stop offset="50%" stopColor="#dc2743"/>
                <stop offset="100%" stopColor="#405de6"/>
              </linearGradient>
            </defs>
          </svg>
          {isLive && <span className="ls-ig-pulse" aria-hidden="true" />}
        </div>
        {isLive && <p className="ls-ig-live-text">🔴 Transmitindo ao vivo</p>}
      </div>

      <div className="ls-card-info">
        <h3 className="ls-card-title">{stream.title}</h3>
        {stream.scheduledDate && <p className="ls-card-date">{formatDate(stream.scheduledDate, stream.scheduledTime)}</p>}
      </div>

      <button className="ls-ig-action" type="button" onClick={handleOpen}>
        {isLive ? '🔴 Assistir live no Instagram' : 'Abrir Instagram'}
      </button>

      <div className="ls-card-footer">
        <a className="ls-footer-link" href={webUrl} target="_blank" rel="noopener noreferrer">
          Abrir no Instagram ↗
        </a>
        <LiveIndicator active={isLive} size="sm" />
      </div>
    </div>
  )
}

/* ─── Main Export ─────────────────────────────────────────────── */
export function LiveStreamCard({ stream }: { stream: LiveStreamDocument }) {
  if (stream.platform === 'instagram') {
    return <InstagramCard stream={stream} />
  }
  return <YouTubeCard stream={stream} />
}
