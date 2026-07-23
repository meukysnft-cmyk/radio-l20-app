import { useMemo, useState } from 'react'
import type { MatchChave, LeagueTable } from '../types/content'

type PairedMatch = {
  leg1: MatchChave
  leg2: MatchChave
  aggregateHome?: number
  aggregateAway?: number
  winner?: 'home' | 'away'
}

function pairMatches(chaves: MatchChave[]): PairedMatch[] {
  const used = new Set<number>()
  const pairs: PairedMatch[] = []
  for (let i = 0; i < chaves.length; i++) {
    if (used.has(i)) continue
    for (let j = i + 1; j < chaves.length; j++) {
      if (used.has(j)) continue
      if (chaves[i].home === chaves[j].away && chaves[i].away === chaves[j].home) {
        const [leg1, leg2] = chaves[i].date <= chaves[j].date
          ? [chaves[i], chaves[j]]
          : [chaves[j], chaves[i]]
        const h1 = leg1.homeScore ?? 0
        const a1 = leg1.awayScore ?? 0
        const h2 = leg2.homeScore ?? 0
        const a2 = leg2.awayScore ?? 0
        const aggHome = a1 + h2
        const aggAway = h1 + a2
        let winner: 'home' | 'away' | undefined
        if (leg1.played && leg2.played) {
          if (aggHome > aggAway) winner = 'home'
          else if (aggAway > aggHome) winner = 'away'
          else {
            const awayGoalsHome = h2
            const awayGoalsAway = a1
            if (awayGoalsAway > awayGoalsHome) winner = 'home'
            else if (awayGoalsHome > awayGoalsAway) winner = 'away'
          }
        }
        pairs.push({ leg1, leg2, aggregateHome: aggHome, aggregateAway: aggAway, winner })
        used.add(i)
        used.add(j)
        break
      }
    }
  }
  return pairs
}

function fmtDate(d: string): string {
  if (!d) return ''
  return new Date(d + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
}

const ROUNDS = [
  { label: 'Oitavas', size: 8, offset: 0 },
  { label: 'Quartas', size: 4, offset: 8 },
  { label: 'Semifinais', size: 2, offset: 12 },
  { label: 'Final', size: 1, offset: 14 },
]

export function LibertadoresBracket({ data }: { data: LeagueTable }) {
  const allPairs = useMemo(() => {
    if (!data.matches?.chaves) return null
    const pairs = pairMatches(data.matches.chaves)
    return pairs.length ? pairs : null
  }, [data.matches])

  const avail = useMemo(() => {
    if (!allPairs) return []
    return ROUNDS.filter(r => allPairs.length >= r.offset + r.size)
  }, [allPairs])

  const [tab, setTab] = useState(0)

  if (!allPairs || avail.length === 0) {
    return <p className="ft-na" style={{ textAlign: 'center', padding: 24 }}>Dados do chaveamento indisponíveis no momento.</p>
  }

  const cur = avail[tab]
  const shown = allPairs.slice(cur.offset, cur.offset + cur.size)

  return (
    <div>
      <div className="ft-tabs" style={{ marginBottom: 18 }}>
        {avail.map((r, i) => (
          <button
            key={r.label}
            className={`ft-tab${i === tab ? ' is-active' : ''}`}
            onClick={() => setTab(i)}
            type="button"
            style={{ fontSize: '.85rem', padding: '8px 18px' }}
          >
            {r.label}
          </button>
        ))}
      </div>
      <div className="lb-round">
        <h3 className="lb-round-title">{cur.label}</h3>
        <div className="lb-round-list">
          {shown.map((pair, pi) => {
            const played = pair.leg1.played && pair.leg2.played
            const h1s = pair.leg1.homeScore != null ? pair.leg1.homeScore : '-'
            const a1s = pair.leg1.awayScore != null ? pair.leg1.awayScore : '-'
            const h2s = pair.leg2.homeScore != null ? pair.leg2.homeScore : '-'
            const a2s = pair.leg2.awayScore != null ? pair.leg2.awayScore : '-'
            return (
              <div key={pi} className={`lb-matchup${played ? ' lb-matchup-played' : ''}`}>
                <div className="lb-matchup-label">Confronto {pi + 1}</div>
                <div className="lb-matchup-body">
                  <div className="lb-leg">
                    <span className="lb-leg-date">{fmtDate(pair.leg1.date)}</span>
                    <div className="lb-leg-teams">
                      <div className="lb-leg-row">
                         <img src={pair.leg1.homeLogo} alt="" className="lb-leg-logo" loading="lazy" />
                        <span className="lb-leg-name">{pair.leg1.home}</span>
                      </div>
                      <div className="lb-leg-score">
                        {h1s}
                        <span className="lb-leg-x">&times;</span>
                        {a1s}
                      </div>
                      <div className="lb-leg-row lb-leg-row-right">
                        <span className="lb-leg-name">{pair.leg1.away}</span>
                         <img src={pair.leg1.awayLogo} alt="" className="lb-leg-logo" loading="lazy" />
                      </div>
                    </div>
                  </div>
                  <div className="lb-leg">
                    <span className="lb-leg-date">{fmtDate(pair.leg2.date)}</span>
                    <div className="lb-leg-teams">
                      <div className="lb-leg-row">
                         <img src={pair.leg2.homeLogo} alt="" className="lb-leg-logo" loading="lazy" />
                        <span className="lb-leg-name lb-leg-name-bold">{pair.leg2.home}</span>
                      </div>
                      <div className="lb-leg-score lb-leg-score-bold">
                        {h2s}
                        <span className="lb-leg-x">&times;</span>
                        {a2s}
                      </div>
                      <div className="lb-leg-row lb-leg-row-right">
                        <span className="lb-leg-name lb-leg-name-bold">{pair.leg2.away}</span>
                         <img src={pair.leg2.awayLogo} alt="" className="lb-leg-logo" loading="lazy" />
                      </div>
                    </div>
                  </div>
                  {played && pair.aggregateHome != null && pair.aggregateAway != null && (
                    <div className="lb-agg">
                      Agregado: {pair.aggregateHome}&times;{pair.aggregateAway}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}