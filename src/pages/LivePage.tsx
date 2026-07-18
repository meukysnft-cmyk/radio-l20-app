import { useEffect, useMemo, useState } from 'react'
import { LiveIndicator } from '../components/LiveIndicator'
import { useAudioPlayer } from '../context/useAudioPlayer'
import { subscribeDocuments, listDocuments } from '../services/firestoreService'
import type { LiveStreamDocument, ProgramDocument, LinksDocument, PlayerDocument } from '../types/content'

function formatDate(dateStr: string, timeStr?: string): string {
  if (!dateStr) return ''
  try {
    const d = new Date(`${dateStr}T${timeStr || '12:00'}`)
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  } catch {
    return dateStr
  }
}

function ProgramLiveCard({ program }: { program: ProgramDocument }) {
  const platform = program.livePlatform || 'youtube'
  const isLive = program.liveStatus === 'live'

  return (
    <div className={`ls-card${isLive ? ' is-live' : ''}`}>
      {isLive && (
        <div className="ls-card-header">
          <span className="ls-live-dot" aria-hidden="true" />
          <span className="ls-live-badge">🔴 AO VIVO</span>
        </div>
      )}

      {program.coverImageUrl && (
        <div className="ls-embed-wrap">
          <div className="ls-embed-inner">
            <img
              src={program.coverImageUrl}
              alt={program.name}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
              loading="lazy"
            />
            {isLive && program.youtubeUrl && (
              <a
                className="ls-btn-huge"
                href={program.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)', zIndex: 2 }}
              >
                ▶ {platform === 'instagram' ? 'Assistir no Instagram' : 'Assistir no YouTube'}
              </a>
            )}
          </div>
        </div>
      )}

      {!program.coverImageUrl && isLive && program.youtubeUrl && (
        <a className="ls-btn-huge" href={program.youtubeUrl} target="_blank" rel="noopener noreferrer" style={{ margin: '8px 0' }}>
          ▶ {platform === 'instagram' ? 'Assistir no Instagram' : 'Assistir no YouTube'}
        </a>
      )}

      <div className="ls-card-info">
        <h3 className="ls-card-title">{program.name}</h3>
        {program.liveDate && <p className="ls-card-date">{formatDate(program.liveDate, program.time)}</p>}
        {program.liveNote && <p style={{ margin: 0, color: 'var(--text)', fontSize: '.82rem' }}>{program.liveNote}</p>}
      </div>
    </div>
  )
}

function getYouTubeEmbedUrl(url: string) {
  if (!url) return ''
  try {
    const parsedUrl = new URL(url)
    const host = parsedUrl.hostname.replace('www.', '')

    if (host === 'youtu.be') {
      const videoId = parsedUrl.pathname.split('/').filter(Boolean)[0]
      return videoId ? `https://www.youtube.com/embed/${videoId}` : ''
    }

    const videoId = parsedUrl.searchParams.get('v')
    if (videoId) return `https://www.youtube.com/embed/${videoId}`

    if (parsedUrl.pathname.includes('/embed/')) return url

    if (parsedUrl.pathname.includes('/live/')) {
      const liveId = parsedUrl.pathname.split('/live/')[1]?.split('?')[0]
      if (liveId) return `https://www.youtube.com/embed/${liveId}`
    }

    if (parsedUrl.pathname.includes('/shorts/')) {
      const shortsId = parsedUrl.pathname.split('/shorts/')[1]?.split('?')[0]
      if (shortsId) return `https://www.youtube.com/embed/${shortsId}`
    }

    if (parsedUrl.pathname.includes('/channel/') || parsedUrl.pathname.includes('/c/') || parsedUrl.pathname.includes('/@')) {
      const channelPath = parsedUrl.pathname.split('/').filter(Boolean).pop()
      if (channelPath) return `https://www.youtube.com/embed/live_stream?channel=${channelPath}`
    }
  } catch {
    // URL inválida
  }
  return ''
}

function StreamLiveCard({ stream }: { stream: LiveStreamDocument }) {
  const isLive = stream.status === 'live'
  const isEnded = stream.status === 'ended' || stream.status === 'archived'

  if (isLive && stream.platform === 'youtube' && stream.url) {
    const embedUrl = getYouTubeEmbedUrl(stream.url)
    return (
      <div className="ls-card is-live">
        <div className="ls-card-header">
          <span className="ls-live-dot" aria-hidden="true" />
          <span className="ls-live-badge">🔴 AO VIVO</span>
        </div>
        <div className="ls-embed-wrap">
          <div className="ls-embed-inner">
            {embedUrl ? (
              <iframe
                className="ls-embed-frame"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                src={embedUrl}
                title={stream.title}
              />
            ) : (
              <a
                className="ls-btn-huge"
                href={stream.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', background: 'rgba(0,0,0,.6)', color: '#fff', fontWeight: 800, fontSize: '1.1rem', textDecoration: 'none' }}
              >
                ▶ Abrir no YouTube
              </a>
            )}
          </div>
        </div>
        <div className="ls-card-info">
          <h3 className="ls-card-title">{stream.title}</h3>
          {stream.programName && <p style={{ margin: 0, color: 'var(--accent)', fontSize: '.78rem', fontWeight: 700 }}>{stream.programName}</p>}
        </div>
      </div>
    )
  }

  if (isEnded && stream.platform === 'youtube' && stream.url) {
    const embedUrl = getYouTubeEmbedUrl(stream.url)
    return (
      <div className="ls-card">
        <div className="ls-card-header">
          <span className="ls-live-badge" style={{ background: 'rgba(100,116,139,.15)', color: '#94a3b8' }}>✅ Encerrada</span>
        </div>
        <div className="ls-embed-wrap">
          <div className="ls-embed-inner">
            {embedUrl ? (
              <iframe
                className="ls-embed-frame"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                src={embedUrl}
                title={stream.title}
              />
            ) : (
              <a
                className="ls-btn-huge"
                href={stream.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', background: 'rgba(0,0,0,.6)', color: '#fff', fontWeight: 800, fontSize: '1.1rem', textDecoration: 'none' }}
              >
                ▶ Abrir no YouTube
              </a>
            )}
          </div>
        </div>
        <div className="ls-card-info">
          <h3 className="ls-card-title">{stream.title}</h3>
          {stream.programName && <p style={{ margin: 0, color: 'var(--accent)', fontSize: '.78rem', fontWeight: 700 }}>{stream.programName}</p>}
          {stream.scheduledDate && <p className="ls-card-date">{formatDate(stream.scheduledDate, stream.scheduledTime)}</p>}
        </div>
      </div>
    )
  }

  if (isLive && stream.platform === 'instagram' && stream.url) {
    return (
      <div className="ls-card is-live">
        <div className="ls-card-header">
          <span className="ls-live-dot" aria-hidden="true" />
          <span className="ls-live-badge">🔴 AO VIVO</span>
        </div>
        {stream.coverImageUrl && (
          <div className="ls-embed-wrap">
            <div className="ls-embed-inner">
              <img
                src={stream.coverImageUrl}
                alt={stream.title}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                loading="lazy"
              />
              <a
                className="ls-btn-huge"
                href={stream.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)', zIndex: 2 }}
              >
                📷 Assistir no Instagram
              </a>
            </div>
          </div>
        )}
        <div className="ls-card-info">
          <h3 className="ls-card-title">{stream.title}</h3>
          {stream.programName && <p style={{ margin: 0, color: 'var(--accent)', fontSize: '.78rem', fontWeight: 700 }}>{stream.programName}</p>}
        </div>
      </div>
    )
  }

  if (isEnded && stream.platform === 'instagram' && stream.url) {
    return (
      <div className="ls-card">
        <div className="ls-card-header">
          <span className="ls-live-badge" style={{ background: 'rgba(100,116,139,.15)', color: '#94a3b8' }}>✅ Encerrada</span>
        </div>
        {stream.coverImageUrl && (
          <div className="ls-embed-wrap">
            <div className="ls-embed-inner">
              <img
                src={stream.coverImageUrl}
                alt={stream.title}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                loading="lazy"
              />
              <a
                className="ls-btn-huge"
                href={stream.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)', zIndex: 2 }}
              >
                📷 Assistir no Instagram
              </a>
            </div>
          </div>
        )}
        <div className="ls-card-info">
          <h3 className="ls-card-title">{stream.title}</h3>
          {stream.programName && <p style={{ margin: 0, color: 'var(--accent)', fontSize: '.78rem', fontWeight: 700 }}>{stream.programName}</p>}
          {stream.scheduledDate && <p className="ls-card-date">{formatDate(stream.scheduledDate, stream.scheduledTime)}</p>}
        </div>
      </div>
    )
  }

  return (
    <div className="ls-card">
      {stream.coverImageUrl && (
        <div className="ls-embed-wrap">
          <div className="ls-embed-inner">
            <img
              src={stream.coverImageUrl}
              alt={stream.title}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
              loading="lazy"
            />
          </div>
        </div>
      )}
      <div className="ls-card-info">
        <h3 className="ls-card-title">{stream.title}</h3>
        {stream.programName && <p style={{ margin: 0, color: 'var(--accent)', fontSize: '.78rem', fontWeight: 700 }}>{stream.programName}</p>}
        {stream.scheduledDate && <p className="ls-card-date">{formatDate(stream.scheduledDate, stream.scheduledTime)}</p>}
      </div>
    </div>
  )
}

function GenericLiveCard({ player }: { player: PlayerDocument }) {
  const activePlatform = player.youtubeIsLive ? 'youtube' : player.instagramIsLive ? 'instagram' : null
  const liveUrl = activePlatform === 'youtube' ? player.youtubeLiveUrl : player.instagramLiveUrl

  return (
    <div className="ls-card is-live">
      <div className="ls-card-header">
        <span className="ls-live-dot" aria-hidden="true" />
        <span className="ls-live-badge">🔴 AO VIVO</span>
      </div>

      {liveUrl && (
        <a
          className="ls-btn-huge"
          href={liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{ margin: '8px 0' }}
        >
          ▶ {activePlatform === 'instagram' ? 'Assistir no Instagram' : 'Assistir no YouTube'}
        </a>
      )}

      <div className="ls-card-info">
        <h3 className="ls-card-title">Transmissão ao vivo</h3>
        <p style={{ margin: 0, color: 'var(--text)', fontSize: '.82rem' }}>
          {player.statusMessage || 'Estamos ao vivo!'}
        </p>
      </div>
    </div>
  )
}

export function LivePage() {
  useAudioPlayer()
  const [programs, setPrograms] = useState<Array<ProgramDocument & { id: string }>>([])
  const [liveStreams, setLiveStreams] = useState<Array<LiveStreamDocument & { id: string }>>([])
  const [, setLinks] = useState<LinksDocument | null>(null)
  const [player, setPlayer] = useState<PlayerDocument | null>(null)

  const currentProgram = useMemo(() => programs.find((p) => p.isOnAir) || null, [programs])
  const livePrograms = useMemo(() => programs.filter((p) => p.liveStatus === 'live'), [programs])
  const endedPrograms = useMemo(() => programs.filter((p) => p.liveStatus === 'ended'), [programs])

  const liveStreamItems = useMemo(() => liveStreams.filter((s) => s.status === 'live'), [liveStreams])
  const endedStreamItems = useMemo(() => liveStreams.filter((s) => s.status === 'ended'), [liveStreams])

  const isRadioLive = player?.isLive || !!currentProgram
  const isYouTubeLive = (player?.youtubeIsLive && !!player?.youtubeLiveUrl)
    || livePrograms.some((p) => p.livePlatform === 'youtube')
    || liveStreamItems.some((s) => s.platform === 'youtube')
  const isInstagramLive = (player?.instagramIsLive && !!player?.instagramLiveUrl)
    || livePrograms.some((p) => p.livePlatform === 'instagram')
    || liveStreamItems.some((s) => s.platform === 'instagram')

  const showGenericLiveCard = isYouTubeLive || isInstagramLive
  const hasAnyLive = isRadioLive || livePrograms.length > 0 || liveStreamItems.length > 0 || showGenericLiveCard

  useEffect(() => {
    const unsubPrograms = subscribeDocuments<ProgramDocument>('programs', (docs) => {
      setPrograms(docs)
    })

    const unsubStreams = subscribeDocuments<LiveStreamDocument>('liveStreams', (docs) => {
      setLiveStreams(docs)
    })

    const unsubPlayer = subscribeDocuments<PlayerDocument>('player', (docs) => {
      if (docs.length > 0) setPlayer(docs[0])
    })

    listDocuments<LinksDocument>('links').then((doc) => {
      if (doc.length > 0) setLinks(doc[0])
    })

    return () => {
      unsubPrograms()
      unsubStreams()
      unsubPlayer()
    }
  }, [])

  const allLiveCount = livePrograms.length + liveStreamItems.length
  const allEndedCount = endedPrograms.length + endedStreamItems.length

  return (
    <section className="live-hub" aria-labelledby="live-title">
      <div className="live-hub-hero">
        <div className="live-hub-hero-copy">
          <h1 id="live-title" style={hasAnyLive ? { color: '#ef4444', animation: 'livePulse 1.5s ease-in-out infinite' } : undefined}>
            Ao vivo <LiveIndicator active={hasAnyLive} size="lg" />
          </h1>
        </div>
      </div>

      {allLiveCount > 0 && (
        <div className="live-hub-section">
          <div className="live-hub-section-header">
            <h2>🔴 Ao vivo agora</h2>
            <span className="live-hub-section-count">{allLiveCount} ativa{allLiveCount > 1 ? 's' : ''}</span>
          </div>
          <div className="live-streams-grid">
            {liveStreamItems.map((stream) => (
              <StreamLiveCard key={stream.id} stream={stream} />
            ))}
            {livePrograms.map((program) => (
              <ProgramLiveCard key={program.id} program={program} />
            ))}
          </div>
        </div>
      )}

      {showGenericLiveCard && allLiveCount === 0 && player && (
        <div className="live-hub-section">
          <div className="live-hub-section-header">
            <h2>🔴 Ao vivo agora</h2>
            <span className="live-hub-section-count">1 ativa</span>
          </div>
          <div className="live-streams-grid">
            <GenericLiveCard player={player} />
          </div>
        </div>
      )}

      {!hasAnyLive && allEndedCount === 0 && (
        <div className="live-hub-section" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
          <p style={{ color: 'var(--text)', fontSize: '1.1rem' }}>Nenhuma transmissão no momento.</p>
        </div>
      )}
    </section>
  )
}
