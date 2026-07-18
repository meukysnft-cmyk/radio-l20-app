import { type FormEvent, useEffect, useMemo, useState } from 'react'
import {
  createDocument,
  deleteDocument,
  updateDocument,
  subscribeDocuments,
  type FirestoreRecord,
} from '../../services/firestoreService'
import '../../styles/admin.css'
import type { JobDocument } from '../../types/content'

type JobForm = {
  title: string
  company: string
  city: string
  type: string
  description: string
  contact: string
  salary: string
  requirements: string
  imageUrl: string
  urgent: boolean
  published: boolean
}

const emptyForm: JobForm = {
  title: '',
  company: '',
  city: '',
  type: 'CLT',
  description: '',
  contact: '',
  salary: '',
  requirements: '',
  imageUrl: '',
  urgent: false,
  published: true,
}

const JOB_TYPES = ['CLT', 'PJ', 'Estágio', 'Temporário', 'Freelancer', 'A combinar'] as const

const CITY_SUGGESTIONS = ['Pilar', 'Delmiro Goveia', 'Piaçabuçu', 'Coqueiro Seco', 'Atalaia', 'Feliz Deserto', 'Junqueiro', 'Limoeiro de Anadia'] as const

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message
  return 'Falha inesperada ao acessar o Firebase.'
}

export function AdminJobsPage() {
  const [jobs, setJobs] = useState<Array<FirestoreRecord<JobDocument>>>([])
  const [form, setForm] = useState<JobForm>(emptyForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const isEditing = Boolean(editingId)

  const orderedJobs = useMemo(
    () =>
      [...jobs].sort((a, b) => {
        if (a.urgent && !b.urgent) return -1
        if (!a.urgent && b.urgent) return 1
        const aTime = (a.createdAt as { seconds?: number } | undefined)?.seconds ?? 0
        const bTime = (b.createdAt as { seconds?: number } | undefined)?.seconds ?? 0
        return bTime - aTime
      }),
    [jobs],
  )

  useEffect(() => {
    const unsub = subscribeDocuments<JobDocument>(
      'jobs',
      (docs) => {
        setJobs(docs)
        setIsLoading(false)
      },
      (error) => {
        setErrorMessage(getErrorMessage(error))
        setIsLoading(false)
      },
    )
    return () => unsub()
  }, [])

  function updateForm<K extends keyof JobForm>(key: K, value: JobForm[K]) {
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

    const payload: Omit<JobDocument, 'id' | 'createdAt' | 'updatedAt'> = {
      title: form.title.trim(),
      company: form.company.trim(),
      city: form.city.trim(),
      type: form.type,
      description: form.description.trim(),
      contact: form.contact.trim(),
      salary: form.salary.trim() || undefined,
      requirements: form.requirements.trim() || undefined,
      imageUrl: form.imageUrl.trim() || undefined,
      urgent: form.urgent,
      published: form.published,
    }

    if (!payload.title || !payload.contact) {
      setErrorMessage('Informe pelo menos título e contato da vaga.')
      setIsSaving(false)
      return
    }

    try {
      if (editingId) {
        await updateDocument('jobs', editingId, payload)
        setFeedback('Vaga atualizada no Firestore.')
      } else {
        await createDocument('jobs', payload)
        setFeedback('Vaga criada no Firestore.')
      }
      resetForm()
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    } finally {
      setIsSaving(false)
    }
  }

  function handleEdit(item: FirestoreRecord<JobDocument>) {
    setEditingId(item.id)
    setFeedback('')
    setErrorMessage('')
    setForm({
      title: item.title || '',
      company: item.company || '',
      city: item.city || '',
      type: item.type || 'CLT',
      description: item.description || '',
      contact: item.contact || '',
      salary: item.salary || '',
      requirements: item.requirements || '',
      imageUrl: item.imageUrl || '',
      urgent: Boolean(item.urgent),
      published: Boolean(item.published),
    })
  }

  async function handleDelete(item: FirestoreRecord<JobDocument>) {
    if (!window.confirm(`Excluir a vaga "${item.title}"?`)) return
    setFeedback('')
    setErrorMessage('')
    try {
      await deleteDocument('jobs', item.id)
      setFeedback('Vaga excluída do Firestore.')
      if (editingId === item.id) resetForm()
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    }
  }

  return (
    <section className="content-section page-section admin-page admin-jobs-page" aria-labelledby="admin-jobs-title">
      <div className="admin-hero">
        <p className="eyebrow">Firestore</p>
        <h1 id="admin-jobs-title">Empregos do Admin</h1>
        <p>Cadastre, edite e exclua vagas de emprego de Pilar, Delmiro Goveia, Piaçabuçu e cidades vizinhas.</p>
        <span>Use dados reais somente quando houver vaga confirmada e disponível.</span>
      </div>

      <div className="admin-news-layout">
        <form className="admin-logo-form admin-news-form" onSubmit={handleSubmit}>
          <div>
            <p className="eyebrow">{isEditing ? 'Editando' : 'Nova vaga'}</p>
            <h2>{isEditing ? 'Atualizar vaga' : 'Criar vaga'}</h2>
          </div>

          <label>
            Título da vaga
            <input
              onChange={(e) => updateForm('title', e.target.value)}
              placeholder="Ex: Vendedor(a) - Loja X"
              required
              value={form.title}
            />
          </label>

          <label>
            Empresa
            <input
              onChange={(e) => updateForm('company', e.target.value)}
              placeholder="Nome da empresa ou comércio"
              value={form.company}
            />
          </label>

          <div className="admin-form-grid">
            <label>
              Cidade
              <input
                list="cities-list"
                onChange={(e) => updateForm('city', e.target.value)}
                placeholder="Ex: Pilar"
                value={form.city}
              />
              <datalist id="cities-list">
                {CITY_SUGGESTIONS.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </label>

            <label>
              Tipo
              <select onChange={(e) => updateForm('type', e.target.value)} value={form.type}>
                {JOB_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="admin-form-grid">
            <label>
              Salário
              <input
                onChange={(e) => updateForm('salary', e.target.value)}
                placeholder="Ex: R$ 1.800 ou A combinar"
                value={form.salary}
              />
            </label>

            <label>
              Contato
              <input
                onChange={(e) => updateForm('contact', e.target.value)}
                placeholder="Telefone, WhatsApp ou email"
                required
                value={form.contact}
              />
            </label>
          </div>

          <label>
            Requisitos
            <input
              onChange={(e) => updateForm('requirements', e.target.value)}
              placeholder="Ex: Ensino médio, experiência prévia"
              value={form.requirements}
            />
          </label>

          <label>
            Descrição
            <textarea
              onChange={(e) => updateForm('description', e.target.value)}
              placeholder="Detalhes sobre a vaga, atividades, horário..."
              rows={5}
              value={form.description}
            />
          </label>

          <label>
            Link da imagem
            <input
              inputMode="url"
              onChange={(e) => updateForm('imageUrl', e.target.value)}
              placeholder="https://exemplo.com/imagem.webp"
              value={form.imageUrl}
            />
          </label>
          {form.imageUrl ? (
            <div className="admin-image-preview">
              <img alt="Preview da imagem" src={form.imageUrl} />
            </div>
          ) : null}

          <div className="admin-form-checkboxes">
            <label className="admin-checkbox">
              <input
                checked={form.urgent}
                onChange={(e) => updateForm('urgent', e.target.checked)}
                type="checkbox"
              />
              Vaga urgente
            </label>
            <label className="admin-checkbox">
              <input
                checked={form.published}
                onChange={(e) => updateForm('published', e.target.checked)}
                type="checkbox"
              />
              Publicada
            </label>
          </div>

          {errorMessage ? <p className="admin-feedback is-error">{errorMessage}</p> : null}
          {feedback ? <p className="admin-feedback is-success">{feedback}</p> : null}

          <div className="admin-hero-actions">
            <button className="advertise-primary admin-hero-action" disabled={isSaving} type="submit">
              {isSaving ? 'Salvando...' : isEditing ? 'Salvar edição' : 'Criar vaga'}
            </button>
            {isEditing ? (
              <button className="advertise-secondary admin-hero-action" type="button" onClick={resetForm}>
                Cancelar edição
              </button>
            ) : null}
          </div>
        </form>

        <div className="admin-news-list" aria-live="polite">
          <div className="admin-news-list-header">
            <div>
              <p className="eyebrow">Coleção jobs</p>
              <h2>Vagas cadastradas</h2>
            </div>
          </div>

          {isLoading ? <p className="admin-feedback">Carregando vagas do Firestore...</p> : null}

          {!isLoading && orderedJobs.length === 0 ? (
            <div className="admin-empty-state">
              <p className="eyebrow">Estado vazio</p>
              <h3>Nenhuma vaga encontrada</h3>
              <p>Crie a primeira vaga para validar a conexão com o Firestore.</p>
            </div>
          ) : null}

          {orderedJobs.map((item) => (
            <article className={`admin-news-card${item.urgent ? ' admin-job-urgent' : ''}`} key={item.id}>
              <div>
                {item.imageUrl ? (
                  <div className="admin-news-card-image">
                    <img alt={item.title} src={item.imageUrl} />
                  </div>
                ) : null}
                <span>{item.type || 'Sem tipo'}</span>
                <h3>{item.title}</h3>
                {item.company ? <p>{item.company}</p> : null}
                {item.city ? <small>Cidade: {item.city}</small> : null}
              </div>
              <dl>
                <div>
                  <dt>Status</dt>
                  <dd>{item.published ? 'Publicada' : 'Rascunho'}</dd>
                </div>
                <div>
                  <dt>Urgente</dt>
                  <dd>{item.urgent ? 'Sim' : 'Não'}</dd>
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
    </section>
  )
}
