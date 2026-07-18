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
import type { AgendaDocument, ContentStatus } from '../../types/content'
import '../../styles/admin.css'
import { ModulePage } from './cms/ModulePage'

type AgendaFormState = {
  title: string
  date: string
  time: string
  type: string
  description: string
  status: ContentStatus
}

const emptyAgendaForm: AgendaFormState = {
  title: '',
  date: '',
  time: '',
  type: 'Evento',
  description: '',
  status: 'draft',
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message
  }

  return 'Falha inesperada ao acessar o Firebase.'
}

function getStatusLabel(status: ContentStatus) {
  const labels: Record<ContentStatus, string> = {
    draft: 'Rascunho',
    published: 'Publicado',
    archived: 'Arquivado',
  }

  return labels[status]
}

export function AdminAgendaPage() {
  const [items, setItems] = useState<Array<FirestoreRecord<AgendaDocument>>>([])
  const [form, setForm] = useState<AgendaFormState>(emptyAgendaForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const isEditing = Boolean(editingId)

  const orderedItems = useMemo(
    () => [...items].sort((first, second) => `${first.date} ${first.time}`.localeCompare(`${second.date} ${second.time}`)),
    [items],
  )

  useEffect(() => {
    const unsubscribe = subscribeDocuments<AgendaDocument>(
      'agenda',
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

  function updateForm<K extends keyof AgendaFormState>(key: K, value: AgendaFormState[K]) {
    setForm((currentForm) => ({
      ...currentForm,
      [key]: value,
    }))
  }

  function resetForm() {
    setForm(emptyAgendaForm)
    setEditingId(null)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFeedback('')
    setErrorMessage('')
    setIsSaving(true)

    const payload: Omit<AgendaDocument, 'id' | 'createdAt' | 'updatedAt'> = {
      title: form.title.trim(),
      date: form.date.trim(),
      time: form.time.trim(),
      type: form.type.trim(),
      description: form.description.trim(),
      status: form.status,
    }

    if (!payload.title || !payload.date || !payload.time) {
      setErrorMessage('Informe pelo menos título, data e horário.')
      setIsSaving(false)
      return
    }

    try {
      if (editingId) {
        await updateDocument('agenda', editingId, payload)
        setFeedback('Agenda atualizada no Firestore.')
      } else {
        await createDocument('agenda', payload)
        setFeedback('Agenda criada no Firestore.')
      }

      resetForm()
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    } finally {
      setIsSaving(false)
    }
  }

  function handleEdit(item: FirestoreRecord<AgendaDocument>) {
    setEditingId(item.id)
    setFeedback('')
    setErrorMessage('')
    setForm({
      title: item.title || '',
      date: item.date || '',
      time: item.time || '',
      type: item.type || 'Evento',
      description: item.description || '',
      status: item.status || 'draft',
    })
  }

  async function handleDelete(item: FirestoreRecord<AgendaDocument>) {
    const shouldDelete = window.confirm(`Excluir a agenda "${item.title}"?`)

    if (!shouldDelete) {
      return
    }

    setFeedback('')
    setErrorMessage('')

    try {
      await deleteDocument('agenda', item.id)
      setFeedback('Agenda excluída do Firestore.')
      if (editingId === item.id) {
        resetForm()
      }
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    }
  }

  return (
    <ModulePage
      eyebrow="Conteúdo"
      title="Agenda"
      description="Cadastre jogos, eventos e transmissões com data e horário para aparecerem na programação pública."
    >
      <div className="admin-news-layout admin-agenda-layout">
        <form className="admin-logo-form admin-news-form" onSubmit={handleSubmit}>
          <div>
            <p className="eyebrow">{isEditing ? 'Editando' : 'Novo evento'}</p>
            <h2>{isEditing ? 'Atualizar agenda' : 'Criar agenda'}</h2>
          </div>

          <label>
            Título
            <input
              onChange={(event) => updateForm('title', event.target.value)}
              placeholder="Nome do evento"
              required
              value={form.title}
            />
          </label>

          <div className="admin-form-grid">
            <label>
              Data
              <input
                onChange={(event) => updateForm('date', event.target.value)}
                placeholder="2026-07-12"
                required
                type="date"
                value={form.date}
              />
            </label>

            <label>
              Horário
              <input
                onChange={(event) => updateForm('time', event.target.value)}
                required
                type="time"
                value={form.time}
              />
            </label>
          </div>

          <div className="admin-form-grid">
            <label>
              Tipo
              <input
                onChange={(event) => updateForm('type', event.target.value)}
                placeholder="Jogo, Evento, Transmissão..."
                value={form.type}
              />
            </label>

            <label>
              Status
              <select
                onChange={(event) => updateForm('status', event.target.value as ContentStatus)}
                value={form.status}
              >
                <option value="draft">Rascunho</option>
                <option value="published">Publicado</option>
                <option value="archived">Arquivado</option>
              </select>
            </label>
          </div>

          <label>
            Descrição
            <textarea
              onChange={(event) => updateForm('description', event.target.value)}
              placeholder="Breve descrição do evento ou cobertura"
              rows={6}
              value={form.description}
            />
          </label>

          {errorMessage ? <p className="admin-feedback is-error">{errorMessage}</p> : null}
          {feedback ? <p className="admin-feedback is-success">{feedback}</p> : null}

          <div className="admin-hero-actions">
            <button className="advertise-primary admin-hero-action" disabled={isSaving} type="submit">
              {isSaving ? 'Salvando...' : isEditing ? 'Salvar edição' : 'Criar agenda'}
            </button>
            {isEditing ? (
              <button className="advertise-secondary admin-hero-action" type="button" onClick={resetForm}>
                Cancelar edição
              </button>
            ) : null}
            <Link className="advertise-secondary admin-hero-action" to={radioRoutes.schedule}>
              Ver agenda pública
            </Link>
          </div>
        </form>

        <div className="admin-news-list" aria-live="polite">
          <div className="admin-news-list-header">
            <div>
              <p className="eyebrow">Coleção agenda</p>
              <h2>Itens cadastrados</h2>
            </div>
          </div>

          {isLoading ? <p className="admin-feedback">Carregando agenda do Firestore...</p> : null}

          {!isLoading && orderedItems.length === 0 ? (
            <div className="admin-empty-state">
              <p className="eyebrow">Estado vazio</p>
              <h3>Nenhuma agenda encontrada</h3>
              <p>Cadastre o primeiro evento para validar a conexão com a coleção agenda.</p>
            </div>
          ) : null}

          {orderedItems.map((item) => (
            <article className="admin-news-card" key={item.id}>
              <div>
                <span>{item.type || 'Evento'}</span>
                <h3>{item.title}</h3>
                <p>{item.description || 'Sem descrição cadastrada.'}</p>
                <small>
                  {item.date} às {item.time}
                </small>
              </div>

              <dl>
                <div>
                  <dt>Status</dt>
                  <dd>{getStatusLabel(item.status || 'draft')}</dd>
                </div>
              </dl>

              <div className="admin-card-actions">
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
