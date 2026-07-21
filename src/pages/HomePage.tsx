import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FeaturedNewsCard,
  NewsCard,
  ScheduleCard,
  SectionHeader,
} from '../components/ContentCards'
import { LivePlayer } from '../components/LivePlayer'
import { SectionSummaries, HoroscopeSummary } from '../components/SectionSummaries'
import { SocialActions } from '../components/SocialLinks'
import { SponsorBanner } from '../components/SponsorBanner'
import { radioRoutes } from '../config/radioLinks'
import { radioPrograms } from '../data/programsContent'
import { getProgramLabelBySlug } from '../data/programsContent'
import { subscribeDocuments } from '../services/firestoreService'
import type { NewsDocument } from '../types/content'
import { siteContent, type ContentCard } from '../data/siteContent'
import { IoVideocam, IoBriefcase, IoStar } from 'react-icons/io5'

const SPORT_CATEGORIES = ['Esporte Local', 'Esporte Nacional', 'Esporte Internacional']

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
  if (!value || typeof value !== 'object' || !('seconds' in value)) return ''
  const seconds = (value as { seconds: number }).seconds
  const date = new Date(seconds * 1000)
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date)
}

function QuickLinkCard({ to, icon, eyebrow, title, description }: {
  to: string
  icon: React.ReactNode
  eyebrow: string
  title: string
  description: string
}) {
  return (
    <Link className="home-quick-card" to={to}>
      <span className="home-quick-icon" aria-hidden="true">{icon}</span>
      <p className="card-eyebrow">{eyebrow}</p>
      <h3>{title}</h3>
      <p>{description}</p>
      <span className="home-quick-arrow">Ver mais →</span>
    </Link>
  )
}

export function HomePage() {
  const content = siteContent
  const [allNews, setAllNews] = useState<NewsDocument[]>([])

  useEffect(() => {
    return subscribeDocuments<NewsDocument>(
      'news',
      (documents) => {
        const published = documents.filter((item) => item.status === 'published')
        const sorted = [...published].sort((first, second) => {
          if (first.featured !== second.featured) {
            return Number(second.featured) - Number(first.featured)
          }
          const a = 'seconds' in (first.createdAt as object) ? Number((first.createdAt as { seconds: number }).seconds) : 0
          const b = 'seconds' in (second.createdAt as object) ? Number((second.createdAt as { seconds: number }).seconds) : 0
          return b - a
        })
        setAllNews(sorted)
      },
      () => setAllNews([]),
    )
  }, [])

  const generalNews = useMemo(
    () => allNews.filter((item) => !SPORT_CATEGORIES.includes(item.category || '')),
    [allNews],
  )

  const sportNews = useMemo(
    () => allNews.filter((item) => SPORT_CATEGORIES.includes(item.category || '')),
    [allNews],
  )

  const featuredNews = useMemo(() => {
    const top = generalNews[0]
    return top ? toNewsCard(top) : fallbackFeaturedNews
  }, [generalNews])

  const featuredNewsLink = generalNews[0] ? `/noticias/${generalNews[0].id}` : radioRoutes.news

  const moreNews = useMemo(
    () => generalNews.slice(0, 7).map((item) => ({ id: item.id, card: toNewsCard(item) })),
    [generalNews],
  )

  const topPrograms = useMemo(() => radioPrograms.slice(0, 4), [])

  return (
    <div className="home-page">
      <section className="hero-split" id="ao-vivo" aria-labelledby="hero-title">
        <div className="hero-cards-row">
          <div className="hero-player-side">
            <LivePlayer compact />
          </div>
          <div className="hero-horoscope-side">
            <HoroscopeSummary premium />
          </div>
        </div>
        <SocialActions className="hero-social-row" />
      </section>

      <section className="content-section" id="noticias">
        <div className="section-title-row">
          <SectionHeader
            eyebrow={content.sections.news.eyebrow}
            title="Últimas notícias"
            description={content.sections.news.description}
          />
          <Link className="section-link" to={radioRoutes.news}>
            Ver todas
          </Link>
        </div>

        {generalNews.length > 0 ? (
          <>
            <div className="news-layout">
              <Link className="news-card-link" to={featuredNewsLink}>
                <FeaturedNewsCard item={featuredNews} />
              </Link>
              <div className="news-list">
                {moreNews.slice(1, 3).map((item) => (
                  <Link className="news-card-link" key={item.id} to={`/noticias/${item.id}`}>
                    <NewsCard item={item.card} />
                  </Link>
                ))}
              </div>
            </div>
            <div className="news-grid">
              {moreNews.slice(3).map((item) => (
                <Link className="news-card-link" key={item.id} to={`/noticias/${item.id}`}>
                  <NewsCard item={item.card} />
                </Link>
              ))}
            </div>
          </>
        ) : (
          <div className="empty-state-card">
            <p className="card-eyebrow">Portal local</p>
            <h3>Ainda não há notícias publicadas</h3>
            <p>Assim que o admin publicar conteúdo, esta área será preenchida automaticamente.</p>
          </div>
        )}
      </section>

      <SponsorBanner className="sponsor-strip-scroll" />

      {sportNews.length > 0 ? (
        <section className="content-section" id="esporte-home">
          <div className="section-title-row">
            <SectionHeader
              eyebrow="Esportes"
              title="Notícias esportivas"
              description="Acompanhe as principais notícias do esporte local, nacional e internacional."
            />
            <Link className="section-link" to={radioRoutes.sport}>
              Ver esportes
            </Link>
          </div>
          <div className="news-grid">
            {sportNews.slice(0, 4).map((item) => (
              <Link className="news-card-link" key={item.id} to={`/noticias/${item.id}`}>
                <NewsCard item={toNewsCard(item)} />
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <section className="content-section" id="programas-home">
        <div className="section-title-row">
          <SectionHeader
            eyebrow={content.sections.programs.eyebrow}
            title={content.sections.programs.title}
            description={content.sections.programs.description}
          />
          <Link className="section-link" to={radioRoutes.programs}>
            Ver programação
          </Link>
        </div>
        <div className="home-quick-grid">
          {topPrograms.map((p) => (
            <Link className="home-program-mini" key={p.slug} to={`${radioRoutes.programDetail(p.slug)}`}>
              <span className="home-program-mini-icon" aria-hidden="true">🎙</span>
              <div>
                <strong>{p.name}</strong>
                <small>{p.time || p.days || ''}</small>
              </div>
            </Link>
          ))}
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

      <section className="content-section" id="extras-home">
        <div className="section-title-row">
          <SectionHeader
            eyebrow="Mais para você"
            title="Explore a Rádio L20"
            description="Vagas, horóscopo, vídeos e muito mais."
          />
        </div>
        <div className="home-quick-grid home-quick-grid-3">
          <QuickLinkCard
            to={radioRoutes.horoscope}
            icon={<IoStar />}
            eyebrow={content.sections.wordOfLife.eyebrow}
            title="Horóscopo do dia"
            description="Veja a previsão do seu signo."
          />
          <QuickLinkCard
            to={radioRoutes.videos}
            icon={<IoVideocam />}
            eyebrow={content.sections.videos.eyebrow}
            title={content.sections.videos.title}
            description={content.sections.videos.description}
          />
          <QuickLinkCard
            to={radioRoutes.jobs}
            icon={<IoBriefcase />}
            eyebrow={content.sections.jobs.eyebrow}
            title={content.sections.jobs.title}
            description={content.sections.jobs.description}
          />
        </div>
      </section>

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
          <h2>Entre para a comunidade</h2>
          <p>Faça seu cadastro e receba novidades.</p>
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
