import { useEffect, useState } from 'react'
import { Logo } from './Logo'

export function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [isVisible, setIsVisible] = useState(true)
  const [isFadingOut, setIsFadingOut] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFadingOut(true)
      setTimeout(() => {
        setIsVisible(false)
        onComplete()
      }, 260)
    }, 950)

    return () => clearTimeout(timer)
  }, [onComplete])

  if (!isVisible) return null

  return (
    <div className={`splash-screen${isFadingOut ? ' is-fading-out' : ''}`} aria-hidden="true">
      <div className="splash-content">
        <div className="splash-logo-container">
          <Logo />
          <div className="splash-glow"></div>
        </div>
        <div className="splash-loader">
          <div className="splash-bar"></div>
          <div className="splash-bar"></div>
          <div className="splash-bar"></div>
        </div>
        <p className="splash-text">Rádio L20</p>
      </div>
    </div>
  )
}
