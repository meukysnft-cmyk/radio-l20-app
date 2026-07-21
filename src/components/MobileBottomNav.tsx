import { useLocation } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { IoFootball, IoMic, IoNewspaper, IoList } from 'react-icons/io5'
import { radioRoutes } from '../config/radioLinks'
import { useLiveStatus } from '../context/useLiveStatus'

const navItems = [
  { label: 'Notícias', to: radioRoutes.news, icon: <IoNewspaper /> },
  { label: 'Esportes', to: radioRoutes.sport, icon: <IoFootball /> },
  { label: 'Início', to: radioRoutes.home, icon: <img src="/logo-oficial.svg" alt="" className="nav-home-logo" />, isHome: true },
  { label: 'Programas', to: radioRoutes.programs, icon: <IoList /> },
  { label: 'Ao vivo', to: radioRoutes.live, icon: <IoMic /> },
]

export function MobileBottomNav() {
  const location = useLocation()
  const { isLive } = useLiveStatus()

  return (
    <nav className="mobile-bottom-nav" aria-label="Navegação rápida">
      {navItems.map((item) => {
        const isActive = location.pathname === item.to

        return (
          <Link
            aria-current={isActive ? 'page' : undefined}
            aria-label={item.label}
            className={`nav-item${isActive ? ' active' : ''}${item.isHome ? ' nav-item-home' : ''}${item.to === radioRoutes.live && isLive ? ' is-live-pulse' : ''}`}
            key={item.to}
            to={item.to}
          >
            <span className="icon-wrapper" aria-hidden="true">{item.icon}</span>
            {!item.isHome && <span>{item.label}</span>}
          </Link>
        )
      })}
    </nav>
  )
}
