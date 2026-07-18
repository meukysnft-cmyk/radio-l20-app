import { LiveIndicator } from './LiveIndicator'

type LiveSourceCardProps = {
  title: string
  platform: 'radio' | 'instagram' | 'youtube'
  isLive: boolean
  url: string
  statusMessage?: string
  onPlay?: () => void
}

const platformConfig = {
  radio: {
    icon: '📻',
    label: 'Rádio L20',
    actionLabel: 'Tocar rádio',
    openLabel: 'Ouvir ao vivo',
  },
  instagram: {
    icon: '📷',
    label: 'Instagram',
    actionLabel: 'Abrir Instagram',
    openLabel: 'Assistir live',
  },
  youtube: {
    icon: '▶️',
    label: 'YouTube',
    actionLabel: 'Abrir YouTube',
    openLabel: 'Assistir live',
  },
}

export function LiveSourceCard({ title, platform, isLive, url, statusMessage, onPlay }: LiveSourceCardProps) {
  const config = platformConfig[platform]

  const handleAction = () => {
    if (platform === 'radio' && onPlay) {
      onPlay()
    } else {
      window.open(url, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <div className={`live-source-card${isLive ? ' is-live' : ''}`}>
      <div className="live-source-header">
        <span className="live-source-icon" aria-hidden="true">{config.icon}</span>
        <LiveIndicator active={isLive} size="sm" />
      </div>
      <div className="live-source-body">
        <h3>{title || config.label}</h3>
        {statusMessage && <p className="live-source-status">{statusMessage}</p>}
      </div>
      <button
        className="live-source-action"
        type="button"
        onClick={handleAction}
        aria-label={isLive ? config.openLabel : config.actionLabel}
      >
        {isLive ? config.openLabel : config.actionLabel}
      </button>
    </div>
  )
}
