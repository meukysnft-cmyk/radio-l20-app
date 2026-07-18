type AdminEditButtonProps = {
  label?: string
  isOpen: boolean
  onToggle: () => void
}

export function AdminEditButton({ label = 'Editar conteúdo', isOpen, onToggle }: AdminEditButtonProps) {
  return (
    <button className="admin-edit-button" type="button" onClick={onToggle}>
      <span className="admin-edit-button-icon" aria-hidden="true">
        {isOpen ? '×' : '✎'}
      </span>
      {isOpen ? 'Fechar edição' : label}
    </button>
  )
}
