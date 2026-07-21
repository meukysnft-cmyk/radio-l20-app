const stroke = '#fff'
const sw = 1.8
const fill = 'none'

type Props = { size?: number }

function Aries({ size = 120 }: Props) {
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} fill={fill} stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d="M30 85 C30 55 40 35 55 20 C58 17 62 17 65 20 C80 35 90 55 90 85" />
      <path d="M42 85 C42 65 48 50 60 38 C72 50 78 65 78 85" />
      <circle cx="42" cy="18" r="5" fill={stroke} fillOpacity=".15" />
      <circle cx="78" cy="18" r="5" fill={stroke} fillOpacity=".15" />
      <path d="M42 13 C38 5 32 2 28 8" />
      <path d="M78 13 C82 5 88 2 92 8" />
      <line x1="60" y1="70" x2="60" y2="55" strokeDasharray="3 3" opacity=".3" />
    </svg>
  )
}

function Touro({ size = 120 }: Props) {
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} fill={fill} stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="60" cy="62" r="24" />
      <path d="M28 40 C28 25 38 18 48 22" />
      <path d="M92 40 C92 25 82 18 72 22" />
      <circle cx="28" cy="36" r="4" fill={stroke} fillOpacity=".2" />
      <circle cx="92" cy="36" r="4" fill={stroke} fillOpacity=".2" />
      <circle cx="52" cy="58" r="3" fill={stroke} fillOpacity=".3" />
      <circle cx="68" cy="58" r="3" fill={stroke} fillOpacity=".3" />
      <path d="M55 70 C58 74 62 74 65 70" />
      <path d="M38 100 C50 92 70 92 82 100" opacity=".25" />
    </svg>
  )
}

function Gemeos({ size = 120 }: Props) {
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} fill={fill} stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="42" cy="40" r="16" />
      <circle cx="78" cy="40" r="16" />
      <line x1="42" y1="56" x2="42" y2="90" />
      <line x1="78" y1="56" x2="78" y2="90" />
      <circle cx="38" cy="38" r="2" fill={stroke} fillOpacity=".4" />
      <circle cx="74" cy="38" r="2" fill={stroke} fillOpacity=".4" />
      <path d="M36 46 C39 49 45 49 48 46" />
      <path d="M72 46 C75 49 81 49 84 46" />
      <path d="M42 90 C50 96 70 96 78 90" strokeDasharray="4 3" opacity=".3" />
      <path d="M42 75 C50 80 70 80 78 75" strokeDasharray="3 3" opacity=".2" />
    </svg>
  )
}

function Cancer({ size = 120 }: Props) {
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} fill={fill} stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="60" cy="55" rx="28" ry="20" />
      <path d="M32 55 C32 35 45 25 60 25 C75 25 88 35 88 55" />
      <circle cx="50" cy="50" r="4" fill={stroke} fillOpacity=".3" />
      <circle cx="70" cy="50" r="4" fill={stroke} fillOpacity=".3" />
      <circle cx="48" cy="49" r="1.5" fill={stroke} fillOpacity=".6" />
      <circle cx="68" cy="49" r="1.5" fill={stroke} fillOpacity=".6" />
      <path d="M28 72 L18 62 C14 58 14 52 18 48" />
      <path d="M92 72 L102 62 C106 58 106 52 102 48" />
      <path d="M22 82 C22 90 30 95 38 92" />
      <path d="M98 82 C98 90 90 95 82 92" />
    </svg>
  )
}

function Leao({ size = 120 }: Props) {
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} fill={fill} stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="60" cy="52" r="20" />
      <circle cx="60" cy="52" r="30" strokeDasharray="6 4" opacity=".2" />
      <circle cx="60" cy="52" r="38" strokeDasharray="4 6" opacity=".1" />
      <circle cx="53" cy="48" r="2.5" fill={stroke} fillOpacity=".4" />
      <circle cx="67" cy="48" r="2.5" fill={stroke} fillOpacity=".4" />
      <path d="M55 56 C57 59 63 59 65 56" />
      <path d="M52 44 L48 38" />
      <path d="M68 44 L72 38" />
      <path d="M60 72 C60 80 60 90 60 100" />
      <path d="M60 100 C55 108 65 108 60 100" fill={stroke} fillOpacity=".15" />
      <path d="M45 30 C50 22 55 18 60 18 C65 18 70 22 75 30" opacity=".3" />
    </svg>
  )
}

function Virgem({ size = 120 }: Props) {
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} fill={fill} stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="50" cy="38" r="14" />
      <line x1="50" y1="52" x2="50" y2="92" />
      <line x1="70" y1="52" x2="70" y2="92" />
      <circle cx="46" cy="36" r="2" fill={stroke} fillOpacity=".4" />
      <path d="M44 44 C47 47 53 47 56 44" />
      <path d="M50 52 C42 58 42 68 50 72" />
      <path d="M70 52 C78 58 78 68 70 72" />
      <path d="M50 92 C55 98 65 98 70 92" />
      <path d="M82 28 L88 22 M82 38 L90 36 M82 48 L88 52" opacity=".25" />
      <circle cx="85" cy="28" r="1.5" fill={stroke} fillOpacity=".2" />
      <circle cx="86" cy="38" r="1" fill={stroke} fillOpacity=".15" />
      <circle cx="85" cy="48" r="1.5" fill={stroke} fillOpacity=".2" />
    </svg>
  )
}

function Libra({ size = 120 }: Props) {
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} fill={fill} stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <line x1="25" y1="42" x2="95" y2="42" />
      <path d="M60 42 L60 80" />
      <path d="M45 80 C52 86 68 86 75 80" />
      <path d="M25 42 C25 50 35 56 45 56 C50 56 55 54 60 50" />
      <path d="M95 42 C95 50 85 56 75 56 C70 56 65 54 60 50" />
      <circle cx="25" cy="42" r="3" fill={stroke} fillOpacity=".25" />
      <circle cx="95" cy="42" r="3" fill={stroke} fillOpacity=".25" />
      <path d="M40 95 C50 100 70 100 80 95" opacity=".2" />
    </svg>
  )
}

function Escorpiao({ size = 120 }: Props) {
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} fill={fill} stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d="M40 30 C40 50 50 60 60 70 C70 60 80 50 80 30" />
      <circle cx="45" cy="40" r="5" />
      <circle cx="75" cy="40" r="5" />
      <circle cx="44" cy="39" r="1.5" fill={stroke} fillOpacity=".5" />
      <circle cx="74" cy="39" r="1.5" fill={stroke} fillOpacity=".5" />
      <path d="M50 55 C55 65 60 80 60 90" />
      <path d="M70 55 C65 65 60 80 60 90" />
      <path d="M60 90 C65 95 72 92 70 85 C68 78 60 82 60 90" />
      <path d="M60 90 C55 95 48 92 50 85 C52 78 60 82 60 90" opacity=".5" />
      <circle cx="70" cy="85" r="2" fill={stroke} fillOpacity=".3" />
    </svg>
  )
}

function Sagitario({ size = 120 }: Props) {
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} fill={fill} stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <line x1="20" y1="100" x2="100" y2="20" />
      <path d="M100 20 C90 20 85 25 85 35" />
      <path d="M100 20 C100 30 95 35 85 35" />
      <path d="M30 90 L22 85 L25 92" fill={stroke} fillOpacity=".2" />
      <line x1="35" y1="85" x2="45" y2="75" strokeDasharray="2 3" opacity=".25" />
      <line x1="50" y1="70" x2="60" y2="60" strokeDasharray="2 3" opacity=".2" />
      <line x1="65" y1="55" x2="75" y2="45" strokeDasharray="2 3" opacity=".15" />
      <circle cx="25" cy="98" r="3" fill={stroke} fillOpacity=".1" />
      <path d="M85 55 C90 58 90 62 85 65 C80 68 75 65 78 60" opacity=".3" />
    </svg>
  )
}

function Capricornio({ size = 120 }: Props) {
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} fill={fill} stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d="M35 30 C35 50 45 65 55 75 C50 80 42 88 35 95" />
      <path d="M55 75 C65 85 80 90 95 85" />
      <path d="M95 85 C88 78 82 68 82 58" />
      <circle cx="35" cy="30" r="5" fill={stroke} fillOpacity=".15" />
      <circle cx="82" cy="58" r="4" fill={stroke} fillOpacity=".15" />
      <path d="M32 26 C28 20 30 14 35 14 C40 14 42 20 38 26" />
      <path d="M78 55 C82 48 90 46 94 50 C98 54 94 60 88 58" opacity=".4" />
      <path d="M55 75 L58 80 L52 80" fill={stroke} fillOpacity=".15" />
    </svg>
  )
}

function Aquario({ size = 120 }: Props) {
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} fill={fill} stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d="M30 45 C38 40 46 45 54 40 C62 35 70 40 78 35 C86 30 94 35 98 42" />
      <path d="M30 55 C38 50 46 55 54 50 C62 45 70 50 78 45 C86 40 94 45 98 52" />
      <path d="M22 65 C30 60 38 65 46 60 C54 55 62 60 70 55 C78 50 86 55 94 50" opacity=".5" />
      <circle cx="38" cy="42" r="2" fill={stroke} fillOpacity=".2" />
      <circle cx="60" cy="38" r="2" fill={stroke} fillOpacity=".2" />
      <circle cx="82" cy="36" r="2" fill={stroke} fillOpacity=".2" />
      <path d="M26 78 C30 85 22 92 18 88" opacity=".25" />
      <path d="M32 82 C36 88 28 96 24 92" opacity=".15" />
    </svg>
  )
}

function Peixes({ size = 120 }: Props) {
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} fill={fill} stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="40" cy="55" rx="18" ry="12" transform="rotate(-20 40 55)" />
      <path d="M22 48 C16 42 16 32 22 28 C28 32 28 42 22 48" fill={stroke} fillOpacity=".1" />
      <circle cx="36" cy="52" r="2.5" fill={stroke} fillOpacity=".4" />
      <ellipse cx="80" cy="65" rx="18" ry="12" transform="rotate(20 80 65)" />
      <path d="M98 72 C104 78 104 88 98 92 C92 88 92 78 98 72" fill={stroke} fillOpacity=".1" />
      <circle cx="84" cy="68" r="2.5" fill={stroke} fillOpacity=".4" />
      <path d="M56 58 C60 56 64 58 60 62 C56 66 52 64 56 58" opacity=".4" />
      <circle cx="60" cy="60" r="1" fill={stroke} fillOpacity=".3" />
    </svg>
  )
}

const SIGN_MAP: Record<string, React.FC<Props>> = {
  aries: Aries,
  touro: Touro,
  gemeos: Gemeos,
  cancer: Cancer,
  leao: Leao,
  virgem: Virgem,
  libra: Libra,
  escorpiao: Escorpiao,
  sagitario: Sagitario,
  capricornio: Capricornio,
  aquario: Aquario,
  peixes: Peixes,
}

export function ZodiacImage({ sign, size }: { sign: string; size?: number }) {
  const slug = sign
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, '-')

  const Component = SIGN_MAP[slug]
  if (!Component) return null
  return <Component size={size} />
}
