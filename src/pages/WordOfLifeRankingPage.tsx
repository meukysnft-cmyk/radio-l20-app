import { useMemo, useState } from 'react'
import { useWordOfLifePostsRealtime } from '../hooks/useWordOfLifePosts'
import { SkRankingPage } from '../components/Skeleton'
import type { WordOfLifePost } from '../types/wordOfLife'

function formatNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M'
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'K'
  return String(n)
}

type SortKey = 'views' | 'likes' | 'comments' | 'engagementRate'

export function WordOfLifeRankingPage() {
  const { posts, loading, error } = useWordOfLifePostsRealtime(100)
  const [sortBy, setSortBy] = useState<SortKey>('views')

  const ranked = useMemo(() => {
    const sorted = [...posts].sort((a: WordOfLifePost, b: WordOfLifePost) => {
      const va = (a.metrics as Record<string, number>)[sortBy] || 0
      const vb = (b.metrics as Record<string, number>)[sortBy] || 0
      return vb - va
    })
    return sorted.map((p, i) => ({ ...p, rank: i + 1 }))
  }, [posts, sortBy])

  const medals = ['🥇', '🥈', '🥉']

  function handleShareWhatsApp() {
    const url = `${window.location.origin}/ranking-palavra-de-vida.html`
    const text = encodeURIComponent(`📊 Acesse o Ranking Palavra de Vida:\n\n${url}`)
    window.open(`https://wa.me/?text=${text}`, '_blank')
  }

  return (
    <section className="wol-public-page" aria-labelledby="wol-ranking-title">
      <header className="wol-public-header">
        <h1 id="wol-ranking-title">📊 Ranking Palavra de Vida</h1>
        <p>Acompanhe o desempenho dos reels do programa no Instagram.</p>
        <button type="button" className="wol-share-btn-public" onClick={handleShareWhatsApp}>
          📲 Compartilhar no WhatsApp
        </button>
      </header>

      <div className="wol-public-filters">
        {([
          { key: 'views' as SortKey, label: '👁️ Views' },
          { key: 'likes' as SortKey, label: '❤️ Curtidas' },
          { key: 'comments' as SortKey, label: '💬 Comentários' },
          { key: 'engagementRate' as SortKey, label: '📈 Engajamento' },
        ]).map((opt) => (
          <button
            key={opt.key}
            type="button"
            className={`wol-public-filter-btn${sortBy === opt.key ? ' is-active' : ''}`}
            onClick={() => setSortBy(opt.key)}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {loading && <SkRankingPage />}
      {error && <p className="wol-public-error">{error}</p>}

      {!loading && ranked.length === 0 && (
        <div className="wol-public-empty">
          <p>Nenhum post analisado ainda.</p>
        </div>
      )}

      {ranked.length > 0 && (
        <div className="wol-public-list">
          {ranked.map((post) => (
            <a
              key={post.id || post.shortcode}
              className={`wol-public-card${post.rank <= 3 ? ` wol-public-card-top${post.rank}` : ''}`}
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="wol-public-card-rank">
                {post.rank <= 3 ? medals[post.rank - 1] : `#${post.rank}`}
              </div>
              {post.imageUrl && (
                <img className="wol-public-card-img" src={post.imageUrl} alt="" loading="lazy" />
              )}
              <div className="wol-public-card-info">
                <span className="wol-public-card-shortcode">#{post.shortcode}</span>
                <p className="wol-public-card-caption">{post.caption?.slice(0, 100) || 'Sem legenda'}</p>
              </div>
              <div className="wol-public-card-stats">
                <span>👁️ {formatNumber(post.metrics.views)}</span>
                <span>❤️ {formatNumber(post.metrics.likes)}</span>
                <span>💬 {formatNumber(post.metrics.comments)}</span>
              </div>
              <span className="wol-public-card-cta">Ver no Instagram →</span>
            </a>
          ))}
        </div>
      )}
    </section>
  )
}
