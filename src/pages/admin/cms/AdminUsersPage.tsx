import { useEffect, useState } from 'react'
import { ModulePage } from './ModulePage'
import { subscribeDocuments } from '../../../services/firestoreService'
import type { CommunityUserDocument } from '../../../types/content'

type UserRecord = CommunityUserDocument & { id: string }

export function AdminUsersPage() {
  const [users, setUsers] = useState<UserRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    return subscribeDocuments<CommunityUserDocument>('communityUsers', (docs) => {
      setUsers(docs.sort((a, b) => {
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
      title="Usuários"
      description="Gerencie os usuários cadastrados e suas permissões."
    >
      <div className="cms-users-permissions">
        <h3>Permissões do sistema</h3>
        <div className="cms-permission-grid">
          <div className="cms-permission-card">
            <span className="cms-permission-badge is-admin">Administrador</span>
            <p>Acesso total ao CMS. Pode criar, editar, excluir e configurar tudo.</p>
          </div>
          <div className="cms-permission-card">
            <span className="cms-permission-badge is-editor">Editor</span>
            <p>Pode criar e editar conteúdo, mas não pode alterar configurações do sistema.</p>
          </div>
          <div className="cms-permission-card">
            <span className="cms-permission-badge is-moderator">Moderador</span>
            <p>Pode revisar e aprovar conteúdo, mas não pode criar novos items.</p>
          </div>
          <div className="cms-permission-card">
            <span className="cms-permission-badge is-viewer">Visualizador</span>
            <p>Acesso somente leitura ao painel administrativo.</p>
          </div>
        </div>
      </div>

      <div className="cms-section">
        <h3>Cadastros da comunidade ({users.length})</h3>
        {isLoading ? (
          <div className="cms-loading">Carregando usuários...</div>
        ) : users.length === 0 ? (
          <div className="cms-empty">
            <p>Nenhum usuário cadastrado ainda.</p>
          </div>
        ) : (
          <div className="cms-table-wrap">
            <table className="cms-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Apelido</th>
                  <th>Cidade</th>
                  <th>WhatsApp</th>
                  <th>Interesse</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.name}</td>
                    <td>{u.nickname}</td>
                    <td>{u.city}</td>
                    <td>{u.whatsapp}</td>
                    <td>{u.interest}</td>
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
