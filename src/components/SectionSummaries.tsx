import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { radioRoutes } from '../config/radioLinks'
import { radioPrograms } from '../data/programsContent'
import { horoscopeContent } from '../data/horoscopeContent'
import { subscribeDocuments, getDocument } from '../services/firestoreService'
import { useAuth } from '../context/useAuth'
import { getZodiacFromBirthday, ZODIAC_SIGNS } from '../utils/zodiac'
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

export function HoroscopeSummary() {
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

  return (
    <Link className="summary-card summary-card-horoscope-top" to={radioRoutes.horoscope}>
      <span className="summary-icon" aria-hidden="true">{sign.symbol}</span>
      <p className="summary-eyebrow">Seu Horóscopo de Hoje</p>
      <h3>{sign.name}</h3>
      <p className="summary-desc">{content.message}</p>
      <span className="summary-cta">Ler previsão completa →</span>
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
