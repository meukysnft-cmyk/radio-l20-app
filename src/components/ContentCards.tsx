import { memo } from 'react'
import type {
  AdvertiseBenefit,
  ContactCardItem,
  ContentCard,
  ProgramItem,
  ScheduleItem,
  SponsorBanner as SponsorBannerType,
  SponsorItem,
  VideoCardItem,
} from '../data/siteContent'
import type { TeamProfile } from '../data/teamsContent'
import { TeamLogo } from './TeamLogo'

type SectionHeaderProps = {
  eyebrow: string
  title: string
  description: string
}

export const SectionHeader = memo(function SectionHeader({ eyebrow, title, description }: SectionHeaderProps) {
  return (
    <div className="section-header">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  )
})

export const FeaturedNewsCard = memo(function FeaturedNewsCard({ item }: { item: ContentCard }) {
  return (
    <article className="featured-news-card">
      <p className="card-eyebrow">{item.category}</p>
      {item.programLabel ? <span className="news-program-tag">{item.programLabel}</span> : null}
      {item.imageUrl ? <img className="news-card-image" src={item.imageUrl} alt={item.title} loading="lazy" /> : null}
      <h3>{item.title}</h3>
      <p>{item.description}</p>
      <div className="news-card-meta">
        {item.author ? <span>{item.author}</span> : null}
        {item.publishedAt ? <span>{item.publishedAt}</span> : null}
        <span>{item.meta}</span>
      </div>
    </article>
  )
})

export const NewsCard = memo(function NewsCard({ item }: { item: ContentCard }) {
  return (
    <article className="news-card">
      <p className="card-eyebrow">{item.category}</p>
      {item.programLabel ? <span className="news-program-tag">{item.programLabel}</span> : null}
      {item.imageUrl ? <img className="news-card-image" src={item.imageUrl} alt={item.title} loading="lazy" /> : null}
      <h3>{item.title}</h3>
      <p>{item.description}</p>
      <div className="news-card-meta">
        {item.author ? <span>{item.author}</span> : null}
        {item.publishedAt ? <span>{item.publishedAt}</span> : null}
        <span>{item.meta}</span>
      </div>
    </article>
  )
})

export const BlogCard = memo(function BlogCard({ item }: { item: ContentCard }) {
  return (
    <article className="blog-card">
      {item.imageUrl ? <img className="blog-card-image" src={item.imageUrl} alt={item.title} loading="lazy" /> : null}
      <div className="blog-card-body">
        <p className="card-eyebrow">{item.category}</p>
        {item.programLabel ? <span className="news-program-tag">{item.programLabel}</span> : null}
        <h3>{item.title}</h3>
        <p className="blog-card-desc">{item.description}</p>
        <div className="news-card-meta">
          {item.author ? <span>{item.author}</span> : null}
          {item.publishedAt ? <span>{item.publishedAt}</span> : null}
          <span>{item.meta}</span>
        </div>
      </div>
    </article>
  )
})

export const SportsCard = memo(function SportsCard({ item }: { item: ContentCard }) {
  return (
    <article className="sport-card">
      <p className="card-eyebrow">{item.category}</p>
      <h3>{item.title}</h3>
      <p>{item.description}</p>
      <span>{item.meta}</span>
    </article>
  )
})

export const TeamCard = memo(function TeamCard({ item }: { item: TeamProfile }) {
  const fallback = item.name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2)

  return (
    <article className="team-card">
      <TeamLogo logoUrl={item.logoUrl} alt={item.alt} fallback={fallback} />
      <div>
        <h3>{item.name}</h3>
        <p>{item.city}</p>
        <small>{item.category}</small>
      </div>
      {item.colors ? (
        <div className="team-color-swatches" aria-label={`Cores de ${item.name}`}>
          <span style={{ background: item.colors.primary }}></span>
          <span style={{ background: item.colors.secondary }}></span>
        </div>
      ) : null}
    </article>
  )
})

export const ScheduleCard = memo(function ScheduleCard({ item }: { item: ScheduleItem }) {
  return (
    <article className="schedule-item">
      <time>{item.time}</time>
      <div>
        <h3>{item.title}</h3>
        <p>{item.description}</p>
      </div>
    </article>
  )
})

export const ProgramCard = memo(function ProgramCard({ item }: { item: ProgramItem }) {
  return (
    <article className={`program-card${item.isOnAir ? ' is-on-air' : ''}`}>
      <div className="program-card-header">
        <p className="card-eyebrow">{item.category}</p>
        {item.isOnAir ? <span className="program-status">{item.statusLabel ?? 'No ar'}</span> : null}
      </div>
      <h3>{item.name}</h3>
      <div className="program-meta">
        <span>{item.time}</span>
        <span>{item.days}</span>
      </div>
      <p>{item.description}</p>
    </article>
  )
})

export const ProgramPreviewCard = memo(function ProgramPreviewCard({
  logoPath,
  title,
  description,
  label,
}: {
  logoPath: string
  title: string
  description: string
  label: string
}) {
  return (
    <article className="program-card program-preview-card">
      <div className="program-logo-frame" aria-hidden="true">
        <img src={logoPath} alt="" loading="lazy" />
      </div>
      <p className="card-eyebrow">{label}</p>
      <h3>{title}</h3>
      <p>{description}</p>
      <span>Toque para abrir o programa</span>
    </article>
  )
})

export const AdvertiseBenefitCard = memo(function AdvertiseBenefitCard({ item }: { item: AdvertiseBenefit }) {
  return (
    <article className="advertise-benefit-card">
      <h3>{item.title}</h3>
      <p>{item.description}</p>
    </article>
  )
})

export const SponsorCard = memo(function SponsorCard({ item }: { item: SponsorItem }) {
  return (
    <div className="sponsor-card">
      <span className="sponsor-logo-mark" aria-hidden="true">
        {item.initials}
      </span>
      <div>
        <strong>{item.name}</strong>
        <p>{item.category}</p>
      </div>
    </div>
  )
})

export const SponsorBanner = memo(function SponsorBanner({ item }: { item: SponsorBannerType }) {
  return (
    <article className="sponsor-banner">
      <h3>{item.title}</h3>
      <p>{item.description}</p>
    </article>
  )
})

export const VideoCard = memo(function VideoCard({ item }: { item: VideoCardItem }) {
  return (
    <article className="video-card">
      <p className="card-eyebrow">{item.category}</p>
      <h3>{item.title}</h3>
      <p>{item.description}</p>
    </article>
  )
})

export const ContactCard = memo(function ContactCard({
  item,
  href,
  featured = false,
}: {
  item: ContactCardItem
  href?: string
  featured?: boolean
}) {
  return (
    <article className={`contact-card${featured ? ' is-featured' : ''}`}>
      <p className="card-eyebrow">{item.eyebrow}</p>
      <h3>{item.title}</h3>
      <p>{item.description}</p>
      {href && item.actionLabel ? (
        <a
          className={featured ? 'advertise-primary' : 'contact-card-action'}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
        >
          {item.actionLabel}
        </a>
      ) : null}
    </article>
  )
})
