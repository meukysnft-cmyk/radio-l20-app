import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getSignSvg } from '../utils/zodiac'
import { getSignSlug } from '../data/signProfiles'
import { radioRoutes } from '../config/radioLinks'

export type HoroscopePeriodData = {
  message: string
  love: string
  work: string
  health: string
  advice: string
}

export type HoroscopeDailyData = HoroscopePeriodData & {
  color?: string
  accessory?: string
  luckyNumber?: string
}

export type HoroscopeSignData = {
  name: string
  period: string
  element: string
  daily: HoroscopeDailyData
  weekly: HoroscopePeriodData
  monthly: HoroscopePeriodData
}

type PeriodTab = 'daily' | 'weekly' | 'monthly'

const tabLabels: Record<PeriodTab, string> = {
  daily: 'Diário',
  weekly: 'Semanal',
  monthly: 'Mensal',
}

const COLOR_MAP: Record<string, string> = {
  'Vermelho': '#e74c3c',
  'Azul': '#3498db',
  'Verde': '#27ae60',
  'Amarelo': '#f1c40f',
  'Roxo': '#9b59b6',
  'Rosa': '#e91e8a',
  'Laranja': '#e67e22',
  'Branco': '#ecf0f1',
  'Dourado': '#f39c12',
  'Prata': '#bdc3c7',
  'Turquesa': '#1abc9c',
  'Coral': '#ff6f61',
  'Índigo': '#5b5ea6',
  'Bege': '#d2b48c',
  'Vinho': '#722f37',
  'Lilás': '#c8a2c8',
  'Marinho': '#003153',
  'Pêssego': '#ffcba4',
  'Menta': '#98ff98',
  'Bordô': '#800020',
  'Cinza': '#808080',
  'Caramelo': '#ffd59a',
  'Magenta': '#ff00ff',
  'Oliva': '#808000',
}

function resolveColor(color: string | undefined): string | undefined {
  if (!color) return undefined
  if (color.startsWith('#') || color.startsWith('rgb')) return color
  return COLOR_MAP[color] || color
}

export function HoroscopeCard({ sign }: { sign: HoroscopeSignData }) {
  const [activeTab, setActiveTab] = useState<PeriodTab>('daily')
  const periodData = sign[activeTab]
  const colorHex = resolveColor(sign.daily.color)

  const signSvg = getSignSvg(sign.name)

  return (
    <details className="horoscope-card">
      <summary>
        {signSvg ? (
          <img className="horoscope-card-icon" src={signSvg} alt="" width={56} height={56} />
        ) : null}
        <span>
          <small>{sign.element}</small>
          <strong>{sign.name}</strong>
          <em>{sign.period}</em>
        </span>
        <span className="horoscope-toggle">Ver detalhes</span>
        <Link
          to={`${radioRoutes.horoscope}/${getSignSlug(sign.name)}`}
          className="horoscope-card-sign-link"
          onClick={(e) => e.stopPropagation()}
        >
          Ver signo &rarr;
        </Link>
      </summary>

      <div className="horoscope-card-period-tabs">
        {(['daily', 'weekly', 'monthly'] as const).map((tab) => (
          <button
            key={tab}
            className={`horoscope-card-period-tab${activeTab === tab ? ' is-active' : ''}`}
            type="button"
            onClick={(e) => { e.preventDefault(); setActiveTab(tab) }}
          >
            {tabLabels[tab]}
          </button>
        ))}
      </div>

      <p>{periodData.message}</p>

      {activeTab === 'daily' && (colorHex || sign.daily.luckyNumber) ? (
        <div className="horoscope-card-extras">
          {colorHex ? (
            <span className="horoscope-card-extra">
              <span className="horoscope-extra-label">Cor do dia</span>
              <span className="horoscope-extra-value horoscope-color-pill" style={{ background: colorHex }}>
                {sign.daily.color}
              </span>
            </span>
          ) : null}
          {sign.daily.luckyNumber ? (
            <span className="horoscope-card-extra">
              <span className="horoscope-extra-label">Número da sorte</span>
              <span className="horoscope-extra-value">{sign.daily.luckyNumber}</span>
            </span>
          ) : null}
        </div>
      ) : null}

      <dl className="horoscope-details">
        <div>
          <dt>Amor</dt>
          <dd>{periodData.love}</dd>
        </div>
        <div>
          <dt>Trabalho</dt>
          <dd>{periodData.work}</dd>
        </div>
        <div>
          <dt>Saúde</dt>
          <dd>{periodData.health}</dd>
        </div>
        <div>
          <dt>Conselho do dia</dt>
          <dd>{periodData.advice}</dd>
        </div>
      </dl>
    </details>
  )
}
