import type { WordOfLifePost } from '../types/wordOfLife'

const API_BASE = import.meta.env.VITE_WORDOFLIFE_API_URL || ''

type ApiResponse<T> = {
  ok: boolean
  data?: T
  error?: string
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })

  const body: ApiResponse<T> = await response.json()

  if (!response.ok || !body.ok) {
    throw new Error(body.error || `Erro ${response.status}`)
  }

  return body.data as T
}

export async function analyzePost(url: string): Promise<WordOfLifePost> {
  return request<WordOfLifePost>('/api/analyze', {
    method: 'POST',
    body: JSON.stringify({ url }),
  })
}

export async function fetchPosts(
  limit?: number,
): Promise<WordOfLifePost[]> {
  const params = new URLSearchParams()
  if (limit) params.set('limit', String(limit))
  const qs = params.toString()
  return request<WordOfLifePost[]>(`/api/posts${qs ? `?${qs}` : ''}`)
}

export async function fetchConfig(): Promise<{
  igAccountId: string
  hasAccessToken: boolean
  backendVersion: string
}> {
  return request('/api/config')
}

export async function healthCheck(): Promise<{ status: string; uptime: number }> {
  return request('/api/health')
}
