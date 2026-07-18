import { Link } from 'react-router-dom'
import { AdvertiseBenefitCard, SectionHeader } from '../components/ContentCards'
import { radioRoutes, radioSocialLinks } from '../config/radioLinks'
import { siteContent } from '../data/siteContent'

export function AdvertisePage() {
  const content = siteContent

  return (
    <section className="content-section advertise-section page-section">
      <div className="advertise-copy">
        <SectionHeader
          eyebrow={content.sections.advertise.eyebrow}
          title={content.sections.advertise.title}
          description={content.sections.advertise.description}
        />
        <p className="advertise-subtitle">{content.advertise.subtitle}</p>
        <p className="advertise-audience">{content.advertise.audienceText}</p>
        <div className="advertise-actions">
          <a
            className="advertise-primary"
            href={radioSocialLinks.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
          >
            {content.advertise.primaryActionLabel}
          </a>
          <Link className="advertise-secondary" to={radioRoutes.contact}>
            {content.advertise.secondaryActionLabel}
          </Link>
        </div>
      </div>

      <aside className="advertise-spotlight">
        <p className="card-eyebrow">Esporte amador</p>
        <h3>{content.advertise.transmissionTitle}</h3>
        <p>{content.advertise.transmissionDescription}</p>
        <span>{content.advertise.localBrandsText}</span>
      </aside>

      <div className="advertise-benefits">
        {content.advertise.benefits.map((item) => (
          <AdvertiseBenefitCard item={item} key={item.title} />
        ))}
      </div>
    </section>
  )
}
