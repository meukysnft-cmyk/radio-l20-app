import { useEffect, useState } from 'react'
import { subscribeDocuments } from '../../../services/firestoreService'
import type {
  NewsDocument,
  ProgramDocument,
  AgendaDocument,
  VideoDocument,
  LiveStreamDocument,
  SponsorDocument,
  CommunityUserDocument,
} from '../../../types/content'

type Stats = {
  newsPublished: number
  newsDrafts: number
  programs: number
  upcomingEvents: number
  videos: number
  activeLive: number
  sponsors: number
  communityUsers: number
}

const emptyStats: Stats = {
  newsPublished: 0,
  newsDrafts: 0,
  programs: 0,
  upcomingEvents: 0,
  videos: 0,
  activeLive: 0,
  sponsors: 0,
  communityUsers: 0,
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message
  return 'Erro ao carregar dados.'
}

export function AdminDashboard() {
  const [stats, setStats] = useState<Stats>(emptyStats)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true

    const unsubNews = subscribeDocuments<NewsDocument>('news', (docs) => {
      if (!mounted) return
      setStats((prev) => ({
        ...prev,
        newsPublished: docs.filter((d) => d.status === 'published').length,
        newsDrafts: docs.filter((d) => d.status === 'draft').length,
      }))
      setIsLoading(false)
    }, (err) => { if (mounted) setError(getErrorMessage(err)); setIsLoading(false) })

    const unsubPrograms = subscribeDocuments<ProgramDocument>('programs', (docs) => {
      if (!mounted) return
      setStats((prev) => ({ ...prev, programs: docs.length }))
    })

    const unsubAgenda = subscribeDocuments<AgendaDocument>('agenda', (docs) => {
      if (!mounted) return
      const now = new Date().toISOString().slice(0, 10)
      setStats((prev) => ({
        ...prev,
        upcomingEvents: docs.filter((d) => (d.date || '') >= now).length,
      }))
    })

    const unsubVideos = subscribeDocuments<VideoDocument>('videos', (docs) => {
      if (!mounted) return
      setStats((prev) => ({ ...prev, videos: docs.length }))
    })

    const unsubLive = subscribeDocuments<LiveStreamDocument>('liveStreams', (docs) => {
      if (!mounted) return
      setStats((prev) => ({ ...prev, activeLive: docs.filter((d) => d.status === 'live').length }))
    })

    const unsubSponsors = subscribeDocuments<SponsorDocument>('sponsors', (docs) => {
      if (!mounted) return
      setStats((prev) => ({ ...prev, sponsors: docs.length }))
    })

    const unsubUsers = subscribeDocuments<CommunityUserDocument>('communityUsers', (docs) => {
      if (!mounted) return
      setStats((prev) => ({ ...prev, communityUsers: docs.length }))
    })

    return () => {
      mounted = false
      unsubNews()
      unsubPrograms()
      unsubAgenda()
      unsubVideos()
      unsubLive()
      unsubSponsors()
      unsubUsers()
    }
  }, [])

  const statCards = [
    { label: 'Notícias publicadas', value: stats.newsPublished, color: '#3b82f6', icon: '📰' },
    { label: 'Rascunhos', value: stats.newsDrafts, color: '#f59e0b', icon: '📝' },
    { label: 'Programas cadastrados', value: stats.programs, color: '#8b5cf6', icon: '📻' },
    { label: 'Próximos eventos', value: stats.upcomingEvents, color: '#10b981', icon: '📅' },
    { label: 'Vídeos publicados', value: stats.videos, color: '#ef4444', icon: '🎬' },
    { label: 'Live em andamento', value: stats.activeLive, color: '#ff3c3c', icon: '🔴' },
    { label: 'Patrocinadores', value: stats.sponsors, color: '#f59e0b', icon: '⭐' },
    { label: 'Usuários da comunidade', value: stats.communityUsers, color: '#06b6d4', icon: '👥' },
  ]

  return (
    <div className="cms-page">
      <div className="cms-page-header">
        <div>
          <p className="cms-page-eyebrow">Painel interno</p>
          <h1 className="cms-page-title">Dashboard</h1>
          <p className="cms-page-desc">Visão geral do conteúdo e sistema da Rádio L20.</p>
        </div>
      </div>

      {error && <div className="cms-alert is-error">{error}</div>}

      {isLoading ? (
        <div className="cms-loading">Carregando dados do Firestore...</div>
      ) : (
        <>
          <div className="cms-stats-grid">
            {statCards.map((card) => (
              <div className="cms-stat-card" key={card.label}>
                <div className="cms-stat-icon" style={{ background: `${card.color}18`, color: card.color }}>
                  {card.icon}
                </div>
                <div className="cms-stat-info">
                  <span className="cms-stat-value">{card.value}</span>
                  <span className="cms-stat-label">{card.label}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="cms-dashboard-grid">
            <div className="cms-dashboard-card">
              <h3>Status do Firebase</h3>
              <div className="cms-dashboard-status">
                <span className="cms-status-dot is-online" />
                <span>Conectado ao projeto <strong>canal-l20</strong></span>
              </div>
              <p>Firestore, Auth, Storage e Hosting ativos.</p>
            </div>

            <div className="cms-dashboard-card">
              <h3>Atalhos rápidos</h3>
              <div className="cms-dashboard-links">
                <a className="cms-dashboard-link" href="/admin/noticias" target="_blank" rel="noreferrer">
                  Criar notícia
                </a>
                <a className="cms-dashboard-link" href="/admin/live-streams" target="_blank" rel="noreferrer">
                  Agendar live
                </a>
                <a className="cms-dashboard-link" href="/admin/agenda" target="_blank" rel="noreferrer">
                  Novo evento
                </a>
                <a className="cms-dashboard-link" href="/admin/videos" target="_blank" rel="noreferrer">
                  Upload de vídeo
                </a>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
