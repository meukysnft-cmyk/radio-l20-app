import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { subscribeDocuments } from '../services/firestoreService'
import { radioRoutes } from '../config/radioLinks'
import type { PlayerDocument } from '../types/content'

export function LiveBanner() {
  const [player, setPlayer] = useState<PlayerDocument | null>(null)

  useEffect(() => {
    const unsub = subscribeDocuments<PlayerDocument>('player', (docs) => {
      setPlayer(docs.length > 0 ? docs[0] : null)
    })
    return () => unsub()
  }, [])

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
