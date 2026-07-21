import { Link } from 'react-router-dom'
import { useEffect, useMemo, useState, useContext } from 'react'
import { SponsorBanner, SectionHeader } from '../components/ContentCards'
import { radioRoutes, radioSocialLinks } from '../config/radioLinks'
import { useAuth } from '../context/useAuth'
import { SponsorsContext } from '../context/sponsorsState'
import { siteContent } from '../data/siteContent'

type SponsorView = {
  id: string
  name: string
  category: string
  logoFile?: string
  bannerFile?: string
  linkUrl?: string
  info?: string
}

export function SponsorsPage() {
  const content = siteContent
  const { isAdmin } = useAuth()
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false)
  const { sponsors } = useContext(SponsorsContext)

  const orderedSponsors = useMemo(() => {
    const list = [...sponsors]
    if (list.length === 0) {
      return content.temporarySponsors.map((item) => ({
        id: item.name,
        name: item.name,
        category: item.category,
        info: item.note,
        logoFile: '',
        bannerFile: '',
      })) as SponsorView[]
    }

    return list as SponsorView[]
  }, [content.temporarySponsors, sponsors])

  const [rotatedSponsors, setRotatedSponsors] = useState(orderedSponsors)

  useEffect(() => {
    setRotatedSponsors(orderedSponsors)
  }, [orderedSponsors])

  useEffect(() => {
    const interval = window.setInterval(() => {
      setRotatedSponsors((current) => {
        if (current.length < 2) {
          return current
        }

        const next = [...current]
        const first = next.shift()
        return first ? [...next, first] : current
      })
    }, 10 * 60 * 1000)

    return () => window.clearInterval(interval)
  }, [])

  return (
    <section className="content-section sponsors-section page-section">
      <SectionHeader
        eyebrow={content.sections.sponsors.eyebrow}
        title={content.sections.sponsors.title}
        description={content.sections.sponsors.description}
      />

      {isAdmin ? (
        <>
          <button className="news-admin-open-button" type="button" onClick={() => setIsAdminPanelOpen((current) => !current)}>
            {isAdminPanelOpen ? 'Fechar edição' : 'Editar patrocinadores'}
          </button>

          <aside className={`admin-side-panel${isAdminPanelOpen ? ' is-open' : ''}`} aria-label="Painel de patrocinadores">
            <div className="admin-inline-panel-header">
              <div>
                <p className="eyebrow">Admin / Patrocinadores</p>
                <h3>Gerenciar patrocinadores</h3>
              </div>
              <button className="advertise-secondary" type="button" onClick={() => setIsAdminPanelOpen(false)}>
                Fechar
              </button>
            </div>

            <p className="admin-panel-note">
              Abra a área administrativa completa para criar, editar ou remover patrocinadores e banners.
            </p>

            <div className="admin-hero-actions">
              <Link className="advertise-primary" to={radioRoutes.adminSponsors}>
                Abrir admin
              </Link>
            </div>
          </aside>
        </>
      ) : null}

      <div className="sponsor-grid">
        {rotatedSponsors.map((item) => (
          <article className="sponsor-card" key={item.id ?? item.name}>
            <a
              className="sponsor-card-link"
              href={item.linkUrl || radioSocialLinks.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="sponsor-logo-frame" aria-hidden="true">
                {item.logoFile ? (
                  <img src={`/${item.logoFile}`} alt="" loading="lazy" />
                ) : (
                  item.name.slice(0, 2).toUpperCase()
                )}
              </span>
              {item.bannerFile ? (
                <span className="sponsor-banner-frame" aria-hidden="true">
                  <img src={`/${item.bannerFile}`} alt="" loading="lazy" />
                </span>
              ) : null}
              <div>
                <strong>{item.name}</strong>
                <p>{item.category}</p>
                {item.info ? <small>{item.info}</small> : null}
              </div>
            </a>
          </article>
        ))}
      </div>

      <div className="sponsor-banner-grid">
        {content.sponsorBanners.map((item) => (
          <SponsorBanner item={item} key={item.title} />
        ))}
      </div>

      <div className="sponsor-callout">
        <div>
          <h3>{content.sponsorCallout.title}</h3>
          <p>{content.sponsorCallout.description}</p>
        </div>
        <a
          className="advertise-primary"
          href={radioSocialLinks.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
        >
          {content.sponsorCallout.actionLabel}
        </a>
      </div>
    </section>
  )
}
