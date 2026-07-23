import { type FormEvent, useState } from 'react'
import { radioPrograms } from '../data/programsContent'
import {
  createDocument,
  deleteDocument,
  updateDocument,
  type FirestoreRecord,
} from '../services/firestoreService'
import type { ContentStatus, NewsDocument } from '../types/content'
import { AdminPanelShell } from './AdminPanelShell'
import '../styles/admin.css'

export type NewsFormState = {
  title: string
  subtitle: string
  excerpt: string
  category: string
  section: 'general' | 'sports'
  author: string
  editor: string
  content: string
  imageUrl: string
  programSlug: string
  status: ContentStatus
  featured: boolean
  tags: string
  sourceUrl: string
}

export const emptyNewsForm: NewsFormState = {
  title: '',
  subtitle: '',
  excerpt: '',
  category: 'Cidade',
  section: 'general',
  author: '',
  editor: '',
  content: '',
  imageUrl: '',
  programSlug: '',
  status: 'draft',
  featured: false,
  tags: '',
  sourceUrl: '',
}

type NewsAdminPanelProps = {
  isOpen: boolean
  onClose: () => void
  onSaved: () => void
  editingItem: FirestoreRecord<NewsDocument> | null
  selectedProgramName: string
}

export function NewsAdminPanel({
  isOpen,
  onClose,
  onSaved,
  editingItem,
  selectedProgramName,
}: NewsAdminPanelProps) {
  const [form, setForm] = useState<NewsFormState>(
    editingItem
      ? {
          title: editingItem.title || '',
          subtitle: editingItem.subtitle || '',
          excerpt: editingItem.excerpt || '',
          category: editingItem.category || 'Cidade',
          section: editingItem.section || 'general',
          author: editingItem.author || '',
          editor: editingItem.editor || '',
          content: editingItem.content || '',
          imageUrl: editingItem.imageUrl || '',
          programSlug: editingItem.programSlug || '',
          status: editingItem.status || 'draft',
          featured: Boolean(editingItem.featured),
          tags: editingItem.tags?.join(', ') || '',
          sourceUrl: editingItem.sourceUrl || '',
        }
      : emptyNewsForm,
  )
  const [isSaving, setIsSaving] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  function updateForm<K extends keyof NewsFormState>(key: K, value: NewsFormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function resetForm() {
    setForm(emptyNewsForm)
    onClose()
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFeedback('')
    setErrorMessage('')
    setIsSaving(true)

    const payload: Omit<NewsDocument, 'id' | 'createdAt' | 'updatedAt'> = {
      title: form.title.trim(),
      subtitle: form.subtitle.trim() || undefined,
      excerpt: form.excerpt.trim(),
      category: form.category.trim(),
      section: form.section,
      author: form.author.trim(),
      editor: form.editor.trim() || undefined,
      content: form.content.trim(),
      imageUrl: form.imageUrl.trim(),
      programSlug: form.programSlug.trim() || undefined,
      status: form.status,
      featured: form.featured,
      tags: form.tags.trim() ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : undefined,
      sourceUrl: form.sourceUrl.trim() || undefined,
    }

    if (!payload.title || !payload.excerpt) {
      setErrorMessage('Informe pelo menos título e resumo.')
      setIsSaving(false)
      return
    }

    try {
      if (editingItem) {
        await updateDocument('news', editingItem.id, payload)
        setFeedback('Notícia atualizada.')
      } else {
        await createDocument('news', payload)
        setFeedback('Notícia criada.')
      }
      resetForm()
      onSaved()
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Falha ao salvar notícia.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <AdminPanelShell
      isOpen={isOpen}
      onClose={onClose}
      eyebrow="Admin / Notícias"
      title={editingItem ? 'Editar notícia' : 'Nova notícia'}
    >
      <form className="admin-inline-form" onSubmit={handleSubmit}>
        <div className="admin-form-grid">
          <label>
            Título
            <input value={form.title} onChange={(e) => updateForm('title', e.target.value)} required />
          </label>
          <label>
            Subtítulo
            <input value={form.subtitle} onChange={(e) => updateForm('subtitle', e.target.value)} placeholder="Opcional" />
          </label>
        </div>

        <label>
          Resumo
          <input value={form.excerpt} onChange={(e) => updateForm('excerpt', e.target.value)} required />
        </label>

        <div className="admin-form-grid">
          <label>
            Categoria
            <input value={form.category} onChange={(e) => updateForm('category', e.target.value)} />
          </label>
          <label>
            Autor
            <input value={form.author} onChange={(e) => updateForm('author', e.target.value)} />
          </label>
        </div>

        <div className="admin-form-grid">
          <label>
            Editor
            <input value={form.editor} onChange={(e) => updateForm('editor', e.target.value)} placeholder="Opcional" />
          </label>
          <label>
            Programa
            <select value={form.programSlug} onChange={(e) => updateForm('programSlug', e.target.value)}>
              <option value="">Selecione um programa</option>
              {radioPrograms.map((program) => (
                <option key={program.slug} value={program.slug}>
                  {program.name}
                </option>
              ))}
            </select>
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
        <div className="admin-form-grid">
          <label>
            Seção
            <select value={form.section} onChange={(e) => updateForm('section', e.target.value as 'general' | 'sports')}>
              <option value="general">Notícia Geral</option>
              <option value="sports">Notícia Esportiva</option>
            </select>
          </label>
        </div>

        <label>
          Imagem
          <input value={form.imageUrl} onChange={(e) => updateForm('imageUrl', e.target.value)} placeholder="https://..." />
        </label>

        {selectedProgramName ? (
          <p className="admin-feedback">Vinculada ao programa: {selectedProgramName}</p>
        ) : null}

        <label>
          Conteúdo
          <textarea value={form.content} onChange={(e) => updateForm('content', e.target.value)} rows={4} />
        </label>

        <div className="admin-form-grid">
          <label>
            Tags
            <input value={form.tags} onChange={(e) => updateForm('tags', e.target.value)} placeholder="futebol, pilar, campeonato" />
            <small style={{ opacity: 0.6 }}>Separadas por vírgula</small>
          </label>
          <label>
            Origem da informação
            <input value={form.sourceUrl} onChange={(e) => updateForm('sourceUrl', e.target.value)} placeholder="https://..." />
          </label>
        </div>

        <label className="admin-checkbox">
          <input checked={form.featured} onChange={(e) => updateForm('featured', e.target.checked)} type="checkbox" />
          Notícias em destaque
        </label>

        {errorMessage ? <p className="admin-feedback is-error">{errorMessage}</p> : null}
        {feedback ? <p className="admin-feedback is-success">{feedback}</p> : null}

        <div className="admin-hero-actions">
          <button className="advertise-primary" type="submit" disabled={isSaving}>
            {isSaving ? 'Salvando...' : editingItem ? 'Salvar edição' : 'Publicar notícia'}
          </button>
          {editingItem ? (
            <button className="advertise-secondary" type="button" onClick={resetForm}>
              Cancelar edição
            </button>
          ) : null}
        </div>
      </form>
    </AdminPanelShell>
  )
}

export async function deleteNewsItem(item: FirestoreRecord<NewsDocument>) {
  if (!window.confirm(`Excluir a notícia "${item.title}"?`)) {
    return false
  }

  try {
    await deleteDocument('news', item.id)
    return true
  } catch (error) {
    alert(error instanceof Error ? error.message : 'Falha ao excluir notícia.')
    return false
  }
}
