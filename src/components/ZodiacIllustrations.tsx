type Props = { size?: number }

const P = 'none'
const S = '#fff'
const sw = 1.5

function Aries({ size = 160 }: Props) {
  return (
    <svg viewBox="0 0 160 160" width={size} height={size} fill={P} stroke={S} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <defs>
        <radialGradient id="a-g"><stop offset="0%" stopColor="#ff6b35" stopOpacity=".3"/><stop offset="100%" stopColor="#ff6b35" stopOpacity="0"/></radialGradient>
      </defs>
      <circle cx="80" cy="80" r="70" fill="url(#a-g)" opacity=".4"/>
      <path d="M50 120 C50 80 60 55 80 35 C100 55 110 80 110 120" strokeWidth={2}/>
      <path d="M60 115 C60 85 68 65 80 48 C92 65 100 85 100 115" opacity=".5"/>
      <circle cx="50" cy="30" r="8" strokeWidth={1.5}/>
      <circle cx="110" cy="30" r="8" strokeWidth={1.5}/>
      <path d="M50 22 C42 10 32 8 28 16" strokeWidth={2}>
        <animateTransform attributeName="transform" type="rotate" values="-5 50 30;5 50 30;-5 50 30" dur="2s" repeatCount="indefinite"/>
      </path>
      <path d="M110 22 C118 10 128 8 132 16" strokeWidth={2}>
        <animateTransform attributeName="transform" type="rotate" values="5 110 30;-5 110 30;5 110 30" dur="2s" repeatCount="indefinite"/>
      </path>
      <path d="M80 35 L80 20" strokeDasharray="3 4" opacity=".3"/>
      <circle cx="80" cy="20" r="3" fill="#ff6b35" opacity=".6">
        <animate attributeName="r" values="3;5;3" dur="1.5s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values=".6;.3;.6" dur="1.5s" repeatCount="indefinite"/>
      </circle>
    </svg>
  )
}

function Touro({ size = 160 }: Props) {
  return (
    <svg viewBox="0 0 160 160" width={size} height={size} fill={P} stroke={S} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <defs>
        <radialGradient id="t-g"><stop offset="0%" stopColor="#27ae60" stopOpacity=".25"/><stop offset="100%" stopColor="#27ae60" stopOpacity="0"/></radialGradient>
      </defs>
      <circle cx="80" cy="80" r="70" fill="url(#t-g)" opacity=".4"/>
      <ellipse cx="80" cy="75" rx="28" ry="22" strokeWidth={2}/>
      <path d="M30 45 C30 25 45 15 58 22" strokeWidth={2}/>
      <path d="M130 45 C130 25 115 15 102 22" strokeWidth={2}/>
      <circle cx="30" cy="42" r="5" opacity=".3"/>
      <circle cx="130" cy="42" r="5" opacity=".3"/>
      <circle cx="70" cy="70" r="4" fill="#27ae60" opacity=".4">
        <animate attributeName="opacity" values=".4;.7;.4" dur="3s" repeatCount="indefinite"/>
      </circle>
      <circle cx="90" cy="70" r="4" fill="#27ae60" opacity=".4">
        <animate attributeName="opacity" values=".4;.7;.4" dur="3s" repeatCount="indefinite" begin=".5s"/>
      </circle>
      <path d="M73 82 C77 86 83 86 87 82"/>
      <path d="M80 97 C80 105 80 115 80 125" strokeDasharray="4 4" opacity=".2"/>
      <ellipse cx="80" cy="125" rx="15" ry="5" opacity=".15"/>
    </svg>
  )
}

function Gemeos({ size = 160 }: Props) {
  return (
    <svg viewBox="0 0 160 160" width={size} height={size} fill={P} stroke={S} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <defs>
        <radialGradient id="g-g"><stop offset="0%" stopColor="#f1c40f" stopOpacity=".2"/><stop offset="100%" stopColor="#3498db" stopOpacity="0"/></radialGradient>
      </defs>
      <circle cx="80" cy="80" r="70" fill="url(#g-g)" opacity=".3"/>
      <circle cx="60" cy="52" r="18" strokeWidth={2}/>
      <circle cx="100" cy="52" r="18" strokeWidth={2}/>
      <line x1="60" y1="70" x2="60" y2="120" strokeWidth={2}/>
      <line x1="100" y1="70" x2="100" y2="120" strokeWidth={2}/>
      <circle cx="55" cy="50" r="2.5" fill="#f1c40f" opacity=".5"/>
      <circle cx="95" cy="50" r="2.5" fill="#3498db" opacity=".5"/>
      <path d="M54 58 C57 61 63 61 66 58"/>
      <path d="M94 58 C97 61 103 61 106 58"/>
      <path d="M60 120 C70 130 90 130 100 120" strokeDasharray="4 3" opacity=".25">
        <animate attributeName="stroke-dashoffset" values="0;14" dur="3s" repeatCount="indefinite"/>
      </path>
      <circle cx="80" cy="42" r="6" opacity=".15">
        <animate attributeName="r" values="6;9;6" dur="4s" repeatCount="indefinite"/>
      </circle>
    </svg>
  )
}

function Cancer({ size = 160 }: Props) {
  return (
    <svg viewBox="0 0 160 160" width={size} height={size} fill={P} stroke={S} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <defs>
        <radialGradient id="c-g"><stop offset="0%" stopColor="#00bcd4" stopOpacity=".25"/><stop offset="100%" stopColor="#00bcd4" stopOpacity="0"/></radialGradient>
      </defs>
      <circle cx="80" cy="80" r="70" fill="url(#c-g)" opacity=".35"/>
      <ellipse cx="80" cy="70" rx="30" ry="20" strokeWidth={2}/>
      <path d="M50 70 C50 45 65 30 80 30 C95 30 110 45 110 70" strokeWidth={2}/>
      <circle cx="68" cy="65" r="4" fill="#00bcd4" opacity=".4"/>
      <circle cx="92" cy="65" r="4" fill="#00bcd4" opacity=".4"/>
      <circle cx="67" cy="64" r="1.5" fill="#fff" opacity=".5"/>
      <circle cx="91" cy="64" r="1.5" fill="#fff" opacity=".5"/>
      <path d="M38 85 L22 68 C16 60 18 48 26 44" strokeWidth={2}/>
      <path d="M122 85 L138 68 C144 60 142 48 134 44" strokeWidth={2}/>
      <path d="M26 95 C26 105 35 112 45 108" strokeWidth={1.5}/>
      <path d="M134 95 C134 105 125 112 115 108" strokeWidth={1.5}>
        <animateTransform attributeName="transform" type="rotate" values="-3 115 108;3 115 108;-3 115 108" dur="2.5s" repeatCount="indefinite"/>
      </path>
      <path d="M26 95 C26 105 35 112 45 108" strokeWidth={1.5}>
        <animateTransform attributeName="transform" type="rotate" values="3 45 108;-3 45 108;3 45 108" dur="2.5s" repeatCount="indefinite"/>
      </path>
    </svg>
  )
}

function Leao({ size = 160 }: Props) {
  return (
    <svg viewBox="0 0 160 160" width={size} height={size} fill={P} stroke={S} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <defs>
        <radialGradient id="l-g"><stop offset="0%" stopColor="#f39c12" stopOpacity=".35"/><stop offset="100%" stopColor="#e74c3c" stopOpacity="0"/></radialGradient>
      </defs>
      <circle cx="80" cy="75" r="72" fill="url(#l-g)" opacity=".4"/>
      <g>
        <animateTransform attributeName="transform" type="rotate" values="0 80 70;2 80 70;-2 80 70;0 80 70" dur="4s" repeatCount="indefinite"/>
        <path d="M80 18 C60 18 38 30 32 55 C28 72 35 92 55 98" strokeWidth={1.5} opacity=".5"/>
        <path d="M80 18 C100 18 122 30 128 55 C132 72 125 92 105 98" strokeWidth={1.5} opacity=".5"/>
        <path d="M80 12 C55 12 28 28 22 58 C18 80 28 102 52 110" strokeWidth={1} opacity=".3"/>
        <path d="M80 12 C105 12 132 28 138 58 C142 80 132 102 108 110" strokeWidth={1} opacity=".3"/>
        <path d="M80 8 C48 8 18 26 12 62 C8 88 22 114 50 120" strokeWidth={.8} opacity=".2"/>
        <path d="M80 8 C112 8 142 26 148 62 C152 88 138 114 110 120" strokeWidth={.8} opacity=".2"/>
      </g>
      <circle cx="80" cy="72" r="26" strokeWidth={2}/>
      <circle cx="70" cy="66" r="3.5" fill="#f39c12" opacity=".5">
        <animate attributeName="opacity" values=".5;.8;.5" dur="3s" repeatCount="indefinite"/>
      </circle>
      <circle cx="90" cy="66" r="3.5" fill="#f39c12" opacity=".5">
        <animate attributeName="opacity" values=".5;.8;.5" dur="3s" repeatCount="indefinite" begin=".5s"/>
      </circle>
      <circle cx="69" cy="65" r="1.5" fill="#fff" opacity=".7"/>
      <circle cx="89" cy="65" r="1.5" fill="#fff" opacity=".7"/>
      <path d="M73 80 C76 84 84 84 87 80"/>
      <path d="M80 98 C80 112 80 125 80 138" opacity=".2"/>
      <path d="M80 138 L74 148 M80 138 L86 148" opacity=".15"/>
    </svg>
  )
}

function Virgem({ size = 160 }: Props) {
  return (
    <svg viewBox="0 0 160 160" width={size} height={size} fill={P} stroke={S} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <defs>
        <radialGradient id="v-g"><stop offset="0%" stopColor="#9ccc65" stopOpacity=".2"/><stop offset="100%" stopColor="#9ccc65" stopOpacity="0"/></radialGradient>
      </defs>
      <circle cx="80" cy="80" r="70" fill="url(#v-g)" opacity=".3"/>
      <circle cx="65" cy="48" r="16" strokeWidth={2}/>
      <line x1="65" y1="64" x2="65" y2="130" strokeWidth={2}/>
      <line x1="95" y1="64" x2="95" y2="130" strokeWidth={2}/>
      <circle cx="60" cy="46" r="2.5" fill="#9ccc65" opacity=".4"/>
      <path d="M58 54 C62 58 68 58 72 54"/>
      <path d="M65 64 C55 72 55 88 65 95" opacity=".6"/>
      <path d="M95 64 C105 72 105 88 95 95" opacity=".6"/>
      <path d="M65 130 C75 138 85 138 95 130"/>
      <circle cx="115" cy="35" r="2" fill="#9ccc65" opacity=".3">
        <animate attributeName="opacity" values=".3;.7;.3" dur="2s" repeatCount="indefinite"/>
      </circle>
      <circle cx="125" cy="55" r="1.5" fill="#9ccc65" opacity=".2">
        <animate attributeName="opacity" values=".2;.5;.2" dur="2.5s" repeatCount="indefinite" begin=".7s"/>
      </circle>
      <circle cx="118" cy="75" r="1" fill="#9ccc65" opacity=".25">
        <animate attributeName="opacity" values=".25;.6;.25" dur="3s" repeatCount="indefinite" begin="1s"/>
      </circle>
    </svg>
  )
}

function Libra({ size = 160 }: Props) {
  return (
    <svg viewBox="0 0 160 160" width={size} height={size} fill={P} stroke={S} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <defs>
        <radialGradient id="li-g"><stop offset="0%" stopColor="#ce93d8" stopOpacity=".2"/><stop offset="100%" stopColor="#ce93d8" stopOpacity="0"/></radialGradient>
      </defs>
      <circle cx="80" cy="80" r="70" fill="url(#li-g)" opacity=".3"/>
      <line x1="30" y1="55" x2="130" y2="55" strokeWidth={2}/>
      <path d="M80 55 L80 105" strokeWidth={2}/>
      <path d="M65 105 C72 112 88 112 95 105" strokeWidth={2}/>
      <path d="M30 55 C30 68 48 78 65 78 C72 78 78 75 80 70" strokeWidth={1.5}>
        <animateTransform attributeName="transform" type="rotate" values="-4 80 55;4 80 55;-4 80 55" dur="3.5s" repeatCount="indefinite"/>
      </path>
      <path d="M130 55 C130 68 112 78 95 78 C88 78 82 75 80 70" strokeWidth={1.5}>
        <animateTransform attributeName="transform" type="rotate" values="4 80 55;-4 80 55;4 80 55" dur="3.5s" repeatCount="indefinite"/>
      </path>
      <circle cx="30" cy="55" r="4" opacity=".25"/>
      <circle cx="130" cy="55" r="4" opacity=".25"/>
    </svg>
  )
}

function Escorpiao({ size = 160 }: Props) {
  return (
    <svg viewBox="0 0 160 160" width={size} height={size} fill={P} stroke={S} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <defs>
        <radialGradient id="e-g"><stop offset="0%" stopColor="#e91e63" stopOpacity=".25"/><stop offset="100%" stopColor="#4a148c" stopOpacity="0"/></radialGradient>
      </defs>
      <circle cx="80" cy="80" r="70" fill="url(#e-g)" opacity=".35"/>
      <path d="M50 40 C50 65 65 80 80 95 C95 80 110 65 110 40" strokeWidth={2}/>
      <circle cx="58" cy="55" r="7" strokeWidth={1.5}/>
      <circle cx="102" cy="55" r="7" strokeWidth={1.5}/>
      <circle cx="57" cy="54" r="2.5" fill="#e91e63" opacity=".5"/>
      <circle cx="101" cy="54" r="2.5" fill="#e91e63" opacity=".5"/>
      <path d="M65 70 C70 85 75 100 80 115" strokeWidth={2}/>
      <path d="M95 70 C90 85 85 100 80 115" strokeWidth={2}/>
      <path d="M80 115 C90 125 100 120 98 112 C96 104 82 110 80 115" strokeWidth={1.5}/>
      <path d="M80 115 C70 125 60 120 62 112 C64 104 78 110 80 115" opacity=".5">
        <animateTransform attributeName="transform" type="rotate" values="-5 80 115;5 80 115;-5 80 115" dur="2s" repeatCount="indefinite"/>
      </path>
      <circle cx="98" cy="112" r="3" fill="#e91e63" opacity=".4">
        <animate attributeName="opacity" values=".4;.8;.4" dur="1.5s" repeatCount="indefinite"/>
      </circle>
    </svg>
  )
}

function Sagitario({ size = 160 }: Props) {
  return (
    <svg viewBox="0 0 160 160" width={size} height={size} fill={P} stroke={S} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <defs>
        <radialGradient id="s-g"><stop offset="0%" stopColor="#ff6f00" stopOpacity=".25"/><stop offset="100%" stopColor="#d32f2f" stopOpacity="0"/></radialGradient>
      </defs>
      <circle cx="80" cy="80" r="70" fill="url(#s-g)" opacity=".35"/>
      <line x1="25" y1="130" x2="135" y2="30" strokeWidth={2.5}/>
      <path d="M135 30 C120 28 115 35 115 48" strokeWidth={2}/>
      <path d="M135 30 C135 45 128 52 115 48" strokeWidth={2}/>
      <path d="M35 120 L27 114 L30 122" fill={S} fillOpacity=".2"/>
      <circle cx="30" cy="128" r="4" fill="#ff6f00" opacity=".2"/>
      <path d="M55 100 L48 94" strokeDasharray="3 4" opacity=".2"/>
      <path d="M75 80 L68 74" strokeDasharray="3 4" opacity=".2"/>
      <path d="M95 60 L88 54" strokeDasharray="3 4" opacity=".2"/>
      <circle cx="115" cy="48" r="8" opacity=".15">
        <animate attributeName="r" values="8;12;8" dur="2s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values=".15;.3;.15" dur="2s" repeatCount="indefinite"/>
      </circle>
    </svg>
  )
}

function Capricornio({ size = 160 }: Props) {
  return (
    <svg viewBox="0 0 160 160" width={size} height={size} fill={P} stroke={S} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <defs>
        <radialGradient id="cp-g"><stop offset="0%" stopColor="#5d4037" stopOpacity=".2"/><stop offset="100%" stopColor="#78909c" stopOpacity="0"/></radialGradient>
      </defs>
      <circle cx="80" cy="80" r="70" fill="url(#cp-g)" opacity=".3"/>
      <path d="M40 35 C40 60 55 80 70 100 C60 108 48 118 40 130" strokeWidth={2}/>
      <path d="M70 100 C85 115 105 120 130 112" strokeWidth={2}/>
      <path d="M130 112 C118 102 108 88 105 72" strokeWidth={2}/>
      <circle cx="40" cy="35" r="6" fill="#5d4037" opacity=".2"/>
      <circle cx="105" cy="72" r="5" fill="#78909c" opacity=".2"/>
      <path d="M36 30 C30 22 32 14 40 14 C48 14 50 22 44 30" strokeWidth={1.5}/>
      <path d="M102 68 C108 60 118 58 122 64 C126 70 120 78 112 74" opacity=".4">
        <animateTransform attributeName="transform" type="rotate" values="-3 105 72;3 105 72;-3 105 72" dur="4s" repeatCount="indefinite"/>
      </path>
      <path d="M70 100 L72 106 L66 104" fill={S} fillOpacity=".15"/>
    </svg>
  )
}

function Aquario({ size = 160 }: Props) {
  return (
    <svg viewBox="0 0 160 160" width={size} height={size} fill={P} stroke={S} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <defs>
        <radialGradient id="aq-g"><stop offset="0%" stopColor="#0097a7" stopOpacity=".25"/><stop offset="100%" stopColor="#26c6da" stopOpacity="0"/></radialGradient>
      </defs>
      <circle cx="80" cy="80" r="70" fill="url(#aq-g)" opacity=".35"/>
      <path d="M35 55 C48 48 62 55 76 48 C90 41 104 48 118 42" strokeWidth={2}>
        <animate attributeName="d" values="M35 55 C48 48 62 55 76 48 C90 41 104 48 118 42;M35 58 C48 51 62 58 76 51 C90 44 104 51 118 45;M35 55 C48 48 62 55 76 48 C90 41 104 48 118 42" dur="3s" repeatCount="indefinite"/>
      </path>
      <path d="M35 68 C48 61 62 68 76 61 C90 54 104 61 118 55" strokeWidth={1.5} opacity=".6">
        <animate attributeName="d" values="M35 68 C48 61 62 68 76 61 C90 54 104 61 118 55;M35 71 C48 64 62 71 76 64 C90 57 104 64 118 58;M35 68 C48 61 62 68 76 61 C90 54 104 61 118 55" dur="3.5s" repeatCount="indefinite"/>
      </path>
      <path d="M35 80 C48 73 62 80 76 73 C90 66 104 73 118 67" strokeWidth={1} opacity=".35">
        <animate attributeName="d" values="M35 80 C48 73 62 80 76 73 C90 66 104 73 118 67;M35 83 C48 76 62 83 76 76 C90 69 104 76 118 70;M35 80 C48 73 62 80 76 73 C90 66 104 73 118 67" dur="4s" repeatCount="indefinite"/>
      </path>
      <path d="M28 100 C32 108 24 116 18 112" opacity=".25"/>
      <path d="M34 104 C38 112 30 120 24 116" opacity=".15"/>
      <circle cx="50" cy="52" r="2" fill="#26c6da" opacity=".3">
        <animate attributeName="opacity" values=".3;.6;.3" dur="2s" repeatCount="indefinite"/>
      </circle>
      <circle cx="80" cy="48" r="2" fill="#26c6da" opacity=".3">
        <animate attributeName="opacity" values=".3;.6;.3" dur="2s" repeatCount="indefinite" begin=".5s"/>
      </circle>
      <circle cx="110" cy="44" r="2" fill="#26c6da" opacity=".3">
        <animate attributeName="opacity" values=".3;.6;.3" dur="2s" repeatCount="indefinite" begin="1s"/>
      </circle>
    </svg>
  )
}

function Peixes({ size = 160 }: Props) {
  return (
    <svg viewBox="0 0 160 160" width={size} height={size} fill={P} stroke={S} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <defs>
        <radialGradient id="p-g"><stop offset="0%" stopColor="#5c6bc0" stopOpacity=".2"/><stop offset="100%" stopColor="#7986cb" stopOpacity="0"/></radialGradient>
      </defs>
      <circle cx="80" cy="80" r="70" fill="url(#p-g)" opacity=".3"/>
      <g>
        <animateTransform attributeName="transform" type="translate" values="0,0;3,-2;0,0;-3,2;0,0" dur="5s" repeatCount="indefinite"/>
        <ellipse cx="55" cy="70" rx="22" ry="14" transform="rotate(-15 55 70)" strokeWidth={2}/>
        <path d="M33 60 C24 50 22 35 30 30 C38 35 38 50 33 60" fill={S} fillOpacity=".08" strokeWidth={1.5}/>
        <circle cx="48" cy="66" r="3" fill="#5c6bc0" opacity=".5"/>
        <circle cx="47" cy="65" r="1" fill="#fff" opacity=".6"/>
      </g>
      <g>
        <animateTransform attributeName="transform" type="translate" values="0,0;-3,2;0,0;3,-2;0,0" dur="5s" repeatCount="indefinite"/>
        <ellipse cx="105" cy="90" rx="22" ry="14" transform="rotate(15 105 90)" strokeWidth={2}/>
        <path d="M127 100 C136 110 138 125 130 130 C122 125 122 110 127 100" fill={S} fillOpacity=".08" strokeWidth={1.5}/>
        <circle cx="112" cy="86" r="3" fill="#7986cb" opacity=".5"/>
        <circle cx="113" cy="85" r="1" fill="#fff" opacity=".6"/>
      </g>
      <path d="M72 78 C76 74 80 74 84 78 C88 82 84 86 80 82 C76 86 72 82 72 78" opacity=".3">
        <animateTransform attributeName="transform" type="rotate" values="0 80 80;10 80 80;0 80 80;-10 80 80;0 80 80" dur="4s" repeatCount="indefinite"/>
      </path>
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

export function ZodiacIllustration({ sign, size }: { sign: string; size?: number }) {
  const slug = sign
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, '-')
  const Component = SIGN_MAP[slug]
  if (!Component) return null
  return <Component size={size} />
}
