import { useEffect, useState } from 'react'
import { ModulePage } from './ModulePage'
import { subscribeDocuments } from '../../../services/firestoreService'
import type { NotificationDocument } from '../../../types/content'

type LogEntry = NotificationDocument & { id: string }

function formatTimestamp(ts: unknown): string {
  if (!ts) return '—'
  const seconds = typeof ts === 'object' && ts !== null && 'seconds' in ts
    ? (ts as { seconds: number }).seconds
    : typeof ts === 'string'
      ? Math.floor(new Date(ts).getTime() / 1000)
      : 0
  if (!seconds) return '—'
  return new Date(seconds * 1000).toLocaleString('pt-BR')
}

export function AdminLogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    return subscribeDocuments<NotificationDocument>('notifications', (docs) => {
      setLogs(docs.sort((a, b) => {
        const aTime = (a.createdAt as { seconds?: number } | undefined)?.seconds ?? 0
        const bTime = (b.createdAt as { seconds?: number } | undefined)?.seconds ?? 0
        return bTime - aTime
      }))
      setIsLoading(false)
    })
  }, [])

  return (
    <ModulePage
      eyebrow="Sistema"
      title="Logs do Sistema"
      description="Histórico de notificações enviadas e atividades do sistema."
    >
      <div className="cms-section">
        <h3>Notificações enviadas ({logs.length})</h3>
        {isLoading ? (
          <div className="cms-loading">Carregando logs...</div>
        ) : logs.length === 0 ? (
          <div className="cms-empty">
            <p>Nenhuma notificação enviada ainda.</p>
          </div>
        ) : (
          <div className="cms-table-wrap">
            <table className="cms-table">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Título</th>
                  <th>Mensagem</th>
                  <th>Link</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id}>
                    <td>{formatTimestamp(log.createdAt)}</td>
                    <td>{(log as Record<string, unknown>).title as string || '—'}</td>
                    <td>{(log as Record<string, unknown>).body as string || '—'}</td>
                    <td>{(log as Record<string, unknown>).url as string || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </ModulePage>
  )
}
