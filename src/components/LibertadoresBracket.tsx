import { useMemo } from 'react'
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

function getRoundNames(total: number): string[] {
  if (total <= 1) return ['Final']
  if (total <= 2) return ['Semifinais', 'Final']
  if (total <= 4) return ['Quartas', 'Semifinais', 'Final']
  return ['Oitavas', 'Quartas', 'Semifinais', 'Final']
}

function getNextRoundSlots(prevCount: number): number {
  return Math.ceil(prevCount / 2)
}

function fmtDate(d: string): string {
  if (!d) return ''
  return new Date(d + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
}

export function LibertadoresBracket({ data }: { data: LeagueTable }) {
  const rounds = useMemo(() => {
    if (!data.matches?.chaves) return null
    const pairs = pairMatches(data.matches.chaves)
    if (pairs.length === 0) return null
    const roundNames = getRoundNames(pairs.length)
    const arr: { name: string; pairs: (PairedMatch | null)[] }[] = []
    let remaining = [...pairs]
    for (const name of roundNames) {
      const count = remaining.length
      const nextCount = getNextRoundSlots(count)
      const rPairs = name === roundNames[0] ? remaining : Array.from({ length: nextCount }, () => null)
      arr.push({ name, pairs: rPairs })
      if (name !== roundNames[0]) break
      remaining = Array.from({ length: nextCount }, () => null)
    }
    return arr
  }, [data.matches])

  if (!rounds || rounds.length === 0) {
    return <p className="ft-na" style={{ textAlign: 'center', padding: 24 }}>Dados do chaveamento indisponíveis no momento.</p>
  }

  const firstCount = rounds[0].pairs.length
  const totalRows = firstCount * 3

  function gRow(i: number) { return i * 3 + 2 }
  function colGrid(col: number) { return col }

  let gridCols = '0px'
  for (let ri = 0; ri < rounds.length; ri++) {
    gridCols += ' 1fr'
    if (ri < rounds.length - 1) gridCols += ' 28px'
  }

  return (
    <div className="lb-wrap">
      <div
        className="lb-grid"
        style={{
          gridTemplateColumns: gridCols,
          gridTemplateRows: `auto repeat(${totalRows}, auto)`,
        }}
      >
        {rounds.map((r, ri) => (
          <div
            key={r.name}
            className="lb-col-title"
            style={{ gridColumn: colGrid(ri * 2 + 2), gridRow: 1 }}
          >
            {r.name}
          </div>
        ))}

        {rounds.map((r, ri) =>
          r.pairs.map((pair, pi) => {
            if (!pair) {
              const row = gRow(pi)
              const span = ri === 0 ? 3 : (firstCount / Math.pow(2, ri)) * 1.5
              return (
                <div
                  key={`${ri}-${pi}`}
                  className="lb-node lb-node-empty"
                  style={{ gridColumn: colGrid(ri * 2 + 2), gridRow: `${row} / span ${span}` }}
                >
                  <div className="lb-node-inner"><span>A definir</span></div>
                </div>
              )
            }

            const row = gRow(pi)
            const span = ri === 0 ? 3 : (firstCount / Math.pow(2, ri)) * 1.5
            const played = pair.leg1.played && pair.leg2.played
            const h1s = pair.leg1.homeScore != null ? pair.leg1.homeScore : '-'
            const a1s = pair.leg1.awayScore != null ? pair.leg1.awayScore : '-'
            const h2s = pair.leg2.homeScore != null ? pair.leg2.homeScore : '-'
            const a2s = pair.leg2.awayScore != null ? pair.leg2.awayScore : '-'

            return (
              <div
                key={`${ri}-${pi}`}
                className={`lb-node${played ? ' lb-node-played' : ''}`}
                style={{ gridColumn: colGrid(ri * 2 + 2), gridRow: `${row} / span ${span}` }}
              >
                <div className="lb-inner">
                  <div className="lb-game">
                    <span className="lb-gdate">{fmtDate(pair.leg1.date)}</span>
                    <img src={pair.leg1.homeLogo} alt="" className="lb-glogo" />
                    <span className="lb-gteam">{pair.leg1.home}</span>
                    <span className="lb-gscore">{h1s}</span>
                    <span className="lb-gx">&times;</span>
                    <span className="lb-gscore">{a1s}</span>
                    <span className="lb-gteam">{pair.leg1.away}</span>
                    <img src={pair.leg1.awayLogo} alt="" className="lb-glogo" />
                  </div>
                  <div className="lb-game">
                    <span className="lb-gdate">{fmtDate(pair.leg2.date)}</span>
                    <img src={pair.leg2.homeLogo} alt="" className="lb-glogo" />
                    <span className="lb-gteam lb-gteam-bold">{pair.leg2.home}</span>
                    <span className="lb-gscore lb-gscore-bold">{h2s}</span>
                    <span className="lb-gx">&times;</span>
                    <span className="lb-gscore lb-gscore-bold">{a2s}</span>
                    <span className="lb-gteam lb-gteam-bold">{pair.leg2.away}</span>
                    <img src={pair.leg2.awayLogo} alt="" className="lb-glogo" />
                  </div>
                  {played && pair.aggregateHome != null && pair.aggregateAway != null && (
                    <div className="lb-agg">Agr: {pair.aggregateHome}&times;{pair.aggregateAway}</div>
                  )}
                </div>
              </div>
            )
          })
        )}

        {rounds.slice(0, -1).map((r, ri) => {
          const nextPairs = rounds[ri + 1]?.pairs ?? []
          return nextPairs.map((_, npi) => {
            const prevStart = npi * 2
            const rowStart = gRow(prevStart)
            const span = (firstCount / Math.pow(2, ri + 1)) * 3
            return (
              <div
                key={`conn-${ri}-${npi}`}
                className="lb-conn"
                style={{
                  gridColumn: colGrid(ri * 2 + 3),
                  gridRow: `${rowStart} / span ${span}`,
                }}
              />
            )
          })
        })}
      </div>
    </div>
  )
}
