import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { IoFootball, IoMic, IoNewspaper, IoPlayCircle, IoRadio } from 'react-icons/io5'
import { radioRoutes } from '../config/radioLinks'
import { subscribeDocuments } from '../services/firestoreService'
import type { PlayerDocument, ProgramDocument, LiveStreamDocument } from '../types/content'

const navItems = [
  { label: 'Início', to: radioRoutes.home, icon: <IoRadio /> },
  { label: 'Ao vivo', to: radioRoutes.live, icon: <IoMic /> },
  { label: 'Notícias', to: radioRoutes.news, icon: <IoNewspaper /> },
  { label: 'Esporte', to: radioRoutes.sport, icon: <IoFootball /> },
  { label: 'Vídeos', to: radioRoutes.videos, icon: <IoPlayCircle /> },
]

export function MobileBottomNav() {
  const location = useLocation()
  const [player, setPlayer] = useState<PlayerDocument | null>(null)
  const [programs, setPrograms] = useState<Array<ProgramDocument & { id: string }>>([])
  const [liveStreams, setLiveStreams] = useState<Array<LiveStreamDocument & { id: string }>>([])

  useEffect(() => {
    const unsubPlayer = subscribeDocuments<PlayerDocument>('player', (docs) => {
      if (docs.length > 0) setPlayer(docs[0])
    })
    const unsubPrograms = subscribeDocuments<ProgramDocument>('programs', (docs) => {
      setPrograms(docs)
    })
    const unsubStreams = subscribeDocuments<LiveStreamDocument>('liveStreams', (docs) => {
      setLiveStreams(docs)
    })
    return () => { unsubPlayer(); unsubPrograms(); unsubStreams() }
  }, [])

  const isLive = useMemo(() => {
    if (player?.isLive) return true
    if (player?.youtubeIsLive && !!player?.youtubeLiveUrl) return true
    if (player?.instagramIsLive && !!player?.instagramLiveUrl) return true
    if (programs.some((p) => p.liveStatus === 'live')) return true
    if (liveStreams.some((s) => s.status === 'live')) return true
    return false
  }, [player, programs, liveStreams])

  return (
    <nav className="mobile-bottom-nav" aria-label="Navegação rápida">
      {navItems.map((item) => {
        const isActive = location.pathname === item.to

        return (
          <Link
            aria-current={isActive ? 'page' : undefined}
            aria-label={item.label}
            className={`nav-item${isActive ? ' active' : ''}${item.to === radioRoutes.live && isLive ? ' is-live-pulse' : ''}`}
            key={item.to}
            to={item.to}
          >
            <span className="icon-wrapper" aria-hidden="true">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
