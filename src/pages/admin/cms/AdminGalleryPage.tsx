import { ModulePage } from './ModulePage'

export function AdminGalleryPage() {
  return (
    <ModulePage
      eyebrow="Engajamento"
      title="Galeria de Fotos"
      description="Envie, organize e gerencie imagens da Rádio L20."
    >
      <div className="cms-placeholder">
        <div className="cms-placeholder-icon">🖼️</div>
        <h3>Em construção</h3>
        <p>Este módulo permitirá upload de imagens com organizeção por albums, thumbnails automáticas e galeria interativa no site.</p>
        <div className="cms-placeholder-features">
          <span>Upload de imagens</span>
          <span>Organização por álbum</span>
          <span>Thumbnails automáticas</span>
          <span>Lightbox responsivo</span>
        </div>
      </div>
    </ModulePage>
  )
}
