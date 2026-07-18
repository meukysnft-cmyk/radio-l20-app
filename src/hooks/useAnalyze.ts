import { useCallback, useRef, useState } from 'react'
import { createDocument } from '../services/firestoreService'
import { analyzePost } from '../services/wordOfLifeApi'
import { useAuth } from '../context/useAuth'
import type { AnalyzeState } from '../types/wordOfLife'

export function useAnalyze() {
  const { user } = useAuth()
  const [state, setState] = useState<AnalyzeState>({
    status: 'idle',
    url: '',
    post: null,
    error: null,
  })
  const abortRef = useRef<AbortController | null>(null)

  const analyze = useCallback(async (url: string) => {
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setState({ status: 'loading', url, post: null, error: null })

    try {
      const post = await analyzePost(url)

      if (controller.signal.aborted) return

      await createDocument('wordOfLife', {
        ...post,
        analyzedBy: user?.uid || 'anonymous',
      })

      if (controller.signal.aborted) return

      setState({ status: 'success', url, post, error: null })
    } catch (err) {
      if (controller.signal.aborted) return
      setState({
        status: 'error',
        url,
        post: null,
        error: err instanceof Error ? err.message : 'Erro ao analisar post',
      })
    }
  }, [user])

  const reset = useCallback(() => {
    abortRef.current?.abort()
    setState({ status: 'idle', url: '', post: null, error: null })
  }, [])

  return { ...state, analyze, reset }
}
