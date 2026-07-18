import { type ReactNode } from 'react'

type AdminPanelShellProps = {
  isOpen: boolean
  onClose: () => void
  eyebrow: string
  title: string
  children: ReactNode
}

export function AdminPanelShell({ isOpen, onClose, eyebrow, title, children }: AdminPanelShellProps) {
  return (
    <aside className={`admin-side-panel${isOpen ? ' is-open' : ''}`} aria-label={title}>
      <div className="admin-inline-panel-header">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h3>{title}</h3>
        </div>
        <button className="advertise-secondary" type="button" onClick={onClose}>
          Fechar
        </button>
      </div>
      {children}
    </aside>
  )
}
