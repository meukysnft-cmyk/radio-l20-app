import { type FormEvent, useState } from 'react'
import { useAnalyze } from '../../hooks/useAnalyze'
import { PostResultCard } from './PostResultCard'

export function AnalyzeTab() {
  const [url, setUrl] = useState('')
  const { status, post, error, analyze, reset } = useAnalyze()

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const trimmed = url.trim()
    if (!trimmed || !trimmed.includes('instagram.com')) return
    analyze(trimmed)
  }

  return (
    <div className="wol-tab-content">
      <form className="wol-analyze-form" onSubmit={handleSubmit}>
        <div className="wol-analyze-input-group">
          <input
            type="url"
            className="wol-analyze-input"
            placeholder="Cole a URL do post do Instagram aqui..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
          <button
            type="submit"
            className="wol-analyze-btn"
            disabled={status === 'loading' || !url.trim()}
          >
            {status === 'loading' ? 'Analisando...' : 'Analisar'}
          </button>
        </div>
        {status === 'loading' && (
          <p className="wol-analyze-status">Buscando métricas do post...</p>
        )}
        {error && (
          <div className="wol-analyze-error">
            <p>{error}</p>
            <button type="button" className="wol-analyze-reset" onClick={reset}>
              Tentar novamente
            </button>
          </div>
        )}
      </form>

      {post && (
        <div className="wol-analyze-result">
          <h3>Resultado da análise</h3>
          <PostResultCard post={post} />
        </div>
      )}
    </div>
  )
}
