import { useState } from 'react'
import { deleteDocument } from '../services/firestoreService'

export function useDeletePost() {
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function remove(docId: string) {
    setDeleting(true)
    setError(null)
    try {
      await deleteDocument('wordOfLife', docId)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro ao excluir'
      setError(msg)
      throw err
    } finally {
      setDeleting(false)
    }
  }

  return { remove, deleting, error }
}
