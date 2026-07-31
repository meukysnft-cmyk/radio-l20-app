import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { IoCopy, IoLink, IoLogoWhatsapp } from 'react-icons/io5'
import { radioRoutes } from '../config/radioLinks'
import { radioPrograms } from '../data/programsContent'
import { getDocument, listDocuments } from '../services/firestoreService'
import { SkPageHeader, SkCard, SkLine, Sk, SkNewsCard } from '../components/Skeleton'
import { usePageMeta } from '../hooks/usePageMeta'
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
  const [news, setNews] = useState<(NewsDocument & { id: string }) | null>(null)
  const [related, setRelated] = useState<Array<NewsDocument & { id: string }>>([])
  const [isLoading, setIsLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!id) return
    let cancelled = false

    async function load() {
      const doc = await getDocument<NewsDocument>('news', id!)
      if (cancelled) return
      setNews(doc)
      if (doc) {
        const all = await listDocuments<NewsDocument>('news')
        if (cancelled) return
        const published = all.filter((item) => item.id !== doc.id && item.status === 'published')
        const sameProgram = doc.programSlug ? published.filter((item) => item.programSlug === doc.programSlug) : []
        const relatedItems = sameProgram.length > 0
          ? sameProgram
          : published.filter((item) => item.category === doc.category)
        setRelated(relatedItems.slice(0, 3))
      }
      setIsLoading(false)
    }

    load()
    return () => { cancelled = true }
  }, [id])

  const programName = useMemo(
    () => radioPrograms.find((program) => program.slug === news?.programSlug)?.name || 'Rádio L20',
    [news?.programSlug],
  )

  const relatedTitle = useMemo(() => {
    if (news?.programSlug && related.some((item) => item.programSlug === news.programSlug)) {
      return 'Mais deste programa'
    }
    return 'Notícias relacionadas'
  }, [news?.programSlug, related])

  usePageMeta(
    news ? `${news.title} | Rádio L20` : 'Notícia | Rádio L20',
    news?.excerpt || news?.content?.replace(/<[^>]+>/g, ' ').slice(0, 160) || 'Leia a notícia completa na Rádio L20.',
  )

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/noticias/${id}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard indisponível
    }
  }

  if (!id) {
    return <Navigate to={radioRoutes.news} replace />
  }

  if (isLoading) {
    return (
      <section className="content-section page-section news-detail-page">
        <SkPageHeader />
        <SkCard style={{ marginTop: 20 }}>
          <Sk width="100%" height="320px" radius="var(--radius-lg)" style={{ marginBottom: 16 }} />
          <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
            <Sk width="80px" height="24px" radius="var(--radius-pill)" />
            <Sk width="100px" height="24px" radius="var(--radius-pill)" />
            <Sk width="90px" height="24px" radius="var(--radius-pill)" />
          </div>
          <SkLine width="100%" height="0.9rem" style={{ marginBottom: 6 }} />
          <SkLine width="95%" height="0.9rem" style={{ marginBottom: 6 }} />
          <SkLine width="88%" height="0.9rem" style={{ marginBottom: 6 }} />
          <SkLine width="70%" height="0.9rem" />
        </SkCard>
        <div style={{ display: 'grid', gap: 16, marginTop: 24 }}>
          <SkLine width="180px" height="1.3rem" />
          <div className="news-list">
            <SkNewsCard />
            <SkNewsCard />
          </div>
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
        {news.imageUrl ? <img className="news-detail-image" src={news.imageUrl} alt={news.title} loading="eager" /> : null}
        <div className="news-detail-meta">
          <span>{news.category}</span>
          {news.author ? <span>{news.author}</span> : null}
          {news.editor ? <span>Edição: {news.editor}</span> : null}
          <span>{formatNewsDate(news.createdAt)}</span>
          {news.programSlug ? <span>{programName}</span> : null}
        </div>
        <div className="news-detail-text" dangerouslySetInnerHTML={{ __html: news.content }} />

        {news.tags && news.tags.length > 0 ? (
          <div className="news-detail-tags" aria-label="Tags da notícia">
            {news.tags.map((tag) => <span key={tag}>{tag}</span>)}
          </div>
        ) : null}

        {news.sourceUrl ? (
          <a
            className="news-source-link"
            href={news.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <IoLink /> Ver fonte original
          </a>
        ) : null}

        <div className="news-detail-actions">
          <a
            className="share-whatsapp"
            href={`https://wa.me/?text=${encodeURIComponent(`${news.title} ${window.location.origin}/noticias/${news.id}`)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <IoLogoWhatsapp /> Compartilhar no WhatsApp
          </a>
          <button className="share-copy" onClick={handleCopyLink} type="button">
            {copied ? <IoCopy /> : <IoLink />} {copied ? 'Link copiado!' : 'Copiar link'}
          </button>
        </div>
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
            <p className="eyebrow">{relatedTitle}</p>
            <h2>Outras publicações para você</h2>
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
            <p className="eyebrow">Notícias relacionadas</p>
            <h2>Sem outras publicações por enquanto</h2>
          </div>
          <div className="empty-state-card">
            <p>Não encontramos outras notícias ligadas a esta publicação.</p>
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
