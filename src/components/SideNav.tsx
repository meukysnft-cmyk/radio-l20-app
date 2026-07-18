import { useEffect, useMemo, useRef, useState } from 'react'
import { FaCalendarAlt, FaEnvelope, FaFutbol, FaHome, FaLock, FaListUl, FaMicrophone, FaNewspaper, FaSignInAlt, FaStar, FaSuitcase, FaUser, FaVideo } from 'react-icons/fa'
import { NavLink } from 'react-router-dom'
import { radioRoutes } from '../config/radioLinks'
import { useAuth } from '../context/useAuth'
import { useTheme } from '../context/useTheme'
import { subscribeDocuments } from '../services/firestoreService'
import { hasCommunityAccess } from '../routes/RequireCommunityAccess'
import { Logo } from './Logo'
import type { PlayerDocument, ProgramDocument, LiveStreamDocument } from '../types/content'

type SidenavProps = {
  onClose: () => void
  variant?: 'mobile' | 'desktop'
}

export function Sidenav({ onClose, variant = 'mobile' }: SidenavProps) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const { isAdmin, user, logout, loginWithGoogle } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [player, setPlayer] = useState<PlayerDocument | null>(null)
  const [programs, setPrograms] = useState<Array<ProgramDocument & { id: string }>>([])
  const [liveStreams, setLiveStreams] = useState<Array<LiveStreamDocument & { id: string }>>([])

  useEffect(() => {
    const unsubPlayer = subscribeDocuments<PlayerDocument>('player', (docs) => {
      if (docs.length > 0) setPlayer(docs[0])
    })
    const unsubPrograms = subscribeDocuments<ProgramDocument>('programs', (docs) => {
      setPrograms(docs)
    })
    const unsubStreams = subscribeDocuments<LiveStreamDocument>('liveStreams', (docs) => {
      setLiveStreams(docs)
    })
    return () => { unsubPlayer(); unsubPrograms(); unsubStreams() }
  }, [])

  const isLive = useMemo(() => {
    if (player?.isLive) return true
    if (player?.youtubeIsLive && !!player?.youtubeLiveUrl) return true
    if (player?.instagramIsLive && !!player?.instagramLiveUrl) return true
    if (programs.some((p) => p.liveStatus === 'live')) return true
    if (liveStreams.some((s) => s.status === 'live')) return true
    return false
  }, [player, programs, liveStreams])

  useEffect(() => {
    if (variant === 'mobile') {
      closeRef.current?.focus()
    }
  }, [variant])

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const navItems = useMemo(
    () =>
      [
        { label: 'Início', to: radioRoutes.home, icon: <FaHome /> },
        { label: 'Ao Vivo', to: radioRoutes.live, icon: <FaMicrophone /> },
        { label: 'Notícias', to: radioRoutes.news, icon: <FaNewspaper /> },
        { label: 'Esportes', to: radioRoutes.sport, icon: <FaFutbol /> },
        { label: 'Agenda', to: radioRoutes.schedule, icon: <FaCalendarAlt /> },
        { label: 'Programas', to: radioRoutes.programs, icon: <FaListUl /> },
        { label: 'Vídeos', to: radioRoutes.videos, icon: <FaVideo /> },
        { label: 'Horóscopo', to: radioRoutes.horoscope, icon: <FaStar /> },
        { label: 'Empregos', to: radioRoutes.jobs, icon: <FaSuitcase /> },
        { label: 'Contato', to: radioRoutes.contact, icon: <FaEnvelope /> },
      ].filter(Boolean),
    [],
  )

  const accountItems = [
    { label: 'Meu Perfil', to: radioRoutes.profile, icon: <FaUser /> },
    ...(hasCommunityAccess() ? [] : [{ label: 'Cadastro', to: radioRoutes.register, icon: <FaEnvelope /> }]),
    ...(isAdmin ? [{ label: 'Admin', to: radioRoutes.admin, icon: <FaLock /> }] : []),
  ]

  return (
    <aside
      className={`sidenav-overlay${variant === 'desktop' ? ' is-desktop' : ''}`}
      role={variant === 'mobile' ? 'dialog' : undefined}
      aria-modal={variant === 'mobile'}
      aria-label="Menu principal"
    >
      <div className="sidenav-content">
        <div className="sidenav-surface">
          {variant === 'mobile' ? (
            <button
              ref={closeRef}
              className="close-menu-btn"
              type="button"
              onClick={onClose}
              aria-label="Fechar menu"
            >
              ×
            </button>
          ) : null}

          <div className="sidenav-brand-block">
            <Logo />
            <div className="sidenav-brand-copy">
              <span className="sidenav-label">Navegação</span>
              <strong>Rádio L20</strong>
              <small>Pilar, Alagoas</small>
            </div>
          </div>

          <div className="sidenav-quick-card">
            <span className="sidenav-quick-dot" />
            <div>
              <strong>Acesso rápido</strong>
              <p>Notícias, ao vivo e conteúdo editorial.</p>
            </div>
          </div>

          <button
            type="button"
            className="theme-toggle-button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
          >
            <span aria-hidden="true">{theme === 'dark' ? '\u2600\uFE0F' : '\uD83C\uDF19'}</span>
            <span>{theme === 'dark' ? 'Tema claro' : 'Tema escuro'}</span>
          </button>

          <nav className="sidenav-nav" id="menu-principal" aria-label="Navegação principal">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) => `sidenav-link${isActive ? ' is-active' : ''}${item.to === radioRoutes.live && isLive ? ' is-live-pulse' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}
            {!user ? (
              <button
                type="button"
                className="sidenav-link"
                onClick={() => { loginWithGoogle(); onClose() }}
              >
                <span className="nav-icon"><FaSignInAlt /></span>
                <span>Entrar com Google</span>
              </button>
            ) : null}
          </nav>

          {accountItems.length > 0 ? (
            <div className="sidenav-account-block">
              <span className="sidenav-label">Conta</span>
              <div className="sidenav-nav">
                {accountItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={onClose}
                    className={({ isActive }) => `sidenav-link${isActive ? ' is-active' : ''}`}
                  >
                    <span className="nav-icon">{item.icon}</span>
                    <span>{item.label}</span>
                  </NavLink>
                ))}
                {user ? (
                  <button
                    type="button"
                    className="sidenav-link sidenav-logout-btn"
                    onClick={() => { logout(); onClose() }}
                  >
                    <span className="nav-icon"><FaLock /></span>
                    <span>Sair da conta</span>
                  </button>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {variant === 'mobile' ? <div className="sidenav-backdrop" onClick={onClose} aria-hidden="true" /> : null}
    </aside>
  )
}

