import { useEffect, useRef, useState } from 'react'

export type ScrollDirection = 'up' | 'down' | 'idle'

type ScrollState = {
  isVisible: boolean
  isAtTop: boolean
  scrollDirection: ScrollDirection
}

export function useScrollDirection(threshold = 10): ScrollState {
  const lastScrollY = useRef(0)
  const frameRef = useRef<number | null>(null)
  const [scrollState, setScrollState] = useState<ScrollState>({
    isVisible: true,
    isAtTop: true,
    scrollDirection: 'idle',
  })

  useEffect(() => {
    lastScrollY.current = window.scrollY

    function updateScrollState() {
      frameRef.current = null

      const currentScrollY = Math.max(window.scrollY, 0)
      const delta = currentScrollY - lastScrollY.current
      const isAtTop = currentScrollY <= threshold

      if (Math.abs(delta) < threshold && !isAtTop) {
        return
      }

      const scrollDirection: ScrollDirection = isAtTop ? 'idle' : delta > 0 ? 'down' : 'up'
      const isVisible = isAtTop || scrollDirection === 'up'

      lastScrollY.current = currentScrollY

      setScrollState((current) => {
        if (
          current.isVisible === isVisible &&
          current.isAtTop === isAtTop &&
          current.scrollDirection === scrollDirection
        ) {
          return current
        }

        return {
          isVisible,
          isAtTop,
          scrollDirection,
        }
      })
    }

    function handleScroll() {
      if (frameRef.current !== null) {
        return
      }

      frameRef.current = window.requestAnimationFrame(updateScrollState)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)

      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current)
      }
    }
  }, [threshold])

  return scrollState
}
