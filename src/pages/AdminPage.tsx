import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import '../styles/admin.css'
import { radioRoutes } from '../config/radioLinks'
import { adminContent } from '../data/adminContent'
import { subscribeDocuments } from '../services/firestoreService'
import type { CommunityUserDocument } from '../types/content'

const adminShortcuts = [
  { label: 'Notícias', to: radioRoutes.adminNews },
  { label: 'Times e escudos', to: radioRoutes.adminTeams },
  { label: 'Campeonatos', to: radioRoutes.adminChampionships },
  { label: 'Agenda', to: radioRoutes.adminSchedule },
  { label: 'Programação', to: radioRoutes.adminPrograms },
  { label: 'Vídeos', to: radioRoutes.adminVideos },
  { label: 'Patrocinadores', to: radioRoutes.adminSponsors },
  { label: 'Anuncie', to: radioRoutes.adminAdvertise },
  { label: 'Horóscopo', to: radioRoutes.adminHoroscope },
  { label: 'Empregos', to: radioRoutes.adminJobs },
  { label: 'Palavra de Vida', to: radioRoutes.adminWordOfLife },
  { label: 'Links', to: radioRoutes.adminLinks },
  { label: 'Player', to: radioRoutes.adminPlayer },
  { label: 'Live Streams', to: radioRoutes.adminLiveStreams },
  { label: 'Notificações', to: radioRoutes.adminNotifications },
  { label: 'Tema', to: radioRoutes.adminTheme },
  { label: 'Configurações', to: radioRoutes.adminSettings },
] as const

export function AdminPage() {
  const [communityUsers, setCommunityUsers] = useState<Array<{ id: string; name: string; nickname: string; age: string; whatsapp: string; city: string; interest: string }>>([])

  useEffect(() => {
    return subscribeDocuments<CommunityUserDocument>(
      'communityUsers',
      (documents) => {
        setCommunityUsers(
          documents
            .slice()
            .sort((first, second) => Number((second.createdAt as { seconds?: number } | undefined)?.seconds ?? 0) - Number((first.createdAt as { seconds?: number } | undefined)?.seconds ?? 0))
            .slice(0, 4)
              .map((item) => ({
              id: item.id,
              name: item.name,
              nickname: item.nickname,
              age: item.age,
              whatsapp: item.whatsapp,
              city: item.city,
              interest: item.interest,
            })),
        )
      },
      (error) => {
        console.error('Falha ao ouvir cadastros da comunidade.', error)
        setCommunityUsers([])
      },
    )
  }, [])

  return (
    <section className="content-section page-section admin-page" aria-labelledby="admin-title">
      <div className="admin-hero">
        <p className="eyebrow">Painel interno</p>
        <h1 id="admin-title">{adminContent.title}</h1>
        <p>{adminContent.subtitle}</p>
        <span>{adminContent.notice}</span>
        <div className="admin-hero-actions">
          <Link className="advertise-primary admin-hero-action" to={radioRoutes.adminNews}>
            Gerenciar notícias
          </Link>
          <Link className="advertise-secondary admin-hero-action" to={radioRoutes.adminTeams}>
            Gerenciar times e escudos
          </Link>
        </div>
      </div>

      <section className="admin-shortcuts" aria-labelledby="admin-shortcuts-title">
        <div className="section-title-row">
          <div>
            <p className="eyebrow">Acesso rápido</p>
            <h2 id="admin-shortcuts-title">Todos os módulos do admin</h2>
          </div>
        </div>
        <div className="admin-shortcuts-grid">
          {adminShortcuts.map((item) => (
            <Link className="admin-shortcut-card" key={item.to} to={item.to}>
              <strong>{item.label}</strong>
              <span>Abrir módulo</span>
            </Link>
          ))}
        </div>
      </section>

      <div className="admin-module-grid" aria-label="Módulos futuros do administrador">
        {adminContent.modules.map((module) => (
          <article className="admin-module-card" key={module.name}>
            <span className="admin-module-icon" aria-hidden="true">
              {module.icon}
            </span>
            <div>
              <h2>{module.name}</h2>
              <p>{module.description}</p>
            </div>
            <strong>{module.status}</strong>
          </article>
        ))}
      </div>

      <aside className="admin-next-steps">
        <div>
          <p className="eyebrow">Próximas etapas do painel</p>
          <h2>Preparado para evoluir com backend</h2>
          <p>
            Esta tela é apenas um protótipo visual. Futuramente, o painel pode receber
            autenticação segura e gestão real de conteúdo.
          </p>
        </div>

        <ul>
          {adminContent.nextSteps.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </aside>

      <section className="admin-community-panel" aria-labelledby="community-panel-title">
        <div className="section-title-row">
          <div>
            <p className="eyebrow">Cadastro social</p>
            <h2 id="community-panel-title">Últimos cadastros recebidos</h2>
          </div>
        </div>
        <div className="admin-community-grid">
          {communityUsers.length > 0 ? (
            communityUsers.map((item) => (
              <article className="admin-community-card" key={item.id}>
                <strong>{item.name}</strong>
                <p>
                  {item.nickname} • {item.age} anos
                </p>
                <p>{item.whatsapp}</p>
                <small>
                  {item.city} • {item.interest}
                </small>
              </article>
            ))
          ) : (
            <p className="admin-feedback">Nenhum cadastro recebido ainda.</p>
          )}
        </div>
      </section>
    </section>
  )
}
