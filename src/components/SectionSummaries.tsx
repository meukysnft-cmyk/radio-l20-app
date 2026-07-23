import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { radioRoutes } from '../config/radioLinks'
import { radioPrograms } from '../data/programsContent'
import { horoscopeContent } from '../data/horoscopeContent'
import { subscribeDocuments, getDocument } from '../services/firestoreService'
import { useAuth } from '../context/useAuth'
import { getZodiacFromBirthday, ZODIAC_SIGNS, ELEMENT_EMOJI, ELEMENT_LABELS, getSignSvg } from '../utils/zodiac'
import type { JobDocument, UserProfileDocument } from '../types/content'
import { siteContent } from '../data/siteContent'

function getTodaySignIndex() {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 0)
  const dayOfYear = Math.floor((now.getTime() - start.getTime()) / 86400000)
  return dayOfYear % 12
}

function ProgramasSummary() {
  const programs = radioPrograms.slice(0, 3)

  return (
    <Link className="summary-card" to={radioRoutes.programs}>
      <span className="summary-icon" aria-hidden="true">🎙</span>
      <p className="summary-eyebrow">{siteContent.sections.programs.eyebrow}</p>
      <h3>{siteContent.sections.programs.title}</h3>
      <ul className="summary-list">
        {programs.map((p) => (
          <li key={p.slug}>
            <strong>{p.name}</strong>
            <span>{p.slogan}</span>
          </li>
        ))}
      </ul>
      <span className="summary-cta">Ver programação →</span>
    </Link>
  )
}

function VideosSummary() {
  return (
    <Link className="summary-card" to={radioRoutes.videos}>
      <span className="summary-icon" aria-hidden="true">▶</span>
      <p className="summary-eyebrow">{siteContent.sections.videos.eyebrow}</p>
      <h3>{siteContent.sections.videos.title}</h3>
      <p className="summary-desc">{siteContent.sections.videos.description}</p>
      <span className="summary-cta">Ver vídeos →</span>
    </Link>
  )
}

export function HoroscopeSummary({ premium = false }: { premium?: boolean }) {
  const { user } = useAuth()
  const [todayIndex] = useState(getTodaySignIndex)
  const [userSignIndex, setUserSignIndex] = useState<number | null>(null)

  useEffect(() => {
    if (!user) { setUserSignIndex(null); return }
    let cancelled = false
    getDocument<UserProfileDocument>('userProfiles', user.uid).then((profile) => {
      if (cancelled || !profile?.birthday) return
      const sign = getZodiacFromBirthday(profile.birthday)
      if (sign) {
        const idx = ZODIAC_SIGNS.findIndex((s) => s.name === sign.name)
        if (idx >= 0) setUserSignIndex(idx)
      }
    }).catch(() => {})
    return () => { cancelled = true }
  }, [user])

  const activeIndex = userSignIndex ?? todayIndex
  const sign = ZODIAC_SIGNS[activeIndex]
  const content = horoscopeContent.signs[activeIndex] || horoscopeContent.signs[0]

  const signSlug = sign.name
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, '-')

  if (premium) {
    const svg = getSignSvg(sign.name)
    return (
      <Link className={`holo-premium holo-premium-${signSlug}`} to={radioRoutes.horoscope}>
        <div className="holo-premium-illustration">
          {svg ? <img src={svg} alt="" width={180} height={180} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'contain' }} /> : null}
        </div>
        <div className="holo-premium-info">
          <span className="holo-premium-element">{ELEMENT_EMOJI[sign.element]} {ELEMENT_LABELS[sign.element]}</span>
          <h3 className="holo-premium-name">{sign.name}</h3>
          <p className="holo-premium-message">{content.message}</p>
          <span className="holo-premium-cta">Ver previsão completa →</span>
        </div>
      </Link>
    )
  }

  const svg = getSignSvg(sign.name)

  return (
    <Link className={`holo-card holo-${signSlug}`} to={radioRoutes.horoscope}>
      <div className="holo-bg">
        <span className="holo-orb holo-orb-1" aria-hidden="true" />
        <span className="holo-orb holo-orb-2" aria-hidden="true" />
        <span className="holo-orb holo-orb-3" aria-hidden="true" />
      </div>
      <div className="holo-content">
        <div className="holo-symbol-wrap">
          {svg ? <img src={svg} alt="" width={100} height={100} loading="lazy" style={{ width: 100, height: 100, objectFit: 'contain' }} /> : null}
        </div>
        <p className="holo-element">{ELEMENT_EMOJI[sign.element]} {ELEMENT_LABELS[sign.element]}</p>
        <h3 className="holo-name">{sign.name}</h3>
        <p className="holo-period">{sign.period}</p>
        <p className="holo-message">{content.message}</p>
        <span className="holo-cta">Ver previsão completa →</span>
      </div>
    </Link>
  )
}

function EmpregosSummary() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    return subscribeDocuments<JobDocument>(
      'jobs',
      (documents) => {
        const published = documents.filter((j) => j.published !== false)
        setCount(published.length)
      },
      () => setCount(0),
    )
  }, [])

  return (
    <Link className="summary-card" to={radioRoutes.jobs}>
      <span className="summary-icon" aria-hidden="true">💼</span>
      <p className="summary-eyebrow">{siteContent.sections.jobs.eyebrow}</p>
      <h3>{siteContent.sections.jobs.title}</h3>
      <p className="summary-desc">
        {count > 0
          ? `${count} vaga${count === 1 ? '' : 's'} disponível${count === 1 ? '' : 'is'} agora`
          : siteContent.sections.jobs.description}
      </p>
      <span className="summary-cta">Ver vagas →</span>
    </Link>
  )
}

function PalavraSummary() {
  return (
    <Link className="summary-card" to={radioRoutes.wordOfLife}>
      <span className="summary-icon" aria-hidden="true">🕊</span>
      <p className="summary-eyebrow">{siteContent.sections.wordOfLife.eyebrow}</p>
      <h3>{siteContent.sections.wordOfLife.title}</h3>
      <p className="summary-desc">{siteContent.sections.wordOfLife.description}</p>
      <span className="summary-cta">Ver conteúdo →</span>
    </Link>
  )
}

export function SectionSummaries() {
  return (
    <section className="content-section section-summaries" aria-label="Outras seções">
      <div className="section-title-row">
        <div className="section-header">
          <p className="eyebrow">Explore mais</p>
          <h2>Tudo que a Rádio L20 oferece</h2>
          <p>Programação, vídeos, empregos, horóscopo e conteúdo comunitário.</p>
        </div>
      </div>
      <div className="summary-grid">
        <ProgramasSummary />
        <VideosSummary />
        <HoroscopeSummary />
        <EmpregosSummary />
        <PalavraSummary />
      </div>
    </section>
  )
}
