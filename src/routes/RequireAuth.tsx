import { Navigate, Outlet } from 'react-router-dom'
import { radioRoutes } from '../config/radioLinks'
import { useAuth } from '../context/useAuth'

export function RequireAuth() {
  const { adminLoading, loading, user } = useAuth()

  if (loading || adminLoading) {
    return (
      <section className="app-login-screen" aria-labelledby="app-loading-title">
        <section className="app-login-loading">
          <span className="brand-symbol app-login-logo" aria-hidden="true">
            L20
          </span>
          <p className="eyebrow">Rádio L20</p>
          <h1 id="app-loading-title">Carregando acesso</h1>
          <p>Estamos verificando sua sessão com segurança.</p>
        </section>
      </section>
    )
  }

  if (!user) {
    return <Navigate to={radioRoutes.adminLogin} replace />
  }

  return <Outlet />
}
