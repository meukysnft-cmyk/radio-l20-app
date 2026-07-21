import { Link } from 'react-router-dom'
import { radioRoutes } from '../config/radioLinks'
import { useLiveStatus } from '../context/useLiveStatus'

export function LiveBanner() {
  const { player } = useLiveStatus()

  const isYouTubeLive = player?.youtubeIsLive || false
  const isInstagramLive = player?.instagramIsLive || false

  if (!isYouTubeLive && !isInstagramLive) return null

  const platforms = [
    isYouTubeLive && 'YouTube',
    isInstagramLive && 'Instagram',
  ].filter(Boolean)

  return (
    <Link className="live-banner" to={radioRoutes.live} aria-label={`AO VIVO: ${platforms.join(' e ')}. Clique para assistir.`}>
      <span className="live-banner-dot" aria-hidden="true" />
      <span className="live-banner-text">
        🔴 AO VIVO — {platforms.join(' & ')}
      </span>
      <span className="live-banner-cta">Assistir →</span>
    </Link>
  )
}
