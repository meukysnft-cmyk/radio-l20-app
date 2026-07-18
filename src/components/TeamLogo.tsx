import { useState } from 'react'

type TeamLogoProps = {
  logoUrl?: string
  alt: string
  fallback: string
  size?: number
}

export function TeamLogo({ logoUrl, alt, fallback, size = 56 }: TeamLogoProps) {
  const [failedLogoUrl, setFailedLogoUrl] = useState<string | null>(null)
  const hasError = Boolean(logoUrl && failedLogoUrl === logoUrl)

  if (!logoUrl || hasError) {
    return (
      <span
        className="team-logo-placeholder"
        aria-hidden="true"
        style={{ width: size, height: size }}
      >
        {fallback}
      </span>
    )
  }

  return (
    <img
      className="team-logo-image"
      src={logoUrl}
      width={size}
      height={size}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      alt={alt}
      onError={() => setFailedLogoUrl(logoUrl)}
    />
  )
}
