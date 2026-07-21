import type { LeagueTable, NewsItem } from '../types/content'

const API_BASE = import.meta.env.VITE_WORDOFLIFE_API_URL || ''

type ApiResponse<T> = { ok: boolean; data?: T; error?: string }

export async function fetchLeagueTables(): Promise<LeagueTable[]> {
  const response = await fetch(`${API_BASE}/api/football/tables`, {
    headers: { 'Accept': 'application/json' },
    signal: AbortSignal.timeout(15000),
  })
  const body: ApiResponse<LeagueTable[]> = await response.json()
  if (!body.ok) throw new Error(body.error || 'Erro ao buscar tabelas')
  return body.data ?? []
}

export async function fetchNews(): Promise<NewsItem[]> {
  const response = await fetch(`${API_BASE}/api/football/news`, {
    headers: { 'Accept': 'application/json' },
    signal: AbortSignal.timeout(15000),
  })
  const body: ApiResponse<NewsItem[]> = await response.json()
  if (!body.ok) throw new Error(body.error || 'Erro ao buscar notícias')
  return body.data ?? []
}
