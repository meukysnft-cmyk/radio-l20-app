import { useMemo } from 'react'
import { Bar, Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js'
import type { WordOfLifePost } from '../../types/wordOfLife'

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend)

function formatNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M'
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K'
  return String(n)
}

export function PostsBarChart({ posts }: { posts: WordOfLifePost[] }) {
  const data = useMemo(() => {
    const sorted = [...posts].sort((a, b) => (a.timestamp || '').localeCompare(b.timestamp || '')).slice(-10)
    return {
      labels: sorted.map((p) => p.shortcode || '?'),
      datasets: [
        { label: 'Curtidas', data: sorted.map((p) => p.metrics.likes), backgroundColor: '#e63946' },
        { label: 'Comentários', data: sorted.map((p) => p.metrics.comments), backgroundColor: '#457b9d' },
      ],
    }
  }, [posts])

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom' as const } },
    scales: { y: { beginAtZero: true } },
  }

  return (
    <div className="wol-chart-container">
      <Bar data={data} options={options} />
    </div>
  )
}

export function EngagementDoughnut({ posts }: { posts: WordOfLifePost[] }) {
  const data = useMemo(() => {
    let great = 0
    let good = 0
    let low = 0
    for (const p of posts) {
      if (p.metrics.engagementRate >= 5) great++
      else if (p.metrics.engagementRate >= 2) good++
      else low++
    }
    return {
      labels: ['Excelente (5%+)', 'Bom (2-5%)', 'Baixo (<2%)'],
      datasets: [{
        data: [great, good, low],
        backgroundColor: ['#2a9d8f', '#e9c46a', '#e76f51'],
        borderWidth: 0,
      }],
    }
  }, [posts])

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom' as const } },
  }

  return (
    <div className="wol-chart-container wol-chart-sm">
      <Doughnut data={data} options={options} />
    </div>
  )
}

export function TotalsSummary({ posts }: { posts: WordOfLifePost[] }) {
  const totals = useMemo(() => {
    const t = { likes: 0, comments: 0, views: 0, engagement: 0, count: posts.length }
    for (const p of posts) {
      t.likes += p.metrics.likes
      t.comments += p.metrics.comments
      t.views += p.metrics.views
    }
    t.engagement = t.views > 0 ? Math.round(((t.likes + t.comments) / t.views) * 10000) / 100 : 0
    return t
  }, [posts])

  return (
    <div className="wol-totals">
      <div className="wol-total-item">
        <span className="wol-total-value">{totals.count}</span>
        <span className="wol-total-label">Posts analisados</span>
      </div>
      <div className="wol-total-item">
        <span className="wol-total-value">{formatNumber(totals.likes)}</span>
        <span className="wol-total-label">Total de curtidas</span>
      </div>
      <div className="wol-total-item">
        <span className="wol-total-value">{formatNumber(totals.comments)}</span>
        <span className="wol-total-label">Total de comentários</span>
      </div>
      <div className="wol-total-item">
        <span className="wol-total-value">{formatNumber(totals.views)}</span>
        <span className="wol-total-label">Total de views</span>
      </div>
      <div className="wol-total-item wol-total-highlight">
        <span className="wol-total-value">{totals.engagement.toFixed(1)}%</span>
        <span className="wol-total-label">Engajamento médio</span>
      </div>
    </div>
  )
}
