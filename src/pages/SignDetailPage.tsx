import { useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ZODIAC_SIGNS, getSignSvg, ELEMENT_EMOJI } from '../utils/zodiac'
import { getSignBySlug, SIGN_PROFILES } from '../data/signProfiles'
import { radioRoutes } from '../config/radioLinks'

export function SignDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const profile = slug ? getSignBySlug(slug) : undefined

  const signIndex = useMemo(
    () => (slug ? SIGN_PROFILES.findIndex((s) => s.slug === slug) : -1),
    [slug],
  )

  const prevSign = signIndex > 0 ? SIGN_PROFILES[signIndex - 1] : null
  const nextSign = signIndex < SIGN_PROFILES.length - 1 ? SIGN_PROFILES[signIndex + 1] : null

  const signMeta = useMemo(
    () => ZODIAC_SIGNS.find((s) => s.name === profile?.name) ?? null,
    [profile],
  )

  if (!profile || !signMeta) {
    return (
      <section className="content-section page-section" style={{ textAlign: 'center', padding: '80px 24px' }}>
        <h1>Signo não encontrado</h1>
        <p style={{ color: 'var(--text-secondary)', margin: '12px 0 24px' }}>
          O signo que você procura não existe.
        </p>
        <Link to={radioRoutes.horoscope} className="btn btn-primary">Ver todos os signos</Link>
      </section>
    )
  }

  const signSvg = getSignSvg(profile.name)
  const compatSlugs = profile.compatibility.split(',').map((s) => s.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ''))
  const compatProfiles = SIGN_PROFILES.filter((s) => compatSlugs.some((cs) => s.slug.includes(cs) || cs.includes(s.slug)))

  return (
    <section className="sign-detail" aria-labelledby="sign-title">
      {/* Hero */}
      <div className="sign-hero">
        <div className="sign-hero-bg" />
        <div className="sign-hero-content">
          <Link to={radioRoutes.horoscope} className="sign-back">&larr; Voltar ao Horóscopo</Link>
          <div className="sign-hero-main">
            {signSvg ? <img className="sign-hero-icon" src={signSvg} alt={profile.name} width={120} height={120} /> : null}
            <div className="sign-hero-text">
              <p className="sign-hero-element">{ELEMENT_EMOJI[signMeta.element as keyof typeof ELEMENT_EMOJI]} {profile.element}</p>
              <h1 id="sign-title"><span className="sign-hero-symbol">{profile.symbol}</span> {profile.name}</h1>
              <p className="sign-hero-period">{profile.period}</p>
              <p className="sign-hero-summary">{profile.summary}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick facts */}
      <div className="sign-facts">
        {[
          { icon: '🪐', label: 'Planeta regente', value: profile.rulingPlanet },
          { icon: '📅', label: 'Dia da sorte', value: profile.luckyDay },
          { icon: '🔢', label: 'Número da sorte', value: profile.luckyNumber },
          { icon: '🎨', label: 'Cor', value: profile.color },
        ].map((f) => (
          <div className="sign-fact" key={f.label}>
            <span className="sign-fact-icon">{f.icon}</span>
            <span className="sign-fact-label">{f.label}</span>
            <span className="sign-fact-value">{f.value}</span>
          </div>
        ))}
      </div>

      {/* Personality */}
      <div className="sign-section">
        <h2>Personalidade</h2>
        <p>{profile.personality}</p>
        <div className="sign-strengths-weaknesses">
          <div className="sign-trait-card sign-strengths">
            <h3>✅ Pontos fortes</h3>
            <ul>{profile.strengths.map((s) => <li key={s}>{s}</li>)}</ul>
          </div>
          <div className="sign-trait-card sign-weaknesses">
            <h3>⚠️ Desafios</h3>
            <ul>{profile.weaknesses.map((w) => <li key={w}>{w}</li>)}</ul>
          </div>
        </div>
      </div>

      {/* Life areas */}
      <div className="sign-sections">
        {[
          { icon: '❤️', title: 'Amor', text: profile.love },
          { icon: '💼', title: 'Trabalho', text: profile.work },
          { icon: '🏃', title: 'Saúde', text: profile.health },
          { icon: '🤝', title: 'Amizade', text: profile.friendship },
        ].map((area) => (
          <div className="sign-section" key={area.title}>
            <h2>{area.icon} {area.title}</h2>
            <p>{area.text}</p>
          </div>
        ))}
      </div>

      {/* Compatible signs */}
      {compatProfiles.length > 0 ? (
        <div className="sign-section">
          <h2>Compatibilidade</h2>
          <p>Os signos mais compatíveis com <strong>{profile.name}</strong> são:</p>
          <div className="sign-compatible-grid">
            {compatProfiles.map((cp) => {
              const cpSvg = getSignSvg(cp.name)
              return (
                <Link to={`${radioRoutes.horoscope}/${cp.slug}`} className="sign-compatible-card" key={cp.slug}>
                  {cpSvg ? <img src={cpSvg} alt={cp.name} width={48} height={48} /> : null}
                  <div>
                    <strong>{cp.name}</strong>
                    <span>{cp.period}</span>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      ) : null}

      {/* Advice */}
      <div className="sign-section sign-advice">
        <h2>✨ Conselho para {profile.name}</h2>
        <blockquote>{profile.elementalAdvice}</blockquote>
      </div>

      {/* Navigation */}
      <div className="sign-nav">
        {prevSign ? (
          <Link to={`${radioRoutes.horoscope}/${prevSign.slug}`} className="sign-nav-btn">
            &larr; {prevSign.name}
          </Link>
        ) : <span />}
        {nextSign ? (
          <Link to={`${radioRoutes.horoscope}/${nextSign.slug}`} className="sign-nav-btn sign-nav-next">
            {nextSign.name} &rarr;
          </Link>
        ) : null}
      </div>
    </section>
  )
}
