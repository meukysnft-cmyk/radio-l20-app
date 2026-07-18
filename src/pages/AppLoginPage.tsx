import { useEffect } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import '../styles/admin.css'
import { radioRoutes } from '../config/radioLinks'
import { useAuth } from '../context/useAuth'
import { hasCommunityAccess } from '../routes/RequireCommunityAccess'

export function AppLoginPage() {
  const { user, loading, loginWithGoogle, isAdmin } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user || loading) {
      return
    }

    navigate(isAdmin ? radioRoutes.admin : hasCommunityAccess() ? radioRoutes.home : radioRoutes.register, {
      replace: true,
    })
  }, [isAdmin, loading, navigate, user])

  if (loading) {
    return (
      <section className="app-login-screen">
        <section className="app-login-loading">
          <p>Carregando...</p>
        </section>
      </section>
    )
  }

  if (user) {
    return <Navigate to={isAdmin ? radioRoutes.admin : hasCommunityAccess() ? radioRoutes.home : radioRoutes.register} replace />
  }

  async function handleLogin() {
    try {
      await loginWithGoogle()
    } catch (error) {
      console.error('Erro ao fazer login:', error)
      alert('Não foi possível fazer o login. Tente novamente.')
    }
  }

  return (
    <section className="app-login-screen">
      <section className="app-login-card" aria-labelledby="login-title">
        <span className="brand-symbol" aria-hidden="true">
          L20
        </span>
        <p className="eyebrow">Área do ouvinte</p>
        <h1 id="login-title">Acesso à Rádio L20</h1>
        <p>Faça login com sua conta Google para acessar recursos exclusivos.</p>
        <button className="google-login-button" onClick={handleLogin} type="button">
          <svg aria-hidden="true" height="22" viewBox="0 0 24 24" width="22">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09A6.95 6.95 0 0 1 5.49 12c0-.73.13-1.43.35-2.09V7.07H2.18A10.99 10.99 0 0 0 1 12c0 1.78.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Entrar com Google
        </button>
      </section>
    </section>
  )
}
