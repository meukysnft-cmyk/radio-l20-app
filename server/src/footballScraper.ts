import * as brasileirao from 'campeonato-brasileiro-api'

export type TeamRow = {
  pos: number
  name: string
  pts: number
  pj: number
  v: number
  e: number
  d: number
  gp: number
  gc: number
  sg: number
}

export type LeagueTable = {
  league: string
  slug: string
  updatedAt: string
  teams: TeamRow[]
}

const SERIES = ['a', 'b', 'c', 'd'] as const
const SERIES_NAMES: Record<string, string> = {
  a: 'Brasileirão Série A',
  b: 'Brasileirão Série B',
  c: 'Brasileirão Série C',
  d: 'Brasileirão Série D',
}

const CACHE_TTL = 30 * 60 * 1000
let cache: { data: LeagueTable[]; timestamp: number } | null = null

async function fetchSerie(serie: string): Promise<LeagueTable | null> {
  try {
    const data = await brasileirao.getStandings(serie)
    const table = data.tables?.[0]
    if (!table?.entries?.length) return null

    const leagueName = SERIES_NAMES[serie] || data.competition.name
    const slug = data.competition.slug

    const teams: TeamRow[] = table.entries.map((entry: any) => ({
      pos: entry.position ?? 0,
      name: entry.team?.name || '',
      pts: entry.points ?? 0,
      pj: entry.matches ?? 0,
      v: entry.wins ?? 0,
      e: entry.draws ?? 0,
      d: entry.losses ?? 0,
      gp: entry.goalsFor ?? 0,
      gc: entry.goalsAgainst ?? 0,
      sg: entry.goalDifference ?? 0,
    }))

    return {
      league: leagueName,
      slug,
      updatedAt: new Date().toISOString(),
      teams,
    }
  } catch {
    return null
  }
}

function mapGrupoEntry(entry: any): TeamRow {
  return {
    pos: entry.position ?? 0,
    name: entry.team?.name || '',
    pts: entry.points ?? 0,
    pj: entry.matches ?? 0,
    v: entry.wins ?? 0,
    e: entry.draws ?? 0,
    d: entry.losses ?? 0,
    gp: entry.goalsFor ?? 0,
    gc: entry.goalsAgainst ?? 0,
    sg: entry.goalDifference ?? 0,
  }
}

async function fetchSerieD(): Promise<LeagueTable | null> {
  try {
    const data = await brasileirao.getStandings('d')
    if (!data.tables?.length) return null

    const allTeams: TeamRow[] = []

    for (const table of data.tables) {
      if (table.entries?.length) {
        for (const entry of table.entries) {
          allTeams.push(mapGrupoEntry(entry))
        }
      }
    }

    if (!allTeams.length) return null

    return {
      league: 'Brasileirão Série D',
      slug: 'brasileirao-serie-d',
      updatedAt: new Date().toISOString(),
      teams: allTeams,
    }
  } catch {
    return null
  }
}

export async function getAllTables(): Promise<LeagueTable[]> {
  if (cache && Date.now() - cache.timestamp < CACHE_TTL) {
    return cache.data
  }

  const results = await Promise.allSettled([
    ...SERIES.filter((s) => s !== 'd').map(fetchSerie),
    fetchSerieD(),
  ])

  const tables: LeagueTable[] = []
  for (const result of results) {
    if (result.status === 'fulfilled' && result.value) {
      tables.push(result.value)
    }
  }

  cache = { data: tables, timestamp: Date.now() }
  return tables
}
