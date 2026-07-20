import axios from 'axios'
import * as cheerio from 'cheerio'

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

export type LeagueTable = {
  league: string
  slug: string
  updatedAt: string
  teams: TeamRow[]
}

const LEAGUES = [
  { name: 'Brasileirão Série A', slug: 'brasileirao-serie-a', url: 'https://ge.globo.com/futebol/brasileirao-serie-a/' },
  { name: 'Brasileirão Série B', slug: 'brasileirao-serie-b', url: 'https://ge.globo.com/futebol/brasileirao-serie-b/' },
  { name: 'Brasileirão Série C', slug: 'brasileirao-serie-c', url: 'https://ge.globo.com/futebol/brasileirao-serie-c/' },
  { name: 'Brasileirão Série D', slug: 'brasileirao-serie-d', url: 'https://ge.globo.com/futebol/brasileirao-serie-d/' },
  { name: 'Copa do Brasil', slug: 'copa-do-brasil', url: 'https://ge.globo.com/futebol/copa-do-brasil/' },
  { name: 'Libertadores', slug: 'libertadores', url: 'https://ge.globo.com/futebol/libertadores/' },
]

const CACHE_TTL = 30 * 60 * 1000
let cache: { data: LeagueTable[]; timestamp: number } | null = null

function parseTeamRow($: cheerio.CheerioAPI, row: any, leagueSlug: string): TeamRow | null {
  const cells = $(row).find('td, th')
  if (cells.length < 11) return null

  const getText = (i: number) => $(cells[i]).text().trim()

  const posText = getText(0)
  const pos = parseInt(posText, 10)
  if (isNaN(pos)) return null

  const name = $(cells[1]).text().trim()
  const pts = parseInt(getText(2), 10) || 0
  const pj = parseInt(getText(3), 10) || 0
  const v = parseInt(getText(4), 10) || 0
  const e = parseInt(getText(5), 10) || 0
  const d = parseInt(getText(6), 10) || 0
  const gp = parseInt(getText(7), 10) || 0
  const gc = parseInt(getText(8), 10) || 0
  const sg = parseInt(getText(9), 10) || 0

  const ultimos: string[] = []
  const ultimosContainer = $(cells[cells.length - 1])
  ultimosContainer.find('span, .classificacao__ultimos-jogos-item').each((_, el) => {
    const cls = $(el).attr('class') || ''
    if (cls.includes('vitoria') || cls.includes('green')) ultimos.push('V')
    else if (cls.includes('derrota') || cls.includes('red')) ultimos.push('D')
    else if (cls.includes('empate') || cls.includes('gray')) ultimos.push('E')
    else {
      const t = $(el).text().trim()
      if (t === 'V' || t === 'D' || t === 'E') ultimos.push(t)
    }
  })

  return { pos, name, pts, pj, v, e, d, gp, gc, sg, ultimos }
}

async function scrapeLeague(league: typeof LEAGUES[0]): Promise<LeagueTable> {
  const { data: html } = await axios.get(league.url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
    },
    timeout: 15000,
  })

  const $ = cheerio.load(html)
  const teams: TeamRow[] = []

  $('.classificacao__tabela tbody tr, table tbody tr, .tabela-geral tbody tr').each((_, row) => {
    const parsed = parseTeamRow($, row, league.slug)
    if (parsed) teams.push(parsed)
  })

  if (teams.length === 0) {
    $('tr').each((_, row) => {
      const parsed = parseTeamRow($, row, league.slug)
      if (parsed) teams.push(parsed)
    })
  }

  return {
    league: league.name,
    slug: league.slug,
    updatedAt: new Date().toISOString(),
    teams,
  }
}

export async function getAllTables(): Promise<LeagueTable[]> {
  if (cache && Date.now() - cache.timestamp < CACHE_TTL) {
    return cache.data
  }

  const results = await Promise.allSettled(LEAGUES.map(scrapeLeague))
  const tables: LeagueTable[] = []

  for (const result of results) {
    if (result.status === 'fulfilled' && result.value.teams.length > 0) {
      tables.push(result.value)
    }
  }

  cache = { data: tables, timestamp: Date.now() }
  return tables
}
