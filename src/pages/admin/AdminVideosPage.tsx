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
import type { ContentStatus, VideoDocument, VideoPlatform } from '../../types/content'
import { getPlatformLabel, getVideoEmbedUrl } from '../../utils/videoEmbed'
import '../../styles/admin.css'
import { ModulePage } from './cms/ModulePage'

type VideoFormState = {
  title: string
  category: string
  platform: VideoPlatform
  videoUrl: string
  description: string
  status: ContentStatus
}

const emptyVideoForm: VideoFormState = {
  title: '',
  category: 'Destaque',
  platform: 'youtube',
  videoUrl: '',
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

const PLATFORM_OPTIONS: { value: VideoPlatform; label: string }[] = [
  { value: 'youtube', label: 'YouTube / Shorts' },
  { value: 'instagram', label: 'Instagram Reel' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'facebook', label: 'Facebook' },
]

export function AdminVideosPage() {
  const [videos, setVideos] = useState<Array<FirestoreRecord<VideoDocument>>>([])
  const [form, setForm] = useState<VideoFormState>(emptyVideoForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const isEditing = Boolean(editingId)

  const orderedVideos = useMemo(
    () => [...videos].sort((first, second) => Number(second.createdAt ?? 0) - Number(first.createdAt ?? 0)),
    [videos],
  )

  useEffect(() => {
    const unsubscribe = subscribeDocuments<VideoDocument>(
      'videos',
      (documents) => {
        setVideos(documents)
        setIsLoading(false)
      },
      (error) => {
        setErrorMessage(getErrorMessage(error))
        setIsLoading(false)
      },
    )

    return () => unsubscribe()
  }, [])

  function updateForm<K extends keyof VideoFormState>(key: K, value: VideoFormState[K]) {
    setForm((currentForm) => ({
      ...currentForm,
      [key]: value,
    }))
  }

  function resetForm() {
    setForm(emptyVideoForm)
    setEditingId(null)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFeedback('')
    setErrorMessage('')
    setIsSaving(true)

    const payload: Omit<VideoDocument, 'id' | 'createdAt' | 'updatedAt'> = {
      title: form.title.trim(),
      category: form.category.trim(),
      platform: form.platform,
      videoUrl: form.videoUrl.trim(),
      description: form.description.trim(),
      status: form.status,
    }

    if (!payload.title || !payload.videoUrl) {
      setErrorMessage('Informe pelo menos o título e o link do vídeo.')
      setIsSaving(false)
      return
    }

    try {
      if (editingId) {
        await updateDocument('videos', editingId, payload)
        setFeedback('Vídeo atualizado no Firestore.')
      } else {
        await createDocument('videos', payload)
        setFeedback('Vídeo criado no Firestore.')
      }

      resetForm()
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    } finally {
      setIsSaving(false)
    }
  }

  function handleEdit(item: FirestoreRecord<VideoDocument>) {
    setEditingId(item.id)
    setFeedback('')
    setErrorMessage('')
    setForm({
      title: item.title || '',
      category: item.category || 'Destaque',
      platform: item.platform || 'youtube',
      videoUrl: item.videoUrl || '',
      description: item.description || '',
      status: item.status || 'draft',
    })
  }

  async function handleDelete(item: FirestoreRecord<VideoDocument>) {
    const shouldDelete = window.confirm(`Excluir o vídeo "${item.title}"?`)

    if (!shouldDelete) {
      return
    }

    setFeedback('')
    setErrorMessage('')

    try {
      await deleteDocument('videos', item.id)
      setFeedback('Vídeo excluído do Firestore.')
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
      title="Vídeos"
      description="Gerencie cortes, lives e destaques do canal da rádio com publicação real no Firestore."
    >
      <div className="admin-news-layout admin-videos-layout">
        <form className="admin-logo-form admin-news-form" onSubmit={handleSubmit}>
          <div>
            <p className="eyebrow">{isEditing ? 'Editando' : 'Novo vídeo'}</p>
            <h2>{isEditing ? 'Atualizar vídeo' : 'Cadastrar vídeo'}</h2>
          </div>

          <label>
            Título
            <input
              onChange={(event) => updateForm('title', event.target.value)}
              placeholder="Nome do vídeo"
              required
              value={form.title}
            />
          </label>

          <div className="admin-form-grid">
            <label>
              Categoria
              <input
                onChange={(event) => updateForm('category', event.target.value)}
                placeholder="Live, Esporte, Destaque..."
                value={form.category}
              />
            </label>

            <label>
              Plataforma
              <select
                onChange={(event) => updateForm('platform', event.target.value as VideoPlatform)}
                value={form.platform}
              >
                {PLATFORM_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
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
            Link do vídeo ({getPlatformLabel(form.platform)})
            <input
              inputMode="url"
              onChange={(event) => updateForm('videoUrl', event.target.value)}
              placeholder={
                form.platform === 'youtube'
                  ? 'https://www.youtube.com/watch?v=...'
                  : form.platform === 'instagram'
                    ? 'https://www.instagram.com/reel/...'
                    : form.platform === 'tiktok'
                      ? 'https://www.tiktok.com/@user/video/...'
                      : 'https://www.facebook.com/watch/?v=...'
              }
              required
              value={form.videoUrl}
            />
          </label>

          <label>
            Descrição
            <textarea
              onChange={(event) => updateForm('description', event.target.value)}
              placeholder="Resumo do vídeo para exibir na tela pública"
              rows={6}
              value={form.description}
            />
          </label>

          {errorMessage ? <p className="admin-feedback is-error">{errorMessage}</p> : null}
          {feedback ? <p className="admin-feedback is-success">{feedback}</p> : null}

          <div className="admin-hero-actions">
            <button className="advertise-primary admin-hero-action" disabled={isSaving} type="submit">
              {isSaving ? 'Salvando...' : isEditing ? 'Salvar edição' : 'Criar vídeo'}
            </button>
            {isEditing ? (
              <button className="advertise-secondary admin-hero-action" type="button" onClick={resetForm}>
                Cancelar edição
              </button>
            ) : null}
            <Link className="advertise-secondary admin-hero-action" to={radioRoutes.videos}>
              Ver vídeos no site
            </Link>
          </div>
        </form>

        <div className="admin-news-list" aria-live="polite">
          <div className="admin-news-list-header">
            <div>
              <p className="eyebrow">Coleção videos</p>
              <h2>Vídeos cadastrados</h2>
            </div>
          </div>

          {isLoading ? <p className="admin-feedback">Carregando vídeos do Firestore...</p> : null}

          {!isLoading && orderedVideos.length === 0 ? (
            <div className="admin-empty-state">
              <p className="eyebrow">Estado vazio</p>
              <h3>Nenhum vídeo encontrado</h3>
              <p>Cadastre o primeiro vídeo para validar a conexão com a coleção videos.</p>
            </div>
          ) : null}

          {orderedVideos.map((item) => {
            const plat = item.platform || 'youtube'
            const embedUrl = getVideoEmbedUrl(item.videoUrl, plat)

            return (
              <article className="admin-news-card" key={item.id}>
                <div>
                  <span>{item.category || 'Sem categoria'}</span>
                  <span className="admin-video-platform-tag">{getPlatformLabel(plat)}</span>
                  <h3>{item.title}</h3>
                  <p>{item.description || 'Sem descrição cadastrada.'}</p>
                  <small>{item.videoUrl}</small>
                </div>

                <dl>
                  <div>
                    <dt>Status</dt>
                    <dd>{getStatusLabel(item.status || 'draft')}</dd>
                  </div>
                  <div>
                    <dt>Plataforma</dt>
                    <dd>{getPlatformLabel(plat)}</dd>
                  </div>
                  <div>
                    <dt>Prévia</dt>
                    <dd>{embedUrl ? 'Disponível' : 'Link direto'}</dd>
                  </div>
                </dl>

                {embedUrl ? (
                  <div className="admin-video-preview">
                    <iframe
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      loading="lazy"
                      src={embedUrl}
                      title={item.title}
                    />
                  </div>
                ) : null}

                <div className="admin-card-actions">
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
