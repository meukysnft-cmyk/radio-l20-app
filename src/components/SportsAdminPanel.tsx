import { type FormEvent, useEffect, useState } from 'react'
import {
  createDocument,
  getDocument,
  updateDocument,
} from '../services/firestoreService'
import type { ContentStatus, SportsCardData, SportsContentDocument } from '../types/content'
import { AdminPanelShell } from './AdminPanelShell'

type SportsAdminPanelProps = {
  isOpen: boolean
  onClose: () => void
  onSaved: () => void
}

type AmateurCardForm = {
  category: string
  title: string
  description: string
  meta: string
}

const emptyAmateurCard: AmateurCardForm = {
  category: '',
  title: '',
  description: '',
  meta: 'Pilar, AL',
}

export function SportsAdminPanel({ isOpen, onClose, onSaved }: SportsAdminPanelProps) {
  const [docId, setDocId] = useState<string | null>(null)
  const [featuredCategory, setFeaturedCategory] = useState('')
  const [featuredTitle, setFeaturedTitle] = useState('')
  const [featuredDescription, setFeaturedDescription] = useState('')
  const [featuredMeta, setFeaturedMeta] = useState('Pilar, AL')
  const [amateurCards, setAmateurCards] = useState<AmateurCardForm[]>([])
  const [calloutTitle, setCalloutTitle] = useState('')
  const [calloutDescription, setCalloutDescription] = useState('')
  const [calloutActionLabel, setCalloutActionLabel] = useState('')
  const [status, setStatus] = useState<ContentStatus>('published')
  const [isSaving, setIsSaving] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [editingCardIndex, setEditingCardIndex] = useState<number | null>(null)

  useEffect(() => {
    if (!isOpen) return

    getDocument<SportsContentDocument>('sportsContent', 'main').then((doc) => {
      if (doc) {
        setDocId(doc.id)
        setFeaturedCategory(doc.featured?.category ?? '')
        setFeaturedTitle(doc.featured?.title ?? '')
        setFeaturedDescription(doc.featured?.description ?? '')
        setFeaturedMeta(doc.featured?.meta ?? 'Pilar, AL')
        setAmateurCards(doc.amateurCards?.map((c) => ({ ...c })) ?? [])
        setCalloutTitle(doc.callout?.title ?? '')
        setCalloutDescription(doc.callout?.description ?? '')
        setCalloutActionLabel(doc.callout?.actionLabel ?? '')
        setStatus(doc.status ?? 'published')
      }
    })
  }, [isOpen])

  function addAmateurCard() {
    setAmateurCards((prev) => [...prev, { ...emptyAmateurCard }])
    setEditingCardIndex(amateurCards.length)
  }

  function updateAmateurCard(index: number, field: keyof AmateurCardForm, value: string) {
    setAmateurCards((prev) => prev.map((card, i) => (i === index ? { ...card, [field]: value } : card)))
  }

  function removeAmateurCard(index: number) {
    setAmateurCards((prev) => prev.filter((_, i) => i !== index))
    setEditingCardIndex(null)
  }

  function resetForm() {
    setDocId(null)
    setFeaturedCategory('')
    setFeaturedTitle('')
    setFeaturedDescription('')
    setFeaturedMeta('Pilar, AL')
    setAmateurCards([])
    setCalloutTitle('')
    setCalloutDescription('')
    setCalloutActionLabel('')
    setStatus('published')
    setEditingCardIndex(null)
    setFeedback('')
    setErrorMessage('')
    onClose()
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFeedback('')
    setErrorMessage('')
    setIsSaving(true)

    const featured: SportsCardData = {
      category: featuredCategory.trim(),
      title: featuredTitle.trim(),
      description: featuredDescription.trim(),
      meta: featuredMeta.trim(),
    }

    const amateur: SportsCardData[] = amateurCards
      .filter((c) => c.title.trim())
      .map((c) => ({
        category: c.category.trim(),
        title: c.title.trim(),
        description: c.description.trim(),
        meta: c.meta.trim(),
      }))

    const callout = {
      title: calloutTitle.trim(),
      description: calloutDescription.trim(),
      actionLabel: calloutActionLabel.trim(),
    }

    if (!featured.title) {
      setErrorMessage('Informe o título do destaque esportivo.')
      setIsSaving(false)
      return
    }

    const payload: Omit<SportsContentDocument, 'id' | 'createdAt' | 'updatedAt'> = {
      featured,
      amateurCards: amateur,
      callout,
      status,
    }

    try {
      if (docId) {
        await updateDocument('sportsContent', docId, payload)
        setFeedback('Conteúdo esportivo atualizado.')
      } else {
        const newId = await createDocument('sportsContent', { ...payload, id: 'main' })
        setDocId(newId ?? 'main')
        setFeedback('Conteúdo esportivo criado.')
      }
      onSaved()
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Falha ao salvar conteúdo esportivo.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <AdminPanelShell isOpen={isOpen} onClose={onClose} eyebrow="Admin / Esportes" title="Editar conteúdo esportivo">
      <form className="admin-inline-form" onSubmit={handleSubmit}>
        <p className="card-eyebrow" style={{ margin: '0 0 4px' }}>Destaque</p>

        <label>
          Categoria
          <input value={featuredCategory} onChange={(e) => setFeaturedCategory(e.target.value)} placeholder="Ex: Transmissão esportiva" />
        </label>
        <label>
          Título
          <input value={featuredTitle} onChange={(e) => setFeaturedTitle(e.target.value)} required />
        </label>
        <label>
          Descrição
          <textarea rows={3} value={featuredDescription} onChange={(e) => setFeaturedDescription(e.target.value)} />
        </label>
        <label>
          Meta
          <input value={featuredMeta} onChange={(e) => setFeaturedMeta(e.target.value)} />
        </label>

        <div className="admin-form-grid">
          <label>
            Status
            <select value={status} onChange={(e) => setStatus(e.target.value as ContentStatus)}>
              <option value="draft">Rascunho</option>
              <option value="published">Publicado</option>
              <option value="archived">Arquivado</option>
            </select>
          </label>
        </div>

        <p className="card-eyebrow" style={{ margin: '16px 0 4px' }}>Cards amadores ({amateurCards.length})</p>

        {amateurCards.map((card, index) => (
          <div key={index} className="admin-amateur-card-editor">
            <div className="admin-amateur-card-header">
              <strong>{card.title || `Card ${index + 1}`}</strong>
              <div className="admin-card-actions">
                <button type="button" onClick={() => setEditingCardIndex(editingCardIndex === index ? null : index)}>
                  {editingCardIndex === index ? 'Fechar' : 'Editar'}
                </button>
                <button type="button" onClick={() => removeAmateurCard(index)}>
                  Remover
                </button>
              </div>
            </div>
            {editingCardIndex === index ? (
              <div className="admin-amateur-card-fields">
                <label>
                  Categoria
                  <input value={card.category} onChange={(e) => updateAmateurCard(index, 'category', e.target.value)} />
                </label>
                <label>
                  Título
                  <input value={card.title} onChange={(e) => updateAmateurCard(index, 'title', e.target.value)} required />
                </label>
                <label>
                  Descrição
                  <textarea rows={2} value={card.description} onChange={(e) => updateAmateurCard(index, 'description', e.target.value)} />
                </label>
                <label>
                  Meta
                  <input value={card.meta} onChange={(e) => updateAmateurCard(index, 'meta', e.target.value)} />
                </label>
              </div>
            ) : null}
          </div>
        ))}

        <button className="admin-add-card-button" type="button" onClick={addAmateurCard}>
          + Adicionar card
        </button>

        <p className="card-eyebrow" style={{ margin: '16px 0 4px' }}>Callout</p>

        <label>
          Título
          <input value={calloutTitle} onChange={(e) => setCalloutTitle(e.target.value)} />
        </label>
        <label>
          Descrição
          <textarea rows={2} value={calloutDescription} onChange={(e) => setCalloutDescription(e.target.value)} />
        </label>
        <label>
          Label do botão
          <input value={calloutActionLabel} onChange={(e) => setCalloutActionLabel(e.target.value)} />
        </label>

        {errorMessage ? <p className="admin-feedback is-error">{errorMessage}</p> : null}
        {feedback ? <p className="admin-feedback is-success">{feedback}</p> : null}

        <div className="admin-hero-actions">
          <button className="advertise-primary" type="submit" disabled={isSaving}>
            {isSaving ? 'Salvando...' : 'Salvar conteúdo'}
          </button>
          <button className="advertise-secondary" type="button" onClick={resetForm}>
            Limpar
          </button>
        </div>
      </form>
    </AdminPanelShell>
  )
}
