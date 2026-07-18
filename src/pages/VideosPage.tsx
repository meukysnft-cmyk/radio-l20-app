import { useState } from 'react'
import { Link } from 'react-router-dom'
import { SectionHeader, VideoCard } from '../components/ContentCards'
import { radioRoutes, radioSocialLinks } from '../config/radioLinks'
import { useAuth } from '../context/useAuth'
import { siteContent } from '../data/siteContent'

export function VideosPage() {
  const content = siteContent
  const { isAdmin } = useAuth()
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false)

  return (
    <section className="content-section page-section videos-section">
      <SectionHeader
        eyebrow={content.sections.videos.eyebrow}
        title={content.sections.videos.title}
        description={content.sections.videos.description}
      />

      {isAdmin ? (
        <>
          <button className="news-admin-open-button" type="button" onClick={() => setIsAdminPanelOpen((current) => !current)}>
            {isAdminPanelOpen ? 'Fechar edição' : 'Editar vídeos'}
          </button>

          <aside className={`admin-side-panel${isAdminPanelOpen ? ' is-open' : ''}`} aria-label="Painel de vídeos">
            <div className="admin-inline-panel-header">
              <div>
                <p className="eyebrow">Admin / Vídeos</p>
                <h3>Gerenciar vídeos</h3>
              </div>
              <button className="advertise-secondary" type="button" onClick={() => setIsAdminPanelOpen(false)}>
                Fechar
              </button>
            </div>

            <p className="admin-panel-note">
              Aqui você abre a área administrativa completa para publicar vídeos, lives e destaques.
            </p>

            <div className="admin-hero-actions">
              <Link className="advertise-primary" to={radioRoutes.adminVideos}>
                Abrir admin
              </Link>
            </div>
          </aside>
        </>
      ) : null}

      <div className="video-layout">
        <article className="video-feature">
          <span className="video-channel-mark" aria-hidden="true">
            YT
          </span>
          <p className="card-eyebrow">{content.videos.feature.category}</p>
          <h3>{content.videos.feature.title}</h3>
          <p>{content.videos.feature.description}</p>

          <div className="video-actions">
            <a
              className="advertise-primary"
              href={radioSocialLinks.youtube}
              target="_blank"
              rel="noopener noreferrer"
            >
              {content.videos.feature.primaryActionLabel}
            </a>
            <a
              className="advertise-secondary"
              href={radioSocialLinks.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
            >
              {content.videos.feature.secondaryActionLabel}
            </a>
          </div>
        </article>

        <aside className="video-live-highlight">
          <p className="card-eyebrow">{content.videos.liveHighlight.category}</p>
          <h3>{content.videos.liveHighlight.title}</h3>
          <p>{content.videos.liveHighlight.description}</p>
        </aside>
      </div>

      <div className="video-card-section">
        <div className="section-title-row">
          <div className="section-header">
            <p className="eyebrow">Conteúdo em vídeo</p>
            <h2>Categorias de vídeo</h2>
            <p>Lives, notícias, programas e coberturas da Rádio L20 no YouTube.</p>
          </div>
        </div>

        <div className="video-card-grid">
          {content.videos.cards.map((item) => (
            <VideoCard item={item} key={item.title} />
          ))}
        </div>
      </div>

      <div className="video-subscribe-callout">
        <div>
          <h2>{content.videos.subscribeCallout.title}</h2>
          <p>{content.videos.subscribeCallout.description}</p>
        </div>
        <a
          className="advertise-primary"
          href={radioSocialLinks.youtube}
          target="_blank"
          rel="noopener noreferrer"
        >
          {content.videos.subscribeCallout.actionLabel}
        </a>
      </div>
    </section>
  )
}
