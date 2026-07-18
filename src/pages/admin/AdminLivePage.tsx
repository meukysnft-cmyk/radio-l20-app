import { type FormEvent, useEffect, useMemo, useState } from 'react'
import {
  createDocument,
  deleteDocument,
  subscribeDocuments,
  updateDocument,
  type FirestoreRecord,
} from '../../services/firestoreService'
import type { PlayerDocument } from '../../types/content'
import '../../styles/admin.css'
import { ModulePage } from './cms/ModulePage'

type PlayerFormState = {
  streamUrl: string
  statusMessage: string
  isLive: boolean
  youtubeLiveUrl: string
  youtubeIsLive: boolean
  instagramLiveUrl: string
  instagramIsLive: boolean
}

const emptyForm: PlayerFormState = {
  streamUrl: '',
  statusMessage: '',
  isLive: false,
  youtubeLiveUrl: '',
  youtubeIsLive: false,
  instagramLiveUrl: '',
  instagramIsLive: false,
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message
  return 'Falha inesperada ao acessar o Firebase.'
}

export function AdminLivePage() {
  const [items, setItems] = useState<Array<FirestoreRecord<PlayerDocument>>>([])
  const [form, setForm] = useState<PlayerFormState>(emptyForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const isEditing = Boolean(editingId)
  const latestItem = useMemo(() => items[0] ?? null, [items])

  useEffect(() => {
    const unsubscribe = subscribeDocuments<PlayerDocument>(
      'player',
      (docs) => {
        setItems(docs)
        setIsLoading(false)
      },
      (error) => {
        setErrorMessage(getErrorMessage(error))
        setIsLoading(false)
      },
    )
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    if (latestItem && !editingId) {
      setForm({
        streamUrl: latestItem.streamUrl || '',
        statusMessage: latestItem.statusMessage || '',
        isLive: latestItem.isLive || false,
        youtubeLiveUrl: latestItem.youtubeLiveUrl || '',
        youtubeIsLive: latestItem.youtubeIsLive || false,
        instagramLiveUrl: latestItem.instagramLiveUrl || '',
        instagramIsLive: latestItem.instagramIsLive || false,
      })
    }
  }, [editingId, latestItem])

  function updateForm<K extends keyof PlayerFormState>(key: K, value: PlayerFormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function resetForm() {
    setForm(emptyForm)
    setEditingId(null)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFeedback('')
    setErrorMessage('')
    setIsSaving(true)

    const payload: PlayerDocument = {
      streamUrl: form.streamUrl.trim(),
      statusMessage: form.statusMessage.trim(),
      isLive: form.isLive,
      youtubeLiveUrl: form.youtubeLiveUrl.trim(),
      youtubeIsLive: form.youtubeIsLive,
      instagramLiveUrl: form.instagramLiveUrl.trim(),
      instagramIsLive: form.instagramIsLive,
    }

    try {
      if (editingId) {
        await updateDocument('player', editingId, payload)
        setFeedback('Configuração ao vivo atualizada.')
      } else {
        await createDocument('player', payload)
        setFeedback('Configuração ao vivo criada.')
      }
      resetForm()
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    } finally {
      setIsSaving(false)
    }
  }

  function handleEdit(item: FirestoreRecord<PlayerDocument>) {
    setEditingId(item.id)
    setFeedback('')
    setErrorMessage('')
    setForm({
      streamUrl: item.streamUrl || '',
      statusMessage: item.statusMessage || '',
      isLive: item.isLive || false,
      youtubeLiveUrl: item.youtubeLiveUrl || '',
      youtubeIsLive: item.youtubeIsLive || false,
      instagramLiveUrl: item.instagramLiveUrl || '',
      instagramIsLive: item.instagramIsLive || false,
    })
  }

  async function handleDelete(item: FirestoreRecord<PlayerDocument>) {
    if (!window.confirm('Excluir esta configuração ao vivo?')) return
    setFeedback('')
    setErrorMessage('')
    try {
      await deleteDocument('player', item.id)
      setFeedback('Configuração excluída.')
      if (editingId === item.id) resetForm()
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    }
  }

  return (
    <ModulePage
      eyebrow="Sistema"
      title="Controle ao vivo"
      description="Gerencie o status de transmissão da rádio, YouTube e Instagram em tempo real."
    >
      <div className="admin-news-layout">
        <form className="admin-logo-form" onSubmit={handleSubmit}>
          <div>
            <p className="eyebrow">{isEditing ? 'Editando' : 'Status ao vivo'}</p>
            <h2>{isEditing ? 'Atualizar transmissão' : 'Configurar transmissão'}</h2>
          </div>

          {/* Rádio */}
          <fieldset className="admin-live-fieldset">
            <legend>📻 Rádio</legend>
            <label className="admin-toggle-row">
              <span>Rádio ao vivo</span>
              <input
                type="checkbox"
                checked={form.isLive}
                onChange={(e) => updateForm('isLive', e.target.checked)}
              />
            </label>
            <label>
              URL do stream
              <input
                inputMode="url"
                placeholder="https://stm4.conectastreaming.com:23844/stream"
                value={form.streamUrl}
                onChange={(e) => updateForm('streamUrl', e.target.value)}
              />
            </label>
          </fieldset>

          {/* YouTube */}
          <fieldset className="admin-live-fieldset">
            <legend>▶ YouTube</legend>
            <label className="admin-toggle-row">
              <span>YouTube ao vivo</span>
              <input
                type="checkbox"
                checked={form.youtubeIsLive}
                onChange={(e) => updateForm('youtubeIsLive', e.target.checked)}
              />
            </label>
            <label>
              URL ou ID do vídeo YouTube
              <input
                inputMode="url"
                placeholder="https://youtube.com/watch?v=... ou ID do vídeo"
                value={form.youtubeLiveUrl}
                onChange={(e) => updateForm('youtubeLiveUrl', e.target.value)}
              />
            </label>
          </fieldset>

          {/* Instagram */}
          <fieldset className="admin-live-fieldset">
            <legend>📷 Instagram</legend>
            <label className="admin-toggle-row">
              <span>Instagram ao vivo</span>
              <input
                type="checkbox"
                checked={form.instagramIsLive}
                onChange={(e) => updateForm('instagramIsLive', e.target.checked)}
              />
            </label>
            <label>
              URL da live no Instagram
              <input
                inputMode="url"
                placeholder="https://instagram.com/p/..."
                value={form.instagramLiveUrl}
                onChange={(e) => updateForm('instagramLiveUrl', e.target.value)}
              />
            </label>
          </fieldset>

          {/* Status */}
          <label>
            Mensagem de status
            <input
              placeholder="Ex: Estamos ao vivo!"
              value={form.statusMessage}
              onChange={(e) => updateForm('statusMessage', e.target.value)}
            />
          </label>

          {errorMessage && <p className="admin-feedback is-error">{errorMessage}</p>}
          {feedback && <p className="admin-feedback is-success">{feedback}</p>}

          <div className="admin-hero-actions">
            <button className="advertise-primary" disabled={isSaving} type="submit">
              {isSaving ? 'Salvando...' : isEditing ? 'Salvar edição' : 'Salvar'}
            </button>
            {isEditing && (
              <button className="advertise-secondary" type="button" onClick={resetForm}>
                Cancelar
              </button>
            )}
          </div>
        </form>

        {/* Lista de configs existentes */}
        <div className="admin-news-list" aria-live="polite">
          <div className="admin-news-list-header">
            <div>
              <p className="eyebrow">Coleção player</p>
              <h2>Configurações salvas</h2>
            </div>
          </div>

          {isLoading && <p className="admin-feedback">Carregando...</p>}

          {!isLoading && items.length === 0 && (
            <div className="admin-empty-state">
              <h3>Nenhuma configuração</h3>
              <p>Crie a primeira configuração de transmissão.</p>
            </div>
          )}

          {items.map((item) => (
            <article className="admin-news-card" key={item.id}>
              <div>
                <span>{item.isLive ? '🔴 AO VIVO' : '⚪ Offline'}</span>
                <h3>{item.statusMessage || 'Sem mensagem'}</h3>
                <p>
                  {item.youtubeIsLive ? '▶ YouTube ON' : '▶ YouTube OFF'} ·{' '}
                  {item.instagramIsLive ? '📷 Insta ON' : '📷 Insta OFF'}
                </p>
                <small>{item.streamUrl}</small>
              </div>
              <div className="admin-card-actions">
                <button type="button" onClick={() => handleEdit(item)}>Editar</button>
                <button type="button" onClick={() => void handleDelete(item)}>Excluir</button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </ModulePage>
  )
}
