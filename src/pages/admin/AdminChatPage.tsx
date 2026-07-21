import { useEffect, useState } from 'react'
import { useAuth } from '../../context/useAuth'
import {
  subscribeMessages,
  type ChatMessage,
} from '../../services/chatService'
import {
  pinMessage,
  deleteAnyMessage,
  blockUser,
  unblockUser,
  subscribeBlockedUsers,
  type BlockedUser,
} from '../../services/chatAdminService'
import { ModulePage } from './cms/ModulePage'
import '../../styles/admin.css'

export function AdminChatPage() {
  const { user } = useAuth()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([])
  const [tab, setTab] = useState<'messages' | 'blocked'>('messages')
  const [filter, setFilter] = useState('')
  const [feedback, setFeedback] = useState('')

  useEffect(() => {
    const unsub = subscribeMessages(setMessages)
    return () => unsub()
  }, [])

  useEffect(() => {
    const unsub = subscribeBlockedUsers(setBlockedUsers)
    return () => unsub()
  }, [])

  function showFeedback(msg: string) {
    setFeedback(msg)
    setTimeout(() => setFeedback(''), 3000)
  }

  async function handlePin(msg: ChatMessage) {
    try {
      await pinMessage(msg.id, !msg.pinned)
      showFeedback(msg.pinned ? 'Mensagem desafixada.' : 'Mensagem fixada.')
    } catch {
      showFeedback('Erro ao alterar fixação.')
    }
  }

  async function handleDelete(msg: ChatMessage) {
    if (!window.confirm(`Excluir mensagem de "${msg.displayName}"?`)) return
    try {
      await deleteAnyMessage(msg.id)
      showFeedback('Mensagem excluída.')
    } catch {
      showFeedback('Erro ao excluir mensagem.')
    }
  }

  async function handleBlock(msg: ChatMessage) {
    if (!user) return
    if (!window.confirm(`Bloquear o usuário "${msg.displayName}"? Ele não poderá mais enviar mensagens.`)) return
    try {
      await blockUser(msg.uid, msg.displayName, user.uid)
      showFeedback(`"${msg.displayName}" bloqueado.`)
    } catch {
      showFeedback('Erro ao bloquear usuário.')
    }
  }

  async function handleUnblock(bu: BlockedUser) {
    if (!window.confirm(`Desbloquear "${bu.displayName || bu.uid}"?`)) return
    try {
      await unblockUser(bu.uid)
      showFeedback(`"${bu.displayName || bu.uid}" desbloqueado.`)
    } catch {
      showFeedback('Erro ao desbloquear.')
    }
  }

  function formatTime(createdAt: unknown): string {
    if (!createdAt || typeof createdAt !== 'object' || !('seconds' in createdAt)) return ''
    const date = new Date((createdAt as { seconds: number }).seconds * 1000)
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }

  const blockedUids = new Set(blockedUsers.map((b) => b.uid))

  const filteredMessages = messages.filter((m) => {
    if (!filter) return true
    const f = filter.toLowerCase()
    return (
      m.displayName.toLowerCase().includes(f) ||
      m.text.toLowerCase().includes(f)
    )
  })

  const pinnedMessages = filteredMessages.filter((m) => m.pinned)
  const normalMessages = filteredMessages.filter((m) => !m.pinned)

  return (
    <ModulePage
      eyebrow="Moderacao"
      title="Chat"
      description="Gerencie mensagens, fixe conteudo e bloqueie usuarios."
    >
      {feedback && (
        <div className="admin-feedback is-success" style={{ marginBottom: 14 }}>
          {feedback}
        </div>
      )}

      <div className="admin-chat-tabs">
        <button
          className={`admin-chat-tab${tab === 'messages' ? ' active' : ''}`}
          type="button"
          onClick={() => setTab('messages')}
        >
          Mensagens ({messages.length})
        </button>
        <button
          className={`admin-chat-tab${tab === 'blocked' ? ' active' : ''}`}
          type="button"
          onClick={() => setTab('blocked')}
        >
          Bloqueados ({blockedUsers.length})
        </button>
      </div>

      {tab === 'messages' && (
        <>
          <div className="admin-chat-filter">
            <input
              type="text"
              className="admin-chat-filter-input"
              placeholder="Buscar por nome ou texto..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>

          {pinnedMessages.length > 0 && (
            <div className="admin-chat-section">
              <h3 className="admin-chat-section-title">Fixadas</h3>
              {pinnedMessages.map((msg) => (
              <AdminChatCard
                key={msg.id}
                msg={msg}
                allMessages={messages}
                blocked={blockedUids.has(msg.uid)}
                formatTime={formatTime}
                onPin={handlePin}
                onDelete={handleDelete}
                onBlock={handleBlock}
              />
            ))}
          </div>
        )}

        <div className="admin-chat-section">
          {pinnedMessages.length > 0 && (
            <h3 className="admin-chat-section-title">Todas as Mensagens</h3>
          )}
          {normalMessages.length === 0 && pinnedMessages.length === 0 && (
            <div className="admin-chat-empty">
              {filter ? 'Nenhum resultado para essa busca.' : 'Nenhuma mensagem no chat ainda.'}
            </div>
          )}
          {normalMessages.map((msg) => (
            <AdminChatCard
              key={msg.id}
              msg={msg}
              allMessages={messages}
              blocked={blockedUids.has(msg.uid)}
              formatTime={formatTime}
              onPin={handlePin}
              onDelete={handleDelete}
              onBlock={handleBlock}
            />
            ))}
          </div>
        </>
      )}

      {tab === 'blocked' && (
        <div className="admin-chat-section">
          {blockedUsers.length === 0 ? (
            <div className="admin-chat-empty">Nenhum usuario bloqueado.</div>
          ) : (
            blockedUsers.map((bu) => (
              <div key={bu.uid} className="admin-blocked-card">
                <div className="admin-blocked-info">
                  <strong>{bu.displayName || 'Desconhecido'}</strong>
                  <span className="admin-blocked-uid">{bu.uid}</span>
                </div>
                <button
                  className="admin-btn admin-btn-sm admin-btn-danger"
                  type="button"
                  onClick={() => handleUnblock(bu)}
                >
                  Desbloquear
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </ModulePage>
  )
}

function AdminChatCard({
  msg,
  allMessages,
  blocked,
  formatTime,
  onPin,
  onDelete,
  onBlock,
}: {
  msg: ChatMessage
  allMessages: ChatMessage[]
  blocked: boolean
  formatTime: (v: unknown) => string
  onPin: (m: ChatMessage) => void
  onDelete: (m: ChatMessage) => void
  onBlock: (m: ChatMessage) => void
}) {
  const replyMsg = msg.replyTo ? allMessages.find((m) => m.id === msg.replyTo) : null

  return (
    <div className={`admin-chat-card${msg.pinned ? ' is-pinned' : ''}${blocked ? ' is-blocked' : ''}`}>
      <div className="admin-chat-card-header">
        <div className="admin-chat-card-user">
          {msg.photoURL ? (
            <img className="admin-chat-card-avatar" src={msg.photoURL} alt="" referrerPolicy="no-referrer" />
          ) : (
            <span className="admin-chat-card-avatar admin-chat-card-avatar-placeholder">
              {msg.displayName.charAt(0).toUpperCase()}
            </span>
          )}
          <div className="admin-chat-card-names">
            <span className="admin-chat-card-name">
              {msg.displayName}
              {msg.role === 'developer' && <span className="chat-dev-badge" style={{ marginLeft: 6 }}>DEV</span>}
              {msg.role === 'admin' && <span className="chat-admin-badge" style={{ marginLeft: 6 }}>ADMIN</span>}
            </span>
            <span className="admin-chat-card-meta">
              {msg.uid} &middot; {formatTime(msg.createdAt)}
              {blocked && <span className="admin-blocked-label"> BLOQUEADO</span>}
            </span>
          </div>
        </div>
        <div className="admin-chat-card-actions">
          <button
            className={`admin-btn admin-btn-sm${msg.pinned ? ' admin-btn-active' : ''}`}
            type="button"
            title={msg.pinned ? 'Desafixar' : 'Fixar'}
            onClick={() => onPin(msg)}
          >
            {msg.pinned ? '📌' : '📍'}
          </button>
          <button
            className="admin-btn admin-btn-sm admin-btn-danger"
            type="button"
            title="Excluir mensagem"
            onClick={() => onDelete(msg)}
          >
            🗑
          </button>
          {!blocked && (
            <button
              className="admin-btn admin-btn-sm admin-btn-warning"
              type="button"
              title="Bloquear usuario"
              onClick={() => onBlock(msg)}
            >
              🚫
            </button>
          )}
        </div>
      </div>
      {(replyMsg || msg.replyToName) && (
        <div className="chat-reply-ref" style={{ marginBottom: 4 }}>
          <span className="chat-reply-ref-name">{msg.replyToName || replyMsg?.displayName}</span>
          <span className="chat-reply-ref-text">{replyMsg?.text || '...'}</span>
        </div>
      )}
      <p className="admin-chat-card-text">{msg.text}</p>
    </div>
  )
}
