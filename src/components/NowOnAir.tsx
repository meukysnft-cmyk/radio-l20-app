import type { PlayerDocument, ProgramDocument } from '../types/content'
import { LiveIndicator } from './LiveIndicator'

const categoryIcons: Record<string, string> = {
  esporte: '⚽',
  musica: '🎵',
  noticia: '📰',
  entretenimento: '🎤',
  religioso: '✝️',
  humor: '😄',
  infantil: '👶',
  entrevista: '🎙️',
}

type NowOnAirProps = {
  program: ProgramDocument | null
  player?: PlayerDocument | null
}

export function NowOnAir({ program, player }: NowOnAirProps) {
  const youtubeLive = player?.youtubeIsLive && !!player?.youtubeLiveUrl
  const instagramLive = player?.instagramIsLive && !!player?.instagramLiveUrl

  return (
    <div className="now-on-air">
      <div className="now-on-air-header">
        <span className="now-on-air-label">Programa Atual</span>
        <LiveIndicator active={!!program?.isOnAir || !!youtubeLive || !!instagramLive} size="sm" />
      </div>

      {(youtubeLive || instagramLive) && (
        <div className="now-on-air-card" style={{ borderColor: 'rgba(239,68,68,.3)', background: 'rgba(239,68,68,.06)' }}>
          <span className="now-on-air-icon" aria-hidden="true">
            {youtubeLive ? '▶️' : '📷'}
          </span>
          <div className="now-on-air-info">
            <h3>Transmissão ao vivo no {youtubeLive ? 'YouTube' : 'Instagram'}</h3>
            <div className="now-on-air-meta">
              {youtubeLive && player?.youtubeLiveUrl && (
                <a
                  href={player.youtubeLiveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="now-on-air-time"
                  style={{ color: 'var(--accent)', textDecoration: 'underline' }}
                >
                  Abrir live
                </a>
              )}
              {instagramLive && player?.instagramLiveUrl && (
                <a
                  href={player.instagramLiveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="now-on-air-time"
                  style={{ color: 'var(--accent)', textDecoration: 'underline' }}
                >
                  Abrir live
                </a>
              )}
            </div>
            {player?.statusMessage && <p className="now-on-air-desc">{player.statusMessage}</p>}
          </div>
        </div>
      )}

      {program && (
        <div className="now-on-air-card">
          <span className="now-on-air-icon" aria-hidden="true">{categoryIcons[program.category.toLowerCase()] || '🎙️'}</span>
          <div className="now-on-air-info">
            <h3>{program.name}</h3>
            <div className="now-on-air-meta">
              {program.time && <span className="now-on-air-time">{program.time}</span>}
              {program.days && <span className="now-on-air-days">{program.days}</span>}
              {program.category && <span className="now-on-air-category">{program.category}</span>}
            </div>
            {program.description && <p className="now-on-air-desc">{program.description}</p>}
          </div>
        </div>
      )}

      {!program && !youtubeLive && !instagramLive && (
        <div className="now-on-air-empty">
          <span className="now-on-air-empty-icon" aria-hidden="true">📻</span>
          <p>Programação regular — nenhum programa ao vivo no momento.</p>
        </div>
      )}
    </div>
  )
}
