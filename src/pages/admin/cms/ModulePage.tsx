import type { ReactNode } from 'react'

type ModulePageProps = {
  eyebrow?: string
  title: string
  description?: string
  actions?: ReactNode
  children: ReactNode
}

export function ModulePage({ eyebrow = 'Módulo', title, description, actions, children }: ModulePageProps) {
  return (
    <div className="cms-page">
      <div className="cms-page-header">
        <div>
          <p className="cms-page-eyebrow">{eyebrow}</p>
          <h1 className="cms-page-title">{title}</h1>
          {description && <p className="cms-page-desc">{description}</p>}
        </div>
        {actions && <div className="cms-page-actions">{actions}</div>}
      </div>
      {children}
    </div>
  )
}
