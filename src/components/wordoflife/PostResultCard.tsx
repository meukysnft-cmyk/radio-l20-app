import { memo } from 'react'
import type { WordOfLifePost } from '../../types/wordOfLife'

function formatNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M'
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'K'
  return String(n)
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
  } catch {
    return iso
  }
}

function typeLabel(type: string): string {
  switch (type) {
    case 'image': return 'Imagem'
    case 'video': return 'Reels'
    case 'carousel': return 'Carrossel'
    default: return type
  }
}

export const PostResultCard = memo(function PostResultCard({ post }: { post: WordOfLifePost }) {
  return (
    <article className="wol-post-card">
      {post.imageUrl ? (
        <img className="wol-post-thumb" src={post.imageUrl} alt={post.caption?.slice(0, 60) || 'Post'} loading="lazy" />
      ) : null}

      <div className="wol-post-body">
        <div className="wol-post-header">
          <span className="wol-post-type">{typeLabel(post.mediaType)}</span>
          <time className="wol-post-date">{formatDate(post.timestamp)}</time>
        </div>

        <p className="wol-post-caption">{post.caption?.slice(0, 200) || 'Sem legenda'}</p>

        <div className="wol-post-metrics">
          <div className="wol-metric">
            <span className="wol-metric-value">{formatNumber(post.metrics.likes)}</span>
            <span className="wol-metric-label">Curtidas</span>
          </div>
          <div className="wol-metric">
            <span className="wol-metric-value">{formatNumber(post.metrics.comments)}</span>
            <span className="wol-metric-label">Comentários</span>
          </div>
          {post.metrics.views > 0 ? (
            <div className="wol-metric">
              <span className="wol-metric-value">{formatNumber(post.metrics.views)}</span>
              <span className="wol-metric-label">Visualizações</span>
            </div>
          ) : null}
          {post.metrics.shares > 0 ? (
            <div className="wol-metric">
              <span className="wol-metric-value">{formatNumber(post.metrics.shares)}</span>
              <span className="wol-metric-label">Compartilhamentos</span>
            </div>
          ) : null}
          {post.metrics.saves > 0 ? (
            <div className="wol-metric">
              <span className="wol-metric-value">{formatNumber(post.metrics.saves)}</span>
              <span className="wol-metric-label">Salvos</span>
            </div>
          ) : null}
          <div className="wol-metric wol-metric-highlight">
            <span className="wol-metric-value">{post.metrics.engagementRate.toFixed(1)}%</span>
            <span className="wol-metric-label">Engajamento</span>
          </div>
        </div>

        {post.metrics.engagementRate >= 5 ? (
          <span className="wol-post-badge wol-badge-great">Excelente engajamento</span>
        ) : post.metrics.engagementRate >= 2 ? (
          <span className="wol-post-badge wol-badge-good">Bom engajamento</span>
        ) : (
          <span className="wol-post-badge wol-badge-low">Engajamento baixo</span>
        )}

        <a
          className="wol-post-link"
          href={post.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          Ver no Instagram
        </a>
      </div>
    </article>
  )
})
