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
  ultimos: string[]
}

export type Scorer = {
  pos: number
  name: string
  position: string
  team: string
  teamLogo: string
  photo: string
  goals: number
}

export type GroupStanding = {
  pos: number
  name: string
  code: string
  logo?: string
  pts: number
  pj: number
  v: number
  e: number
  d: number
  gp: number
  gc: number
  sg: string
  ultimos: string[]
}

export type GroupData = {
  name: string
  teams: GroupStanding[]
}

export type MatchData = {
  phase: string
  chaves: {
    home: string
    homeLogo: string
    homeScore?: number
    away: string
    awayLogo: string
    awayScore?: number
    date: string
    time: string
    played: boolean
  }[]
  scorers?: Scorer[]
  groups?: GroupData[]
}

export type LeagueTable = {
  league: string
  slug: string
  updatedAt: string
  teams: TeamRow[]
  matches?: MatchData
}

type SerieConfig = {
  code: string
  name: string
  slug: string
  url: string
}

const SERIES: SerieConfig[] = [
  { code: 'a', name: 'Brasileirão Série A', slug: 'brasileirao-serie-a', url: 'https://ge.globo.com/futebol/brasileirao-serie-a/' },
  { code: 'b', name: 'Brasileirão Série B', slug: 'brasileirao-serie-b', url: 'https://ge.globo.com/futebol/brasileirao-serie-b/' },
  { code: 'c', name: 'Brasileirão Série C', slug: 'brasileirao-serie-c', url: 'https://ge.globo.com/futebol/brasileirao-serie-c/' },
  { code: 'd', name: 'Brasileirão Série D', slug: 'brasileirao-serie-d', url: 'https://ge.globo.com/futebol/brasileirao-serie-d/' },
  { code: 'lib', name: 'Libertadores', slug: 'libertadores', url: 'https://ge.globo.com/futebol/libertadores/' },
]

const CACHE_TTL = 30 * 60 * 1000
let cache: { data: LeagueTable[]; timestamp: number } | null = null

async function fetchPage(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      Accept: 'text/html',
    },
    signal: AbortSignal.timeout(15_000),
  })
  return res.text()
}

function extractScriptReact(html: string): string {
  const m = html.match(/<script type="text\/javascript" id="scriptReact">([\s\S]*?)<\/script>/)
  if (!m) throw new Error('scriptReact not found')
  return m[1]
}

function extractArtilharia(html: string): Scorer[] {
  const scorers: Scorer[] = []
  const sectionMatch = html.match(/<section\s+class="artilharia-wrapper">([\s\S]*?)<\/section>/)
  if (!sectionMatch) return scorers

  const itemRegex = /<div\s+class="ranking-item-wrapper">\s*<div\s+class="ranking-item">\s*(\d+)?\s*<\/div>\s*<div\s+class="jogador">\s*<div\s+class="jogador-foto">\s*<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"\s*\/?>\s*<\/div>\s*<div\s+class="jogador-escudo">\s*<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"\s*\/?>\s*<\/div>\s*<div\s+class="jogador-info">\s*<div\s+class="jogador-nome">([^<]*)<\/div>\s*<div\s+class="jogador-posicao">([^<]*)<\/div>\s*<\/div>\s*<div\s+class="jogador-gols">\s*(\d+)\s*<\/div>/g

  let m
  while ((m = itemRegex.exec(sectionMatch[1])) !== null) {
    const pos = m[1] ? parseInt(m[1], 10) : scorers.length + 1
    scorers.push({
      pos,
      name: m[6].trim(),
      position: m[7].trim(),
      team: m[5].trim(),
      teamLogo: m[4].trim(),
      photo: m[2].trim(),
      goals: parseInt(m[8], 10),
    })
  }

  return scorers
}

function extractClassificacao(script: string): any {
  const marker = 'const classificacao = '
  const start = script.indexOf(marker)
  if (start < 0) throw new Error('classificacao not found')
  let i = start + marker.length
  while (i < script.length && /\s/.test(script[i])) i++
  if (script[i] !== '{' && script[i] !== '[') throw new Error('unexpected format')
  const brace = script[i]
  const closing = brace === '{' ? '}' : ']'
  let depth = 1
  let inStr = false
  let quote: string | null = null
  let esc = false
  for (let j = i + 1; j < script.length; j++) {
    const ch = script[j]
    if (inStr) {
      if (esc) { esc = false; continue }
      if (ch === '\\') { esc = true; continue }
      if (ch === quote) inStr = false
      continue
    }
    if (ch === '"' || ch === "'") { inStr = true; quote = ch; continue }
    if (ch === brace) depth++
    else if (ch === closing) { depth--; if (depth === 0) return JSON.parse(script.slice(i, j + 1)) }
  }
  throw new Error('could not parse classificacao')
}

function parseEntry(entry: any, slug: string): TeamRow {
  return {
    pos: entry.ordem ?? 0,
    name: entry.nome_popular || '',
    pts: entry.pontos ?? 0,
    pj: entry.jogos ?? 0,
    v: entry.vitorias ?? 0,
    e: entry.empates ?? 0,
    d: entry.derrotas ?? 0,
    gp: entry.gols_pro ?? 0,
    gc: entry.gols_contra ?? 0,
    sg: entry.saldo_gols ?? 0,
    ultimos: entry.ultimos ?? [],
  }
}

async function fetchSerie(serie: SerieConfig): Promise<LeagueTable | null> {
  try {
    const html = await fetchPage(serie.url)
    const script = extractScriptReact(html)
    const data = extractClassificacao(script)
    const teams: TeamRow[] = []

    if (data.grupos) {
      for (const grupo of data.grupos) {
        if (grupo.classificacao) {
          for (const entry of grupo.classificacao) {
            teams.push(parseEntry(entry, serie.slug))
          }
        }
      }
    } else if (data.classificacao) {
      for (const entry of data.classificacao) {
        teams.push(parseEntry(entry, serie.slug))
      }
    }

    if (teams.length) {
      return {
        league: serie.name,
        slug: serie.slug,
        updatedAt: new Date().toISOString(),
        teams,
      }
    }

    if (data.secao && data.fase) {
      const chaves = []
      for (const secao of data.secao) {
        for (const chave of secao.chave || []) {
          for (const jogo of chave.jogos || []) {
            const home = jogo.equipes?.mandante
            const away = jogo.equipes?.visitante
            if (!home || !away) continue
            const hasScore = jogo.placar_oficial_mandante != null && jogo.placar_oficial_visitante != null
            chaves.push({
              home: home.nome_popular || '',
              homeLogo: home.escudo || '',
              homeScore: hasScore ? jogo.placar_oficial_mandante : undefined,
              away: away.nome_popular || '',
              awayLogo: away.escudo || '',
              awayScore: hasScore ? jogo.placar_oficial_visitante : undefined,
              date: jogo.data_realizacao || '',
              time: jogo.hora_realizacao || '',
              played: hasScore,
            })
          }
        }
      }

      if (chaves.length) {
        const [scorers, groups] = await Promise.all([
          Promise.resolve(extractArtilharia(html)),
          serie.slug === 'libertadores' ? fetchGroupsFromOpta() : Promise.resolve([]),
        ])
        return {
          league: serie.name,
          slug: serie.slug,
          updatedAt: new Date().toISOString(),
          teams: [],
          matches: {
            phase: data.fase.nome || '',
            chaves,
            ...(scorers.length ? { scorers } : {}),
            ...(groups.length ? { groups } : {}),
          },
        }
      }
    }

    return null
  } catch {
    return null
  }
}

const OPTA_BASE = 'https://api.performfeeds.com/soccerdata/standings/a5oqwilhwzb2174uel4v42sus'
const OPTA_TOURNAMENT_ID = 'dk8bg66qizwked9etonwaaln8'

async function fetchGroupsFromOpta(): Promise<GroupData[]> {
  try {
    const url = `${OPTA_BASE}?_rt=c&_fmt=json&_lcl=pt-br&tmcl=${OPTA_TOURNAMENT_ID}&type=total`
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        Referer: 'https://gol.conmebol.com/',
      },
      signal: AbortSignal.timeout(15_000),
    })
    if (!res.ok) return []
    const json = await res.json()
    const stage = json.stage?.[0]
    if (!stage?.division) return []
    return stage.division.map((div: any) => ({
      name: div.groupName || '',
      teams: (div.ranking || []).map((r: any) => ({
        pos: r.rank ?? 0,
        name: r.contestantClubName || r.contestantName || '',
        code: r.contestantCode || '',
        pts: r.points ?? 0,
        pj: r.matchesPlayed ?? 0,
        v: r.matchesWon ?? 0,
        e: r.matchesDrawn ?? 0,
        d: r.matchesLost ?? 0,
        gp: r.goalsFor ?? 0,
        gc: r.goalsAgainst ?? 0,
        sg: r.goaldifference ?? '0',
        ultimos: r.lastSix ? r.lastSix.split('') : [],
      })),
    }))
  } catch {
    return []
  }
}

export async function getAllTables(): Promise<LeagueTable[]> {
  if (cache && Date.now() - cache.timestamp < CACHE_TTL) {
    return cache.data
  }

  const results = await Promise.allSettled(SERIES.map(fetchSerie))
  const tables: LeagueTable[] = []
  for (const r of results) {
    if (r.status === 'fulfilled' && r.value) tables.push(r.value)
  }

  cache = { data: tables, timestamp: Date.now() }
  return tables
}
