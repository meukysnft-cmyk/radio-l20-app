import { useCallback, useState } from 'react'
import { createDocument } from '../services/firestoreService'
import { analyzeBatch } from '../services/wordOfLifeApi'
import { useAuth } from '../context/useAuth'
import type { BatchAnalyzeState } from '../types/wordOfLife'

export function useBatchAnalyze() {
  const { user } = useAuth()
  const [state, setState] = useState<BatchAnalyzeState>({
    status: 'idle',
    total: 0,
    completed: 0,
    currentUrl: '',
    results: [],
    error: null,
  })

  const analyze = useCallback(async (urls: string[]) => {
    const validUrls = urls
      .map((u) => u.trim())
      .filter((u) => u.includes('instagram.com'))

    if (validUrls.length === 0) {
      setState((s) => ({ ...s, status: 'error', error: 'Nenhuma URL válida do Instagram' }))
      return
    }

    setState({
      status: 'loading',
      total: validUrls.length,
      completed: 0,
      currentUrl: validUrls[0],
      results: [],
      error: null,
    })

    try {
      const results = await analyzeBatch(validUrls)

      setState((s) => ({ ...s, completed: results.length, currentUrl: '' }))

      for (const item of results) {
        if (item.post) {
          createDocument('wordOfLife', {
            ...item.post,
            analyzedBy: user?.uid || 'anonymous',
          }).catch(() => {})
        }
      }

      const errors = results.filter((r) => r.error).length
      setState({
        status: errors > 0 && errors < results.length ? 'partial' : errors === results.length ? 'error' : 'success',
        total: validUrls.length,
        completed: results.length,
        currentUrl: '',
        results,
        error: errors === results.length ? 'Todas as análises falharam' : null,
      })
    } catch (err) {
      setState({
        status: 'error',
        total: validUrls.length,
        completed: 0,
        currentUrl: '',
        results: [],
        error: err instanceof Error ? err.message : 'Erro ao analisar posts',
      })
    }
  }, [user])

  const reset = useCallback(() => {
    setState({
      status: 'idle',
      total: 0,
      completed: 0,
      currentUrl: '',
      results: [],
      error: null,
    })
  }, [])

  return { ...state, analyze, reset }
}
