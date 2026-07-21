import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { horoscopeContent } from '../data/horoscopeContent'
import { useAuth } from '../context/useAuth'
import { getDocument, subscribeDocuments } from '../services/firestoreService'
import { getZodiacFromBirthday, ZODIAC_SIGNS, getSignSvg } from '../utils/zodiac'
import { getSignSlug } from '../data/signProfiles'
import { radioRoutes } from '../config/radioLinks'
import type { UserProfileDocument, HoroscopePredictionDocument } from '../types/content'
import { fetchTodayHoroscope } from '../services/horoscopeService'
import type { HoroscopeSignData } from '../components/HoroscopeCard'

function fallbackToSignData(): HoroscopeSignData[] {
  return horoscopeContent.signs.map((s) => ({
    name: s.name,
    period: s.period,
    element: s.element,
    daily: { message: s.message, love: s.details.love, work: s.details.work, health: s.details.health, advice: s.details.advice, color: '', accessory: '', luckyNumber: '' },
    weekly: { message: '', love: '', work: '', health: '', advice: '' },
    monthly: { message: '', love: '', work: '', health: '', advice: '' },
  }))
}

export function HoroscopePage() {
  const { user } = useAuth()
  const [signs, setSigns] = useState<HoroscopeSignData[]>(fallbackToSignData)
  const [userSign, setUserSign] = useState<string | null>(null)
  const [selectedSign, setSelectedSign] = useState<string>('')
  const [prediction, setPrediction] = useState<HoroscopePredictionDocument | null>(null)

  const activeSign = userSign || selectedSign

  useEffect(() => {
    fetchTodayHoroscope()
      .then((data) => { if (data.length > 0) setSigns(data) })
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (!user) { setUserSign(null); return }
    let cancelled = false
    getDocument<UserProfileDocument>('userProfiles', user.uid).then((profile) => {
      if (cancelled || !profile?.birthday) return
      const sign = getZodiacFromBirthday(profile.birthday)
      if (sign) setUserSign(sign.name)
    }).catch(() => {})
    return () => { cancelled = true }
  }, [user])

  useEffect(() => {
    if (!activeSign) { setPrediction(null); return }
    const today = new Date().toISOString().slice(0, 10)
    const unsub = subscribeDocuments<HoroscopePredictionDocument>(
      'horoscopePredictions',
      (docs) => {
        const pred = docs.find((d) => d.date === today && d.sign === activeSign && d.status === 'published')
        setPrediction(pred || null)
      },
      () => setPrediction(null),
    )
    return () => unsub()
  }, [activeSign])

  const activeSignData = useMemo(
    () => signs.find((s) => s.name === activeSign) ?? null,
    [signs, activeSign],
  )

  const activeSignMeta = useMemo(
    () => ZODIAC_SIGNS.find((s) => s.name === activeSign) ?? null,
    [activeSign],
  )

  const activeSlug = activeSign ? getSignSlug(activeSign) : null

  return (
    <section className="content-section page-section horoscope-page" aria-labelledby="horoscope-title">
      <div className="section-header">
        <p className="eyebrow">Entretenimento</p>
        <h1 id="horoscope-title">{horoscopeContent.title}</h1>
        <p>{horoscopeContent.subtitle}</p>
        <span>{horoscopeContent.note}</span>
      </div>

      {/* Hero: user sign or selector */}
      {activeSign && activeSignMeta ? (
        <div className="sign-hero-card">
          <div className="sign-hero-card-bg" />
          <div className="sign-hero-card-inner">
            <div className="sign-hero-card-top">
              {getSignSvg(activeSign) ? (
                <img className="sign-hero-card-icon" src={getSignSvg(activeSign)!} alt={activeSign} width={80} height={80} />
              ) : (
                <span className="sign-hero-card-emoji">{activeSignMeta.symbol}</span>
              )}
              <div className="sign-hero-card-info">
                <p className="sign-hero-card-label">{userSign ? 'Seu signo' : 'Previsão para'}</p>
                <h2 className="sign-hero-card-name">{activeSign}</h2>
                <span className="sign-hero-card-period">{activeSignMeta.period}</span>
              </div>
            </div>

            {prediction ? (
              <p className="sign-hero-card-message">{prediction.message}</p>
            ) : (
              <p className="sign-hero-card-message sign-hero-card-empty">Previsão de hoje ainda não disponível. Confira mais tarde!</p>
            )}

            {prediction ? (
              <div className="sign-hero-card-grid">
                {prediction.love ? <div className="sign-hero-card-item"><span>❤️ Amor</span><p>{prediction.love}</p></div> : null}
                {prediction.work ? <div className="sign-hero-card-item"><span>💼 Trabalho</span><p>{prediction.work}</p></div> : null}
                {prediction.health ? <div className="sign-hero-card-item"><span>🏃 Saúde</span><p>{prediction.health}</p></div> : null}
                {prediction.money ? <div className="sign-hero-card-item"><span>💰 Dinheiro</span><p>{prediction.money}</p></div> : null}
              </div>
            ) : null}

            {prediction ? (
              <div className="sign-hero-card-extras">
                {prediction.advice ? <span>✨ {prediction.advice}</span> : null}
                {prediction.luckyNumber ? <span>🔢 Sorte: {prediction.luckyNumber}</span> : null}
                {prediction.color ? <span>🎨 {prediction.color}</span> : null}
              </div>
            ) : null}

            {activeSlug ? (
              <Link to={`${radioRoutes.horoscope}/${activeSlug}`} className="sign-hero-card-btn">
                Abrir detalhes &rarr;
              </Link>
            ) : null}
          </div>
        </div>
      ) : !user ? (
        <div className="sign-select-prompt">
          <p>Selecione seu signo para ver a previsão de hoje:</p>
          <div className="sign-select-grid">
            {ZODIAC_SIGNS.map((s) => {
              const svg = getSignSvg(s.name)
              const slug = getSignSlug(s.name)
              return (
                <button
                  key={s.name}
                  className={`sign-select-btn${selectedSign === s.name ? ' is-selected' : ''}`}
                  onClick={() => setSelectedSign(s.name)}
                  type="button"
                >
                  {svg ? <img src={svg} alt="" width={36} height={36} /> : <span className="sign-select-symbol">{s.symbol}</span>}
                  <span className="sign-select-name">{s.name}</span>
                </button>
              )
            })}
          </div>
        </div>
      ) : null}

      {/* All signs grid */}
      <h2 className="sign-grid-title">Todos os signos</h2>
      <div className="sign-mini-grid">
        {ZODIAC_SIGNS.map((s) => {
          const svg = getSignSvg(s.name)
          const slug = getSignSlug(s.name)
          const isActive = s.name === activeSign
          return (
            <Link
              to={`${radioRoutes.horoscope}/${slug}`}
              className={`sign-mini-card${isActive ? ' is-active' : ''}`}
              key={s.name}
            >
              {svg ? <img src={svg} alt="" width={44} height={44} /> : <span className="sign-mini-symbol">{s.symbol}</span>}
              <span className="sign-mini-name">{s.name}</span>
              {isActive ? <span className="sign-mini-badge">Seu signo</span> : null}
            </Link>
          )
        })}
      </div>
    </section>
  )
}
