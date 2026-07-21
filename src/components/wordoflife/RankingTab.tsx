import { useMemo, useState } from 'react'
import { useWordOfLifePostsRealtime } from '../../hooks/useWordOfLifePosts'
import { useDeletePost } from '../../hooks/useDeletePost'

function formatNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M'
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'K'
  return String(n)
}

type SortKey = 'views' | 'likes' | 'comments' | 'engagementRate'

export function RankingTab() {
  const { posts, loading, error } = useWordOfLifePostsRealtime(100)
  const [sortBy, setSortBy] = useState<SortKey>('views')
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const { remove } = useDeletePost()

  const ranked = useMemo(() => {
    const sorted = [...posts].sort((a, b) => {
      const va = (a.metrics as Record<string, number>)[sortBy] || 0
      const vb = (b.metrics as Record<string, number>)[sortBy] || 0
      return vb - va
    })
    return sorted.map((p, i) => ({ ...p, rank: i + 1 }))
  }, [posts, sortBy])

  const medals = ['🥇', '🥈', '🥉']

  function handleDelete(docId: string) {
    if (confirmDelete === docId) {
      remove(docId)
      setConfirmDelete(null)
    } else {
      setConfirmDelete(docId)
      setTimeout(() => setConfirmDelete(null), 3000)
    }
  }

  function getRankingUrl() {
    return `${window.location.origin}/ranking-palavra-de-vida.html`
  }

  function handleShareWhatsApp() {
    const url = getRankingUrl()
    const text = encodeURIComponent(`📊 Acesse o Ranking Palavra de Vida:\n\n${url}`)
    window.open(`https://wa.me/?text=${text}`, '_blank')
  }

  function handleCopyLink() {
    navigator.clipboard.writeText(getRankingUrl()).catch(() => {})
  }

  function handleRefresh() {
    window.location.reload()
  }

  return (
    <div className="wol-tab-content">
      <div className="wol-ranking-header">
        <h3>Ranking de Reels</h3>
        <div className="wol-ranking-actions">
          <button type="button" className="wol-action-btn wol-refresh-btn" onClick={handleRefresh}>
            Atualizar dados
          </button>
          <button type="button" className="wol-action-btn wol-share-btn" onClick={handleShareWhatsApp}>
            Compartilhar WhatsApp
          </button>
          <button type="button" className="wol-action-btn wol-copy-btn" onClick={handleCopyLink}>
            Copiar link
          </button>
        </div>
      </div>

      <div className="wol-sort-buttons">
        {([
          { key: 'views' as SortKey, label: 'Views' },
          { key: 'likes' as SortKey, label: 'Curtidas' },
          { key: 'comments' as SortKey, label: 'Comentários' },
          { key: 'engagementRate' as SortKey, label: 'Engajamento' },
        ]).map((opt) => (
          <button
            key={opt.key}
            type="button"
            className={`wol-sort-btn${sortBy === opt.key ? ' is-active' : ''}`}
            onClick={() => setSortBy(opt.key)}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {loading && <p className="wol-loading">Carregando ranking...</p>}
      {error && <p className="wol-error-text">{error}</p>}

      {!loading && ranked.length === 0 && (
        <div className="wol-empty">
          <p>Nenhum post analisado ainda.</p>
          <p className="wol-empty-hint">Use a aba "Analisar" para analisar posts do Instagram.</p>
        </div>
      )}

      {ranked.length > 0 && (
        <div className="wol-ranking-list">
          {ranked.map((post) => (
            <div
              key={post.id || post.shortcode}
              className={`wol-ranking-row${post.rank <= 3 ? ` wol-ranking-top${post.rank}` : ''}`}
            >
              <span className="wol-ranking-pos">
                {post.rank <= 3 ? medals[post.rank - 1] : `#${post.rank}`}
              </span>
              {post.imageUrl && (
                <img className="wol-ranking-thumb" src={post.imageUrl} alt="" loading="lazy" />
              )}
              <div className="wol-ranking-info">
                <span className="wol-ranking-shortcode">#{post.shortcode}</span>
                <p className="wol-ranking-caption">{post.caption?.slice(0, 80) || 'Sem legenda'}</p>
              </div>
              <div className="wol-ranking-stats">
                <span className="wol-stat">
                  <span className="wol-stat-icon">👁️</span>
                  <span className="wol-stat-value">{formatNumber(post.metrics.views)}</span>
                  <span className="wol-stat-label">views</span>
                </span>
                <span className="wol-stat">
                  <span className="wol-stat-icon">❤️</span>
                  <span className="wol-stat-value">{formatNumber(post.metrics.likes)}</span>
                  <span className="wol-stat-label">curtidas</span>
                </span>
                <span className="wol-stat">
                  <span className="wol-stat-icon">💬</span>
                  <span className="wol-stat-value">{formatNumber(post.metrics.comments)}</span>
                  <span className="wol-stat-label">coment.</span>
                </span>
              </div>
              <div className="wol-ranking-actions-row">
                <a
                  className="wol-ranking-link"
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ver
                </a>
                {post.id && (
                  <button
                    type="button"
                    className={`wol-delete-btn${confirmDelete === post.id ? ' is-confirm' : ''}`}
                    onClick={() => handleDelete(post.id)}
                  >
                    {confirmDelete === post.id ? 'Confirmar' : 'Excluir'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
