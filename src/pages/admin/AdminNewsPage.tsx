import { type FormEvent, useEffect, useMemo, useState } from 'react'
import {
  createDocument,
  deleteDocument,
  updateDocument,
  subscribeDocuments,
  type FirestoreRecord,
} from '../../services/firestoreService'
import '../../styles/admin.css'
import type { ContentStatus, NewsDocument } from '../../types/content'
import { radioPrograms } from '../../data/programsContent'
import { ModulePage } from './cms/ModulePage'

type NewsFormState = {
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

const emptyNewsForm: NewsFormState = {
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

export function AdminNewsPage() {
  const [news, setNews] = useState<Array<FirestoreRecord<NewsDocument>>>([])
  const [form, setForm] = useState<NewsFormState>(emptyNewsForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const isEditing = Boolean(editingId)

  const orderedNews = useMemo(
    () => [...news].sort((first, second) => Number(second.featured) - Number(first.featured)),
    [news],
  )

  useEffect(() => {
    const unsubscribe = subscribeDocuments<NewsDocument>(
      'news',
      (documents) => {
        setNews(documents)
        setIsLoading(false)
      },
      (error) => {
        setErrorMessage(getErrorMessage(error))
        setIsLoading(false)
      },
    )

    return () => unsubscribe()
  }, [])

  function updateForm<K extends keyof NewsFormState>(key: K, value: NewsFormState[K]) {
    setForm((currentForm) => ({
      ...currentForm,
      [key]: value,
    }))
  }

  function resetForm() {
    setForm(emptyNewsForm)
    setEditingId(null)
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
      setErrorMessage('Informe pelo menos título e resumo da notícia.')
      setIsSaving(false)
      return
    }

    try {
      if (editingId) {
        await updateDocument('news', editingId, payload)
        setFeedback('Notícia atualizada no Firestore.')
      } else {
        await createDocument('news', payload)
        setFeedback('Notícia criada no Firestore.')
      }

      resetForm()
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    } finally {
      setIsSaving(false)
    }
  }

  function handleEdit(item: FirestoreRecord<NewsDocument>) {
    setEditingId(item.id)
    setFeedback('')
    setErrorMessage('')
    setForm({
      title: item.title || '',
      subtitle: item.subtitle || '',
      excerpt: item.excerpt || '',
      category: item.category || 'Cidade',
      section: item.section || 'general',
      author: item.author || '',
      editor: item.editor || '',
      content: item.content || '',
      imageUrl: item.imageUrl || '',
      programSlug: item.programSlug || '',
      status: item.status || 'draft',
      featured: Boolean(item.featured),
      tags: item.tags?.join(', ') || '',
      sourceUrl: item.sourceUrl || '',
    })
  }

  async function handleDelete(item: FirestoreRecord<NewsDocument>) {
    const shouldDelete = window.confirm(`Excluir a notícia "${item.title}"?`)

    if (!shouldDelete) {
      return
    }

    setFeedback('')
    setErrorMessage('')

    try {
      await deleteDocument('news', item.id)
      setFeedback('Notícia excluída do Firestore.')
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
      title="Notícias"
      description="Crie, edite, publique e exclua notícias da Rádio L20."
    >

      <div className="admin-news-layout">
        <form className="admin-logo-form admin-news-form" onSubmit={handleSubmit}>
          <div>
            <p className="eyebrow">{isEditing ? 'Editando' : 'Nova notícia'}</p>
            <h2>{isEditing ? 'Atualizar notícia' : 'Criar notícia'}</h2>
          </div>

          <label>
            Título
            <input
              onChange={(event) => updateForm('title', event.target.value)}
              placeholder="Título da notícia"
              required
              value={form.title}
            />
          </label>

          <label>
            Subtítulo
            <input
              onChange={(event) => updateForm('subtitle', event.target.value)}
              placeholder="Subtítulo opcional"
              value={form.subtitle}
            />
          </label>

          <label>
            Resumo
            <input
              onChange={(event) => updateForm('excerpt', event.target.value)}
              placeholder="Resumo curto para cards e chamadas"
              required
              value={form.excerpt}
            />
          </label>

          <div className="admin-form-grid">
            <label>
              Categoria
              <select
                onChange={(event) => updateForm('category', event.target.value)}
                value={form.category}
              >
                <option value="Cidade">Cidade</option>
                <option value="Política">Política</option>
                <option value="Cultura">Cultura</option>
                <option value="Economia">Economia</option>
                <option value="Saúde">Saúde</option>
                <option value="Educação">Educação</option>
                <option value="Utilidade Pública">Utilidade Pública</option>
                <option value="Esporte Local">Esporte Local</option>
                <option value="Esporte Nacional">Esporte Nacional</option>
                <option value="Esporte Internacional">Esporte Internacional</option>
              </select>
            </label>

            <label>
              Autor
              <input
                onChange={(event) => updateForm('author', event.target.value)}
                placeholder="Equipe Rádio L20"
                value={form.author}
              />
            </label>
          </div>

          <div className="admin-form-grid">
            <label>
              Editor
              <input
                onChange={(event) => updateForm('editor', event.target.value)}
                placeholder="Nome do editor (opcional)"
                value={form.editor}
              />
            </label>
            <label>
              Seção
              <select
                onChange={(event) => updateForm('section', event.target.value as 'general' | 'sports')}
                value={form.section}
              >
                <option value="general">Notícia Geral</option>
                <option value="sports">Notícia Esportiva</option>
              </select>
            </label>
          </div>

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

          <label>
            Link da imagem
            <input
              inputMode="url"
              onChange={(event) => updateForm('imageUrl', event.target.value)}
              placeholder="https://exemplo.com/imagem.webp"
              value={form.imageUrl}
            />
          </label>

          <label>
            Programa vinculado
            <select
              onChange={(event) => updateForm('programSlug', event.target.value)}
              value={form.programSlug}
            >
              <option value="">Nenhum programa</option>
              {radioPrograms.map((program) => (
                <option key={program.slug} value={program.slug}>
                  {program.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Conteúdo
            <textarea
              onChange={(event) => updateForm('content', event.target.value)}
              placeholder="Texto completo da notícia"
              rows={7}
              value={form.content}
            />
          </label>

          <div className="admin-form-grid">
            <label>
              Tags
              <input
                onChange={(event) => updateForm('tags', event.target.value)}
                placeholder="futebol, pilar, campeonato"
                value={form.tags}
              />
              <small style={{ opacity: 0.6 }}>Separadas por vírgula</small>
            </label>
            <label>
              Origem da informação
              <input
                inputMode="url"
                onChange={(event) => updateForm('sourceUrl', event.target.value)}
                placeholder="https://ge.globo.com/..."
                value={form.sourceUrl}
              />
            </label>
          </div>

          <label className="admin-checkbox">
            <input
              checked={form.featured}
              onChange={(event) => updateForm('featured', event.target.checked)}
              type="checkbox"
            />
            Marcar como notícia em destaque
          </label>

          {errorMessage ? <p className="admin-feedback is-error">{errorMessage}</p> : null}
          {feedback ? <p className="admin-feedback is-success">{feedback}</p> : null}

          <div className="admin-hero-actions">
            <button className="advertise-primary admin-hero-action" disabled={isSaving} type="submit">
              {isSaving ? 'Salvando...' : isEditing ? 'Salvar edição' : 'Criar notícia'}
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
              <p className="eyebrow">Coleção news</p>
              <h2>Notícias cadastradas</h2>
            </div>
          </div>

          {isLoading ? <p className="admin-feedback">Carregando notícias do Firestore...</p> : null}

          {!isLoading && orderedNews.length === 0 ? (
            <div className="admin-empty-state">
              <p className="eyebrow">Estado vazio</p>
              <h3>Nenhuma notícia encontrada</h3>
              <p>Crie a primeira notícia para validar a conexão com o Firestore.</p>
            </div>
          ) : null}

          {orderedNews.map((item) => (
            <article className="admin-news-card" key={item.id}>
              <div>
                <span>{item.category || 'Sem categoria'}</span>
                <h3>{item.title}</h3>
                {item.subtitle ? <p style={{ opacity: 0.7, fontSize: '0.9rem' }}>{item.subtitle}</p> : null}
                <p>{item.excerpt}</p>
                {item.author ? <small>Autor: {item.author}</small> : null}
                {item.editor ? <small>Editor: {item.editor}</small> : null}
                {item.programSlug ? <small>Programa: {radioPrograms.find((program) => program.slug === item.programSlug)?.name || item.programSlug}</small> : null}
                {item.tags?.length ? <small>Tags: {item.tags.join(', ')}</small> : null}
                {item.sourceUrl ? <small>Fonte: <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer">{item.sourceUrl}</a></small> : null}
              </div>
              <dl>
                <div>
                  <dt>Status</dt>
                  <dd>{getStatusLabel(item.status || 'draft')}</dd>
                </div>
                <div>
                  <dt>Destaque</dt>
                  <dd>{item.featured ? 'Sim' : 'Não'}</dd>
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
