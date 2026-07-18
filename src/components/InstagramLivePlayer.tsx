import { LiveIndicator } from './LiveIndicator'

interface InstagramLivePlayerProps {
  url: string
  isLive: boolean
  username?: string
  coverImageUrl?: string
  programName?: string
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

export function InstagramLivePlayer({ url, isLive, username = 'l20radio', coverImageUrl, programName }: InstagramLivePlayerProps) {
  const deepLink = buildInstagramDeepLink(url)
  const webUrl = buildInstagramWebUrl(url)

  const handleOpen = () => {
    if (isMobile()) {
      window.location.href = deepLink
      setTimeout(() => {
        window.open(webUrl, '_blank', 'noopener,noreferrer')
      }, 2000)
    } else {
      window.open(webUrl, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <div className={`ig-live-player${isLive ? ' is-live' : ''}`}>
      {coverImageUrl && (
        <div className="ig-live-cover">
          <img className="ig-live-cover-img" src={coverImageUrl} alt={programName || 'Programa'} loading="lazy" />
          <div className="ig-live-cover-overlay" />
        </div>
      )}

      <div className="ig-live-visual">
        <div className="ig-live-gradient" aria-hidden="true" />
        <div className="ig-live-icon-wrap">
          <svg className="ig-live-logo" viewBox="0 0 24 24" width="48" height="48" fill="none">
            <rect x="2" y="2" width="20" height="20" rx="5" stroke="url(#ig-gradient)" strokeWidth="2"/>
            <circle cx="12" cy="12" r="5" stroke="url(#ig-gradient)" strokeWidth="2"/>
            <circle cx="17.5" cy="6.5" r="1.5" fill="url(#ig-gradient)"/>
            <defs>
              <linearGradient id="ig-gradient" x1="2" y1="22" x2="22" y2="2">
                <stop offset="0%" stopColor="#fd5"/>
                <stop offset="25%" stopColor="#ff543e"/>
                <stop offset="50%" stopColor="#c837ab"/>
                <stop offset="100%" stopColor="#405de6"/>
              </linearGradient>
            </defs>
          </svg>
          {isLive && (
            <span className="ig-live-pulse" aria-hidden="true" />
          )}
        </div>
        {programName && <p className="ig-live-program">{programName}</p>}
        <p className="ig-live-handle">@{username}</p>
        {isLive && <p className="ig-live-status">🔴 Transmitindo ao vivo</p>}
      </div>

      <button
        className="ig-live-action"
        type="button"
        onClick={handleOpen}
        aria-label={isLive ? 'Assistir live no Instagram' : 'Abrir Instagram'}
      >
        {isLive ? '🔴 Assistir live no Instagram' : 'Abrir Instagram'}
      </button>

      <div className="ig-live-footer">
        <a
          className="ig-footer-link"
          href={webUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Abrir no Instagram ↗
        </a>
        <LiveIndicator active={isLive} size="sm" />
      </div>
    </div>
  )
}
