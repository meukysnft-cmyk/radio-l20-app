import { useAudioPlayer } from '../context/useAudioPlayer'
import { siteContent } from '../data/siteContent'

export function LivePlayer({ compact = false }: { compact?: boolean }) {
  const content = siteContent
  const { isPlaying, isLoading, errorMessage, volume, isMuted, togglePlayback, setVolume, toggleMute } = useAudioPlayer()

  return (
    <aside
      className={`live-player${isPlaying ? ' is-playing' : ''}${isLoading ? ' is-loading' : ''}${compact ? ' is-compact' : ''}`}
      aria-label="Player da Rádio L20 ao vivo"
    >
      <div className="player-topline">
        <span className={`status-dot${isPlaying ? ' is-on' : ''}`} aria-hidden="true" />
        {isLoading
          ? content.radio.livePlayer.loadingStatus
          : isPlaying
            ? content.radio.livePlayer.playingStatus
            : content.radio.livePlayer.idleStatus}
      </div>

      <div className="player-main-row">
        <div className="station-lockup">
          <div className="station-badge station-badge-logo" aria-hidden="true">
            <img src="/Logo-fone.svg" alt="" />
          </div>
          <div className="station-info">
            <p className="station-name">{content.radio.name}</p>
            <strong className="station-status">{content.radio.livePlayer.stationStatus}</strong>
          </div>
        </div>

        <button
          className={`play-button${isPlaying ? ' is-playing' : ''}`}
          type="button"
          onClick={togglePlayback}
          aria-label={isPlaying ? 'Pausar Rádio L20 ao vivo' : 'Tocar Rádio L20 ao vivo'}
          aria-pressed={isPlaying}
        >
          <span aria-hidden="true" />
        </button>
      </div>

      <div className="player-controls">
        <div className={`audio-bars${isPlaying ? ' is-playing' : ''}`} aria-hidden="true">
          <span /><span /><span /><span /><span /><span /><span />
        </div>

        {!compact && (
          <div className="volume-control">
            <button
              className={`volume-button${isMuted ? ' is-muted' : ''}`}
              type="button"
              onClick={toggleMute}
              aria-label={isMuted ? 'Ativar som' : 'Silenciar'}
            >
              <span className="volume-icon" aria-hidden="true">
                {isMuted || volume === 0 ? '🔇' : volume < 0.5 ? '🔉' : '🔊'}
              </span>
            </button>
            <input
              className="volume-slider"
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              aria-label="Volume"
            />
          </div>
        )}
      </div>

      <p className={errorMessage ? 'player-note player-error' : 'player-note'}>
        {errorMessage ||
          (isLoading
            ? content.radio.livePlayer.loadingNote
            : isPlaying
              ? content.radio.livePlayer.playingNote
              : content.radio.livePlayer.idleNote)}
      </p>
    </aside>
  )
}
