import { AdminModuleShell } from './AdminModuleShell'

type AdminStandardModulePageProps = {
  title: string
  description: string
  summary: string
  steps: string[]
}

export function AdminStandardModulePage({ title, description, summary, steps }: AdminStandardModulePageProps) {
  return (
    <AdminModuleShell title={title} description={description}>
      <div className="admin-module-grid">
        <article className="admin-next-steps">
          <p className="card-eyebrow">Resumo</p>
          <h2>{summary}</h2>
          <p>Estrutura pronta para receber conteúdo, campos e listagem administrável.</p>
        </article>

        <article className="admin-code-panel">
          <h2>Próximos passos</h2>
          <ul>
            {steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ul>
        </article>
      </div>
    </AdminModuleShell>
  )
}
