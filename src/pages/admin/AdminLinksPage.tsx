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
import type { LinksDocument } from '../../types/content'
import '../../styles/admin.css'
import { ModulePage } from './cms/ModulePage'

type LinksFormState = LinksDocument

const emptyLinksForm: LinksFormState = {
  instagram: '',
  youtube: '',
  whatsapp: '',
  streamUrl: '',
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message
  }

  return 'Falha inesperada ao acessar o Firebase.'
}

export function AdminLinksPage() {
  const [items, setItems] = useState<Array<FirestoreRecord<LinksDocument>>>([])
  const [form, setForm] = useState<LinksFormState>(emptyLinksForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const isEditing = Boolean(editingId)

  const latestItem = useMemo(() => items[0] ?? null, [items])

  useEffect(() => {
    const unsubscribe = subscribeDocuments<LinksDocument>(
      'links',
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
    if (latestItem && !editingId) {
      setForm({
        instagram: latestItem.instagram || '',
        youtube: latestItem.youtube || '',
        whatsapp: latestItem.whatsapp || '',
        streamUrl: latestItem.streamUrl || '',
      })
    }
  }, [editingId, latestItem])

  function updateForm<K extends keyof LinksFormState>(key: K, value: LinksFormState[K]) {
    setForm((currentForm) => ({
      ...currentForm,
      [key]: value,
    }))
  }

  function resetForm() {
    setForm(emptyLinksForm)
    setEditingId(null)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFeedback('')
    setErrorMessage('')
    setIsSaving(true)

    const payload: LinksDocument = {
      instagram: form.instagram.trim(),
      youtube: form.youtube.trim(),
      whatsapp: form.whatsapp.trim(),
      streamUrl: form.streamUrl.trim(),
    }

    if (!payload.instagram || !payload.youtube || !payload.whatsapp || !payload.streamUrl) {
      setErrorMessage('Preencha todos os links principais.')
      setIsSaving(false)
      return
    }

    try {
      if (editingId) {
        await updateDocument('links', editingId, payload)
        setFeedback('Links atualizados no Firestore.')
      } else {
        await createDocument('links', payload)
        setFeedback('Links criados no Firestore.')
      }

      resetForm()
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    } finally {
      setIsSaving(false)
    }
  }

  function handleEdit(item: FirestoreRecord<LinksDocument>) {
    setEditingId(item.id)
    setFeedback('')
    setErrorMessage('')
    setForm({
      instagram: item.instagram || '',
      youtube: item.youtube || '',
      whatsapp: item.whatsapp || '',
      streamUrl: item.streamUrl || '',
    })
  }

  async function handleDelete(item: FirestoreRecord<LinksDocument>) {
    const shouldDelete = window.confirm('Excluir a configuração de links?')

    if (!shouldDelete) {
      return
    }

    setFeedback('')
    setErrorMessage('')

    try {
      await deleteDocument('links', item.id)
      setFeedback('Configuração de links excluída do Firestore.')
      if (editingId === item.id) {
        resetForm()
      }
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    }
  }

  return (
    <ModulePage
      eyebrow="Engajamento"
      title="Links e redes sociais"
      description="Atualize os links oficiais do Instagram, YouTube, WhatsApp e streaming da rádio em um só lugar."
    >
      <div className="admin-news-layout admin-links-layout">
        <form className="admin-logo-form admin-news-form" onSubmit={handleSubmit}>
          <div>
            <p className="eyebrow">{isEditing ? 'Editando' : 'Configuração oficial'}</p>
            <h2>{isEditing ? 'Atualizar links' : 'Cadastrar links oficiais'}</h2>
          </div>

          <label>
            Instagram
            <input
              inputMode="url"
              onChange={(event) => updateForm('instagram', event.target.value)}
              placeholder="https://instagram.com/..."
              required
              value={form.instagram}
            />
          </label>

          <label>
            YouTube
            <input
              inputMode="url"
              onChange={(event) => updateForm('youtube', event.target.value)}
              placeholder="https://youtube.com/@..."
              required
              value={form.youtube}
            />
          </label>

          <label>
            WhatsApp
            <input
              inputMode="url"
              onChange={(event) => updateForm('whatsapp', event.target.value)}
              placeholder="https://wa.me/..."
              required
              value={form.whatsapp}
            />
          </label>

          <label>
            Stream da rádio
            <input
              inputMode="url"
              onChange={(event) => updateForm('streamUrl', event.target.value)}
              placeholder="https://.../stream"
              required
              value={form.streamUrl}
            />
          </label>

          {errorMessage ? <p className="admin-feedback is-error">{errorMessage}</p> : null}
          {feedback ? <p className="admin-feedback is-success">{feedback}</p> : null}

          <div className="admin-hero-actions">
            <button className="advertise-primary admin-hero-action" disabled={isSaving} type="submit">
              {isSaving ? 'Salvando...' : isEditing ? 'Salvar edição' : 'Salvar links'}
            </button>
            {isEditing ? (
              <button className="advertise-secondary admin-hero-action" type="button" onClick={resetForm}>
                Cancelar edição
              </button>
            ) : null}
            <Link className="advertise-secondary admin-hero-action" to={radioRoutes.contact}>
              Ver contato público
            </Link>
          </div>
        </form>

        <div className="admin-news-list" aria-live="polite">
          <div className="admin-news-list-header">
            <div>
              <p className="eyebrow">Coleção links</p>
              <h2>Configuração atual</h2>
            </div>
          </div>

          {isLoading ? <p className="admin-feedback">Carregando links do Firestore...</p> : null}

          {!isLoading && items.length === 0 ? (
            <div className="admin-empty-state">
              <p className="eyebrow">Estado vazio</p>
              <h3>Nenhuma configuração encontrada</h3>
              <p>Cadastre a primeira configuração para validar a coleção links.</p>
            </div>
          ) : null}

          {items.map((item) => (
            <article className="admin-news-card" key={item.id}>
              <div>
                <span>Links oficiais</span>
                <h3>Instagram, YouTube, WhatsApp e Stream</h3>
                <p>Conjunto atual da configuração pública.</p>
                <small>{item.streamUrl}</small>
              </div>

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
