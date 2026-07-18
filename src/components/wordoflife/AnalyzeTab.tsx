import { type FormEvent, useState } from 'react'
import { useAnalyze } from '../../hooks/useAnalyze'
import { useBatchAnalyze } from '../../hooks/useBatchAnalyze'
import { PostResultCard } from './PostResultCard'
import type { WordOfLifePost } from '../../types/wordOfLife'

export function AnalyzeTab() {
  const [inputMode, setInputMode] = useState<'single' | 'batch'>('single')
  const [url, setUrl] = useState('')
  const [urls, setUrls] = useState('')
  const single = useAnalyze()
  const batch = useBatchAnalyze()

  const handleSingle = (e: FormEvent) => {
    e.preventDefault()
    const trimmed = url.trim()
    if (!trimmed || !trimmed.includes('instagram.com')) return
    single.analyze(trimmed)
  }

  const handleBatch = (e: FormEvent) => {
    e.preventDefault()
    const lines = urls.split('\n').filter((l) => l.trim())
    if (lines.length === 0) return
    batch.analyze(lines)
  }

  const successResults: WordOfLifePost[] = batch.results
    .filter((r): r is { url: string; post: WordOfLifePost } => !!r.post)
    .map((r) => r.post)

  return (
    <div className="wol-tab-content">
      <div className="wol-mode-toggle">
        <button
          type="button"
          className={`wol-mode-btn${inputMode === 'single' ? ' is-active' : ''}`}
          onClick={() => setInputMode('single')}
        >
          Post único
        </button>
        <button
          type="button"
          className={`wol-mode-btn${inputMode === 'batch' ? ' is-active' : ''}`}
          onClick={() => setInputMode('batch')}
        >
          Análise em lote
        </button>
      </div>

      {inputMode === 'single' ? (
        <form className="wol-analyze-form" onSubmit={handleSingle}>
          <div className="wol-analyze-input-group">
            <input
              type="url"
              className="wol-analyze-input"
              placeholder="Cole a URL do post/reel do Instagram aqui..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
            <button
              type="submit"
              className="wol-analyze-btn"
              disabled={single.status === 'loading' || !url.trim()}
            >
              {single.status === 'loading' ? 'Analisando...' : 'Analisar'}
            </button>
          </div>
          {single.status === 'loading' && (
            <p className="wol-analyze-status">Buscando métricas do post...</p>
          )}
          {single.error && (
            <div className="wol-analyze-error">
              <p>{single.error}</p>
              <button type="button" className="wol-analyze-reset" onClick={single.reset}>
                Tentar novamente
              </button>
            </div>
          )}
        </form>
      ) : (
        <form className="wol-analyze-form" onSubmit={handleBatch}>
          <textarea
            className="wol-batch-textarea"
            placeholder={'Cole as URLs do Instagram aqui...\nUma URL por linha\n\nExemplo:\nhttps://www.instagram.com/reel/ABC123/\nhttps://www.instagram.com/p/XYZ789/\nhttps://www.instagram.com/reel/DEF456/'}
            value={urls}
            onChange={(e) => setUrls(e.target.value)}
            rows={8}
          />
          <div className="wol-batch-actions">
            <span className="wol-batch-count">
              {urls.split('\n').filter((l) => l.trim().includes('instagram.com')).length} URL(s) detectada(s)
            </span>
            <button
              type="submit"
              className="wol-analyze-btn"
              disabled={batch.status === 'loading' || !urls.trim()}
            >
              {batch.status === 'loading'
                ? `Analisando ${batch.completed}/${batch.total}...`
                : 'Analisar todas'}
            </button>
          </div>
          {batch.status === 'loading' && (
            <div className="wol-batch-progress">
              <div className="wol-progress-bar">
                <div
                  className="wol-progress-fill"
                  style={{ width: `${(batch.completed / batch.total) * 100}%` }}
                />
              </div>
              <p className="wol-analyze-status">
                {batch.completed} de {batch.total} analisados
                {batch.currentUrl ? ` — ${batch.currentUrl.slice(0, 50)}...` : ''}
              </p>
            </div>
          )}
          {batch.error && (
            <div className="wol-analyze-error">
              <p>{batch.error}</p>
              <button type="button" className="wol-analyze-reset" onClick={batch.reset}>
                Limpar
              </button>
            </div>
          )}
        </form>
      )}

      {single.post && (
        <div className="wol-analyze-result">
          <h3>Resultado da análise</h3>
          <PostResultCard post={single.post} />
        </div>
      )}

      {successResults.length > 0 && (
        <div className="wol-analyze-result">
          <h3>{successResults.length} post(s) analisado(s) com sucesso</h3>
          <div className="wol-batch-results-list">
            {successResults
              .sort((a, b) => b.metrics.engagementRate - a.metrics.engagementRate)
              .map((post, i) => (
                <div key={post.id || i} className="wol-batch-result-row">
                  <span className="wol-batch-rank">#{i + 1}</span>
                  <PostResultCard post={post} />
                </div>
              ))}
          </div>
        </div>
      )}

      {batch.results.filter((r) => r.error).length > 0 && batch.status !== 'loading' && (
        <div className="wol-analyze-result">
          <h3>Erros</h3>
          {batch.results.filter((r) => r.error).map((r, i) => (
            <div key={i} className="wol-batch-error-row">
              <span className="wol-batch-error-url">{r.url.slice(0, 60)}</span>
              <span className="wol-batch-error-msg">{r.error}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
