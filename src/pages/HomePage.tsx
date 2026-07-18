import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FeaturedNewsCard,
  NewsCard,
  ScheduleCard,
  SectionHeader,
  SportsCard,
} from '../components/ContentCards'
import { LivePlayer } from '../components/LivePlayer'
import { SectionSummaries, HoroscopeSummary } from '../components/SectionSummaries'
import { SocialActions } from '../components/SocialLinks'
import { SponsorBanner } from '../components/SponsorBanner'
import { radioRoutes } from '../config/radioLinks'
import { getProgramLabelBySlug } from '../data/programsContent'
import { subscribeDocuments } from '../services/firestoreService'
import type { NewsDocument } from '../types/content'
import { siteContent, type ContentCard } from '../data/siteContent'

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

export function HomePage() {
  const content = siteContent
  const [newsItems, setNewsItems] = useState<NewsDocument[]>([])

  useEffect(() => {
    return subscribeDocuments<NewsDocument>(
      'news',
      (documents) => {
        const published = documents.filter((item) => item.status === 'published')
        const sorted = [...published].sort((first, second) => {
          if (first.featured !== second.featured) {
            return Number(second.featured) - Number(first.featured)
          }

          const firstCreated = first.createdAt && typeof first.createdAt === 'object' && 'seconds' in first.createdAt
            ? Number((first.createdAt as { seconds: number }).seconds)
            : 0
          const secondCreated = second.createdAt && typeof second.createdAt === 'object' && 'seconds' in second.createdAt
            ? Number((second.createdAt as { seconds: number }).seconds)
            : 0

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

  const featuredNews = useMemo(() => {
    const topNews = newsItems[0]

    return topNews ? toNewsCard(topNews) : fallbackFeaturedNews
  }, [newsItems])

  const featuredNewsLink = newsItems[0] ? `/noticias/${newsItems[0].id}` : radioRoutes.news

  const localNewsWithLinks = useMemo(
    () =>
      newsItems
        .filter((item) => !item.featured)
        .slice(0, 2)
        .map((item) => ({ id: item.id, card: toNewsCard(item) })),
    [newsItems],
  )

  return (
    <div className="home-page">
      <section className="hero-section" id="ao-vivo" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="live-kicker">
            <span aria-hidden="true"></span>
            {content.radio.hero.kicker}
          </p>
          <h1 id="hero-title">{content.radio.hero.title}</h1>
          <p className="hero-lead">{content.radio.hero.lead}</p>
          <SocialActions />
        </div>

        <LivePlayer compact />
      </section>

      <HoroscopeSummary />

      <section className="content-section" id="noticias">
        <div className="section-title-row">
          <SectionHeader
            eyebrow={content.sections.news.eyebrow}
            title="Destaques de notícias"
            description={content.sections.news.description}
          />
          <Link className="section-link" to={radioRoutes.news}>
            Ver notícias
          </Link>
        </div>

        {newsItems.length > 0 ? (
          <div className="news-layout">
            <Link className="news-card-link" to={featuredNewsLink}>
              <FeaturedNewsCard item={featuredNews} />
            </Link>
            <div className="news-list">
              {localNewsWithLinks.map((item) => (
                <Link className="news-card-link" key={item.id} to={`/noticias/${item.id}`}>
                  <NewsCard item={item.card} />
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="empty-state-card">
            <p className="card-eyebrow">Portal local</p>
            <h3>Ainda não há notícias publicadas</h3>
            <p>Assim que o admin publicar conteúdo, esta área será preenchida automaticamente.</p>
          </div>
        )}
      </section>

      <SponsorBanner className="sponsor-strip-scroll" />

      <section className="content-section sport-section" id="esporte">
        <div className="sport-intro">
          <SectionHeader
            eyebrow={content.sections.sport.eyebrow}
            title={content.sections.sport.title}
            description={content.sections.sport.description}
          />
          <Link className="section-link" to={radioRoutes.sport}>
            Ver esporte
          </Link>
        </div>

        <div className="sport-content">
          <article className="sports-feature-card">
            <p className="card-eyebrow">{content.sportsFeature.category}</p>
            <h3>{content.sportsFeature.title}</h3>
            <p>{content.sportsFeature.description}</p>
            <span>{content.sportsFeature.meta}</span>
          </article>

          <div className="sport-grid">
            {content.amateurSports.slice(0, 2).map((item) => (
              <SportsCard item={item} key={item.title} />
            ))}
          </div>
        </div>
      </section>

      <section className="content-section schedule-section" id="agenda">
        <div className="section-title-row">
          <SectionHeader
            eyebrow={content.sections.schedule.eyebrow}
            title="Próximas transmissões"
            description={content.sections.schedule.description}
          />
          <Link className="section-link" to={radioRoutes.schedule}>
            Ver agenda
          </Link>
        </div>

        <div className="schedule-list">
          {content.broadcastSchedule.slice(0, 2).map((item) => (
            <ScheduleCard item={item} key={`${item.time}-${item.title}`} />
          ))}
        </div>
      </section>

      <SponsorBanner className="sponsor-strip-scroll" />

      <section className="content-section home-cta-grid">
        <article className="home-cta-card">
          <p className="card-eyebrow">{content.sections.advertise.eyebrow}</p>
          <h2>{content.sections.advertise.title}</h2>
          <p>{content.advertise.subtitle}</p>
          <Link className="advertise-primary" to={radioRoutes.advertise}>
            Conhecer espaços
          </Link>
        </article>

        <article className="home-cta-card is-light">
          <p className="card-eyebrow">{content.sections.contact.eyebrow}</p>
          <h2>{content.sections.contact.title}</h2>
          <p>{content.sections.contact.description}</p>
          <Link className="advertise-secondary" to={radioRoutes.contact}>
            Entrar em contato
          </Link>
        </article>

        <article className="home-cta-card">
          <p className="card-eyebrow">Cadastro social</p>
          <h2>Entre para a comunidade da Rádio L20</h2>
          <p>Faça seu cadastro e deixe seu nome salvo para novidades, ações e participação no app.</p>
          <Link className="advertise-primary" to={radioRoutes.register}>
            Fazer cadastro
          </Link>
        </article>
      </section>

      <SectionSummaries />

      <SponsorBanner className="sponsor-strip-scroll" />
    </div>
  )
}

