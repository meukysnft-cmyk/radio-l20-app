import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { SectionHeader, SportsCard, TeamCard } from '../components/ContentCards'
import { radioRoutes } from '../config/radioLinks'
import { siteContent, type ContentCard } from '../data/siteContent'
import { teamsContent } from '../data/teamsContent'
import { getDocument } from '../services/firestoreService'
import type { SportsContentDocument } from '../types/content'

const fallbackFeatured: ContentCard = siteContent.sportsFeature
const fallbackAmateur: ContentCard[] = siteContent.amateurSports
const fallbackCallout = siteContent.sportsCallout

export function SportsPage() {
  const content = siteContent
  const [firestoreData, setFirestoreData] = useState<SportsContentDocument | null>(null)

  useEffect(() => {
    getDocument<SportsContentDocument>('sportsContent', 'main').then((doc) => {
      if (doc) setFirestoreData(doc)
    })
  }, [])

  const featured: ContentCard = firestoreData?.featured
    ? { ...firestoreData.featured, isTemporary: false }
    : fallbackFeatured

  const amateurCards: ContentCard[] = firestoreData?.amateurCards?.length
    ? firestoreData.amateurCards.map((c) => ({ ...c, isTemporary: false }))
    : fallbackAmateur

  const callout = firestoreData?.callout ?? fallbackCallout

  return (
    <section className="content-section sport-section page-section">
      <div className="sport-intro">
        <SectionHeader
          eyebrow={content.sections.sport.eyebrow}
          title={content.sections.sport.title}
          description={content.sections.sport.description}
        />
        <Link className="section-link" to={radioRoutes.schedule}>
          {content.sections.sport.actionLabel}
        </Link>
      </div>

      <div className="sport-content">
        <article className="sports-feature-card">
          <p className="card-eyebrow">{featured.category}</p>
          <h3>{featured.title}</h3>
          <p>{featured.description}</p>
          <span>{featured.meta}</span>
        </article>

        <div className="sport-grid">
          {amateurCards.map((item) => (
            <SportsCard item={item} key={item.title} />
          ))}
        </div>

        <div className="team-showcase" aria-label="Times locais">
          <div>
            <p className="card-eyebrow">Times locais</p>
            <h3>Equipes do esporte amador de Pilar</h3>
            <p>
              Times, atletas e equipes que movimentam o esporte amador da cidade.
            </p>
          </div>

          <div className="team-grid">
            {teamsContent.map((item) => (
              <TeamCard item={item} key={item.name} />
            ))}
          </div>
        </div>

        <div className="sports-callout">
          <div>
            <h3>{callout.title}</h3>
            <p>{callout.description}</p>
          </div>
          <Link className="section-link" to={radioRoutes.schedule}>
            {callout.actionLabel}
          </Link>
        </div>
      </div>
    </section>
  )
}
