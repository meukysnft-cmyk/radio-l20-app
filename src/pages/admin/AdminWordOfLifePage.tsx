import { useState } from 'react'
import { AnalyzeTab } from '../../components/wordoflife/AnalyzeTab'
import { DashboardTab } from '../../components/wordoflife/DashboardTab'
import { HistoryTab } from '../../components/wordoflife/HistoryTab'
import { ConfigPanel } from '../../components/wordoflife/ConfigPanel'

type Tab = 'analyze' | 'dashboard' | 'history' | 'config'

const TABS: { key: Tab; label: string }[] = [
  { key: 'analyze', label: 'Analisar' },
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'history', label: 'Histórico' },
  { key: 'config', label: 'Config' },
]

export function AdminWordOfLifePage() {
  const [activeTab, setActiveTab] = useState<Tab>('analyze')

  return (
    <section className="cms-page" aria-labelledby="wol-admin-title">
      <header className="cms-page-header">
        <div>
          <h1 id="wol-admin-title">Analisador Palavra de Vida</h1>
          <p>Análise de métricas dos posts do Instagram do programa.</p>
        </div>
      </header>

      <nav className="wol-tabs" role="tablist" aria-label="Analisador Palavra de Vida">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.key}
            className={`wol-tab${activeTab === tab.key ? ' is-active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <div className="wol-panel" role="tabpanel">
        {activeTab === 'analyze' && <AnalyzeTab />}
        {activeTab === 'dashboard' && <DashboardTab />}
        {activeTab === 'history' && <HistoryTab />}
        {activeTab === 'config' && <ConfigPanel />}
      </div>
    </section>
  )
}
