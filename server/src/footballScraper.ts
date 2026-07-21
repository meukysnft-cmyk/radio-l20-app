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
        return {
          league: serie.name,
          slug: serie.slug,
          updatedAt: new Date().toISOString(),
          teams: [],
          matches: {
            phase: data.fase.nome || '',
            chaves,
          },
        }
      }
    }

    return null
  } catch {
    return null
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
