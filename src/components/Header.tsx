import { Link, NavLink } from 'react-router-dom'
import { radioDesktopNavItems, radioRoutes } from '../config/radioLinks'
import { useAudioPlayer } from '../context/useAudioPlayer'
import { useAuth } from '../context/useAuth'
import { useLiveStatus } from '../context/useLiveStatus'
import { useTheme } from '../context/useTheme'
import { hasCommunityAccess } from '../routes/RequireCommunityAccess'
import { Logo } from './Logo'
import { NotificationToggle } from './NotificationToggle'
import { PwaInstallButton } from './PwaInstallButton'
import { WeatherWidget } from './WeatherWidget'

type HeaderProps = {
  onMenuClick: () => void
  isMenuOpen: boolean
}

export function Header({ onMenuClick, isMenuOpen }: HeaderProps) {
  const { isPlaying, isLoading, togglePlayback } = useAudioPlayer()
  const { user, loginWithGoogle, logout, isAdmin } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const { isLive } = useLiveStatus()
  const playerLabel = isLoading ? 'Carregando…' : isPlaying ? 'Pausar rádio' : 'Ouvir ao vivo'
  const userName = user?.displayName || user?.email?.split('@')[0] || 'Ouvinte'

  const desktopItems = radioDesktopNavItems.filter(
    (item) =>
      (item.to !== '/admin' || isAdmin) &&
      (item.to !== '/cadastro' || !hasCommunityAccess()),
  )

  return (
    <header className="site-header">
      <div className="header-brand-area">
        <button
          aria-controls="menu-principal"
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? 'Fechar menu principal' : 'Abrir menu principal'}
          className="mobile-menu-button"
          onClick={onMenuClick}
          type="button"
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>
        <Logo />
      </div>

      <nav className="desktop-nav" aria-label="Navegação principal">
        {desktopItems.map((item) => (
          <NavLink
            className={({ isActive }) => `desktop-nav-link${isActive ? ' is-active' : ''}${item.to === radioRoutes.live && isLive ? ' is-live-pulse' : ''}`}
            key={item.to}
            to={item.to}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="header-actions">
        <WeatherWidget />
        <button
          aria-label={theme === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
          className="theme-toggle-button"
          onClick={toggleTheme}
          type="button"
        >
          <span aria-hidden="true">{theme === 'dark' ? '\u2600\uFE0F' : '\uD83C\uDF19'}</span>
        </button>
        <NotificationToggle />
        <PwaInstallButton />
        <button
          aria-label={isPlaying ? 'Pausar Rádio L20 ao vivo' : 'Tocar Rádio L20 ao vivo'}
          aria-pressed={isPlaying}
          className={`header-player-button${isPlaying ? ' is-playing' : ''}${isLoading ? ' is-loading' : ''}`}
          onClick={togglePlayback}
          type="button"
        >
          <span className="header-player-brand" aria-hidden="true">
            <img src="/Logo-fone.svg" alt="" />
          </span>
          <span className="header-player-text">{playerLabel}</span>
        </button>

        {user ? (
          <div className="user-profile">
            <Link className="user-name" to={radioRoutes.profile} title={user.email ?? undefined}>
              {userName}
            </Link>
            <button className="btn-logout" onClick={logout} type="button">
              Sair
            </button>
          </div>
        ) : (
          <button className="btn-login" onClick={loginWithGoogle} type="button">
            <span className="login-label">Entrar</span>
          </button>
        )}
      </div>
    </header>
  )
}

