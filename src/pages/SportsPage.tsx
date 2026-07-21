import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { NewsCard } from '../components/ContentCards'
import { radioRoutes } from '../config/radioLinks'
import { SPORTS } from '../data/sportsData'
import { FootballTables } from '../components/FootballTables'
import { subscribeDocuments } from '../services/firestoreService'
import type { NewsDocument } from '../types/content'
import type { ContentCard } from '../data/siteContent'
import { getProgramLabelBySlug } from '../data/programsContent'

type Tab = 'local' | 'nacional' | 'internacional'

const TABS: { key: Tab; label: string; icon: string }[] = [
  { key: 'local', label: 'Esporte Local', icon: '📍' },
  { key: 'nacional', label: 'Esporte Nacional', icon: '🇧🇷' },
  { key: 'internacional', label: 'Esporte Internacional', icon: '🌍' },
]

const SPORT_CATEGORIES = ['Esporte Local', 'Esporte Nacional', 'Esporte Internacional']

function formatNewsDate(value: unknown) {
  if (!value || typeof value !== 'object' || !('seconds' in value)) return ''
  const date = new Date((value as { seconds: number }).seconds * 1000)
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date)
}

function toNewsCard(item: NewsDocument): ContentCard {
  return {
    category: item.category || 'Esporte',
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

export function SportsPage() {
  const [tab, setTab] = useState<Tab>('local')
  const [sportNews, setSportNews] = useState<NewsDocument[]>([])

  useEffect(() => {
    return subscribeDocuments<NewsDocument>(
      'news',
      (documents) => {
        const published = documents.filter((item) => item.status === 'published')
        const sports = published
          .filter((item) => SPORT_CATEGORIES.includes(item.category || ''))
          .sort((a, b) => {
            const aSec = 'seconds' in (a.createdAt as object) ? Number((a.createdAt as { seconds: number }).seconds) : 0
            const bSec = 'seconds' in (b.createdAt as object) ? Number((b.createdAt as { seconds: number }).seconds) : 0
            return bSec - aSec
          })
        setSportNews(sports)
      },
      () => setSportNews([]),
    )
  }, [])

  return (
    <section className="content-section sport-section page-section" aria-labelledby="sport-title">
      <h1 id="sport-title" className="sr-only">Esportes</h1>

      <div className="sport-tabs">
        {TABS.map((t) => (
          <button
            key={t.key}
            className={`sport-tab${tab === t.key ? ' is-active' : ''}`}
            onClick={() => setTab(t.key)}
            type="button"
          >
            <span className="sport-tab-icon">{t.icon}</span>
            <span className="sport-tab-label">{t.label}</span>
          </button>
        ))}
      </div>

      {tab === 'local' && (
        <>
          <div className="sport-grid-4">
            {SPORTS.map((s) => (
              <Link
                key={s.name}
                to={`${radioRoutes.sport}/${s.slug}`}
                className="sport-card-4"
                style={{ '--sport-color': s.color } as React.CSSProperties}
              >
                <span className="sport-card-4-icon">{s.icon}</span>
                <h3>{s.name}</h3>
              </Link>
            ))}
          </div>
          {sportNews.filter((n) => n.category === 'Esporte Local').length > 0 ? (
            <div className="sport-news-section">
              <h2 className="section-title">Notícias do Esporte Local</h2>
              <div className="news-grid">
                {sportNews
                  .filter((n) => n.category === 'Esporte Local')
                  .slice(0, 6)
                  .map((item) => (
                    <Link className="news-card-link" key={item.id} to={`/noticias/${item.id}`}>
                      <NewsCard item={toNewsCard(item)} />
                    </Link>
                  ))}
              </div>
            </div>
          ) : null}
        </>
      )}

      {tab === 'nacional' && (
        <div>
          <p className="ft-sub" style={{ marginBottom: 14 }}>Campeonatos nacionais com classificação atualizada.</p>
          <FootballTables slugs={['brasileirao-serie-a', 'brasileirao-serie-b', 'brasileirao-serie-c']} />
          {sportNews.filter((n) => n.category === 'Esporte Nacional').length > 0 ? (
            <div className="sport-news-section">
              <h2 className="section-title">Notícias do Esporte Nacional</h2>
              <div className="news-grid">
                {sportNews
                  .filter((n) => n.category === 'Esporte Nacional')
                  .slice(0, 6)
                  .map((item) => (
                    <Link className="news-card-link" key={item.id} to={`/noticias/${item.id}`}>
                      <NewsCard item={toNewsCard(item)} />
                    </Link>
                  ))}
              </div>
            </div>
          ) : null}
        </div>
      )}

      {tab === 'internacional' && (
        <div>
          <p className="ft-sub" style={{ marginBottom: 14 }}>Competições internacionais com classificação atualizada.</p>
          <FootballTables slugs={['libertadores']} />
          {sportNews.filter((n) => n.category === 'Esporte Internacional').length > 0 ? (
            <div className="sport-news-section">
              <h2 className="section-title">Notícias do Esporte Internacional</h2>
              <div className="news-grid">
                {sportNews
                  .filter((n) => n.category === 'Esporte Internacional')
                  .slice(0, 6)
                  .map((item) => (
                    <Link className="news-card-link" key={item.id} to={`/noticias/${item.id}`}>
                      <NewsCard item={toNewsCard(item)} />
                    </Link>
                  ))}
              </div>
            </div>
          ) : null}
        </div>
      )}
    </section>
  )
}
