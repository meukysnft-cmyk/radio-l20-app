import { ModulePage } from './ModulePage'

export function AdminSocialMediaPage() {
  return (
    <ModulePage
      eyebrow="Engajamento"
      title="Redes Sociais"
      description="Gerencie todos os links de redes sociais da Rádio L20 em um único lugar."
    >
      <div className="cms-placeholder">
        <div className="cms-placeholder-icon">📱</div>
        <h3>Em construção</h3>
        <p>Este módulo centralizará todos os links de redes sociais: Instagram, YouTube, WhatsApp, Facebook, TikTok e Twitter/X.</p>
        <div className="cms-placeholder-features">
          <span>Links centralizados</span>
          <span>Ícones automáticos</span>
          <span>Preview em tempo real</span>
          <span>Integração com o site</span>
        </div>
      </div>
    </ModulePage>
  )
}
