import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import { horoscopeContent } from '../data/horoscopeContent'
import { useAuth } from '../context/useAuth'
import { getDocument, subscribeDocuments } from '../services/firestoreService'
import { getZodiacFromBirthday, ZODIAC_SIGNS } from '../utils/zodiac'
import type { UserProfileDocument, HoroscopePredictionDocument } from '../types/content'
import { fetchTodayHoroscope } from '../services/horoscopeService'
import type { HoroscopeSignData } from '../components/HoroscopeCard'

const HoroscopeCard = lazy(() =>
  import('../components/HoroscopeCard').then((m) => ({ default: m.HoroscopeCard })),
)

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
  const [loading, setLoading] = useState(true)
  const [userSign, setUserSign] = useState<string | null>(null)
  const [selectedSign, setSelectedSign] = useState<string>('')
  const [prediction, setPrediction] = useState<HoroscopePredictionDocument | null>(null)

  const activeSign = userSign || selectedSign

  useEffect(() => {
    fetchTodayHoroscope()
      .then((data) => { if (data.length > 0) setSigns(data) })
      .catch(() => {})
      .finally(() => setLoading(false))
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

  const signMeta = useMemo(() => ZODIAC_SIGNS.find((s) => s.name === activeSign), [activeSign])

  return (
    <section className="content-section page-section horoscope-page" aria-labelledby="horoscope-title">
      <div className="section-header">
        <p className="eyebrow">Entretenimento</p>
        <h1 id="horoscope-title">{horoscopeContent.title}</h1>
        <p>{horoscopeContent.subtitle}</p>
        <span>{horoscopeContent.note}</span>
      </div>

      {user && userSign ? (
        prediction ? (
          <div className="horoscope-personalized">
            <div className="horoscope-personalized-header">
              <span className="horoscope-personalized-emoji">{prediction.emoji || '🔮'}</span>
              <div>
                <p className="eyebrow">Sua previsão de hoje</p>
                <h2>{userSign}</h2>
                <span>{signMeta?.period}</span>
              </div>
            </div>
            <p className="horoscope-personalized-message">{prediction.message}</p>
            <div className="horoscope-personalized-grid">
              {prediction.love ? <div className="horoscope-personalized-item"><span className="horoscope-personalized-item-label">❤️ Amor</span><p>{prediction.love}</p></div> : null}
              {prediction.work ? <div className="horoscope-personalized-item"><span className="horoscope-personalized-item-label">💼 Trabalho</span><p>{prediction.work}</p></div> : null}
              {prediction.health ? <div className="horoscope-personalized-item"><span className="horoscope-personalized-item-label">🏃 Saúde</span><p>{prediction.health}</p></div> : null}
              {prediction.money ? <div className="horoscope-personalized-item"><span className="horoscope-personalized-item-label">💰 Dinheiro</span><p>{prediction.money}</p></div> : null}
            </div>
            <div className="horoscope-personalized-extras">
              {prediction.advice ? <span className="horoscope-personalized-extra">✨ Dica: {prediction.advice}</span> : null}
              {prediction.luckyNumber ? <span className="horoscope-personalized-extra">🔢 Número da sorte: {prediction.luckyNumber}</span> : null}
              {prediction.color ? <span className="horoscope-personalized-extra">🎨 Cor do dia: {prediction.color}</span> : null}
              {prediction.compatibility ? <span className="horoscope-personalized-extra">💕 Compatibilidade: {prediction.compatibility}</span> : null}
            </div>
          </div>
        ) : (
          <div className="horoscope-personalized">
            <div className="horoscope-personalized-header">
              <span className="horoscope-personalized-emoji">🔮</span>
              <div>
                <p className="eyebrow">Seu signo</p>
                <h2>{userSign}</h2>
                <span>{signMeta?.period}</span>
              </div>
            </div>
            <p className="horoscope-personalized-message" style={{ opacity: .6 }}>
              Previsão de hoje ainda não disponível. Confira mais tarde!
            </p>
          </div>
        )
      ) : !user ? (
        <div className="horoscope-manual-select">
          <p>Selecione seu signo para ver a previsão de hoje:</p>
          <div className="horoscope-manual-grid">
            {ZODIAC_SIGNS.map((s) => (
              <button
                key={s.name}
                className={`horoscope-manual-btn${selectedSign === s.name ? ' is-selected' : ''}`}
                onClick={() => setSelectedSign(s.name)}
                type="button"
              >
                <span className="horoscope-manual-symbol">{s.symbol}</span>
                <span className="horoscope-manual-name">{s.name}</span>
                <span className="horoscope-manual-period">{s.period}</span>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {activeSign && prediction && !userSign ? (
        <div className="horoscope-personalized" style={{ marginTop: 16 }}>
          <div className="horoscope-personalized-header">
            <span className="horoscope-personalized-emoji">{prediction.emoji || '🔮'}</span>
            <div>
              <p className="eyebrow">Previsão para {activeSign}</p>
              <h2>{activeSign}</h2>
              <span>{signMeta?.period}</span>
            </div>
          </div>
          <p className="horoscope-personalized-message">{prediction.message}</p>
          <div className="horoscope-personalized-grid">
            {prediction.love ? <div className="horoscope-personalized-item"><span className="horoscope-personalized-item-label">❤️ Amor</span><p>{prediction.love}</p></div> : null}
            {prediction.work ? <div className="horoscope-personalized-item"><span className="horoscope-personalized-item-label">💼 Trabalho</span><p>{prediction.work}</p></div> : null}
            {prediction.health ? <div className="horoscope-personalized-item"><span className="horoscope-personalized-item-label">🏃 Saúde</span><p>{prediction.health}</p></div> : null}
            {prediction.money ? <div className="horoscope-personalized-item"><span className="horoscope-personalized-item-label">💰 Dinheiro</span><p>{prediction.money}</p></div> : null}
          </div>
          <div className="horoscope-personalized-extras">
            {prediction.advice ? <span className="horoscope-personalized-extra">✨ Dica: {prediction.advice}</span> : null}
            {prediction.luckyNumber ? <span className="horoscope-personalized-extra">🔢 Número da sorte: {prediction.luckyNumber}</span> : null}
            {prediction.color ? <span className="horoscope-personalized-extra">🎨 Cor do dia: {prediction.color}</span> : null}
            {prediction.compatibility ? <span className="horoscope-personalized-extra">💕 Compatibilidade: {prediction.compatibility}</span> : null}
          </div>
        </div>
      ) : null}

      {loading ? (
        <div className="horoscope-loading">
          <p>Carregando horóscopo do dia...</p>
        </div>
      ) : null}

      <div className="horoscope-grid">
        {signs.map((sign) => (
          <Suspense fallback={null} key={sign.name}>
            <HoroscopeCard sign={sign} />
          </Suspense>
        ))}
      </div>
    </section>
  )
}
