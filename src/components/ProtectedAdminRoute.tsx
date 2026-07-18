import { Link, Navigate, Outlet, useNavigate } from 'react-router-dom'
import { radioRoutes } from '../config/radioLinks'
import { useAudioPlayer } from '../context/useAudioPlayer'
import { useAuth } from '../context/useAuth'

export function ProtectedAdminRoute() {
  const { adminLoading, authError, isAdmin, loading, logout, user } = useAuth()
  const { stopPlayback } = useAudioPlayer()
  const navigate = useNavigate()

  async function handleLogout() {
    stopPlayback()
    await logout()
    navigate(radioRoutes.home, { replace: true })
  }

  if (loading || adminLoading) {
    return (
      <section className="content-section page-section admin-page" aria-labelledby="admin-loading-title">
        <div className="admin-empty-state">
          <p className="eyebrow">Administrador</p>
          <h1 id="admin-loading-title">Verificando acesso</h1>
          <p>Estamos validando sua conta e permissão no Firebase.</p>
        </div>
      </section>
    )
  }

  if (!user) {
    return <Navigate to={radioRoutes.home} replace />
  }

  if (!isAdmin) {
    return (
      <section className="content-section page-section admin-page" aria-labelledby="admin-denied-title">
        <div className="admin-empty-state">
          <p className="eyebrow">Acesso bloqueado</p>
          <h1 id="admin-denied-title">Acesso não autorizado</h1>
          <p>Esta conta não tem permissão para acessar o Administrador.</p>
          {authError ? <p className="admin-feedback is-error">{authError}</p> : null}
          <div className="admin-hero-actions">
            <button className="advertise-primary admin-hero-action" type="button" onClick={handleLogout}>
              Sair / trocar conta
            </button>
            <Link className="advertise-secondary admin-hero-action" to={radioRoutes.home}>
              Voltar ao início
            </Link>
          </div>
        </div>
      </section>
    )
  }

  return <Outlet />
}
