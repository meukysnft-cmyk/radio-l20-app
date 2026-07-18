import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { radioRoutes } from '../config/radioLinks'
import { radioPrograms } from '../data/programsContent'
import { subscribeDocuments } from '../services/firestoreService'
import type { NewsDocument } from '../types/content'

function formatNewsDate(value: unknown) {
  if (!value || typeof value !== 'object' || !('seconds' in value)) {
    return ''
  }

  const seconds = (value as { seconds: number }).seconds
  const date = new Date(seconds * 1000)

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date)
}

export function NewsDetailPage() {
  const { id } = useParams()
  const [newsItems, setNewsItems] = useState<Array<NewsDocument & { id: string }>>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    return subscribeDocuments<NewsDocument>('news', (documents) => {
      setNewsItems(documents)
      setIsLoading(false)
    })
  }, [])

  const news = useMemo(() => newsItems.find((item) => item.id === id) ?? null, [id, newsItems])
  const related = useMemo(
    () =>
      news
        ? newsItems.filter((item) => item.id !== news.id && item.programSlug === news.programSlug).slice(0, 3)
        : [],
    [news, newsItems],
  )
  const programName = useMemo(
    () => radioPrograms.find((program) => program.slug === news?.programSlug)?.name || 'Rádio L20',
    [news?.programSlug],
  )

  if (!id) {
    return <Navigate to={radioRoutes.news} replace />
  }

  if (isLoading) {
    return (
      <section className="content-section page-section news-detail-page">
        <div className="route-loading-shell" aria-live="polite">
          Carregando notícia...
        </div>
      </section>
    )
  }

  if (!news) {
    return <Navigate to={radioRoutes.news} replace />
  }

  return (
    <section className="content-section page-section news-detail-page" aria-labelledby="news-detail-title">
      <div className="section-header">
        <p className="eyebrow">Notícia publicada</p>
        <h1 id="news-detail-title">{news.title}</h1>
        <p>{news.excerpt}</p>
      </div>

      <article className="news-detail-card">
        {news.imageUrl ? <img className="news-detail-image" src={news.imageUrl} alt={news.title} /> : null}
        <div className="news-detail-meta">
          <span>{news.category}</span>
          {news.author ? <span>{news.author}</span> : null}
          <span>{formatNewsDate(news.createdAt)}</span>
          {news.programSlug ? <span>{programName}</span> : null}
        </div>
        <p className="news-detail-text">{news.content}</p>
      </article>

      {news.programSlug ? (
        <div className="news-detail-program-link">
          <Link className="section-link" to={`${radioRoutes.programDetail(news.programSlug)}`}>
            Ver página do programa {programName}
          </Link>
        </div>
      ) : null}

      {related.length > 0 ? (
        <div className="news-related-block">
          <div className="section-header">
            <p className="eyebrow">Mais deste programa</p>
            <h2>Outras notícias ligadas ao mesmo conteúdo</h2>
          </div>
          <div className="news-list">
            {related.map((item) => (
              <Link className="news-card-link" key={item.id} to={`/noticias/${item.id}`}>
                <article className="news-card">
                  <p className="card-eyebrow">{item.category}</p>
                  {item.programSlug ? <span className="news-program-tag">{programName}</span> : null}
                  <h3>{item.title}</h3>
                  <p>{item.excerpt}</p>
                </article>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div className="news-related-block">
          <div className="section-header">
            <p className="eyebrow">Mais deste programa</p>
            <h2>Sem outras notícias relacionadas por enquanto</h2>
          </div>
          <div className="empty-state-card">
            <p>
              Essa notícia ainda não tem outras publicações associadas ao mesmo programa.
            </p>
            {news.programSlug ? (
              <Link className="advertise-secondary" to={radioRoutes.programDetail(news.programSlug)}>
                Ver página do programa
              </Link>
            ) : null}
          </div>
        </div>
      )}

      <div className="news-detail-actions">
        <Link className="advertise-secondary" to={radioRoutes.news}>
          Voltar às notícias
        </Link>
      </div>
    </section>
  )
}
