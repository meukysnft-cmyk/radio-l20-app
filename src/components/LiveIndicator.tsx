export function LiveIndicator({ active, size = 'md' }: { active: boolean; size?: 'sm' | 'md' | 'lg' }) {
  return (
    <span className={`live-indicator${active ? ' is-active' : ''} live-indicator--${size}`} aria-label={active ? 'Ao vivo' : 'Offline'}>
      <span className="live-indicator-dot" aria-hidden="true" />
      <span className="live-indicator-text">{active ? 'AO VIVO' : 'OFF'}</span>
    </span>
  )
}
