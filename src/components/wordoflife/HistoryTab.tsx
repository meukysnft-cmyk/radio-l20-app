import { useState } from 'react'
import { useWordOfLifePostsOnce } from '../../hooks/useWordOfLifePosts'
import { PostResultCard } from './PostResultCard'
import type { WordOfLifePost } from '../../types/wordOfLife'

type SortKey = 'timestamp' | 'engagementRate' | 'likes' | 'comments'

export function HistoryTab() {
  const { posts, loading, error } = useWordOfLifePostsOnce(100)
  const [sortKey, setSortKey] = useState<SortKey>('timestamp')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [search, setSearch] = useState('')

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('desc')
    }
  }

  const filtered = posts
    .filter((p) => {
      if (!search.trim()) return true
      const q = search.toLowerCase()
      return (
        p.caption?.toLowerCase().includes(q) ||
        p.shortcode?.toLowerCase().includes(q) ||
        p.url?.toLowerCase().includes(q)
      )
    })
    .sort((a: WordOfLifePost, b: WordOfLifePost) => {
      let va: number | string
      let vb: number | string
      if (sortKey === 'timestamp') {
        va = a.timestamp || ''
        vb = b.timestamp || ''
      } else {
        va = (a.metrics as Record<string, number>)[sortKey] || 0
        vb = (b.metrics as Record<string, number>)[sortKey] || 0
      }
      if (typeof va === 'string' && typeof vb === 'string') {
        return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va)
      }
      return sortDir === 'asc' ? (va as number) - (vb as number) : (vb as number) - (va as number)
    })

  return (
    <div className="wol-tab-content">
      <div className="wol-history-controls">
        <input
          type="text"
          className="wol-search-input"
          placeholder="Buscar por legenda ou shortcode..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="wol-sort-buttons">
          {(['timestamp', 'engagementRate', 'likes', 'comments'] as SortKey[]).map((key) => {
            const labels: Record<SortKey, string> = {
              timestamp: 'Data',
              engagementRate: 'Engajamento',
              likes: 'Curtidas',
              comments: 'Comentários',
            }
            return (
              <button
                key={key}
                type="button"
                className={`wol-sort-btn${sortKey === key ? ' is-active' : ''}`}
                onClick={() => toggleSort(key)}
              >
                {labels[key]} {sortKey === key ? (sortDir === 'asc' ? '↑' : '↓') : ''}
              </button>
            )
          })}
        </div>
      </div>

      {loading && <p className="wol-loading">Carregando histórico...</p>}
      {error && <p className="wol-error-text">{error}</p>}

      {!loading && filtered.length === 0 && (
        <div className="wol-empty">
          <p>{search ? 'Nenhum resultado encontrado.' : 'Nenhum post no histórico.'}</p>
        </div>
      )}

      <div className="wol-history-list">
        {filtered.map((post) => (
          <PostResultCard key={post.id || post.shortcode} post={post} />
        ))}
      </div>
    </div>
  )
}
