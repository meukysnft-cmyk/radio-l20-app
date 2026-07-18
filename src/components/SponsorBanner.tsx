import { useContext, useMemo } from 'react'
import { SponsorsContext } from '../context/sponsorsState'
import { radioRoutes } from '../config/radioLinks'
import type { SponsorDocument } from '../types/content'

export function SponsorBanner({ className }: { className?: string }) {
  const { sponsors } = useContext(SponsorsContext)

  const items = useMemo(() => {
    if (sponsors.length === 0) return []
    const seen = new Set<string>()
    const unique: Array<SponsorDocument & { id: string }> = []
    for (const s of sponsors) {
      const key = `${s.name}-${s.bannerFile || s.logoFile || ''}`
      if (seen.has(key)) continue
      seen.add(key)
      unique.push(s)
    }
    return unique
  }, [sponsors])

  if (items.length === 0) return null

  const doubled = [...items, ...items]

  return (
    <div className={`sponsor-strip${className ? ` ${className}` : ''}`} aria-label="Patrocinadores">
      <div className="sponsor-track">
        {doubled.map((item, i) => (
          <a
            className="sponsor-strip-item"
            href={item.linkUrl || radioRoutes.sponsors}
            target="_blank"
            rel="noopener noreferrer"
            key={`${item.id}-${i}`}
            title={item.name}
          >
            {item.bannerFile ? (
              <img src={`/${item.bannerFile}`} alt={item.name} loading="lazy" />
            ) : item.logoFile ? (
              <img src={`/${item.logoFile}`} alt={item.name} loading="lazy" />
            ) : (
              <span>{item.name.slice(0, 2).toUpperCase()}</span>
            )}
          </a>
        ))}
      </div>
    </div>
  )
}
