import { useState, useCallback, useRef, useEffect } from 'react'
import { LiveIndicator } from './LiveIndicator'

interface YouTubeLivePlayerProps {
  url: string
  isLive: boolean
}

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

export function YouTubeLivePlayer({ url, isLive }: YouTubeLivePlayerProps) {
  const [embedFailed, setEmbedFailed] = useState(false)
  const [showEmbed, setShowEmbed] = useState(true)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const videoId = extractYouTubeId(url)
  const youtubeWatchUrl = videoId ? `https://www.youtube.com/watch?v=${videoId}` : url
  const youtubeAppUrl = videoId ? `https://youtu.be/${videoId}` : url
  const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : ''

  const handleEmbedError = useCallback(() => {
    setEmbedFailed(true)
  }, [])

  const handleIframeLoad = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      try {
        const iframe = document.querySelector('.yt-embed-frame') as HTMLIFrameElement
        if (iframe && iframe.contentDocument) {
          const body = iframe.contentDocument.body
          if (body && body.querySelector('.ytp-error-content-wrap-reason')) {
            setEmbedFailed(true)
          }
        }
      } catch {
        // Cross-origin — assume fine
      }
    }, 3500)
  }, [])

  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [])

  if (!videoId) return null

  const showFallback = embedFailed || !showEmbed

  return (
    <div className={`yt-live-player${isLive ? ' is-live' : ''}`}>
      {isLive && (
        <div className="yt-live-header">
          <span className="yt-live-dot" aria-hidden="true" />
          <span className="yt-live-badge">🔴 AO VIVO</span>
          <LiveIndicator active={isLive} size="sm" />
        </div>
      )}

      {!showFallback && (
        <div className="yt-live-embed-wrap">
          <div className="yt-live-embed-inner">
            <iframe
              className="yt-embed-frame"
              src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1`}
              title="Rádio L20 — YouTube Ao Vivo"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              onLoad={handleIframeLoad}
              onError={handleEmbedError}
            />
          </div>
        </div>
      )}

      {showFallback && (
        <div className="yt-fallback-screen">
          <div className="yt-fallback-bg" aria-hidden="true">
            {thumbnailUrl && <img className="yt-fallback-thumb" src={thumbnailUrl} alt="" loading="lazy" />}
            <div className="yt-fallback-overlay" />
          </div>

          <div className="yt-fallback-content">
            <div className="yt-fallback-icon-large" aria-hidden="true">
              <svg viewBox="0 0 68 48" width="80" height="56">
                <path d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13 6.9 1.55C3.97 2.33 2.27 4.81 1.48 7.74.06 13.05 0 24 0 24s.06 10.95 1.48 16.26c.78 2.93 2.49 5.41 5.42 6.19C12.21 47.87 34 48 34 48s21.79-.13 27.1-1.55c2.93-.78 4.64-3.26 5.42-6.19C67.94 34.95 68 24 68 24s-.06-10.95-1.48-16.26z" fill="red"/>
                <path d="M45 24L27 14v20z" fill="#fff"/>
              </svg>
            </div>

            {isLive && <p className="yt-fallback-live-text">🔴 TRANSMISSÃO AO VIVO</p>}

            <h3 className="yt-fallback-title">Rádio L20 no YouTube</h3>
            <p className="yt-fallback-desc">
              {isLive
                ? 'Assista à transmissão ao vivo direto no YouTube'
                : 'Clique abaixo para assistir no YouTube'}
            </p>

            <a
              className="yt-fallback-btn-huge"
              href={youtubeWatchUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg viewBox="0 0 68 48" width="28" height="20">
                <path d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13 6.9 1.55C3.97 2.33 2.27 4.81 1.48 7.74.06 13.05 0 24 0 24s.06 10.95 1.48 16.26c.78 2.93 2.49 5.41 5.42 6.19C12.21 47.87 34 48 34 48s21.79-.13 27.1-1.55c2.93-.78 4.64-3.26 5.42-6.19C67.94 34.95 68 24 68 24s-.06-10.95-1.48-16.26z" fill="#fff"/>
                <path d="M45 24L27 14v20z" fill="red"/>
              </svg>
              Assistir no YouTube
            </a>

            <div className="yt-fallback-secondary">
              <button
                className="yt-btn-retry"
                type="button"
                onClick={() => { setEmbedFailed(false); setShowEmbed(true) }}
              >
                Tentar novamente
              </button>
              <a
                className="yt-btn-app"
                href={youtubeAppUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Abrir app YouTube
              </a>
            </div>
          </div>
        </div>
      )}

      <div className="yt-live-footer">
        <a
          className="yt-footer-link"
          href={youtubeAppUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Abrir no YouTube ↗
        </a>
      </div>
    </div>
  )
}
