import { Link } from 'react-router-dom'
import { radioRoutes } from '../../config/radioLinks'
import { AdminModuleShell } from './AdminModuleShell'

type AdminPlaceholderPageProps = {
  title: string
  description: string
}

export function AdminPlaceholderPage({ title, description }: AdminPlaceholderPageProps) {
  return (
    <AdminModuleShell title={title} description={description}>
      <div className="admin-empty-state">
        <h2>Em breve</h2>
        <p>Este módulo será ativado com campos, listagem e ações de publicação.</p>
        <div className="admin-hero-actions">
          <Link className="advertise-secondary" to={radioRoutes.admin}>
            Abrir painel principal
          </Link>
        </div>
      </div>
    </AdminModuleShell>
  )
}
