import { useEffect, useState } from 'react'
import type { LeagueTable, GroupData } from '../types/content'
import { fetchLeagueTables } from '../services/footballApi'
import { LibertadoresBracket } from './LibertadoresBracket'

const LEAGUE_CARD: Record<string, { label: string; icon: string }> = {
  'brasileirao-serie-a': { label: 'Série A', icon: '🇧🇷' },
  'brasileirao-serie-b': { label: 'Série B', icon: '🇧🇷' },
  'brasileirao-serie-c': { label: 'Série C', icon: '🇧🇷' },
  'brasileirao-serie-d': { label: 'Série D', icon: '🇧🇷' },
  'libertadores': { label: 'Libertadores', icon: '🌎' },
}

function GruposView({ groups }: { groups: GroupData[] }) {
  const [selected, setSelected] = useState<string>(groups[0]?.name || '')
  const active = groups.find(g => g.name === selected) || groups[0]
  return (
    <div>
      <div className="ft-grupos-tabs" style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
        {groups.map(g => (
          <button
            key={g.name}
            className={`ft-tab ft-tab-sm${g.name === (active?.name) ? ' is-active' : ''}`}
            onClick={() => setSelected(g.name)}
            type="button"
          >
            {g.name}
          </button>
        ))}
      </div>
      {active ? (
        <div className="ft-table-wrap">
          <div className="ft-table-header">
            <span className="ft-pos">#</span>
            <span className="ft-team">Time</span>
            <span className="ft-stat" title="Pontos">P</span>
            <span className="ft-stat" title="Jogos">J</span>
            <span className="ft-stat" title="Vitórias">V</span>
            <span className="ft-stat" title="Empates">E</span>
            <span className="ft-stat" title="Derrotas">D</span>
            <span className="ft-stat d-none-mobile" title="Gols Pró">GP</span>
            <span className="ft-stat d-none-mobile" title="Gols Contra">GC</span>
            <span className="ft-stat d-none-mobile" title="Saldo">SG</span>
            <span className="ft-stat ft-stat-ultimos">Últimos</span>
          </div>
          {active.teams.map(team => (
            <div key={team.pos} className={`ft-row${team.pos <= 2 ? ' ft-g4' : ''}`}>
              <span className="ft-pos">{team.pos}</span>
              <span className="ft-team">{team.name} <small style={{ opacity: 0.5, fontSize: '.7rem' }}>{team.code}</small></span>
              <span className="ft-stat ft-stat-bold">{team.pts}</span>
              <span className="ft-stat">{team.pj}</span>
              <span className="ft-stat">{team.v}</span>
              <span className="ft-stat">{team.e}</span>
              <span className="ft-stat">{team.d}</span>
              <span className="ft-stat d-none-mobile">{team.gp}</span>
              <span className="ft-stat d-none-mobile">{team.gc}</span>
              <span className="ft-stat d-none-mobile">{team.sg}</span>
              <span className="ft-stat ft-stat-ultimos">
                {team.ultimos?.length ? team.ultimos.map((r, i) => <ResultDot key={i} result={r} />) : <span className="ft-na">—</span>}
              </span>
            </div>
          ))}
          <div className="ft-legend">
            <span><span className="ft-dot" style={{ background: 'var(--success)' }} /> Vitória</span>
            <span><span className="ft-dot" style={{ background: 'var(--error)' }} /> Derrota</span>
            <span><span className="ft-dot" style={{ background: 'var(--text-muted)' }} /> Empate</span>
          </div>
        </div>
      ) : null}
    </div>
  )
}

function ResultDot({ result }: { result: string }) {
  const color =
    result === 'V' ? 'var(--success, #22c55e)' :
    result === 'D' ? 'var(--error, #ef4444)' :
    'var(--text-muted, #6b7280)'
  return <span className="ft-dot" style={{ background: color }}>{result}</span>
}

type SubTab = 'grupos' | 'chaveamento' | 'artilharia'

export function FootballTables({ slugs }: { slugs?: string[] }) {
  const [tables, setTables] = useState<LeagueTable[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [subTab, setSubTab] = useState<SubTab>('chaveamento')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchLeagueTables()
      .then((data) => {
        setTables(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Erro ao carregar')
        setLoading(false)
      })
  }, [])

  const filtered = slugs ? tables.filter((t) => slugs.includes(t.slug)) : tables
  const active = selected ? filtered.find((t) => t.slug === selected) : null

  if (loading) {
    return (
      <div className="ft-loading">
        <div className="skeleton" style={{ height: 40, marginBottom: 8 }} />
        <div className="skeleton" style={{ height: 200 }} />
      </div>
    )
  }

  if (error || filtered.length === 0) return null

  if (!selected) {
    return (
      <div className="ft-card-grid">
        {filtered.map((t) => (
          <button
            key={t.slug}
            className="ft-card"
            onClick={() => setSelected(t.slug)}
            type="button"
          >
            <span className="ft-card-icon">{LEAGUE_CARD[t.slug]?.icon || '⚽'}</span>
            <span className="ft-card-label">{LEAGUE_CARD[t.slug]?.label || t.league}</span>
          </button>
        ))}
      </div>
    )
  }

  const isLibertadores = selected === 'libertadores'

  return (
    <div>
      <div className="ft-back-row">
        <button className="ft-back-btn" onClick={() => setSelected(null)} type="button">← Voltar</button>
        <h3 className="ft-heading" style={{ margin: 0 }}>{LEAGUE_CARD[selected]?.icon || ''} {LEAGUE_CARD[selected]?.label || active?.league || selected}</h3>
      </div>

      {isLibertadores && active ? (
        <>
          <div className="ft-tabs" style={{ marginBottom: 14 }}>
            <button
              className={`ft-tab${subTab === 'grupos' ? ' is-active' : ''}`}
              onClick={() => setSubTab('grupos')}
              type="button"
            >
              Fase de Grupos
            </button>
            <button
              className={`ft-tab${subTab === 'chaveamento' ? ' is-active' : ''}`}
              onClick={() => setSubTab('chaveamento')}
              type="button"
            >
              Chaveamento
            </button>
            <button
              className={`ft-tab${subTab === 'artilharia' ? ' is-active' : ''}`}
              onClick={() => setSubTab('artilharia')}
              type="button"
            >
              Artilharia
            </button>
          </div>

          {subTab === 'grupos' ? (
            active.matches?.groups && active.matches.groups.length > 0 ? (
              <GruposView groups={active.matches.groups} />
            ) : active.teams.length > 0 ? (
              <div className="ft-table-wrap">
                <div className="ft-table-header">
                  <span className="ft-pos">#</span>
                  <span className="ft-team">Time</span>
                  <span className="ft-stat" title="Pontos">P</span>
                  <span className="ft-stat" title="Jogos">J</span>
                  <span className="ft-stat" title="Vitórias">V</span>
                  <span className="ft-stat" title="Empates">E</span>
                  <span className="ft-stat" title="Derrotas">D</span>
                  <span className="ft-stat d-none-mobile" title="Gols Pró">GP</span>
                  <span className="ft-stat d-none-mobile" title="Gols Contra">GC</span>
                  <span className="ft-stat d-none-mobile" title="Saldo">SG</span>
                  <span className="ft-stat ft-stat-ultimos">Últimos</span>
                </div>
                {active.teams.map((team) => (
                  <div key={team.pos} className={`ft-row${team.pos <= 4 ? ' ft-g4' : ''}${team.pos >= active.teams.length - 3 ? ' ft-zone' : ''}`}>
                    <span className="ft-pos">{team.pos}</span>
                    <span className="ft-team">{team.name}</span>
                    <span className="ft-stat ft-stat-bold">{team.pts}</span>
                    <span className="ft-stat">{team.pj}</span>
                    <span className="ft-stat">{team.v}</span>
                    <span className="ft-stat">{team.e}</span>
                    <span className="ft-stat">{team.d}</span>
                    <span className="ft-stat d-none-mobile">{team.gp}</span>
                    <span className="ft-stat d-none-mobile">{team.gc}</span>
                    <span className="ft-stat d-none-mobile">{team.sg}</span>
                    <span className="ft-stat ft-stat-ultimos">
                      {team.ultimos?.length ? team.ultimos.map((r, i) => <ResultDot key={i} result={r} />) : <span className="ft-na">—</span>}
                    </span>
                  </div>
                ))}
                <div className="ft-legend">
                  <span><span className="ft-dot" style={{ background: 'var(--success)' }} /> Vitória</span>
                  <span><span className="ft-dot" style={{ background: 'var(--error)' }} /> Derrota</span>
                  <span><span className="ft-dot" style={{ background: 'var(--text-muted)' }} /> Empate</span>
                </div>
              </div>
            ) : (
              <p className="ft-na" style={{ textAlign: 'center', padding: 24 }}>
                Dados da fase de grupos indisponíveis no momento.
              </p>
            )
          ) : subTab === 'artilharia' ? (
            active.matches?.scorers && active.matches.scorers.length > 0 ? (
              <div className="art-wrap">
                <div className="art-header">
                  <span className="art-rank">#</span>
                  <span className="art-player">Jogador</span>
                  <span className="art-pos">Posição</span>
                  <span className="art-team-cell">Time</span>
                  <span className="art-gols">Gols</span>
                </div>
                {active.matches.scorers.map((s) => (
                  <div key={`${s.name}-${s.pos}`} className="art-row">
                    <span className="art-rank">{s.pos}</span>
                    <span className="art-player">
                      <img src={s.photo} alt={s.name} className="art-photo" />
                      <span>{s.name}</span>
                    </span>
                    <span className="art-pos">{s.position}</span>
                    <span className="art-team-cell">
                      <img src={s.teamLogo} alt={s.team} className="art-logo" />
                      <span>{s.team}</span>
                    </span>
                    <span className="art-gols">{s.goals}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="ft-na" style={{ textAlign: 'center', padding: 24 }}>
                Dados de artilharia indisponíveis no momento.
              </p>
            )
          ) : (
            <LibertadoresBracket data={active} />
          )}
        </>
      ) : active ? (
        active.matches ? (
          <div className="ft-matches">
            <p className="ft-matches-phase">{active.matches.phase}</p>
            {active.matches.chaves.map((c, i) => (
              <div key={i} className={`ft-match${c.played ? ' ft-match-played' : ''}`}>
                <div className="ft-match-teams">
                  <div className="ft-match-team ft-match-home">
                    <img src={c.homeLogo} alt="" className="ft-match-logo" />
                    <span className="ft-match-name">{c.home}</span>
                  </div>
                  <div className="ft-match-score">
                    {c.played ? (
                      <><span>{c.homeScore}</span><span className="ft-match-score-x">x</span><span>{c.awayScore}</span></>
                    ) : (
                      <span className="ft-match-vs">vs</span>
                    )}
                  </div>
                  <div className="ft-match-team ft-match-away">
                    <span className="ft-match-name">{c.away}</span>
                    <img src={c.awayLogo} alt="" className="ft-match-logo" />
                  </div>
                </div>
                <div className="ft-match-meta">
                  {c.played ? <span className="ft-match-status">Encerrado</span> : null}
                  <span>{new Date(c.date + 'T' + c.time).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}</span>
                  <span>{c.time}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="ft-table-wrap">
            <div className="ft-table-header">
              <span className="ft-pos">#</span>
              <span className="ft-team">Time</span>
              <span className="ft-stat" title="Pontos">P</span>
              <span className="ft-stat" title="Jogos">J</span>
              <span className="ft-stat" title="Vitórias">V</span>
              <span className="ft-stat" title="Empates">E</span>
              <span className="ft-stat" title="Derrotas">D</span>
              <span className="ft-stat d-none-mobile" title="Gols Pró">GP</span>
              <span className="ft-stat d-none-mobile" title="Gols Contra">GC</span>
              <span className="ft-stat d-none-mobile" title="Saldo">SG</span>
              <span className="ft-stat ft-stat-ultimos">Últimos</span>
            </div>

            {active.teams.map((team) => (
              <div key={team.pos} className={`ft-row${team.pos <= 4 ? ' ft-g4' : ''}${team.pos >= active.teams.length - 3 ? ' ft-zone' : ''}`}>
                <span className="ft-pos">{team.pos}</span>
                <span className="ft-team">{team.name}</span>
                <span className="ft-stat ft-stat-bold">{team.pts}</span>
                <span className="ft-stat">{team.pj}</span>
                <span className="ft-stat">{team.v}</span>
                <span className="ft-stat">{team.e}</span>
                <span className="ft-stat">{team.d}</span>
                <span className="ft-stat d-none-mobile">{team.gp}</span>
                <span className="ft-stat d-none-mobile">{team.gc}</span>
                <span className="ft-stat d-none-mobile">{team.sg}</span>
                <span className="ft-stat ft-stat-ultimos">
                  {team.ultimos?.length ? team.ultimos.map((r, i) => <ResultDot key={i} result={r} />) : <span className="ft-na">—</span>}
                </span>
              </div>
            ))}

            <div className="ft-legend">
              <span><span className="ft-dot" style={{ background: 'var(--success)' }} /> Vitória</span>
              <span><span className="ft-dot" style={{ background: 'var(--error)' }} /> Derrota</span>
              <span><span className="ft-dot" style={{ background: 'var(--text-muted)' }} /> Empate</span>
            </div>
          </div>
        )
      ) : (
        <p className="ft-na">Dados indisponíveis para este campeonato no momento.</p>
      )}

      <p className="ft-footer">Fonte: GE.com &middot; Atualizado automaticamente a cada 30 min</p>
    </div>
  )
}
