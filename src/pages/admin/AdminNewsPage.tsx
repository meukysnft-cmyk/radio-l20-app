import { type FormEvent, useEffect, useMemo, useRef, useState } from 'react'
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
import { RichTextEditor } from '../../components/RichTextEditor'

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

const STATUS_FILTERS: Array<{ key: ContentStatus | 'all'; label: string }> = [
  { key: 'all', label: 'Todos' },
  { key: 'published', label: 'Publicados' },
  { key: 'draft', label: 'Rascunhos' },
  { key: 'archived', label: 'Arquivados' },
]

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

function stripHtml(html: string) {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function AdminNewsPage() {
  const [news, setNews] = useState<Array<FirestoreRecord<NewsDocument>>>([])
  const [form, setForm] = useState<NewsFormState>(emptyNewsForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [statusFilter, setStatusFilter] = useState<ContentStatus | 'all'>('all')
  const [search, setSearch] = useState('')
  const submitIntentRef = useRef<'save' | 'publish' | 'archive' | 'draft'>('save')

  const isEditing = Boolean(editingId)

  const orderedNews = useMemo(
    () => [...news].sort((first, second) => Number(second.featured) - Number(first.featured)),
    [news],
  )

  const filteredNews = useMemo(() => {
    const query = search.trim().toLowerCase()

    return orderedNews.filter((item) => {
      const matchesStatus = statusFilter === 'all' || (item.status || 'draft') === statusFilter
      const matchesSearch =
        !query ||
        item.title.toLowerCase().includes(query) ||
        (item.excerpt || '').toLowerCase().includes(query) ||
        (item.category || '').toLowerCase().includes(query)

      return matchesStatus && matchesSearch
    })
  }, [orderedNews, search, statusFilter])

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
    setFeedback('')
    setErrorMessage('')
  }

  function generateExcerpt() {
    const text = stripHtml(form.content)

    if (!text) {
      setErrorMessage('Escreva um pouco de conteúdo antes de gerar o resumo.')
      return
    }

    setErrorMessage('')
    updateForm('excerpt', text.length > 170 ? `${text.slice(0, 170).trimEnd()}…` : text)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFeedback('')
    setErrorMessage('')
    setIsSaving(true)

    const status = submitIntentRef.current === 'publish'
      ? 'published'
      : submitIntentRef.current === 'archive'
        ? 'archived'
        : submitIntentRef.current === 'draft'
          ? 'draft'
          : form.status

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
      status,
      featured: form.featured,
      tags: form.tags.trim() ? form.tags.split(',').map((tag) => tag.trim()).filter(Boolean) : undefined,
      sourceUrl: form.sourceUrl.trim() || undefined,
    }

    if (!payload.title || !payload.excerpt) {
      setErrorMessage('Informe pelo menos título e resumo da notícia.')
      setIsSaving(false)
      return
    }

    if (status === 'published' && !stripHtml(payload.content)) {
      setErrorMessage('Preencha o conteúdo da notícia antes de publicar.')
      setIsSaving(false)
      return
    }

    try {
      if (editingId) {
        await updateDocument('news', editingId, payload)
        setFeedback(status === 'published' ? 'Notícia publicada com sucesso.' : 'Notícia atualizada no Firestore.')
      } else {
        await createDocument('news', payload)
        setFeedback(status === 'published' ? 'Notícia publicada com sucesso.' : 'Rascunho salvo com sucesso.')
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

      <div className="admin-editor-layout">
        <form className="admin-news-form" onSubmit={handleSubmit}>
          <div>
            <p className="eyebrow">{isEditing ? 'Editando' : 'Nova notícia'}</p>
            <h2>{isEditing ? 'Atualizar notícia' : 'Criar notícia'}</h2>
          </div>

          <section className="admin-form-section">
            <div className="admin-form-section-header">
              <h3>Cabeçalho</h3>
              <small>Texto exibido em cards e na página da notícia</small>
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

            <div className="admin-inline-field">
              <label className="admin-field-label">
                Resumo
                <div className="admin-field-row">
                  <input
                    onChange={(event) => updateForm('excerpt', event.target.value)}
                    placeholder="Resumo curto para cards e chamadas"
                    required
                    value={form.excerpt}
                  />
                  <button
                    className="admin-field-button"
                    onClick={generateExcerpt}
                    title="Gera um resumo automático a partir do conteúdo"
                    type="button"
                  >
                    Gerar
                  </button>
                </div>
              </label>
              <small className="admin-field-hint">O botão “Gerar” cria o resumo a partir do conteúdo escrito.</small>
            </div>
          </section>

          <section className="admin-form-section">
            <div className="admin-form-section-header">
              <h3>Imagem</h3>
              <small>Cole o link de uma imagem (URL)</small>
            </div>

            <label>
              Link da imagem
              <input
                inputMode="url"
                onChange={(event) => updateForm('imageUrl', event.target.value)}
                placeholder="https://exemplo.com/imagem.webp"
                value={form.imageUrl}
              />
            </label>
          </section>

          <section className="admin-form-section">
            <div className="admin-form-section-header">
              <h3>Conteúdo</h3>
              <small>Use a barra para formatar: títulos, listas, citações, links e imagens</small>
            </div>

            <RichTextEditor
              onChange={(html) => updateForm('content', html)}
              placeholder="Escreva aqui a notícia..."
              value={form.content}
            />
          </section>

          <section className="admin-form-section">
            <div className="admin-form-section-header">
              <h3>Publicação</h3>
              <small>Organização e metadados</small>
            </div>

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

            <div className="admin-form-grid">
              <label>
                Autor
                <input
                  onChange={(event) => updateForm('author', event.target.value)}
                  placeholder="Equipe Rádio L20"
                  value={form.author}
                />
              </label>

              <label>
                Editor
                <input
                  onChange={(event) => updateForm('editor', event.target.value)}
                  placeholder="Nome do editor (opcional)"
                  value={form.editor}
                />
              </label>
            </div>

            <div className="admin-form-grid">
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

            <div className="admin-form-grid">
              <label>
                Tags
                <input
                  onChange={(event) => updateForm('tags', event.target.value)}
                  placeholder="futebol, pilar, campeonato"
                  value={form.tags}
                />
                <small className="admin-field-hint">Separadas por vírgula</small>
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
          </section>

          {errorMessage ? <p className="admin-feedback is-error">{errorMessage}</p> : null}
          {feedback ? <p className="admin-feedback is-success">{feedback}</p> : null}

          <div className="admin-hero-actions">
            {isEditing ? (
              <button
                className="advertise-primary admin-hero-action"
                disabled={isSaving}
                onClick={() => { submitIntentRef.current = 'save' }}
                type="submit"
              >
                {isSaving ? 'Salvando...' : 'Salvar alterações'}
              </button>
            ) : (
              <button
                className="advertise-primary admin-hero-action"
                disabled={isSaving}
                onClick={() => { submitIntentRef.current = 'draft' }}
                type="submit"
              >
                {isSaving ? 'Salvando...' : 'Salvar rascunho'}
              </button>
            )}
            <button
              className="advertise-primary admin-hero-action"
              disabled={isSaving}
              onClick={() => { submitIntentRef.current = 'publish' }}
              type="submit"
            >
              Publicar agora
            </button>
            {isEditing && form.status !== 'archived' ? (
              <button
                className="advertise-secondary admin-hero-action"
                disabled={isSaving}
                onClick={() => { submitIntentRef.current = 'archive' }}
                type="submit"
              >
                Arquivar
              </button>
            ) : null}
            {isEditing ? (
              <button className="advertise-secondary admin-hero-action" disabled={isSaving} onClick={resetForm} type="button">
                Cancelar edição
              </button>
            ) : null}
          </div>
        </form>

        <aside className="admin-editor-preview">
          <p className="admin-editor-preview-label">Pré-visualização</p>

          <article className="blog-card">
            {form.imageUrl ? (
              <img className="blog-card-image" alt="" src={form.imageUrl} />
            ) : null}
            <div className="blog-card-body">
              <span className="card-eyebrow">{form.category || 'Categoria'}</span>
              <h3>{form.title || 'Título da notícia'}</h3>
              <p className="blog-card-desc">{form.excerpt || 'O resumo aparecerá aqui.'}</p>
            </div>
          </article>

          <article className="news-detail-card">
            <span className="card-eyebrow">{form.category || 'Categoria'}</span>
            <h2 className="admin-preview-title">{form.title || 'Título da notícia'}</h2>
            {form.subtitle ? <p className="admin-preview-subtitle">{form.subtitle}</p> : null}
            <div className="news-detail-meta">
              {form.author ? <span>{form.author}</span> : null}
              {form.programSlug ? (
                <span>{radioPrograms.find((program) => program.slug === form.programSlug)?.name || form.programSlug}</span>
              ) : null}
              <span>{form.status === 'published' ? 'Publicado' : 'Rascunho'}</span>
            </div>
            {form.imageUrl ? (
              <img alt="" className="news-detail-image" src={form.imageUrl} />
            ) : null}
            <div
              className="news-detail-text"
              dangerouslySetInnerHTML={{ __html: form.content || '<p>O conteúdo da notícia aparecerá aqui.</p>' }}
            />
          </article>
        </aside>
      </div>

      <div className="admin-news-list" aria-live="polite">
        <div className="admin-news-list-header">
          <div>
            <p className="eyebrow">Coleção news</p>
            <h2>Notícias cadastradas</h2>
          </div>
          <div className="admin-news-status-tabs" role="tablist" aria-label="Filtrar por status">
            {STATUS_FILTERS.map((filter) => (
              <button
                className={statusFilter === filter.key ? 'admin-news-status-tab is-active' : 'admin-news-status-tab'}
                key={filter.key}
                onClick={() => setStatusFilter(filter.key)}
                role="tab"
                type="button"
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        <input
          aria-label="Buscar notícias"
          className="admin-news-search"
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar por título, resumo ou categoria..."
          type="search"
          value={search}
        />

        {isLoading ? <p className="admin-feedback">Carregando notícias do Firestore...</p> : null}

        {!isLoading && filteredNews.length === 0 ? (
          <div className="admin-empty-state">
            <p className="eyebrow">Estado vazio</p>
            <h3>Nenhuma notícia encontrada</h3>
            <p>Nenhum item corresponde ao filtro ou busca atual.</p>
          </div>
        ) : null}

        {filteredNews.map((item) => (
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
    </ModulePage>
  )
}
