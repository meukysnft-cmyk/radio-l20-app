import { Link } from 'react-router-dom'
import { radioRoutes } from '../config/radioLinks'
import { siteContent } from '../data/siteContent'

export function NotFoundPage() {
  const content = siteContent

  return (
    <section className="content-section page-section not-found-page" aria-labelledby="not-found-title">
      <p className="eyebrow">Página não encontrada</p>
      <h1 id="not-found-title">Essa página não está no ar</h1>
      <p>
        O endereço acessado não existe no site da {content.radio.name}. Você pode voltar ao início
        ou ouvir a rádio ao vivo.
      </p>

      <div className="not-found-actions">
        <Link className="advertise-primary" to={radioRoutes.home}>
          Voltar ao início
        </Link>
        <Link className="advertise-secondary" to={radioRoutes.live}>
          Ouvir a rádio
        </Link>
      </div>
    </section>
  )
}
