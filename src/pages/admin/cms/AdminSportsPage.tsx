import { type FormEvent, useEffect, useMemo, useState } from 'react'
import { ModulePage } from './ModulePage'
import {
  createDocument,
  deleteDocument,
  subscribeDocuments,
  updateDocument,
  type FirestoreRecord,
} from '../../../services/firestoreService'
import type { ChampionshipDocument, TeamDocument } from '../../../types/content'

/* ─── Championship Form ──────────────────────────── */
type ChampForm = {
  name: string
  category: string
  year: string
  status: string
  description: string
}

const emptyChampForm: ChampForm = { name: '', category: '', year: '', status: 'active', description: '' }

/* ─── Team Form ──────────────────────────────────── */
type TeamForm = {
  name: string
  city: string
  championshipId: string
  logoUrl: string
  color: string
}

const emptyTeamForm: TeamForm = { name: '', city: '', championshipId: '', logoUrl: '', color: '' }

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message
  return 'Falha ao acessar o Firestore.'
}

type Tab = 'championships' | 'teams' | 'results'

export function AdminSportsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('championships')

  return (
    <ModulePage
      eyebrow="Conteúdo"
      title="Esportes"
      description="Gerencie campeonatos, equipes, resultados e conteúdo esportivo."
    >
      <div className="cms-tabs">
        <button className={`cms-tab${activeTab === 'championships' ? ' is-active' : ''}`} type="button" onClick={() => setActiveTab('championships')}>
          Campeonatos
        </button>
        <button className={`cms-tab${activeTab === 'teams' ? ' is-active' : ''}`} type="button" onClick={() => setActiveTab('teams')}>
          Equipes
        </button>
        <button className={`cms-tab${activeTab === 'results' ? ' is-active' : ''}`} type="button" onClick={() => setActiveTab('results')}>
          Resultados
        </button>
      </div>

      {activeTab === 'championships' && <ChampionshipsTab />}
      {activeTab === 'teams' && <TeamsTab />}
      {activeTab === 'results' && (
        <div className="cms-placeholder" style={{ marginTop: 20 }}>
          <div className="cms-placeholder-icon">⚽</div>
          <h3>Resultados e Classificação</h3>
          <p>Em breve: cadastro de jogos, placares, classificação e artilharia.</p>
        </div>
      )}
    </ModulePage>
  )
}

function ChampionshipsTab() {
  const [items, setItems] = useState<Array<FirestoreRecord<ChampionshipDocument>>>([])
  const [form, setForm] = useState<ChampForm>(emptyChampForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const isEditing = Boolean(editingId)
  const ordered = useMemo(() => [...items].sort((a, b) => (a.name || '').localeCompare(b.name || '')), [items])

  useEffect(() => {
    return subscribeDocuments<ChampionshipDocument>('championships', (docs) => { setItems(docs); setIsLoading(false) }, (err) => { setErrorMessage(getErrorMessage(err)); setIsLoading(false) })
  }, [])

  function updateForm<K extends keyof ChampForm>(key: K, value: ChampForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function resetForm() { setForm(emptyChampForm); setEditingId(null) }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setFeedback(''); setErrorMessage(''); setIsSaving(true)
    const payload = { name: form.name.trim(), category: form.category.trim(), year: form.year.trim(), status: form.status.trim(), description: form.description.trim() }
    if (!payload.name) { setErrorMessage('Informe o nome do campeonato.'); setIsSaving(false); return }
    try {
      if (editingId) { await updateDocument('championships', editingId, payload); setFeedback('Campeonato atualizado.') }
      else { await createDocument('championships', payload); setFeedback('Campeonato criado.') }
      resetForm()
    } catch (err) { setErrorMessage(getErrorMessage(err)) } finally { setIsSaving(false) }
  }

  function handleEdit(item: FirestoreRecord<ChampionshipDocument>) {
    setEditingId(item.id); setFeedback(''); setErrorMessage('')
    setForm({ name: item.name || '', category: item.category || '', year: item.year || '', status: item.status || 'active', description: item.description || '' })
  }

  async function handleDelete(item: FirestoreRecord<ChampionshipDocument>) {
    if (!window.confirm(`Excluir "${item.name}"?`)) return
    try { await deleteDocument('championships', item.id); setFeedback('Excluído.'); if (editingId === item.id) resetForm() } catch (err) { setErrorMessage(getErrorMessage(err)) }
  }

  return (
    <div className="cms-crud-layout">
      <form className="cms-form" onSubmit={handleSubmit}>
        <h3>{isEditing ? 'Editar campeonato' : 'Novo campeonato'}</h3>
        <label>Nome<input value={form.name} onChange={(e) => updateForm('name', e.target.value)} required /></label>
        <div className="cms-form-row">
          <label>Categoria<input value={form.category} onChange={(e) => updateForm('category', e.target.value)} placeholder="Masculino, Feminino..." /></label>
          <label>Ano<input value={form.year} onChange={(e) => updateForm('year', e.target.value)} placeholder="2026" /></label>
        </div>
        <label>Status
          <select value={form.status} onChange={(e) => updateForm('status', e.target.value)}>
            <option value="active">Ativo</option>
            <option value="finished">Finalizado</option>
            <option value="upcoming">Em breve</option>
          </select>
        </label>
        <label>Descrição<textarea rows={3} value={form.description} onChange={(e) => updateForm('description', e.target.value)} /></label>
        {errorMessage && <p className="cms-alert is-error">{errorMessage}</p>}
        {feedback && <p className="cms-alert is-success">{feedback}</p>}
        <div className="cms-form-actions">
          <button className="cms-btn is-primary" disabled={isSaving} type="submit">{isSaving ? 'Salvando...' : isEditing ? 'Salvar' : 'Criar'}</button>
          {isEditing && <button className="cms-btn" type="button" onClick={resetForm}>Cancelar</button>}
        </div>
      </form>

      <div className="cms-list">
        <h3>Campeonatos ({ordered.length})</h3>
        {isLoading && <p className="cms-loading">Carregando...</p>}
        {!isLoading && ordered.length === 0 && <div className="cms-empty"><p>Nenhum campeonato cadastrado.</p></div>}
        {ordered.map((item) => (
          <article className="cms-list-card" key={item.id}>
            <div>
              <span className="cms-list-tag">{item.category || 'Campeonato'}</span>
              <h4>{item.name}</h4>
              <p>{item.description || 'Sem descrição'}</p>
              <small>{item.year} • {item.status}</small>
            </div>
            <div className="cms-card-actions">
              <button type="button" onClick={() => handleEdit(item)}>Editar</button>
              <button type="button" onClick={() => void handleDelete(item)}>Excluir</button>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

function TeamsTab() {
  const [items, setItems] = useState<Array<FirestoreRecord<TeamDocument>>>([])
  const [champs, setChamps] = useState<Array<FirestoreRecord<ChampionshipDocument>>>([])
  const [form, setForm] = useState<TeamForm>(emptyTeamForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const isEditing = Boolean(editingId)
  const ordered = useMemo(() => [...items].sort((a, b) => (a.name || '').localeCompare(b.name || '')), [items])

  useEffect(() => {
    const unsub1 = subscribeDocuments<TeamDocument>('teams', (docs) => { setItems(docs); setIsLoading(false) })
    const unsub2 = subscribeDocuments<ChampionshipDocument>('championships', (docs) => { setChamps(docs) })
    return () => { unsub1(); unsub2() }
  }, [])

  function updateForm<K extends keyof TeamForm>(key: K, value: TeamForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function resetForm() { setForm(emptyTeamForm); setEditingId(null) }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setFeedback(''); setErrorMessage(''); setIsSaving(true)
    const payload = { name: form.name.trim(), city: form.city.trim(), championshipId: form.championshipId.trim(), logoUrl: form.logoUrl.trim(), color: form.color.trim() }
    if (!payload.name) { setErrorMessage('Informe o nome do time.'); setIsSaving(false); return }
    try {
      if (editingId) { await updateDocument('teams', editingId, payload); setFeedback('Time atualizado.') }
      else { await createDocument('teams', payload); setFeedback('Time criado.') }
      resetForm()
    } catch (err) { setErrorMessage(getErrorMessage(err)) } finally { setIsSaving(false) }
  }

  function handleEdit(item: FirestoreRecord<TeamDocument>) {
    setEditingId(item.id); setFeedback(''); setErrorMessage('')
    setForm({ name: item.name || '', city: item.city || '', championshipId: item.championshipId || '', logoUrl: item.logoUrl || '', color: item.color || '' })
  }

  async function handleDelete(item: FirestoreRecord<TeamDocument>) {
    if (!window.confirm(`Excluir "${item.name}"?`)) return
    try { await deleteDocument('teams', item.id); setFeedback('Excluído.'); if (editingId === item.id) resetForm() } catch (err) { setErrorMessage(getErrorMessage(err)) }
  }

  return (
    <div className="cms-crud-layout">
      <form className="cms-form" onSubmit={handleSubmit}>
        <h3>{isEditing ? 'Editar equipe' : 'Nova equipe'}</h3>
        <label>Nome<input value={form.name} onChange={(e) => updateForm('name', e.target.value)} required /></label>
        <div className="cms-form-row">
          <label>Cidade<input value={form.city} onChange={(e) => updateForm('city', e.target.value)} /></label>
          <label>Cor<input type="color" value={form.color || '#3b82f6'} onChange={(e) => updateForm('color', e.target.value)} /></label>
        </div>
        <label>Campeonato
          <select value={form.championshipId} onChange={(e) => updateForm('championshipId', e.target.value)}>
            <option value="">Selecione</option>
            {champs.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </label>
        <label>URL do escudo<input inputMode="url" value={form.logoUrl} onChange={(e) => updateForm('logoUrl', e.target.value)} placeholder="https://..." /></label>
        {errorMessage && <p className="cms-alert is-error">{errorMessage}</p>}
        {feedback && <p className="cms-alert is-success">{feedback}</p>}
        <div className="cms-form-actions">
          <button className="cms-btn is-primary" disabled={isSaving} type="submit">{isSaving ? 'Salvando...' : isEditing ? 'Salvar' : 'Criar'}</button>
          {isEditing && <button className="cms-btn" type="button" onClick={resetForm}>Cancelar</button>}
        </div>
      </form>

      <div className="cms-list">
        <h3>Equipes ({ordered.length})</h3>
        {isLoading && <p className="cms-loading">Carregando...</p>}
        {!isLoading && ordered.length === 0 && <div className="cms-empty"><p>Nenhuma equipe cadastrada.</p></div>}
        {ordered.map((item) => (
          <article className="cms-list-card" key={item.id}>
            <div>
              <span className="cms-list-tag">{item.city || 'Time'}</span>
              <h4>{item.name}</h4>
              {item.logoUrl && <img src={item.logoUrl} alt="" style={{ maxHeight: 40, marginTop: 6 }} loading="lazy" />}
            </div>
            <div className="cms-card-actions">
              <button type="button" onClick={() => handleEdit(item)}>Editar</button>
              <button type="button" onClick={() => void handleDelete(item)}>Excluir</button>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
