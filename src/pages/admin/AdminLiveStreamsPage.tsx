import { type FormEvent, useEffect, useMemo, useState } from 'react'
import {
  createDocument,
  deleteDocument,
  subscribeDocuments,
  updateDocument,
  type FirestoreRecord,
} from '../../services/firestoreService'
import type { LiveStreamDocument } from '../../types/content'
import '../../styles/admin.css'
import { ModulePage } from './cms/ModulePage'
import { radioPrograms } from '../../data/programsContent'

type LiveStreamFormState = {
  programSlug: string
  programName: string
  platform: 'youtube' | 'instagram'
  title: string
  scheduledDate: string
  scheduledTime: string
  coverImageUrl: string
  thumbnailUrl: string
}

const emptyForm: LiveStreamFormState = {
  programSlug: '',
  programName: '',
  platform: 'youtube',
  title: '',
  scheduledDate: '',
  scheduledTime: '',
  coverImageUrl: '',
  thumbnailUrl: '',
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message
  return 'Falha inesperada ao acessar o Firebase.'
}

const statusLabels: Record<LiveStreamDocument['status'], string> = {
  scheduled: 'Agendada',
  live: 'Ao vivo',
  ended: 'Encerrada',
  archived: 'Arquivada',
}

function formatDate(dateStr: string, timeStr: string): string {
  if (!dateStr) return ''
  try {
    const d = new Date(`${dateStr}T${timeStr || '12:00'}`)
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  } catch {
    return dateStr
  }
}

export function AdminLiveStreamsPage() {
  const [items, setItems] = useState<Array<FirestoreRecord<LiveStreamDocument>>>([])
  const [form, setForm] = useState<LiveStreamFormState>(emptyForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [startUrlMap, setStartUrlMap] = useState<Record<string, string>>({})

  const isEditing = Boolean(editingId)

  const orderedItems = useMemo(
    () =>
      [...items].sort((a, b) => {
        const order: Record<string, number> = { live: 0, scheduled: 1, ended: 2, archived: 3 }
        const aOrder = order[a.status] ?? 4
        const bOrder = order[b.status] ?? 4
        if (aOrder !== bOrder) return aOrder - bOrder
        return (a.scheduledDate || '').localeCompare(b.scheduledDate || '')
      }),
    [items],
  )

  const activeStreams = useMemo(() => items.filter((i) => i.status === 'live'), [items])

  useEffect(() => {
    const unsubscribe = subscribeDocuments<LiveStreamDocument>(
      'liveStreams',
      (documents) => {
        setItems(documents)
        setIsLoading(false)
      },
      (error) => {
        setErrorMessage(getErrorMessage(error))
        setIsLoading(false)
      },
    )
    return () => unsubscribe()
  }, [])

  function updateForm<K extends keyof LiveStreamFormState>(key: K, value: LiveStreamFormState[K]) {
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

    const payload: Omit<LiveStreamDocument, 'id' | 'createdAt' | 'updatedAt'> = {
      programSlug: form.programSlug.trim(),
      programName: form.programName.trim(),
      platform: form.platform,
      url: '',
      title: form.title.trim(),
      scheduledDate: form.scheduledDate.trim(),
      scheduledTime: form.scheduledTime.trim(),
      status: 'scheduled',
      coverImageUrl: form.coverImageUrl.trim(),
      thumbnailUrl: form.thumbnailUrl.trim(),
    }

    if (!payload.title || !payload.programSlug) {
      setErrorMessage('Preencha o título e selecione o programa.')
      setIsSaving(false)
      return
    }

    try {
      if (editingId) {
        await updateDocument('liveStreams', editingId, payload)
        setFeedback('Live stream atualizada no Firestore.')
      } else {
        await createDocument('liveStreams', payload)
        setFeedback('Live stream agendada no Firestore.')
      }
      resetForm()
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    } finally {
      setIsSaving(false)
    }
  }

  function handleEdit(item: FirestoreRecord<LiveStreamDocument>) {
    setEditingId(item.id)
    setFeedback('')
    setErrorMessage('')
    setForm({
      programSlug: item.programSlug || '',
      programName: item.programName || '',
      platform: item.platform || 'youtube',
      title: item.title || '',
      scheduledDate: item.scheduledDate || '',
      scheduledTime: item.scheduledTime || '',
      coverImageUrl: item.coverImageUrl || '',
      thumbnailUrl: item.thumbnailUrl || '',
    })
  }

  async function handleStartLive(item: FirestoreRecord<LiveStreamDocument>) {
    const url = (startUrlMap[item.id] || '').trim()
    if (!url) {
      setErrorMessage('Cole o link da live antes de iniciar.')
      return
    }
    setFeedback('')
    setErrorMessage('')
    try {
      await updateDocument('liveStreams', item.id, {
        status: 'live' as LiveStreamDocument['status'],
        url,
        startedAt: new Date().toISOString(),
      })
      setFeedback(`"${item.title}" está AO VIVO!`)
      setStartUrlMap((prev) => {
        const next = { ...prev }
        delete next[item.id]
        return next
      })
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    }
  }

  async function handleEndLive(item: FirestoreRecord<LiveStreamDocument>) {
    if (!window.confirm(`Encerrar a transmissão de "${item.title}"?`)) return
    setFeedback('')
    setErrorMessage('')
    try {
      await updateDocument('liveStreams', item.id, {
        status: 'ended' as LiveStreamDocument['status'],
        endedAt: new Date().toISOString(),
      })
      setFeedback(`Transmissão de "${item.title}" encerrada.`)
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    }
  }

  async function handleDelete(item: FirestoreRecord<LiveStreamDocument>) {
    if (!window.confirm(`Excluir a live "${item.title}"?`)) return
    setFeedback('')
    setErrorMessage('')
    try {
      await deleteDocument('liveStreams', item.id)
      setFeedback('Live stream excluída do Firestore.')
      if (editingId === item.id) resetForm()
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    }
  }

  async function handleArchive(item: FirestoreRecord<LiveStreamDocument>) {
    setFeedback('')
    setErrorMessage('')
    try {
      await updateDocument('liveStreams', item.id, { status: 'archived' as LiveStreamDocument['status'] })
      setFeedback(`"${item.title}" arquivada.`)
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    }
  }

  return (
    <ModulePage
      eyebrow="Conteúdo"
      title="Live Streams"
      description="Agestre lives para seus programas. Crie a publicação primeiro, depois insira o link e inicie quando estiver ao vivo."
    >
      {activeStreams.length > 0 && (
        <div className="admin-feedback" style={{ borderColor: 'rgba(255,80,80,.3)', background: 'rgba(255,50,50,.08)' }}>
          🔴 <strong>{activeStreams.length}</strong> live{activeStreams.length > 1 ? 's' : ''} ativa{activeStreams.length > 1 ? 's' : ''} no momento
        </div>
      )}

      <div className="admin-news-layout">
        <form className="admin-logo-form" onSubmit={handleSubmit}>
          <div>
            <p className="eyebrow">{isEditing ? 'Editando' : 'Nova live stream'}</p>
            <h2>{isEditing ? 'Atualizar live stream' : 'Agendar live stream'}</h2>
          </div>

          <label>
            Programa
            <select
              value={form.programSlug}
              onChange={(e) => {
                const slug = e.target.value
                const program = radioPrograms.find((p) => p.slug === slug)
                updateForm('programSlug', slug)
                updateForm('programName', program?.name || '')
              }}
              required
            >
              <option value="">Selecione um programa</option>
              {radioPrograms.map((p) => (
                <option key={p.slug} value={p.slug}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Título da live
            <input
              value={form.title}
              onChange={(e) => updateForm('title', e.target.value)}
              placeholder="Ex.: Esporte Conectado — Jogo ao vivo"
              required
            />
          </label>

          <label>
            Plataforma
            <select value={form.platform} onChange={(e) => updateForm('platform', e.target.value as 'youtube' | 'instagram')}>
              <option value="youtube">YouTube</option>
              <option value="instagram">Instagram</option>
            </select>
          </label>

          <div className="admin-form-grid">
            <label>
              Data
              <input type="date" value={form.scheduledDate} onChange={(e) => updateForm('scheduledDate', e.target.value)} />
            </label>
            <label>
              Horário
              <input type="time" value={form.scheduledTime} onChange={(e) => updateForm('scheduledTime', e.target.value)} />
            </label>
          </div>

          <label>
            Imagem de capa
            <input
              inputMode="url"
              value={form.coverImageUrl}
              onChange={(e) => updateForm('coverImageUrl', e.target.value)}
              placeholder="https://.../capa.jpg"
            />
          </label>

          <label>
            Thumbnail YouTube
            <input
              inputMode="url"
              value={form.thumbnailUrl}
              onChange={(e) => updateForm('thumbnailUrl', e.target.value)}
              placeholder="https://img.youtube.com/vi/ID/maxresdefault.jpg"
            />
          </label>

          {errorMessage && <p className="admin-feedback is-error">{errorMessage}</p>}
          {feedback && <p className="admin-feedback is-success">{feedback}</p>}

          <div className="admin-hero-actions">
            <button className="advertise-primary" disabled={isSaving} type="submit">
              {isSaving ? 'Salvando...' : isEditing ? 'Salvar edição' : 'Agendar live stream'}
            </button>
            {isEditing && (
              <button className="advertise-secondary" type="button" onClick={resetForm}>
                Cancelar edição
              </button>
            )}
          </div>
        </form>

        <div className="admin-news-list" aria-live="polite">
          <div className="admin-news-list-header">
            <div>
              <p className="eyebrow">Coleção liveStreams</p>
              <h2>Live streams cadastradas</h2>
            </div>
          </div>

          {isLoading && <p className="admin-feedback">Carregando live streams do Firestore...</p>}

          {!isLoading && orderedItems.length === 0 && (
            <div className="admin-empty-state">
              <p className="eyebrow">Estado vazio</p>
              <h3>Nenhuma live stream encontrada</h3>
              <p>Agende a primeira live stream para seu programa.</p>
            </div>
          )}

          {orderedItems.map((item) => (
            <article className="admin-news-card" key={item.id}>
              <div>
                <span>{item.platform === 'youtube' ? '▶ YouTube' : '📷 Instagram'} • {statusLabels[item.status]}</span>
                <h3>{item.title}</h3>
                <p>{item.programName || 'Sem programa vinculado'}</p>
                {item.scheduledDate && <small>{formatDate(item.scheduledDate, item.scheduledTime)}</small>}
                {item.url && <small style={{ wordBreak: 'break-all' }}>{item.url}</small>}
              </div>

              <div className="admin-card-actions">
                {item.status === 'scheduled' && (
                  <>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center', width: '100%', flexWrap: 'wrap' }}>
                      <input
                        type="url"
                        placeholder={item.platform === 'youtube' ? 'Link do YouTube...' : 'Link do Instagram...'}
                        value={startUrlMap[item.id] || ''}
                        onChange={(e) => setStartUrlMap((prev) => ({ ...prev, [item.id]: e.target.value }))}
                        style={{ flex: '1 1 200px', minWidth: 0, padding: '7px 10px', border: '1px solid var(--line)', borderRadius: 8, background: 'rgba(5,7,10,.32)', color: 'var(--text)', fontSize: '.82rem' }}
                      />
                      <button type="button" className="cms-btn-start-live" onClick={() => void handleStartLive(item)}>
                        🔴 Iniciar
                      </button>
                    </div>
                  </>
                )}
                {item.status === 'live' && (
                  <button type="button" className="cms-btn-end-live" onClick={() => void handleEndLive(item)}>
                    ⏹ Encerrar
                  </button>
                )}
                {item.status === 'ended' && (
                  <button type="button" onClick={() => void handleArchive(item)}>
                    📦 Arquivar
                  </button>
                )}
                <button type="button" onClick={() => handleEdit(item)}>
                  Editar
                </button>
                <button type="button" onClick={() => void handleDelete(item)}>
                  Excluir
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </ModulePage>
  )
}
