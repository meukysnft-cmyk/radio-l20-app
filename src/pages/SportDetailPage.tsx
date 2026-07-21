import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getSportBySlug, SPORTS } from '../data/sportsData'
import { radioRoutes } from '../config/radioLinks'
import { subscribeDocuments } from '../services/firestoreService'
import type { NewsDocument } from '../types/content'

export function SportDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const sport = slug ? getSportBySlug(slug) : undefined
  const [news, setNews] = useState<NewsDocument[]>([])

  useEffect(() => {
    if (!sport) return
    const keywords = [sport.name.toLowerCase(), sport.slug]
    const unsub = subscribeDocuments<NewsDocument>('news', (docs) => {
      setNews(
        docs.filter((d) =>
          d.status === 'published' &&
          keywords.some((kw) => d.category.toLowerCase().includes(kw))
        ).slice(0, 12),
      )
    })
    return () => unsub()
  }, [sport])

  if (!sport) {
    return (
      <section className="content-section page-section" style={{ textAlign: 'center', padding: '80px 24px' }}>
        <h1>Esporte não encontrado</h1>
        <p style={{ color: 'var(--text-secondary)', margin: '12px 0 24px' }}>O esporte que você procura não existe.</p>
        <Link to={radioRoutes.sport} className="btn btn-primary">Ver todos os esportes</Link>
      </section>
    )
  }

  const prevIdx = SPORTS.findIndex((s) => s.slug === slug)
  const prev = prevIdx > 0 ? SPORTS[prevIdx - 1] : null
  const next = prevIdx < SPORTS.length - 1 ? SPORTS[prevIdx + 1] : null

  return (
    <section className="content-section page-section" aria-labelledby="sport-detail-title">
      {/* Hero */}
      <div className="sport-detail-hero" style={{ '--sport-color': sport.color } as React.CSSProperties}>
        <div className="sport-detail-hero-bg" />
        <div className="sport-detail-hero-inner">
          <Link to={radioRoutes.sport} className="sport-detail-back">&larr; Todos os esportes</Link>
          <div className="sport-detail-hero-main">
            <span className="sport-detail-hero-icon">{sport.icon}</span>
            <div>
              <p className="eyebrow">Esportes</p>
              <h1 id="sport-detail-title">{sport.name}</h1>
            </div>
          </div>
        </div>
      </div>

      {/* News */}
      <div style={{ display: 'grid', gap: 16 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-strong)', margin: 0 }}>Notícias</h2>
        {news.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Nenhuma notícia encontrada para {sport.name}.</p>
        ) : (
          <div className="sport-detail-news-grid">
            {news.map((n) => (
              <Link to={`/noticias/${n.id}`} className="sport-detail-news-card" key={n.id}>
                {n.imageUrl ? (
                  <div className="sport-detail-news-thumb">
                    <img src={n.imageUrl} alt={n.title} loading="lazy" />
                  </div>
                ) : (
                  <div className="sport-detail-news-thumb sport-detail-news-placeholder">
                    <span>{sport.icon}</span>
                  </div>
                )}
                <div className="sport-detail-news-body">
                  <span className="sport-detail-news-cat">{n.category}</span>
                  <h3>{n.title}</h3>
                  <p>{n.excerpt}</p>
                  <span className="sport-detail-news-meta">{n.author ? <span>{n.author}</span> : null}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="sport-detail-nav">
        {prev ? (
          <Link to={`${radioRoutes.sport}/${prev.slug}`} className="sport-detail-nav-btn">
            &larr; {prev.icon} {prev.name}
          </Link>
        ) : <span />}
        {next ? (
          <Link to={`${radioRoutes.sport}/${next.slug}`} className="sport-detail-nav-btn sport-detail-nav-next">
            {next.icon} {next.name} &rarr;
          </Link>
        ) : null}
      </div>
    </section>
  )
}
