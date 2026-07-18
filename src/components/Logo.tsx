import { Link } from 'react-router-dom'
import { radioRoutes } from '../config/radioLinks'
import { siteContent } from '../data/siteContent'

type LogoProps = {
  onClick?: () => void
}

export function Logo({ onClick }: LogoProps) {
  const content = siteContent
  return (
    <Link className="brand" to={radioRoutes.home} aria-label={`${content.radio.name} - Início`} onClick={onClick}>
      <img src="/logo-oficial.svg" alt={content.radio.name} className="brand-logo" />
      <span className="brand-text">
        <strong>{content.radio.name}</strong>
        <small>{content.radio.location}</small>
      </span>
    </Link>
  )
}
