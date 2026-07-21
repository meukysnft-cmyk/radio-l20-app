import { useEffect, useRef, useState } from 'react'
import { siteContent } from '../data/siteContent'

function playEntrySound() {
  try {
    const ctx = new AudioContext()
    const now = ctx.currentTime

    const osc1 = ctx.createOscillator()
    const osc2 = ctx.createOscillator()
    const gain = ctx.createGain()
    const filter = ctx.createBiquadFilter()

    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(2000, now)
    filter.frequency.exponentialRampToValueAtTime(400, now + 1.2)

    osc1.type = 'sine'
    osc1.frequency.setValueAtTime(523, now)
    osc1.frequency.exponentialRampToValueAtTime(392, now + 0.8)

    osc2.type = 'sine'
    osc2.frequency.setValueAtTime(659, now + 0.05)
    osc2.frequency.exponentialRampToValueAtTime(440, now + 0.9)

    gain.gain.setValueAtTime(0, now)
    gain.gain.linearRampToValueAtTime(0.18, now + 0.06)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.4)

    osc1.connect(filter)
    osc2.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)

    osc1.start(now)
    osc2.start(now + 0.05)
    osc1.stop(now + 1.5)
    osc2.stop(now + 1.5)
  } catch { /* ignore audio errors */ }
}

export function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<'enter' | 'hold' | 'exit'>('enter')
  const completed = useRef(false)

  const name = siteContent.radio.name

  useEffect(() => {
    playEntrySound()

    const holdTimer = setTimeout(() => setPhase('hold'), 600)
    const exitTimer = setTimeout(() => setPhase('exit'), 1600)
    const doneTimer = setTimeout(() => {
      if (!completed.current) {
        completed.current = true
        onComplete()
      }
    }, 2200)

    return () => {
      clearTimeout(holdTimer)
      clearTimeout(exitTimer)
      clearTimeout(doneTimer)
    }
  }, [onComplete])

  if (phase === 'exit' && completed.current) return null

  return (
    <div className={`splash-screen splash-phase-${phase}`} aria-hidden="true">
      <div className="splash-bg-orb splash-bg-orb-1" />
      <div className="splash-bg-orb splash-bg-orb-2" />
      <div className="splash-bg-orb splash-bg-orb-3" />

      <div className="splash-center">
        <div className="splash-logo-ring">
          <svg className="splash-ring-svg" viewBox="0 0 200 200">
            <circle className="splash-ring-track" cx="100" cy="100" r="90" />
            <circle className="splash-ring-progress" cx="100" cy="100" r="90" />
          </svg>
          <div className="splash-logo-inner">
            <img src="/logo-oficial.svg" alt="" className="splash-logo-img" />
          </div>
        </div>

        <div className="splash-text-group">
          <h1 className="splash-title">{name}</h1>
          <div className="splash-divider" />
          <p className="splash-subtitle">Pilar, Alagoas</p>
        </div>

        <div className="splash-wave">
          <span /><span /><span /><span /><span />
        </div>
      </div>
    </div>
  )
}
