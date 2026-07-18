import { Link } from 'react-router-dom'
import { radioNavItems, radioRoutes, radioSocialItems } from '../config/radioLinks'
import { siteContent } from '../data/siteContent'
import { Logo } from './Logo'

export function Footer() {
  const content = siteContent

  return (
    <footer className="site-footer">
      <div className="footer-brand">
        <Logo />
        <p>{content.radio.footer.description}</p>
        <p>{content.radio.type} de {content.radio.location}.</p>
      </div>

      <nav className="footer-links" aria-label="Links rápidos">
        <h2>Links rápidos</h2>
        <div>
          {radioNavItems.map((item) => (
            <Link key={item.to} to={item.to}>
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      <nav className="footer-social" aria-label="Canais oficiais">
        <h2>Canais oficiais</h2>
        <div>
          {radioSocialItems.map((item) => (
            <a key={item.href} href={item.href} target="_blank" rel="noopener noreferrer">
              {item.label}
            </a>
          ))}
        </div>
      </nav>

      <div className="footer-cta">
        <h2>Anuncie na Rádio L20</h2>
        <p>{content.advertise.subtitle}</p>
        <div className="footer-actions">
          <Link className="advertise-primary" to={radioRoutes.advertise}>
            Anunciar
          </Link>
          <Link className="advertise-secondary" to={radioRoutes.live}>
            Ouvir ao vivo
          </Link>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© Rádio L20. Todos os direitos reservados.</p>
        <p>{content.radio.footer.note}</p>
        <div className="footer-credit">
          <span className="footer-credit-label">Desenvolvido por</span>
          <strong>Emerson Cristovão</strong>
        </div>
      </div>
    </footer>
  )
}
