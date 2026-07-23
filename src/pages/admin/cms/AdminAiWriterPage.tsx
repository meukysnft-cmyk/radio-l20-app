import { type FormEvent, useState } from 'react'
import {
  createDocument,
} from '../../../services/firestoreService'
import { ModulePage } from './ModulePage'
import { getProgramLabelBySlug } from '../../../data/programsContent'

type Step = 'form' | 'loading' | 'preview'

type AiResult = {
  title: string
  subtitle?: string
  content: string
  excerpt: string
  imageUrl: string
  sourceUrl: string
}

const CATEGORIES = [
  'Cidade', 'Esporte Local', 'Esporte Nacional', 'Esporte Internacional',
  'Política', 'Cultura', 'Economia', 'Saúde', 'Educação', 'Utilidade Pública',
]

export function AdminAiWriterPage() {
  const [step, setStep] = useState<Step>('form')
  const [url, setUrl] = useState('')
  const [instructions, setInstructions] = useState('')
  const [result, setResult] = useState<AiResult | null>(null)
  const [feedback, setFeedback] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const [publishCategory, setPublishCategory] = useState('Cidade')
  const [publishSection, setPublishSection] = useState<'general' | 'sports'>('general')
  const [publishProgram, setPublishProgram] = useState('')
  const [publishTags, setPublishTags] = useState('')
  const [isPublishing, setIsPublishing] = useState(false)
  const [publishFeedback, setPublishFeedback] = useState('')

  async function handleRewrite(e: FormEvent) {
    e.preventDefault()
    if (!url.trim()) { setErrorMessage('Cole a URL da notícia'); return }
    setFeedback('')
    setErrorMessage('')
    setStep('loading')
    setResult(null)
    try {
      const body = JSON.stringify({ url: url.trim(), instructions: instructions.trim() })
      const apiBase = import.meta.env.VITE_WORDOFLIFE_API_URL || ''
      const res = await fetch(`${apiBase}/api/ai/rewrite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
        signal: AbortSignal.timeout(45_000),
      })
      const json = await res.json()
      if (!json.ok) throw new Error(json.error || 'Erro ao reescrever')
      setResult(json.data)
      setStep('preview')
      setFeedback('Notícia reescrita com sucesso! Revise e publique abaixo.')
    } catch (err) {
      setStep('form')
      setErrorMessage(err instanceof Error ? err.message : 'Erro de conexão')
    }
  }

  async function handlePublish() {
    if (!result) return
    setIsPublishing(true)
    setPublishFeedback('')
    try {
      const payload = {
        title: result.title,
        subtitle: result.subtitle || undefined,
        content: result.content,
        excerpt: result.excerpt,
        imageUrl: result.imageUrl,
        category: publishCategory,
        section: publishSection,
        programSlug: publishProgram || undefined,
        author: 'Rádio L20',
        sourceUrl: result.sourceUrl,
        tags: publishTags.trim() ? publishTags.split(',').map((t) => t.trim()).filter(Boolean) : undefined,
        status: 'published',
        featured: false,
        createdAt: new Date(),
      }
      await createDocument('news', payload)
      setPublishFeedback('Notícia publicada com sucesso!')
      setResult(null)
      setStep('form')
      setUrl('')
      setInstructions('')
    } catch (err) {
      setPublishFeedback(err instanceof Error ? err.message : 'Erro ao publicar')
    } finally {
      setIsPublishing(false)
    }
  }

  function resetForm() {
    setStep('form')
    setResult(null)
    setFeedback('')
    setErrorMessage('')
    setPublishFeedback('')
  }

  return (
    <ModulePage
      eyebrow="Conteúdo"
      title="Reescrita com IA"
      description="Cole o link de uma notícia (GE, UOL, Lance, etc.) e a IA reescreve com tom local. Depois publique direto no site."
    >
      {step === 'form' && (
        <form className="cms-crud-layout" onSubmit={handleRewrite}>
          <div className="cms-form" style={{ maxWidth: 700 }}>
            <h3>Nova reescrita</h3>

            <label>URL da notícia original
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://ge.globo.com/..."
                required
              />
            </label>

            <label>Instruções adicionais (opcional)
              <textarea
                rows={3}
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder='Ex: "Foque nos times alagoanos" ou "Use tom mais popular"'
              />
            </label>

            <label>Publicar em
              <select value={publishCategory} onChange={(e) => setPublishCategory(e.target.value)}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </label>

            <label>Seção
              <select value={publishSection} onChange={(e) => setPublishSection(e.target.value as 'general' | 'sports')}>
                <option value="general">Notícia Geral</option>
                <option value="sports">Notícia Esportiva</option>
              </select>
            </label>

            <label>Programa (opcional)
              <input
                type="text"
                value={publishProgram}
                onChange={(e) => setPublishProgram(e.target.value)}
                placeholder="ex: esporte-local"
              />
              <small style={{ opacity: 0.6 }}>Slug do programa, ex: esporte-local, jornada-esportiva</small>
            </label>

            <label>Tags (opcional)
              <input
                type="text"
                value={publishTags}
                onChange={(e) => setPublishTags(e.target.value)}
                placeholder="futebol, pilar, campeonato"
              />
              <small style={{ opacity: 0.6 }}>Separadas por vírgula</small>
            </label>

            {errorMessage && <p className="cms-alert is-error">{errorMessage}</p>}
            {feedback && <p className="cms-alert is-success">{feedback}</p>}

            <div className="cms-form-actions">
              <button className="cms-btn is-primary" type="submit">
                ✨ Reescrever com IA
              </button>
            </div>
          </div>
        </form>
      )}

      {step === 'loading' && (
        <div className="cms-placeholder" style={{ marginTop: 40 }}>
          <div className="cms-placeholder-icon">🤖</div>
          <h3>Reescrevendo...</h3>
          <p>A IA está analisando o artigo e gerando uma versão adaptada para a Rádio L20.</p>
          <div className="cms-loading" style={{ marginTop: 16 }}>Processando</div>
        </div>
      )}

      {step === 'preview' && result && (
        <div style={{ maxWidth: 800 }}>
          {feedback && <p className="cms-alert is-success">{feedback}</p>}

          <div className="cms-crud-layout">
            <div className="cms-form" style={{ border: 'none', padding: 0 }}>
              {result.imageUrl && (
                <img
                  src={result.imageUrl}
                  alt=""
                  style={{ width: '100%', maxHeight: 300, objectFit: 'cover', borderRadius: 8, marginBottom: 16 }}
                />
              )}

              <h3 style={{ fontSize: '1.3rem', marginBottom: 8 }}>{result.title}</h3>

              <div
                style={{ lineHeight: 1.7, whiteSpace: 'pre-wrap', marginBottom: 16 }}
                dangerouslySetInnerHTML={{ __html: result.content }}
              />

              <p style={{ fontSize: '0.85rem', opacity: 0.6, marginBottom: 16 }}>
                Fonte original: <a href={result.sourceUrl} target="_blank" rel="noopener noreferrer">{result.sourceUrl}</a>
              </p>

              <div className="cms-form-row" style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <label style={{ flex: 1, minWidth: 140 }}>Categoria
                  <select value={publishCategory} onChange={(e) => setPublishCategory(e.target.value)}>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </label>
                <label style={{ flex: 1, minWidth: 140 }}>Seção
                  <select value={publishSection} onChange={(e) => setPublishSection(e.target.value as 'general' | 'sports')}>
                    <option value="general">Notícia Geral</option>
                    <option value="sports">Notícia Esportiva</option>
                  </select>
                </label>
                <label style={{ flex: 1, minWidth: 140 }}>Programa
                  <input value={publishProgram} onChange={(e) => setPublishProgram(e.target.value)} placeholder="slug" />
                </label>
                <label style={{ flex: 1, minWidth: 140 }}>Tags
                  <input value={publishTags} onChange={(e) => setPublishTags(e.target.value)} placeholder="futebol, pilar" />
                </label>
              </div>

              {publishFeedback && <p className={`cms-alert ${publishFeedback.includes('sucesso') ? 'is-success' : 'is-error'}`}>{publishFeedback}</p>}

              <div className="cms-form-actions">
                <button className="cms-btn is-primary" disabled={isPublishing} onClick={handlePublish} type="button">
                  {isPublishing ? 'Publicando...' : '📰 Publicar no site'}
                </button>
                <button className="cms-btn" type="button" onClick={resetForm}>Cancelar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </ModulePage>
  )
}
