import { useEffect, useMemo, useState } from 'react'
import { FeaturedNewsCard, NewsCard, SectionHeader } from '../components/ContentCards'
import { Link, useSearchParams } from 'react-router-dom'
import { radioRoutes } from '../config/radioLinks'
import { getProgramLabelBySlug } from '../data/programsContent'
import type { NewsDocument } from '../types/content'
import { siteContent, type ContentCard } from '../data/siteContent'
import { subscribeDocuments } from '../services/firestoreService'

type NewsWithCard = {
  id: string
  card: ContentCard
}

const fallbackFeaturedNews: ContentCard = {
  category: 'Cidade',
  title: 'Cobertura local em destaque',
  description:
    'Espaço principal para uma notícia apurada sobre Pilar, com chamada forte e contexto para o ouvinte.',
  meta: 'Pilar, AL',
  isTemporary: false,
}

function toNewsCard(item: NewsDocument) {
  return {
    category: item.category || 'Cidade',
    title: item.title,
    description: item.excerpt || item.content || '',
    meta: item.author || 'Rádio L20',
    author: item.author || 'Rádio L20',
    imageUrl: item.imageUrl || '',
    publishedAt: formatNewsDate(item.createdAt),
    programLabel: getProgramLabelBySlug(item.programSlug),
    isTemporary: false,
  }
}

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

export function NewsPage() {
  const content = siteContent
  const [newsItems, setNewsItems] = useState<NewsDocument[]>([])
  const [searchParams] = useSearchParams()
  const selectedProgramSlug = searchParams.get('program') ?? ''
  const selectedProgramLabel = getProgramLabelBySlug(selectedProgramSlug)

  useEffect(() => {
    return subscribeDocuments<NewsDocument>(
      'news',
      (documents) => {
        const published = documents.filter((item) => item.status === 'published')
        const sorted = [...published].sort((first, second) => {
          if (first.featured !== second.featured) {
            return Number(second.featured) - Number(first.featured)
          }

          const firstCreated = 'seconds' in (first.createdAt as object) ? Number((first.createdAt as { seconds: number }).seconds) : 0
          const secondCreated = 'seconds' in (second.createdAt as object) ? Number((second.createdAt as { seconds: number }).seconds) : 0

          return secondCreated - firstCreated
        })

        setNewsItems(sorted)
      },
      (error) => {
        console.error('Falha ao ouvir notícias do Firestore.', error)
        setNewsItems([])
      },
    )
  }, [])

  const visibleNewsItems = useMemo(() => {
    if (!selectedProgramSlug) {
      return newsItems
    }

    return newsItems.filter((item) => item.programSlug === selectedProgramSlug)
  }, [newsItems, selectedProgramSlug])

  const featuredNews = useMemo(() => {
    const topNews = visibleNewsItems[0]

    return topNews ? toNewsCard(topNews) : fallbackFeaturedNews
  }, [visibleNewsItems])

  const featuredNewsLink = visibleNewsItems[0] ? `/noticias/${visibleNewsItems[0].id}` : radioRoutes.news

  const localNews = useMemo(
    (): NewsWithCard[] =>
      visibleNewsItems
        .slice(1, 3)
        .map((item) => ({ id: item.id ?? '', card: toNewsCard(item) })),
    [visibleNewsItems],
  )

  return (
    <section className="content-section page-section">
      <SectionHeader
        eyebrow={content.sections.news.eyebrow}
        title={selectedProgramLabel ? `Notícias de ${selectedProgramLabel}` : content.sections.news.title}
        description={
          selectedProgramLabel
            ? `Aqui estão as publicações conectadas ao programa ${selectedProgramLabel}.`
            : content.sections.news.description
        }
      />

      {selectedProgramLabel ? (
        <div className="program-news-filter-bar">
          <p>
            Filtrando notícias do programa <strong>{selectedProgramLabel}</strong>
          </p>
          <Link className="section-link" to={radioRoutes.news}>
            Ver todas
          </Link>
        </div>
      ) : null}

      {visibleNewsItems.length > 0 ? (
        <div className="news-layout">
          <Link className="news-card-link" to={featuredNewsLink}>
            <FeaturedNewsCard item={featuredNews} />
          </Link>
          <div className="news-list">
            {localNews.map((item) => (
              <div className="news-card-wrap" key={item.id}>
                <Link className="news-card-link" to={`/noticias/${item.id}`}>
                  <NewsCard item={item.card} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="empty-state-card">
          <p className="card-eyebrow">Sem publicações</p>
          <h3>Nenhuma notícia disponível agora</h3>
          <p>
            {selectedProgramLabel
              ? 'Ainda não há notícias associadas a este programa.'
              : 'Ainda não há notícias publicadas para mostrar nesta seção.'}
          </p>
          {selectedProgramLabel ? (
            <Link className="advertise-secondary" to={radioRoutes.news}>
              Ver todas as notícias
            </Link>
          ) : null}
        </div>
      )}
    </section>
  )
}
