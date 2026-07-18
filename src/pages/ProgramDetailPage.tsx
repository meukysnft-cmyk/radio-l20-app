import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { subscribeDocuments } from '../services/firestoreService'
import { radioRoutes } from '../config/radioLinks'
import { getProgramBySlug } from '../data/programsContent'
import type { LiveStreamDocument, NewsDocument } from '../types/content'

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
    return ''
  }
  return ''
}

function formatDate(dateStr: string, timeStr?: string): string {
  if (!dateStr) return ''
  try {
    const d = new Date(`${dateStr}T${timeStr || '12:00'}`)
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  } catch {
    return dateStr
  }
}

export function ProgramDetailPage() {
  const { slug } = useParams()
  const program = slug ? getProgramBySlug(slug) : null
  const [newsItems, setNewsItems] = useState<Array<NewsDocument & { id: string }>>([])
  const [liveStreams, setLiveStreams] = useState<Array<LiveStreamDocument & { id: string }>>([])

  useEffect(() => {
    return subscribeDocuments<NewsDocument>('news', (documents) => {
      const published = documents.filter((item) => item.status === 'published' && item.programSlug === slug)
      setNewsItems(published)
    })
  }, [slug])

  useEffect(() => {
    return subscribeDocuments<LiveStreamDocument>('liveStreams', (documents) => {
      const filtered = documents.filter((item) => item.programSlug === slug)
      setLiveStreams(filtered)
    })
  }, [slug])

  const programNews = useMemo(() => newsItems.slice(0, 4), [newsItems])

  const activeLiveStream = useMemo(() => liveStreams.find((s) => s.status === 'live') ?? null, [liveStreams])
  const scheduledStreams = useMemo(() => liveStreams.filter((s) => s.status === 'scheduled'), [liveStreams])
  const endedStreams = useMemo(() => liveStreams.filter((s) => s.status === 'ended' || s.status === 'archived'), [liveStreams])

  const hasLiveStream = !!activeLiveStream
  const hasScheduled = scheduledStreams.length > 0

  if (!program) {
    return <Navigate to={radioRoutes.programs} replace />
  }

  return (
    <section className="content-section page-section program-detail-page" aria-labelledby="program-detail-title">
      <div className="program-detail-hero">
        <div className="program-detail-logo" aria-hidden="true">
          <img src={program.logoPath} alt="" loading="lazy" />
        </div>
        <p className="eyebrow">{program.highlightLabel}</p>
        <h1 id="program-detail-title">{program.name}</h1>
        <p className="program-detail-slogan">{program.slogan}</p>
        <p>{program.description}</p>
        {hasLiveStream && (
          <Link
            to="/ao-vivo"
            className="cms-live-badge is-live"
            style={{ marginTop: 8, display: 'inline-flex', textDecoration: 'none', gap: 6 }}
          >
            🔴 AO VIVO — Assistir agora
          </Link>
        )}
        {!hasLiveStream && hasScheduled && (
          <span className="cms-live-badge is-scheduled" style={{ marginTop: 8, display: 'inline-block' }}>
            ⏩ Próxima live agendada
          </span>
        )}
      </div>

      <div className="program-detail-grid">
        {/* AGENDADAS — capa + info em destaque */}
        {scheduledStreams.map((stream) => (
          <article className="program-detail-card program-detail-card--full program-live-promo" key={stream.id}>
            <p className="card-eyebrow">⏰ Próxima transmissão</p>
            <h2>{stream.title}</h2>
            {stream.scheduledDate && (
              <p style={{ fontWeight: 700 }}>{formatDate(stream.scheduledDate, stream.scheduledTime)}</p>
            )}
            <p style={{ color: 'var(--text)' }}>
              {stream.platform === 'youtube' ? '▶ Transmissão via YouTube' : '📷 Transmissão via Instagram'}
            </p>
            {stream.coverImageUrl && (
              <div className="program-live-promo-image">
                <img src={stream.coverImageUrl} alt={stream.title} loading="lazy" />
              </div>
            )}
          </article>
        ))}

        {/* AO VIVO — apenas indicador com link para /ao-vivo, SEM player aqui */}
        {activeLiveStream && (
          <article className="program-detail-card program-detail-card--full program-live-promo" style={{ borderColor: 'rgba(239,68,68,.35)', background: 'rgba(239,68,68,.06)' }}>
            <p className="card-eyebrow">🔴 Ao vivo agora</p>
            <h2>{activeLiveStream.title}</h2>
            {activeLiveStream.scheduledDate && <p>Data: {formatDate(activeLiveStream.scheduledDate, activeLiveStream.scheduledTime)}</p>}
            <Link
              to="/ao-vivo"
              className="advertise-primary"
              style={{ marginTop: 8, display: 'inline-flex' }}
            >
              ▶ Assistir ao vivo
            </Link>
          </article>
        )}

        {/* Encerradas — vídeos disponíveis */}
        {endedStreams.map((stream) => (
          <article className="program-detail-card program-detail-card--full" key={stream.id}>
            <p className="card-eyebrow">✅ Transmissão encerrada</p>
            <h2>{stream.title}</h2>
            {stream.scheduledDate && <p>Data: {formatDate(stream.scheduledDate, stream.scheduledTime)}</p>}
            {stream.url && (
              stream.platform === 'youtube' ? (
                <div className="program-detail-video">
                  <iframe
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                    src={getYouTubeEmbedUrl(stream.url)}
                    title={`${stream.title} — transmissão encerrada`}
                  />
                </div>
              ) : (
                <a className="ls-btn-huge" href={stream.url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', marginTop: 8 }}>
                  📷 Assistir no Instagram
                </a>
              )
            )}
          </article>
        ))}

        {program.blocks.map((block) => (
          <article key={block.title} className="program-detail-card">
            <p className="card-eyebrow">{block.eyebrow}</p>
            <h2>{block.title}</h2>
            <p>{block.text}</p>
          </article>
        ))}

        <article className="program-detail-card program-detail-card--full">
          <p className="card-eyebrow">Resumo editorial</p>
          <h2>Como esta página se apresenta</h2>
          <p>{program.focus}</p>
          <p>{program.closingNote}</p>
        </article>
      </div>

      <div className="program-detail-actions">
        <Link className="advertise-primary" to={`${radioRoutes.news}?program=${slug}`}>
          Ver notícias deste programa
        </Link>
        <Link className="advertise-secondary" to={radioRoutes.programs}>
          Voltar aos programas
        </Link>
      </div>

      {programNews.length > 0 ? (
        <section className="program-news-section">
          <p className="eyebrow">Notícias do programa</p>
          <p className="program-news-helper">
            Publicações relacionadas a <strong>{program.name}</strong>, organizadas para leitura rápida.
          </p>
          <div className="news-list">
            {programNews.map((item) => (
              <Link className="news-card-link" key={item.id} to={`/noticias/${item.id}`}>
                <article className="news-card">
                  <p className="card-eyebrow">{item.category}</p>
                  <span className="news-program-tag">{program.name}</span>
                  <h3>{item.title}</h3>
                  <p>{item.excerpt}</p>
                </article>
              </Link>
            ))}
          </div>
        </section>
      ) : (
        <section className="program-news-section">
          <p className="eyebrow">Notícias do programa</p>
          <div className="empty-state-card">
            <h3>Ainda não há notícias ligadas a este programa</h3>
            <p>
              Quando houver publicações com essa relação, elas aparecerão aqui e também na aba de notícias.
            </p>
          </div>
        </section>
      )}
    </section>
  )
}
