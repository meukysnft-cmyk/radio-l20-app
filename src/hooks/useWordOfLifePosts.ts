import { useEffect, useState } from 'react'
import {
  listDocuments,
  subscribeDocuments,
} from '../services/firestoreService'
import type { WordOfLifePost } from '../types/wordOfLife'
import type { FirestoreRecord } from '../services/firestoreService'

export function useWordOfLifePostsRealtime(limit = 20) {
  const [posts, setPosts] = useState<FirestoreRecord<WordOfLifePost>[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    const unsub = subscribeDocuments<WordOfLifePost>(
      'wordOfLife',
      (docs) => {
        if (cancelled) return
        const sorted = docs
          .sort((a, b) => {
            const ta = a.timestamp || ''
            const tb = b.timestamp || ''
            return tb.localeCompare(ta)
          })
          .slice(0, limit)
        setPosts(sorted)
        setLoading(false)
      },
      (err) => {
        if (cancelled) return
        setError(err instanceof Error ? err.message : 'Erro ao carregar posts')
        setLoading(false)
      },
    )

    return () => {
      cancelled = true
      unsub()
    }
  }, [limit])

  return { posts, loading, error }
}

export function useWordOfLifePostsOnce(limit = 50) {
  const [posts, setPosts] = useState<FirestoreRecord<WordOfLifePost>[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    listDocuments<WordOfLifePost>('wordOfLife')
      .then((docs) => {
        if (cancelled) return
        const sorted = docs
          .sort((a, b) => {
            const ta = a.timestamp || ''
            const tb = b.timestamp || ''
            return tb.localeCompare(ta)
          })
          .slice(0, limit)
        setPosts(sorted)
        setLoading(false)
      })
      .catch((err) => {
        if (cancelled) return
        setError(err instanceof Error ? err.message : 'Erro ao carregar posts')
        setLoading(false)
      })

    return () => { cancelled = true }
  }, [limit])

  return { posts, loading, error }
}
