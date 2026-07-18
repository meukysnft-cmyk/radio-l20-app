import { useState, useEffect } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { IoMenu, IoClose, IoLogOut, IoChevronDown, IoChevronForward } from 'react-icons/io5'
import { useAuth } from '../../context/useAuth'
import { adminNavItems, adminNavGroups } from '../../config/adminNav'
import type { AdminNavItem } from '../../config/adminNav'

function SidebarNavGroup({ group, items, onNavigate }: { group: string; items: AdminNavItem[]; onNavigate: () => void }) {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <div className="cms-nav-group">
      <button
        className="cms-nav-group-toggle"
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span>{group}</span>
        {isOpen ? <IoChevronDown size={14} /> : <IoChevronForward size={14} />}
      </button>
      {isOpen && (
        <div className="cms-nav-group-items">
          {items.map((item) => (
            <NavLink
              key={item.key}
              to={item.path}
              end={item.path === '/admin'}
              className={({ isActive }) => `cms-nav-link${isActive ? ' is-active' : ''}`}
              onClick={onNavigate}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
      )}
    </div>
  )
}

export function AdminShell() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const { user, logout } = useAuth()
  const location = useLocation()

  useEffect(() => {
    setIsSidebarOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSidebarOpen) {
        setIsSidebarOpen(false)
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isSidebarOpen])

  const grouped = adminNavGroups.map((g) => ({
    ...g,
    items: adminNavItems.filter((item) => item.group === g.key),
  }))

  return (
    <div className="cms-layout">
      {/* Mobile header */}
      <header className="cms-topbar">
        <button
          className="cms-menu-toggle"
          type="button"
          onClick={() => setIsSidebarOpen((prev) => !prev)}
          aria-label={isSidebarOpen ? 'Fechar menu' : 'Abrir menu'}
        >
          {isSidebarOpen ? <IoClose size={22} /> : <IoMenu size={22} />}
        </button>
        <Link className="cms-logo" to="/admin">
          <span className="cms-logo-icon">📻</span>
          <span className="cms-logo-text">Rádio L20</span>
          <span className="cms-logo-badge">CMS</span>
        </Link>
        <div className="cms-topbar-right">
          <span className="cms-topbar-user">{user?.displayName || user?.email}</span>
          <button className="cms-logout-btn" type="button" onClick={() => void logout()} title="Sair">
            <IoLogOut size={18} />
          </button>
        </div>
      </header>

      {/* Sidebar overlay (mobile) */}
      {isSidebarOpen && (
        <div
          className="cms-sidebar-overlay"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside className={`cms-sidebar${isSidebarOpen ? ' is-open' : ''}`}>
        <div className="cms-sidebar-header">
          <Link className="cms-logo" to="/admin" onClick={() => setIsSidebarOpen(false)}>
            <span className="cms-logo-icon">📻</span>
            <span className="cms-logo-text">Rádio L20</span>
            <span className="cms-logo-badge">CMS</span>
          </Link>
          <button
            className="cms-sidebar-close"
            type="button"
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Fechar menu"
          >
            <IoClose size={20} />
          </button>
        </div>

        <nav className="cms-sidebar-nav" aria-label="Menu do administrador">
          {grouped.map((group) => (
            <SidebarNavGroup
              key={group.key}
              group={group.label}
              items={group.items}
              onNavigate={() => setIsSidebarOpen(false)}
            />
          ))}
        </nav>

        <div className="cms-sidebar-footer">
          <Link className="cms-sidebar-back" to="/">
            ← Ver site
          </Link>
          <div className="cms-sidebar-user">
            <div className="cms-sidebar-avatar">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="" />
              ) : (
                <span>{(user?.displayName || user?.email || '?')[0].toUpperCase()}</span>
              )}
            </div>
            <div className="cms-sidebar-user-info">
              <span className="cms-sidebar-user-name">{user?.displayName || 'Admin'}</span>
              <span className="cms-sidebar-user-email">{user?.email}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="cms-main">
        <Outlet />
      </main>
    </div>
  )
}
