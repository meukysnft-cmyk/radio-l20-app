import { useState } from 'react'
import { Link } from 'react-router-dom'
import { radioRoutes } from '../config/radioLinks'
import { SPORTS } from '../data/sportsData'
import { FootballTables } from '../components/FootballTables'

type Tab = 'local' | 'nacional' | 'internacional'

const TABS: { key: Tab; label: string; icon: string }[] = [
  { key: 'local', label: 'Esporte Local', icon: '📍' },
  { key: 'nacional', label: 'Esporte Nacional', icon: '🇧🇷' },
  { key: 'internacional', label: 'Esporte Internacional', icon: '🌍' },
]

export function SportsPage() {
  const [tab, setTab] = useState<Tab>('local')

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
      )}

      {tab === 'nacional' && (
        <div>
          <p className="ft-sub" style={{ marginBottom: 14 }}>Campeonatos nacionais com classificação atualizada.</p>
          <FootballTables slugs={['brasileirao-serie-a', 'brasileirao-serie-b', 'brasileirao-serie-c']} />
        </div>
      )}

      {tab === 'internacional' && (
        <div>
          <p className="ft-sub" style={{ marginBottom: 14 }}>Competições internacionais com classificação atualizada.</p>
          <FootballTables slugs={['libertadores']} />
        </div>
      )}
    </section>
  )
}
