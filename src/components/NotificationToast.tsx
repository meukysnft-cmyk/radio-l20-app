import { useEffect } from 'react'
import { useNotifications } from '../hooks/useNotifications'

export function NotificationToast() {
  const { lastMessage, dismissMessage } = useNotifications()

  useEffect(() => {
    if (!lastMessage) return
    const timer = setTimeout(dismissMessage, 8000)
    return () => clearTimeout(timer)
  }, [lastMessage, dismissMessage])

  if (!lastMessage) return null

  return (
    <div className="notification-toast" role="alert" aria-live="polite">
      <div className="notification-toast-content">
        <strong>{lastMessage.title}</strong>
        <p>{lastMessage.body}</p>
      </div>
      <button
        className="notification-toast-close"
        onClick={dismissMessage}
        aria-label="Fechar notificação"
        type="button"
      >
        &times;
      </button>
    </div>
  )
}
