import { ModulePage } from './ModulePage'

export function AdminAppearancePage() {
  return (
    <ModulePage
      eyebrow="Sistema"
      title="Aparência"
      description="Altere cores, tipografia, ícones, banners, logo e layout do site sem precisar alterar o código."
    >
      <div className="cms-placeholder">
        <div className="cms-placeholder-icon">🎨</div>
        <h3>Em construção</h3>
        <p>Este módulo permitirá personalizar toda a identidade visual do site diretamente pelo painel administrativo.</p>
        <div className="cms-placeholder-features">
          <span>Cores e paleta</span>
          <span>Tipografia</span>
          <span>Logo e favicon</span>
          <span>Banners e hero</span>
          <span>Layout e estrutura</span>
          <span>Preview em tempo real</span>
        </div>
      </div>
    </ModulePage>
  )
}
