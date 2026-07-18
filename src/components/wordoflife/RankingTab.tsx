import { useMemo, useState } from 'react'
import { useWordOfLifePostsRealtime } from '../../hooks/useWordOfLifePosts'
import type { WordOfLifePost } from '../../types/wordOfLife'

function formatNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M'
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'K'
  return String(n)
}

function computeScore(post: WordOfLifePost): number {
  const m = post.metrics
  const totalEngagement = m.likes + m.comments + m.shares + m.saves
  const engagementWeight = m.engagementRate * 40
  const volumeWeight = Math.min(totalEngagement / 100, 30)
  const viewsWeight = Math.min(m.views / 1000, 30)
  return Math.round((engagementWeight + volumeWeight + viewsWeight) * 10) / 10
}

type SortKey = 'score' | 'engagementRate' | 'likes' | 'comments' | 'views'

export function RankingTab() {
  const { posts, loading, error } = useWordOfLifePostsRealtime(100)
  const [sortBy, setSortBy] = useState<SortKey>('score')

  const ranked = useMemo(() => {
    const scored = posts.map((p) => ({
      ...p,
      score: computeScore(p),
    }))

    scored.sort((a, b) => {
      if (sortBy === 'score') return b.score - a.score
      return (b.metrics as Record<string | number, number>)[sortBy] - (a.metrics as Record<string | number, number>)[sortBy]
    })

    return scored.map((p, i) => ({ ...p, rank: i + 1 }))
  }, [posts, sortBy])

  const top3 = ranked.slice(0, 3)
  const rest = ranked.slice(3)

  return (
    <div className="wol-tab-content">
      <div className="wol-ranking-header">
        <h3>Ranking de Posts</h3>
        <div className="wol-sort-buttons">
          {([
            { key: 'score' as SortKey, label: 'Pontuação' },
            { key: 'engagementRate' as SortKey, label: 'Engajamento' },
            { key: 'likes' as SortKey, label: 'Curtidas' },
            { key: 'comments' as SortKey, label: 'Comentários' },
            { key: 'views' as SortKey, label: 'Views' },
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
      </div>

      {loading && <p className="wol-loading">Carregando ranking...</p>}
      {error && <p className="wol-error-text">{error}</p>}

      {!loading && ranked.length === 0 && (
        <div className="wol-empty">
          <p>Nenhum post analisado ainda.</p>
          <p className="wol-empty-hint">Use a aba "Analisar" para analisar posts do Instagram.</p>
        </div>
      )}

      {top3.length > 0 && (
        <div className="wol-podium">
          {top3.map((post) => (
            <div
              key={post.id || post.shortcode}
              className={`wol-podium-item wol-podium-${post.rank}`}
            >
              <span className="wol-podium-medal">
                {post.rank === 1 ? '🥇' : post.rank === 2 ? '🥈' : '🥉'}
              </span>
              {post.imageUrl && (
                <img className="wol-podium-thumb" src={post.imageUrl} alt="" loading="lazy" />
              )}
              <div className="wol-podium-info">
                <span className="wol-podium-shortcode">#{post.shortcode}</span>
                <p className="wol-podium-caption">{post.caption?.slice(0, 80) || 'Sem legenda'}</p>
                <div className="wol-podium-metrics">
                  <span>{formatNumber(post.metrics.likes)} curtidas</span>
                  <span>{formatNumber(post.metrics.comments)} coment.</span>
                  <span>{post.metrics.engagementRate.toFixed(1)}% engajamento</span>
                </div>
                <span className="wol-podium-score">{post.score} pts</span>
              </div>
              <a
                className="wol-podium-link"
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                Ver
              </a>
            </div>
          ))}
        </div>
      )}

      {rest.length > 0 && (
        <div className="wol-ranking-list">
          {rest.map((post) => (
            <div key={post.id || post.shortcode} className="wol-ranking-row">
              <span className="wol-ranking-pos">#{post.rank}</span>
              {post.imageUrl && (
                <img className="wol-ranking-thumb" src={post.imageUrl} alt="" loading="lazy" />
              )}
              <div className="wol-ranking-info">
                <span className="wol-ranking-shortcode">#{post.shortcode}</span>
                <p className="wol-ranking-caption">{post.caption?.slice(0, 60) || 'Sem legenda'}</p>
              </div>
              <div className="wol-ranking-stats">
                <span>{formatNumber(post.metrics.likes)} ❤️</span>
                <span>{formatNumber(post.metrics.comments)} 💬</span>
                <span>{post.metrics.engagementRate.toFixed(1)}%</span>
              </div>
              <span className="wol-ranking-score">{post.score} pts</span>
              <a
                className="wol-ranking-link"
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                →
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
