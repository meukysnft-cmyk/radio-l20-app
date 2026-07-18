import { type FormEvent, useState } from 'react'
import {
  createDocument,
  deleteDocument,
  updateDocument,
  type FirestoreRecord,
} from '../services/firestoreService'
import type { AgendaDocument, ContentStatus } from '../types/content'
import { AdminPanelShell } from './AdminPanelShell'

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

type ScheduleAdminPanelProps = {
  isOpen: boolean
  onClose: () => void
  onSaved: () => void
  editingItem: FirestoreRecord<AgendaDocument> | null
}

export function ScheduleAdminPanel({
  isOpen,
  onClose,
  onSaved,
  editingItem,
}: ScheduleAdminPanelProps) {
  const [form, setForm] = useState<AgendaFormState>(
    editingItem
      ? {
          title: editingItem.title || '',
          date: editingItem.date || '',
          time: editingItem.time || '',
          type: editingItem.type || 'Evento',
          description: editingItem.description || '',
          status: editingItem.status || 'draft',
        }
      : emptyAgendaForm,
  )
  const [isSaving, setIsSaving] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  function updateForm<K extends keyof AgendaFormState>(key: K, value: AgendaFormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function resetForm() {
    setForm(emptyAgendaForm)
    onClose()
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
      setErrorMessage('Informe título, data e horário.')
      setIsSaving(false)
      return
    }

    try {
      if (editingItem) {
        await updateDocument('agenda', editingItem.id, payload)
        setFeedback('Agenda atualizada.')
      } else {
        await createDocument('agenda', payload)
        setFeedback('Agenda criada.')
      }
      resetForm()
      onSaved()
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Falha ao salvar agenda.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <AdminPanelShell
      isOpen={isOpen}
      onClose={onClose}
      eyebrow="Admin / Agenda"
      title="Gerenciar agenda"
    >
      <form className="admin-inline-form" onSubmit={handleSubmit}>
        <label>
          Título
          <input value={form.title} onChange={(e) => updateForm('title', e.target.value)} required />
        </label>
        <div className="admin-form-grid">
          <label>
            Data
            <input type="date" value={form.date} onChange={(e) => updateForm('date', e.target.value)} required />
          </label>
          <label>
            Horário
            <input value={form.time} onChange={(e) => updateForm('time', e.target.value)} required />
          </label>
        </div>
        <div className="admin-form-grid">
          <label>
            Tipo
            <input value={form.type} onChange={(e) => updateForm('type', e.target.value)} />
          </label>
          <label>
            Status
            <select value={form.status} onChange={(e) => updateForm('status', e.target.value as ContentStatus)}>
              <option value="draft">Rascunho</option>
              <option value="published">Publicado</option>
              <option value="archived">Arquivado</option>
            </select>
          </label>
        </div>
        <label>
          Descrição
          <textarea rows={4} value={form.description} onChange={(e) => updateForm('description', e.target.value)} />
        </label>

        {errorMessage ? <p className="admin-feedback is-error">{errorMessage}</p> : null}
        {feedback ? <p className="admin-feedback is-success">{feedback}</p> : null}

        <div className="admin-hero-actions">
          <button className="advertise-primary" type="submit" disabled={isSaving}>
            {isSaving ? 'Salvando...' : editingItem ? 'Salvar edição' : 'Salvar agenda'}
          </button>
          <button className="advertise-secondary" type="button" onClick={resetForm}>
            Limpar
          </button>
        </div>
      </form>
    </AdminPanelShell>
  )
}

export async function deleteAgendaItem(item: FirestoreRecord<AgendaDocument>) {
  if (!window.confirm(`Excluir a agenda "${item.title}"?`)) {
    return false
  }

  try {
    await deleteDocument('agenda', item.id)
    return true
  } catch (error) {
    alert(error instanceof Error ? error.message : 'Falha ao excluir agenda.')
    return false
  }
}
