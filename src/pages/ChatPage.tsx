import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { FaUserCog, FaReply } from 'react-icons/fa'
import { useAuth } from '../context/useAuth'
import { radioRoutes } from '../config/radioLinks'
import {
  subscribeMessages,
  sendMessage,
  deleteMessage,
  type ChatMessage,
} from '../services/chatService'

const CHAT_NAME_KEY = 'radio-l20-chat-name'

export function ChatPage() {
  const { user } = useAuth()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [rateLimited, setRateLimited] = useState(false)
  const [error, setError] = useState('')
  const [showSettings, setShowSettings] = useState(false)
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null)
  const [chatName, setChatName] = useState(() => {
    try { return localStorage.getItem(CHAT_NAME_KEY) || '' } catch { return '' }
  })
  const [nameInput, setNameInput] = useState(chatName)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const unsub = subscribeMessages(setMessages, () => {
      setError('Erro ao carregar mensagens.')
    })
    return () => unsub()
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const saveName = useCallback(() => {
    const trimmed = nameInput.trim()
    setChatName(trimmed)
    try { localStorage.setItem(CHAT_NAME_KEY, trimmed) } catch { /* */ }
    setShowSettings(false)
  }, [nameInput])

  const cancelReply = useCallback(() => setReplyingTo(null), [])

  if (!user) {
    return (
      <div className="page-section chat-page">
        <div className="page-hero">
          <div className="page-hero-copy">
            <p className="eyebrow">Bate-papo</p>
            <h1>Chat da Rádio L20</h1>
            <p>Entre na conversa com a comunidade.</p>
          </div>
        </div>
        <div className="chat-login-required">
          <p>Você precisa estar logado para participar do chat.</p>
          <Link className="section-link" to={radioRoutes.register}>
            Fazer cadastro ou login
          </Link>
        </div>
      </div>
    )
  }

  async function handleSend() {
    if (!input.trim() || sending || !user) return

    setSending(true)
    setError('')

    const result = await sendMessage(
      user,
      input,
      chatName || undefined,
      replyingTo?.id,
      replyingTo?.displayName,
    )

    if (result === 'rate-limited') {
      setRateLimited(true)
      setTimeout(() => setRateLimited(false), 3000)
    } else if (result === 'blocked') {
      setError('Voce foi bloqueado e nao pode enviar mensagens.')
    }

    if (result !== 'blocked') {
      setInput('')
      setReplyingTo(null)
    }
    setSending(false)
    inputRef.current?.focus()
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
    if (e.key === 'Escape' && replyingTo) {
      cancelReply()
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Excluir esta mensagem?')) return
    try {
      await deleteMessage(id)
    } catch {
      setError('Erro ao excluir mensagem.')
    }
  }

  function handleReply(msg: ChatMessage) {
    setReplyingTo(msg)
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  function formatTime(createdAt: unknown): string {
    if (!createdAt || typeof createdAt !== 'object' || !('seconds' in createdAt)) return ''
    const date = new Date((createdAt as { seconds: number }).seconds * 1000)
    return new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }

  function getBadgeLabel(role?: string): string | null {
    if (role === 'developer') return 'DEV'
    if (role === 'admin') return 'ADMIN'
    return null
  }

  function getBadgeClass(role?: string): string {
    if (role === 'developer') return 'chat-dev-badge'
    if (role === 'admin') return 'chat-admin-badge'
    return ''
  }

  return (
    <div className="page-section chat-page">
      <div className="page-hero">
        <div className="page-hero-copy">
          <p className="eyebrow">Bate-papo</p>
          <h1>Chat da Rádio L20</h1>
          <p>Converse em tempo real com a comunidade.</p>
        </div>
      </div>

      <div className="chat-container">
        <div className="chat-messages-header">
          <span className="chat-messages-count">{messages.length} mensagem{messages.length !== 1 ? 'ns' : ''}</span>
          <button
            className={`chat-settings-toggle${showSettings ? ' active' : ''}`}
            type="button"
            onClick={() => setShowSettings(!showSettings)}
            aria-label="Configurações do chat"
          >
            <FaUserCog /> Configurações
          </button>
        </div>

        {showSettings && (
          <div className="chat-page-settings">
            <label className="chat-settings-label">
              Seu nome no chat:
              <input
                className="chat-settings-input"
                type="text"
                maxLength={30}
                placeholder={user.displayName || 'Usuário'}
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') saveName() }}
              />
            </label>
            <p className="chat-settings-hint">
              {chatName ? `Seu nome atual: ${chatName}` : `Usando nome padrão: ${user.displayName || 'Usuário'}`}
            </p>
            <button className="chat-settings-save" type="button" onClick={saveName}>
              Salvar
            </button>
          </div>
        )}

        <div className="chat-messages">
          {messages.length === 0 && (
            <div className="chat-empty">
              <p>Nenhuma mensagem ainda. Seja o primeiro a falar!</p>
            </div>
          )}
          {messages.map((msg) => {
            const isOwn = msg.uid === user.uid
            const badge = getBadgeLabel(msg.role)
            const badgeClass = getBadgeClass(msg.role)
            const replyMsg = msg.replyTo ? messages.find((m) => m.id === msg.replyTo) : null
            return (
              <div
                key={msg.id}
                className={`chat-bubble${isOwn ? ' is-own' : ''}`}
              >
                {msg.photoURL ? (
                  <img
                    className="chat-avatar"
                    src={msg.photoURL}
                    alt=""
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span className="chat-avatar chat-avatar-placeholder" aria-hidden="true">
                    {msg.displayName.charAt(0).toUpperCase()}
                  </span>
                )}
                <div className="chat-bubble-body">
                  <div className="chat-bubble-meta">
                    <strong className={`chat-bubble-name${badge ? ' is-highlighted' : ''}`}>{msg.displayName}</strong>
                    {badge && <span className={badgeClass}>{badge}</span>}
                    <span className="chat-bubble-time">{formatTime(msg.createdAt)}</span>
                  </div>
                  {(replyMsg || msg.replyToName) && (
                    <div className="chat-reply-ref">
                      <span className="chat-reply-ref-name">{msg.replyToName || replyMsg?.displayName}</span>
                      <span className="chat-reply-ref-text">{replyMsg?.text || '...'}</span>
                    </div>
                  )}
                  <p className="chat-bubble-text">{msg.text}</p>
                </div>
                <div className="chat-bubble-actions">
                  <button className="chat-reply-btn" type="button" onClick={() => handleReply(msg)} aria-label="Responder">
                    <FaReply />
                  </button>
                  {isOwn && (
                    <button
                      className="chat-delete-btn"
                      type="button"
                      onClick={() => handleDelete(msg.id)}
                      aria-label="Excluir mensagem"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            )
          })}
          <div ref={bottomRef} />
        </div>

        {replyingTo && (
          <div className="chat-reply-preview">
            <div className="chat-reply-preview-info">
              <FaReply />
              <span>Respondendo a <strong>{replyingTo.displayName}</strong></span>
            </div>
            <span className="chat-reply-preview-text">{replyingTo.text}</span>
            <button className="chat-reply-cancel" type="button" onClick={cancelReply} aria-label="Cancelar resposta">
              ✕
            </button>
          </div>
        )}

        <form className="chat-input-row" onSubmit={(e) => { e.preventDefault(); handleSend() }}>
          <textarea
            ref={inputRef}
            className="chat-input"
            rows={1}
            maxLength={500}
            placeholder={replyingTo ? `Respondendo a ${replyingTo.displayName}...` : 'Digite sua mensagem...'}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={sending}
          />
          <button
            className="chat-send-btn"
            type="submit"
            disabled={sending || !input.trim()}
            aria-label="Enviar mensagem"
          >
            {sending ? '...' : '➤'}
          </button>
        </form>

        {rateLimited && (
          <p className="chat-error">Aguarde alguns segundos antes de enviar outra mensagem.</p>
        )}
        {error && <p className="chat-error">{error}</p>}
      </div>
    </div>
  )
}
