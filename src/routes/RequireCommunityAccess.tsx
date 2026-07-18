import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { radioRoutes } from '../config/radioLinks'
import { useAuth } from '../context/useAuth'

const COMMUNITY_ACCESS_KEY = 'radio_l20_community_registered'

export function hasCommunityAccess() {
  return window.localStorage.getItem(COMMUNITY_ACCESS_KEY) === 'true'
}

export function markCommunityAccessGranted() {
  window.localStorage.setItem(COMMUNITY_ACCESS_KEY, 'true')
}

export function RequireCommunityAccess() {
  const location = useLocation()
  const { user, isAdmin, loading } = useAuth()

  if (loading) {
    return (
      <div className="route-loading-shell" aria-live="polite">
        <p>Carregando...</p>
      </div>
    )
  }

  if (isAdmin || (user && hasCommunityAccess())) {
    return <Outlet />
  }

  if (user) {
    return <Navigate to={radioRoutes.register} replace state={{ from: location.pathname }} />
  }

  return <Navigate to={radioRoutes.adminLogin} replace state={{ from: location.pathname }} />
}
