import type { CSSProperties, ReactNode } from 'react'

type SkProps = {
  width?: CSSProperties['width']
  height?: CSSProperties['height']
  radius?: CSSProperties['borderRadius']
  style?: CSSProperties
  className?: string
}

export function Sk({ width, height, radius, style, className }: SkProps) {
  return (
    <span
      className={`sk ${className || ''}`}
      style={{ width, height, borderRadius: radius, ...style }}
      aria-hidden="true"
    />
  )
}

export function SkLine({ width = '100%', height = '1em', style }: SkProps) {
  return <Sk width={width} height={height} radius="var(--radius-sm)" style={style} />
}

export function SkCircle({ width: size = 40, style }: SkProps) {
  return <Sk width={size} height={size} radius="50%" style={style} />
}

export function SkCard({ children, style }: { children?: ReactNode; style?: CSSProperties }) {
  return (
    <div className="sk-card" style={style}>
      {children}
    </div>
  )
}

export function SkNewsCard() {
  return (
    <SkCard>
      <Sk width="100%" height="180px" radius="var(--radius-lg)" style={{ marginBottom: 12 }} />
      <SkLine width="40%" height="0.65rem" style={{ marginBottom: 8 }} />
      <SkLine width="90%" height="1.1rem" style={{ marginBottom: 6 }} />
      <SkLine width="70%" height="1.1rem" style={{ marginBottom: 10 }} />
      <SkLine width="100%" height="0.85rem" style={{ marginBottom: 4 }} />
      <SkLine width="85%" height="0.85rem" />
    </SkCard>
  )
}

export function SkFeaturedCard() {
  return (
    <SkCard style={{ gridColumn: '1 / -1' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, alignItems: 'start' }}>
        <Sk width="100%" height="260px" radius="var(--radius-lg)" />
        <div style={{ display: 'grid', gap: 10, paddingTop: 8 }}>
          <SkLine width="35%" height="0.65rem" />
          <SkLine width="100%" height="1.5rem" style={{ marginBottom: 4 }} />
          <SkLine width="80%" height="1.5rem" style={{ marginBottom: 12 }} />
          <SkLine width="100%" height="0.85rem" />
          <SkLine width="95%" height="0.85rem" />
          <SkLine width="60%" height="0.85rem" />
        </div>
      </div>
    </SkCard>
  )
}

export function SkProgramCard() {
  return (
    <SkCard>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <SkLine width="50%" height="0.7rem" />
        <Sk width="60px" height="22px" radius="var(--radius-pill)" />
      </div>
      <SkLine width="80%" height="1.1rem" style={{ marginBottom: 6 }} />
      <SkLine width="60%" height="0.85rem" />
    </SkCard>
  )
}

export function SkSportCard() {
  return (
    <SkCard>
      <SkLine width="35%" height="0.65rem" style={{ marginBottom: 8 }} />
      <SkLine width="75%" height="1.1rem" style={{ marginBottom: 10 }} />
      <SkLine width="100%" height="0.85rem" style={{ marginBottom: 4 }} />
      <SkLine width="90%" height="0.85rem" />
    </SkCard>
  )
}

export function SkProfileForm() {
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <SkCircle width={96} />
      </div>
      <div>
        <SkLine width="120px" height="0.75rem" style={{ marginBottom: 6 }} />
        <Sk width="100%" height="42px" radius="var(--radius-md)" />
      </div>
      <div>
        <SkLine width="80px" height="0.75rem" style={{ marginBottom: 6 }} />
        <Sk width="100%" height="80px" radius="var(--radius-md)" />
      </div>
      <div>
        <SkLine width="60px" height="0.75rem" style={{ marginBottom: 6 }} />
        <Sk width="100%" height="42px" radius="var(--radius-md)" />
      </div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {Array.from({ length: 6 }, (_, i) => (
          <Sk key={i} width={60 + (i % 3) * 20} height="32px" radius="var(--radius-pill)" />
        ))}
      </div>
      <Sk width="100%" height="46px" radius="var(--radius-md)" />
    </div>
  )
}

export function SkJobCard() {
  return (
    <SkCard>
      <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr', gap: 12, alignItems: 'start' }}>
        <Sk width="60px" height="60px" radius="var(--radius-md)" />
        <div style={{ display: 'grid', gap: 4 }}>
          <SkLine width="70%" height="1rem" />
          <SkLine width="40%" height="0.75rem" />
          <SkLine width="55%" height="0.75rem" />
        </div>
      </div>
      <SkLine width="100%" height="0.85rem" style={{ marginTop: 8 }} />
      <SkLine width="80%" height="0.85rem" />
    </SkCard>
  )
}

export function SkHoroscopeCard() {
  return (
    <SkCard>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <SkCircle width={44} />
        <div style={{ flex: 1, display: 'grid', gap: 4 }}>
          <SkLine width="60%" height="1rem" />
          <SkLine width="40%" height="0.7rem" />
        </div>
        <Sk width="24px" height="24px" radius="50%" />
      </div>
    </SkCard>
  )
}

export function SkRankingRow() {
  return (
    <SkCard>
      <div style={{ display: 'grid', gridTemplateColumns: '36px 60px 1fr auto', gap: 12, alignItems: 'center' }}>
        <SkCircle width={36} />
        <Sk width="60px" height="60px" radius="var(--radius-md)" />
        <div style={{ display: 'grid', gap: 4, minWidth: 0 }}>
          <SkLine width="70%" height="0.85rem" />
          <SkLine width="45%" height="0.7rem" />
        </div>
        <SkLine width="50px" height="0.75rem" />
      </div>
    </SkCard>
  )
}

export function SkPageHeader() {
  return (
    <div className="section-header">
      <SkLine width="60px" height="0.65rem" style={{ marginBottom: 6 }} />
      <SkLine width="200px" height="1.8rem" style={{ marginBottom: 6 }} />
      <SkLine width="280px" height="0.9rem" />
    </div>
  )
}

export function SkGrid({ count = 6, children }: { count?: number; children: () => ReactNode }) {
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      {Array.from({ length: count }, (_, i) => (
        <div key={i}>{children()}</div>
      ))}
    </div>
  )
}

export function SkNewsPageLayout() {
  return (
    <div className="news-layout">
      <SkFeaturedCard />
      <div className="news-list">
        <SkNewsCard />
        <SkNewsCard />
      </div>
    </div>
  )
}

export function SkHoroscopePage() {
  return (
    <>
      <SkCard style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Sk width="56px" height="56px" radius="50%" />
          <div style={{ flex: 1, display: 'grid', gap: 6 }}>
            <SkLine width="120px" height="0.7rem" />
            <SkLine width="160px" height="1.3rem" />
            <SkLine width="100px" height="0.75rem" />
          </div>
        </div>
        <SkLine width="100%" height="0.9rem" style={{ marginTop: 12 }} />
        <SkLine width="90%" height="0.9rem" style={{ marginTop: 4 }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 12 }}>
          <Sk width="100%" height="60px" radius="var(--radius-md)" />
          <Sk width="100%" height="60px" radius="var(--radius-md)" />
          <Sk width="100%" height="60px" radius="var(--radius-md)" />
          <Sk width="100%" height="60px" radius="var(--radius-md)" />
        </div>
      </SkCard>
      <div className="horoscope-grid">
        {Array.from({ length: 12 }, (_, i) => (
          <SkHoroscopeCard key={i} />
        ))}
      </div>
    </>
  )
}

export function SkRankingPage() {
  return (
    <>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {Array.from({ length: 4 }, (_, i) => (
          <Sk key={i} width={80 + i * 10} height="34px" radius="var(--radius-pill)" />
        ))}
      </div>
      <div style={{ display: 'grid', gap: 12 }}>
        {Array.from({ length: 8 }, (_, i) => (
          <SkRankingRow key={i} />
        ))}
      </div>
    </>
  )
}
