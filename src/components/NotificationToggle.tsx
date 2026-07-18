import { useNotifications } from '../hooks/useNotifications'

export function NotificationToggle() {
  const { permission, isSupported, subscribe, unsubscribe } = useNotifications()

  if (!isSupported || permission === 'denied') return null

  if (permission === 'granted') {
    return (
      <button
        className="notification-toggle-button notification-toggle-active"
        onClick={unsubscribe}
        type="button"
        aria-label="Desativar notificações"
        title="Notificações ativas — clique para desativar"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      </button>
    )
  }

  return (
    <button
      className="notification-toggle-button"
      onClick={subscribe}
      type="button"
      aria-label="Ativar notificações"
      title="Receber notificações da Rádio L20"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </svg>
    </button>
  )
}
