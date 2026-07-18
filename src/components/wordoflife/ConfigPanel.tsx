import { useEffect, useState } from 'react'
import { fetchConfig } from '../../services/wordOfLifeApi'

export function ConfigPanel() {
  const [config, setConfig] = useState<{ igAccountId: string; hasAccessToken: boolean; backendVersion: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    fetchConfig()
      .then((c) => { if (!cancelled) setConfig(c) })
      .catch((e) => { if (!cancelled) setError(e instanceof Error ? e.message : 'Erro') })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  if (loading) return <p className="wol-loading">Carregando configurações...</p>
  if (error) return <p className="wol-error-text">{error}</p>

  return (
    <div className="wol-tab-content wol-config">
      <h3>Configuração do Backend</h3>
      {config ? (
        <div className="wol-config-grid">
          <div className="wol-config-item">
            <span className="wol-config-label">Status</span>
            <span className={`wol-config-value ${config.hasAccessToken ? 'wol-status-ok' : 'wol-status-warn'}`}>
              {config.hasAccessToken ? 'Graph API conectada' : 'Sem Graph API'}
            </span>
          </div>
          <div className="wol-config-item">
            <span className="wol-config-label">Conta Instagram</span>
            <span className="wol-config-value">{config.igAccountId || 'Não configurada'}</span>
          </div>
          <div className="wol-config-item">
            <span className="wol-config-label">Versão</span>
            <span className="wol-config-value">{config.backendVersion}</span>
          </div>
        </div>
      ) : (
        <p className="wol-empty">Backend indisponível.</p>
      )}
      <p className="wol-config-note">
        As credenciais da Graph API são configuradas como variáveis de ambiente no servidor (Render).
      </p>
    </div>
  )
}
