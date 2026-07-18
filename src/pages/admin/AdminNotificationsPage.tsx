import { type FormEvent, useEffect, useState } from 'react'
import { collection, addDoc, getDocs, query, where, orderBy, limit } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import '../../styles/admin.css'
import { ModulePage } from './cms/ModulePage'

type NotificationForm = {
  title: string
  body: string
  url: string
}

const emptyForm: NotificationForm = { title: '', body: '', url: '/' }

export function AdminNotificationsPage() {
  const [form, setForm] = useState<NotificationForm>(emptyForm)
  const [isSending, setIsSending] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [subscriberCount, setSubscriberCount] = useState<number | null>(null)
  const [recentNotifications, setRecentNotifications] = useState<Array<{ id: string; title: string; body: string; sentAt: unknown }>>([])

  useEffect(() => {
    void loadSubscriberCount()
    void loadRecentNotifications()
  }, [])

  async function loadSubscriberCount() {
    try {
      const tokensRef = collection(db, 'notificationTokens')
      const snap = await getDocs(query(tokensRef, where('active', '==', true)))
      setSubscriberCount(snap.size)
    } catch {
      setSubscriberCount(0)
    }
  }

  async function loadRecentNotifications() {
    try {
      const ref = collection(db, 'notifications')
      const snap = await getDocs(query(ref, orderBy('sentAt', 'desc'), limit(10)))
      setRecentNotifications(
        snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Array<{ id: string; title: string; body: string; sentAt: unknown }>,
      )
    } catch {
      // silent
    }
  }

  function updateForm<K extends keyof NotificationForm>(key: K, value: NotificationForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFeedback('')
    setErrorMessage('')

    if (!form.title.trim() || !form.body.trim()) {
      setErrorMessage('Informe título e mensagem da notificação.')
      return
    }

    setIsSending(true)

    try {
      await addDoc(collection(db, 'notifications'), {
        title: form.title.trim(),
        body: form.body.trim(),
        url: form.url.trim() || '/',
        sentAt: new Date(),
        sentBy: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      setFeedback('Notificação salva. Será enviada aos assinantes no próximo ciclo via Cloud Functions (ou manualmente).')
      setForm(emptyForm)
      void loadRecentNotifications()
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Falha ao salvar notificação.')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <ModulePage eyebrow="Sistema" title="Notificações Push" description="Envie notificações para os ouvintes que ativaram as notificações no app.">
      <div className="admin-notifications-layout">
        <form className="admin-logo-form" onSubmit={handleSubmit}>
          <div>
            <p className="eyebrow">Nova notificação</p>
            <h2>Compor mensagem</h2>
          </div>

          {subscriberCount !== null ? (
            <div className="admin-notification-subscribers">
              <strong>{subscriberCount}</strong>
              <span>ouvinte{subscriberCount !== 1 ? 's' : ''} assinado{subscriberCount !== 1 ? 's' : ''}</span>
            </div>
          ) : null}

          <label>
            Título
            <input
              onChange={(e) => updateForm('title', e.target.value)}
              placeholder="Ex: Programação de hoje"
              required
              value={form.title}
            />
          </label>

          <label>
            Mensagem
            <textarea
              onChange={(e) => updateForm('body', e.target.value)}
              placeholder="Ex: A Rádio L20 volta com programação ao vivo às 18h!"
              rows={4}
              required
              value={form.body}
            />
          </label>

          <label>
            Link (opcional)
            <input
              onChange={(e) => updateForm('url', e.target.value)}
              placeholder="/ (página inicial)"
              value={form.url}
            />
          </label>

          {errorMessage ? <p className="admin-feedback is-error">{errorMessage}</p> : null}
          {feedback ? <p className="admin-feedback is-success">{feedback}</p> : null}

          <div className="admin-hero-actions">
            <button className="advertise-primary admin-hero-action" disabled={isSending} type="submit">
              {isSending ? 'Salvando...' : 'Enviar notificação'}
            </button>
          </div>
        </form>

        <div className="admin-notifications-list" aria-live="polite">
          <div>
            <p className="eyebrow">Histórico</p>
            <h2>Notificações enviadas</h2>
          </div>

          {recentNotifications.length === 0 ? (
            <div className="admin-empty-state">
              <p className="eyebrow">Sem notificações</p>
              <h3>Nenhuma notificação enviada ainda</h3>
              <p>As notificações salvas aqui poderão ser processadas por Cloud Functions ou enviadas manualmente.</p>
            </div>
          ) : (
            <div className="admin-notifications-history">
              {recentNotifications.map((n) => (
                <article className="admin-notification-card" key={n.id}>
                  <h3>{n.title}</h3>
                  <p>{n.body}</p>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </ModulePage>
  )
}
