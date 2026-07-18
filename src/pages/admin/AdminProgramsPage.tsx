import { type FormEvent, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { radioRoutes } from '../../config/radioLinks'
import {
  createDocument,
  deleteDocument,
  subscribeDocuments,
  updateDocument,
  type FirestoreRecord,
} from '../../services/firestoreService'
import type { PlayerDocument, ProgramDocument, ProgramLiveStatus } from '../../types/content'
import '../../styles/admin.css'
import { ModulePage } from './cms/ModulePage'
import { radioPrograms } from '../../data/programsContent'

type ProgramFormState = {
  slug: string
  name: string
  time: string
  days: string
  category: string
  description: string
  coverImageUrl: string
  youtubeUrl: string
  liveDate: string
  liveNote: string
  livePlatform: 'youtube' | 'instagram'
}

const emptyProgramForm: ProgramFormState = {
  slug: '',
  name: '',
  time: '',
  days: '',
  category: 'Programa',
  description: '',
  coverImageUrl: '',
  youtubeUrl: '',
  liveDate: '',
  liveNote: '',
  livePlatform: 'youtube',
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message
  return 'Falha inesperada ao acessar o Firebase.'
}

export function AdminProgramsPage() {
  const [items, setItems] = useState<Array<FirestoreRecord<ProgramDocument>>>([])
  const [form, setForm] = useState<ProgramFormState>(emptyProgramForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [player, setPlayer] = useState<PlayerDocument | null>(null)

  const isEditing = Boolean(editingId)

  const orderedItems = useMemo(
    () => [...items].sort((first, second) => (first.name || '').localeCompare(second.name || '')),
    [items],
  )

  const livePrograms = useMemo(() => items.filter((i) => i.liveStatus === 'live'), [items])

  useEffect(() => {
    const unsubscribe = subscribeDocuments<ProgramDocument>(
      'programs',
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

  useEffect(() => {
    const unsub = subscribeDocuments<PlayerDocument>('player', (docs) => {
      if (docs.length > 0) setPlayer(docs[0])
    })
    return () => unsub()
  }, [])

  function updateForm<K extends keyof ProgramFormState>(key: K, value: ProgramFormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function resetForm() {
    setForm(emptyProgramForm)
    setEditingId(null)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFeedback('')
    setErrorMessage('')
    setIsSaving(true)

    const payload: Omit<ProgramDocument, 'id' | 'createdAt' | 'updatedAt'> = {
      slug: form.slug.trim(),
      name: form.name.trim(),
      time: form.time.trim(),
      days: form.days.trim(),
      category: form.category.trim(),
      description: form.description.trim(),
      isOnAir: false,
      coverImageUrl: form.coverImageUrl.trim(),
      youtubeUrl: form.youtubeUrl.trim(),
      liveDate: form.liveDate.trim(),
      liveNote: form.liveNote.trim(),
      liveStatus: 'none',
      livePlatform: form.livePlatform,
    }

    if (!payload.slug || !payload.name || !payload.time || !payload.days) {
      setErrorMessage('Selecione o programa e informe nome, horário e dias.')
      setIsSaving(false)
      return
    }

    try {
      if (editingId) {
        await updateDocument('programs', editingId, payload)
        setFeedback('Programa atualizado no Firestore.')
      } else {
        await createDocument('programs', payload)
        setFeedback('Programa criado no Firestore.')
      }
      resetForm()
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    } finally {
      setIsSaving(false)
    }
  }

  function handleEdit(item: FirestoreRecord<ProgramDocument>) {
    setEditingId(item.id)
    setFeedback('')
    setErrorMessage('')
    setForm({
      slug: item.slug || '',
      name: item.name || '',
      time: item.time || '',
      days: item.days || '',
      category: item.category || 'Programa',
      description: item.description || '',
      coverImageUrl: item.coverImageUrl || '',
      youtubeUrl: item.youtubeUrl || '',
      liveDate: item.liveDate || '',
      liveNote: item.liveNote || '',
      livePlatform: item.livePlatform || 'youtube',
    })
  }

  async function handleDelete(item: FirestoreRecord<ProgramDocument>) {
    if (!window.confirm(`Excluir o programa "${item.name}"?`)) return
    setFeedback('')
    setErrorMessage('')
    try {
      await deleteDocument('programs', item.id)
      setFeedback('Programa excluído do Firestore.')
      if (editingId === item.id) resetForm()
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    }
  }

  async function handleStartLive(item: FirestoreRecord<ProgramDocument>) {
    if (!item.youtubeUrl && item.livePlatform === 'youtube') {
      setErrorMessage(`Adicione o link do YouTube antes de iniciar a transmissão de "${item.name}".`)
      return
    }
    setFeedback('')
    setErrorMessage('')
    try {
      await updateDocument('programs', item.id, {
        liveStatus: 'live' as ProgramLiveStatus,
        isOnAir: true,
        liveStartedAt: new Date().toISOString(),
        liveEndedAt: null,
      })
      setFeedback(`"${item.name}" está AO VIVO!`)
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    }
  }

  async function handleEndLive(item: FirestoreRecord<ProgramDocument>) {
    if (!window.confirm(`Encerrar a transmissão de "${item.name}"? O vídeo ficará disponível no histórico.`)) return
    setFeedback('')
    setErrorMessage('')
    try {
      await updateDocument('programs', item.id, {
        liveStatus: 'ended' as ProgramLiveStatus,
        isOnAir: false,
        liveEndedAt: new Date().toISOString(),
      })
      setFeedback(`Transmissão de "${item.name}" encerrada. Vídeo disponível no histórico.`)
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    }
  }

  return (
    <ModulePage
      eyebrow="Conteúdo"
      title="Programação"
      description="Publique programas e gerencie transmissões. Um único registro acompanha todo o ciclo: Em breve → Ao vivo → Encerrada."
    >
      {livePrograms.length > 0 && (
        <div className="admin-feedback" style={{ borderColor: 'rgba(255,80,80,.3)', background: 'rgba(255,50,50,.08)' }}>
          🔴 <strong>{livePrograms.length}</strong> programa{livePrograms.length > 1 ? 's' : ''} ao vivo{livePrograms.length > 1 ? 's' : ''}
        </div>
      )}

      {player?.youtubeIsLive && (
        <div className="admin-feedback" style={{ borderColor: 'rgba(255,80,80,.3)', background: 'rgba(255,50,50,.08)' }}>
          ▶ YouTube ativo via Controle ao vivo — <a href={player.youtubeLiveUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#fca5a5' }}>abrir link</a>
        </div>
      )}

      {player?.instagramIsLive && (
        <div className="admin-feedback" style={{ borderColor: 'rgba(255,80,80,.3)', background: 'rgba(255,50,50,.08)' }}>
          📷 Instagram ativo via Controle ao vivo — <a href={player.instagramLiveUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#fca5a5' }}>abrir link</a>
        </div>
      )}

      <div className="admin-news-layout admin-programs-layout">
        <form className="admin-logo-form admin-news-form" onSubmit={handleSubmit}>
          <div>
            <p className="eyebrow">{isEditing ? 'Editando' : 'Novo programa'}</p>
            <h2>{isEditing ? 'Atualizar programa' : 'Cadastrar programa'}</h2>
          </div>

          <label>
            Programa
            <select
              onChange={(event) => {
                const selectedSlug = event.target.value
                const selectedProgram = radioPrograms.find((program) => program.slug === selectedSlug)
                updateForm('slug', selectedSlug)
                if (selectedProgram) {
                  updateForm('name', selectedProgram.name)
                  updateForm('category', selectedProgram.highlightLabel)
                  updateForm('description', selectedProgram.description)
                }
              }}
              value={form.slug}
              required
            >
              <option value="">Selecione um programa</option>
              {radioPrograms.map((program) => (
                <option key={program.slug} value={program.slug}>
                  {program.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Nome
            <input
              onChange={(event) => updateForm('name', event.target.value)}
              placeholder="Nome do programa"
              required
              value={form.name}
            />
          </label>

          <div className="admin-form-grid">
            <label>
              Horário
              <input
                onChange={(event) => updateForm('time', event.target.value)}
                placeholder="19:00"
                required
                value={form.time}
              />
            </label>
            <label>
              Categoria
              <input
                onChange={(event) => updateForm('category', event.target.value)}
                placeholder="Esporte, Palavra, Música..."
                value={form.category}
              />
            </label>
          </div>

          <label>
            Dias
            <input
              onChange={(event) => updateForm('days', event.target.value)}
              placeholder="Seg, Qua, Sex"
              required
              value={form.days}
            />
          </label>

          <label>
            Descrição
            <textarea
              onChange={(event) => updateForm('description', event.target.value)}
              placeholder="Resumo do que o programa entrega"
              rows={4}
              value={form.description}
            />
          </label>

          <hr style={{ border: 'none', borderTop: '1px solid var(--line)', margin: '4px 0' }} />
          <p className="eyebrow" style={{ margin: 0 }}>Transmissão</p>

          <label>
            Imagem de capa
            <input
              inputMode="url"
              onChange={(event) => updateForm('coverImageUrl', event.target.value)}
              placeholder="https://.../imagem.jpg"
              value={form.coverImageUrl}
            />
          </label>

          <div className="admin-form-grid">
            <label>
              Plataforma
              <select value={form.livePlatform} onChange={(event) => updateForm('livePlatform', event.target.value as 'youtube' | 'instagram')}>
                <option value="youtube">YouTube</option>
                <option value="instagram">Instagram</option>
              </select>
            </label>
            <label>
              Data da transmissão
              <input
                onChange={(event) => updateForm('liveDate', event.target.value)}
                type="date"
                value={form.liveDate}
              />
            </label>
          </div>

          <label>
            Link da transmissão
            <input
              inputMode="url"
              onChange={(event) => updateForm('youtubeUrl', event.target.value)}
              placeholder={form.livePlatform === 'youtube' ? 'https://www.youtube.com/watch?v=...' : 'https://instagram.com/p/...'}
              value={form.youtubeUrl}
            />
          </label>

          <label>
            Observação
            <textarea
              onChange={(event) => updateForm('liveNote', event.target.value)}
              placeholder="Ex.: Entramos ao vivo às 19h com cobertura especial."
              rows={3}
              value={form.liveNote}
            />
          </label>

          {errorMessage ? <p className="admin-feedback is-error">{errorMessage}</p> : null}
          {feedback ? <p className="admin-feedback is-success">{feedback}</p> : null}

          <div className="admin-hero-actions">
            <button className="advertise-primary admin-hero-action" disabled={isSaving} type="submit">
              {isSaving ? 'Salvando...' : isEditing ? 'Salvar edição' : 'Criar programa'}
            </button>
            {isEditing ? (
              <button className="advertise-secondary admin-hero-action" type="button" onClick={resetForm}>
                Cancelar edição
              </button>
            ) : null}
            <Link className="advertise-secondary admin-hero-action" to={radioRoutes.programs}>
              Ver programação pública
            </Link>
          </div>
        </form>

        <div className="admin-news-list" aria-live="polite">
          <div className="admin-news-list-header">
            <div>
              <p className="eyebrow">Coleção programs</p>
              <h2>Programas cadastrados</h2>
            </div>
          </div>

          {isLoading ? <p className="admin-feedback">Carregando programas do Firestore...</p> : null}

          {!isLoading && orderedItems.length === 0 ? (
            <div className="admin-empty-state">
              <p className="eyebrow">Estado vazio</p>
              <h3>Nenhum programa encontrado</h3>
              <p>Cadastre o primeiro programa para validar a conexão com a coleção programs.</p>
            </div>
          ) : null}

          {orderedItems.map((item) => {
            const status = item.liveStatus || 'none'
            const isLive = status === 'live'
            const isScheduled = status === 'scheduled'
            const isEnded = status === 'ended'

            return (
              <article className={`admin-news-card${isLive ? ' is-live-card' : ''}`} key={item.id}>
                <div>
                  <span>{item.category || 'Programa'}</span>
                  <h3>{item.name}</h3>
                  <p>{item.description || 'Sem descrição cadastrada.'}</p>
                  <small>{item.days} • {item.time}</small>
                  {item.liveDate ? <small>Data: {item.liveDate}</small> : null}
                  {item.coverImageUrl ? (
                    <div className="admin-program-cover">
                      <img src={item.coverImageUrl} alt="" loading="lazy" />
                    </div>
                  ) : null}
                </div>

                <dl>
                  <div>
                    <dt>Transmissão</dt>
                    <dd>
                      <span className={`cms-live-badge is-${status}`}>
                        {isLive ? '🔴 AO VIVO' : isScheduled ? '⏰ Em breve' : isEnded ? '✅ Encerrada' : '—'}
                      </span>
                    </dd>
                  </div>
                  <div>
                    <dt>Plataforma</dt>
                    <dd>{item.livePlatform === 'instagram' ? '📷 Instagram' : '▶ YouTube'}</dd>
                  </div>
                </dl>

                <div className="admin-card-actions">
                  {!isLive && (
                    <button type="button" className="cms-btn-start-live" onClick={() => void handleStartLive(item)}>
                      🔴 Iniciar transmissão
                    </button>
                  )}
                  {isLive && (
                    <button type="button" className="cms-btn-end-live" onClick={() => void handleEndLive(item)}>
                      ⏹ Encerrar transmissão
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
            )
          })}
        </div>
      </div>
    </ModulePage>
  )
}
