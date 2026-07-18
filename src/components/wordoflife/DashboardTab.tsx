import { useWordOfLifePostsRealtime } from '../../hooks/useWordOfLifePosts'
import { TotalsSummary, PostsBarChart, EngagementDoughnut } from './Charts'

export function DashboardTab() {
  const { posts, loading, error } = useWordOfLifePostsRealtime(50)

  return (
    <div className="wol-tab-content">
      {loading && <p className="wol-loading">Carregando dados...</p>}
      {error && <p className="wol-error-text">{error}</p>}

      {!loading && !error && posts.length === 0 && (
        <div className="wol-empty">
          <p>Nenhum post analisado ainda.</p>
          <p className="wol-empty-hint">Use a aba "Analisar" para adicionar posts do Instagram.</p>
        </div>
      )}

      {posts.length > 0 && (
        <>
          <TotalsSummary posts={posts} />

          <div className="wol-charts-grid">
            <div className="wol-chart-card">
              <h3>Curtidas vs Comentários</h3>
              <PostsBarChart posts={posts} />
            </div>
            <div className="wol-chart-card">
              <h3>Distribuição de Engajamento</h3>
              <EngagementDoughnut posts={posts} />
            </div>
          </div>
        </>
      )}
    </div>
  )
}
