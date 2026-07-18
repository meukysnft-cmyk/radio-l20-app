import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import '../../styles/admin.css'
import { radioRoutes } from '../../config/radioLinks'

type AdminModuleShellProps = {
  title: string
  description: string
  backTo?: string
  children: ReactNode
}

export function AdminModuleShell({ title, description, backTo = radioRoutes.admin, children }: AdminModuleShellProps) {
  return (
    <section className="content-section page-section admin-module-shell">
      <div className="admin-module-hero">
        <p className="eyebrow">Painel interno</p>
        <h1>{title}</h1>
        <p>{description}</p>
        <div className="admin-module-actions">
          <Link className="advertise-secondary" to={backTo}>
            Voltar ao admin
          </Link>
        </div>
      </div>

      {children}
    </section>
  )
}
