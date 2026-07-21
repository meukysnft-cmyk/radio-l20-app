import { useEffect, useMemo, useState } from 'react'
import { FeaturedNewsCard, NewsCard, BlogCard, SectionHeader } from '../components/ContentCards'
import { Link, useSearchParams } from 'react-router-dom'
import { radioRoutes } from '../config/radioLinks'
import { getProgramLabelBySlug } from '../data/programsContent'
import { SkNewsPageLayout } from '../components/Skeleton'
import type { NewsDocument } from '../types/content'
import { siteContent, type ContentCard } from '../data/siteContent'
import { subscribeDocuments } from '../services/firestoreService'

type NewsWithCard = {
  id: string
  card: ContentCard
}

const fallbackGeneralFeatured: ContentCard = {
  category: 'Cidade',
  title: 'Cobertura local em destaque',
  description:
    'Espaço principal para uma notícia apurada sobre Pilar, com chamada forte e contexto para o ouvinte.',
  meta: 'Pilar, AL',
  isTemporary: false,
}

const fallbackSportsFeatured: ContentCard = {
  category: 'Esporte Local',
  title: 'Esporte local em destaque',
  description:
    'Acompanhe as principais notícias esportivas de Pilar e região.',
  meta: 'Pilar, AL',
  isTemporary: false,
}

const GENERAL_CATEGORIES = [
  'Todas',
  'Cidade',
  'Política',
  'Cultura',
  'Economia',
  'Saúde',
  'Educação',
  'Utilidade Pública',
]

const SPORTS_CATEGORIES = [
  'Todas',
  'Esporte Local',
  'Esporte Nacional',
  'Esporte Internacional',
]

const ITEMS_PER_PAGE = 12

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
  const [isLoading, setIsLoading] = useState(true)
  const [searchParams] = useSearchParams()
  const selectedProgramSlug = searchParams.get('program') ?? ''
  const selectedProgramLabel = getProgramLabelBySlug(selectedProgramSlug)

  const [section, setSection] = useState<'general' | 'sports'>('general')
  const [activeCategory, setActiveCategory] = useState('Todas')
  const [currentPage, setCurrentPage] = useState(1)

  const isGeneral = section === 'general'
  const categories = isGeneral ? GENERAL_CATEGORIES : SPORTS_CATEGORIES
  const fallbackFeatured = isGeneral ? fallbackGeneralFeatured : fallbackSportsFeatured
  const sectionClass = isGeneral ? 'news-page-general' : 'news-page-sports'

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
        setIsLoading(false)
      },
      (error) => {
        console.error('Falha ao ouvir notícias do Firestore.', error)
        setNewsItems([])
        setIsLoading(false)
      },
    )
  }, [])

  useEffect(() => {
    setCurrentPage(1)
  }, [activeCategory, selectedProgramSlug, section])

  const visibleNewsItems = useMemo(() => {
    let filtered = newsItems

    filtered = filtered.filter((item) => (item.section || 'general') === section)

    if (selectedProgramSlug) {
      filtered = filtered.filter((item) => item.programSlug === selectedProgramSlug)
    }

    if (activeCategory !== 'Todas') {
      filtered = filtered.filter((item) => item.category === activeCategory)
    }

    return filtered
  }, [newsItems, section, activeCategory, selectedProgramSlug])

  const featuredNews = useMemo(() => {
    const topNews = visibleNewsItems[0]
    return topNews ? toNewsCard(topNews) : fallbackFeatured
  }, [visibleNewsItems, fallbackFeatured])

  const featuredNewsLink = visibleNewsItems[0] ? `/noticias/${visibleNewsItems[0].id}` : radioRoutes.news

  const totalPages = Math.ceil(visibleNewsItems.length / ITEMS_PER_PAGE)

  const paginatedNews = useMemo((): NewsWithCard[] =>
    visibleNewsItems
      .slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
      .map((item) => ({ id: item.id ?? '', card: toNewsCard(item) })),
    [visibleNewsItems, currentPage],
  )

  function goToPage(page: number) {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <section className={`content-section page-section ${sectionClass}`}>
      <SectionHeader
        eyebrow={content.sections.news.eyebrow}
        title={selectedProgramLabel ? `Notícias de ${selectedProgramLabel}` : content.sections.news.title}
        description={
          selectedProgramLabel
            ? `Aqui estão as publicações conectadas ao programa ${selectedProgramLabel}.`
            : content.sections.news.description
        }
      />

      <div className="news-section-toggle">
        <button
          type="button"
          className={`news-section-btn${isGeneral ? ' is-active' : ''}`}
          onClick={() => { setSection('general'); setActiveCategory('Todas') }}
        >
          <span className="news-section-icon">&#128240;</span>
          Notícias Gerais
        </button>
        <button
          type="button"
          className={`news-section-btn${!isGeneral ? ' is-active' : ''}`}
          onClick={() => { setSection('sports'); setActiveCategory('Todas') }}
        >
          <span className="news-section-icon">&#9917;</span>
          Notícias Esportivas
        </button>
      </div>

      {selectedProgramLabel ? (
        <div className="program-news-filter-bar">
          <p>
            Filtrando notícias do programa <strong>{selectedProgramLabel}</strong>
          </p>
          <Link className="section-link" to={radioRoutes.news}>
            Ver todas
          </Link>
        </div>
      ) : (
        <div className="news-category-tabs">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`news-category-tab${activeCategory === cat ? ' is-active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {isLoading ? (
        <SkNewsPageLayout />
      ) : visibleNewsItems.length > 0 ? (
        <>
          <div className="news-layout">
            <Link className="news-card-link" to={featuredNewsLink}>
              <FeaturedNewsCard item={featuredNews} />
            </Link>
            <div className="news-list news-list-grid">
              {paginatedNews.slice(0, 1).map((item) => (
                <div className="news-card-wrap" key={item.id}>
                  <Link className="news-card-link" to={`/noticias/${item.id}`}>
                    <NewsCard item={item.card} />
                  </Link>
                </div>
              ))}
            </div>
          </div>

          <div className="news-grid blog-grid">
            {paginatedNews.slice(1).map((item) => (
              <Link className="news-card-link" key={item.id} to={`/noticias/${item.id}`}>
                <BlogCard item={item.card} />
              </Link>
            ))}
          </div>

          {totalPages > 1 ? (
            <div className="news-pagination">
              <button
                type="button"
                className="news-page-btn"
                disabled={currentPage <= 1}
                onClick={() => goToPage(currentPage - 1)}
              >
                &laquo; Anterior
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  type="button"
                  className={`news-page-btn${currentPage === page ? ' is-active' : ''}`}
                  onClick={() => goToPage(page)}
                >
                  {page}
                </button>
              ))}
              <button
                type="button"
                className="news-page-btn"
                disabled={currentPage >= totalPages}
                onClick={() => goToPage(currentPage + 1)}
              >
                Próximo &raquo;
              </button>
            </div>
          ) : null}
        </>
      ) : (
        <div className="empty-state-card">
          <p className="card-eyebrow">Sem publicações</p>
          <h3>Nenhuma notícia disponível agora</h3>
          <p>
            {activeCategory !== 'Todas'
              ? `Ainda não há notícias na categoria "${activeCategory}".`
              : selectedProgramLabel
                ? 'Ainda não há notícias associadas a este programa.'
                : isGeneral
                  ? 'Ainda não há notícias gerais publicadas.'
                  : 'Ainda não há notícias esportivas publicadas.'}
          </p>
          {activeCategory !== 'Todas' ? (
            <button type="button" className="advertise-secondary" onClick={() => setActiveCategory('Todas')}>
              Ver todas as categorias
            </button>
          ) : selectedProgramLabel ? (
            <Link className="advertise-secondary" to={radioRoutes.news}>
              Ver todas as notícias
            </Link>
          ) : null}
        </div>
      )}
    </section>
  )
}
