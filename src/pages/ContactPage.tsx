import { ContactCard } from '../components/ContentCards'
import { radioSocialLinks } from '../config/radioLinks'
import { siteContent } from '../data/siteContent'

export function ContactPage() {
  const content = siteContent
  const channelLinks = [
    radioSocialLinks.whatsapp,
    radioSocialLinks.instagram,
    radioSocialLinks.youtube,
  ]

  return (
    <section className="content-section page-section contact-page" aria-labelledby="contact-title">
      <div className="contact-page-hero">
        <p className="eyebrow">{content.sections.contact.eyebrow}</p>
        <h1 id="contact-title">{content.sections.contact.title}</h1>
        <p>{content.sections.contact.description}</p>
        <strong>{content.contact.intro}</strong>
      </div>

      <div className="contact-page-layout">
        <ContactCard item={content.contact.primaryCard} href={radioSocialLinks.whatsapp} featured />

        <div className="contact-channel-grid">
          {content.contact.channels.map((item, index) => (
            <ContactCard item={item} href={channelLinks[index]} key={item.title} />
          ))}
        </div>
      </div>

      <div className="contact-topic-grid">
        {content.contact.topics.map((item) => (
          <ContactCard item={item} key={item.title} />
        ))}
      </div>

      <div className="contact-community-callout">
        <div>
          <h2>{content.contact.communityCallout.title}</h2>
          <p>{content.contact.communityCallout.description}</p>
        </div>
        <a
          className="advertise-primary"
          href={radioSocialLinks.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
        >
          {content.contact.primaryCard.actionLabel}
        </a>
      </div>
    </section>
  )
}
