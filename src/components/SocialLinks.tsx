import { type ReactElement } from 'react'
import { FaInstagram, FaYoutube, FaWhatsapp } from 'react-icons/fa'
import { radioSocialItems } from '../config/radioLinks'

// Dicionário de ícones
const iconMap: Record<string, ReactElement> = {
  'IG': <FaInstagram />,
  'YT': <FaYoutube />,
  'WA': <FaWhatsapp />
}

type SocialLink = {
  label: string
  href: string
  marker: string
  detail: string
  external?: boolean
}

export function SocialButton({ link }: { link: SocialLink }) {
  // Pega o ícone do dicionário, ou usa o marcador de texto se não encontrar
  const icon = iconMap[link.marker] || <span className="social-mark">{link.marker}</span>

  return (
    <a
      className="social-button"
      href={link.href}
      {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      aria-label={`${link.label}: ${link.detail}`}
    >
      <span aria-hidden="true" className="social-icon">
        {icon}
      </span>
      <span>{link.label}</span>
    </a>
  )
}

export function SocialActions({ className = 'hero-actions' }: { className?: string }) {
  return (
    <div className={className} aria-label="Canais oficiais da Rádio L20">
      {radioSocialItems.map((link) => (
        <SocialButton key={link.label} link={link} />
      ))}
    </div>
  )
}