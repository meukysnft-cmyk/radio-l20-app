import { type FormEvent, useEffect, useMemo, useState } from 'react'
import {
  createDocument,
  deleteDocument,
  updateDocument,
  subscribeDocuments,
  type FirestoreRecord,
} from '../../services/firestoreService'
import { ZODIAC_SIGNS } from '../../utils/zodiac'
import '../../styles/admin.css'
import type { HoroscopePredictionDocument } from '../../types/content'

type PredictionForm = {
  date: string
  sign: string
  message: string
  love: string
  work: string
  health: string
  money: string
  advice: string
  luckyNumber: string
  color: string
  compatibility: string
  emoji: string
  imageUrl: string
  status: 'draft' | 'published'
}

const emptyForm: PredictionForm = {
  date: new Date().toISOString().slice(0, 10),
  sign: ZODIAC_SIGNS[0].name,
  message: '',
  love: '',
  work: '',
  health: '',
  money: '',
  advice: '',
  luckyNumber: '',
  color: '',
  compatibility: '',
  emoji: '',
  imageUrl: '',
  status: 'draft',
}

const EMOJI_OPTIONS = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓', '✨', '🌟', '💫', '🌙', '☀️', '🔮']

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message
  return 'Falha inesperada ao acessar o Firebase.'
}

export function AdminHoroscopePage() {
  const [predictions, setPredictions] = useState<Array<FirestoreRecord<HoroscopePredictionDocument>>>([])
  const [form, setForm] = useState<PredictionForm>(emptyForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [filterDate, setFilterDate] = useState('')
  const [filterSign, setFilterSign] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all')

  const isEditing = Boolean(editingId)

  const filtered = useMemo(() => {
    let result = [...predictions]
    if (filterDate) result = result.filter((p) => p.date === filterDate)
    if (filterSign) result = result.filter((p) => p.sign === filterSign)
    if (filterStatus !== 'all') result = result.filter((p) => p.status === filterStatus)
    return result.sort((a, b) => {
      const aTime = (a.createdAt as { seconds?: number } | undefined)?.seconds ?? 0
      const bTime = (b.createdAt as { seconds?: number } | undefined)?.seconds ?? 0
      return bTime - aTime
    })
  }, [predictions, filterDate, filterSign, filterStatus])

  useEffect(() => {
    const unsub = subscribeDocuments<HoroscopePredictionDocument>(
      'horoscopePredictions',
      (docs) => { setPredictions(docs); setIsLoading(false) },
      (error) => { setErrorMessage(getErrorMessage(error)); setIsLoading(false) },
    )
    return () => unsub()
  }, [])

  function updateForm<K extends keyof PredictionForm>(key: K, value: PredictionForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function resetForm() {
    setForm(emptyForm)
    setEditingId(null)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFeedback('')
    setErrorMessage('')
    setIsSaving(true)

    const payload: Omit<HoroscopePredictionDocument, 'id' | 'createdAt' | 'updatedAt'> = {
      date: form.date,
      sign: form.sign,
      message: form.message.trim(),
      love: form.love.trim(),
      work: form.work.trim(),
      health: form.health.trim(),
      money: form.money.trim(),
      advice: form.advice.trim(),
      luckyNumber: form.luckyNumber.trim(),
      color: form.color.trim(),
      compatibility: form.compatibility.trim(),
      emoji: form.emoji,
      imageUrl: form.imageUrl.trim() || undefined,
      status: form.status,
    }

    if (!payload.date || !payload.sign || !payload.message) {
      setErrorMessage('Informe pelo menos data, signo e mensagem principal.')
      setIsSaving(false)
      return
    }

    try {
      if (editingId) {
        await updateDocument('horoscopePredictions', editingId, payload)
        setFeedback('Previsão atualizada no Firestore.')
      } else {
        await createDocument('horoscopePredictions', payload)
        setFeedback('Previsão criada no Firestore.')
      }
      resetForm()
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    } finally {
      setIsSaving(false)
    }
  }

  function handleEdit(item: FirestoreRecord<HoroscopePredictionDocument>) {
    setEditingId(item.id)
    setFeedback('')
    setErrorMessage('')
    setForm({
      date: item.date || '',
      sign: item.sign || ZODIAC_SIGNS[0].name,
      message: item.message || '',
      love: item.love || '',
      work: item.work || '',
      health: item.health || '',
      money: item.money || '',
      advice: item.advice || '',
      luckyNumber: item.luckyNumber || '',
      color: item.color || '',
      compatibility: item.compatibility || '',
      emoji: item.emoji || '',
      imageUrl: item.imageUrl || '',
      status: item.status || 'draft',
    })
  }

  async function handleDuplicate(item: FirestoreRecord<HoroscopePredictionDocument>) {
    setFeedback('')
    setErrorMessage('')
    try {
      const { id: _id, createdAt: _c, updatedAt: _u, ...rest } = item
      await createDocument('horoscopePredictions', { ...rest, status: 'draft' })
      setFeedback('Previsão duplicada.')
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    }
  }

  async function handleToggleStatus(item: FirestoreRecord<HoroscopePredictionDocument>) {
    const newStatus = item.status === 'published' ? 'draft' : 'published'
    try {
      await updateDocument('horoscopePredictions', item.id, { status: newStatus })
      setFeedback(`Previsão ${newStatus === 'published' ? 'publicada' : 'despublicada'}.`)
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    }
  }

  async function handleDelete(item: FirestoreRecord<HoroscopePredictionDocument>) {
    if (!window.confirm(`Excluir previsão de ${item.sign} (${item.date})?`)) return
    setFeedback('')
    setErrorMessage('')
    try {
      await deleteDocument('horoscopePredictions', item.id)
      setFeedback('Previsão excluída.')
      if (editingId === item.id) resetForm()
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    }
  }

  return (
    <section className="content-section page-section admin-page admin-horoscope-page" aria-labelledby="admin-horoscope-title">
      <div className="admin-hero">
        <p className="eyebrow">Horóscopo</p>
        <h1 id="admin-horoscope-title">Previsões do Horóscopo</h1>
        <p>Cadastre previsões diárias para os 12 signos. As previsões são exibidas para os usuários de acordo com o signo de cada um.</p>
        <span>Use dados responsáveis e positivos. As previsões ficam disponíveis publicamente.</span>
      </div>

      <div className="admin-news-layout">
        <form className="admin-logo-form admin-news-form" onSubmit={handleSubmit}>
          <div>
            <p className="eyebrow">{isEditing ? 'Editando' : 'Nova previsão'}</p>
            <h2>{isEditing ? 'Atualizar previsão' : 'Criar previsão'}</h2>
          </div>

          <div className="admin-form-grid">
            <label>
              Data
              <input type="date" onChange={(e) => updateForm('date', e.target.value)} value={form.date} required />
            </label>
            <label>
              Signo
              <select onChange={(e) => updateForm('sign', e.target.value)} value={form.sign} required>
                {ZODIAC_SIGNS.map((s) => (
                  <option key={s.name} value={s.name}>{s.symbol} {s.name}</option>
                ))}
              </select>
            </label>
          </div>

          <label>
            Mensagem principal
            <textarea onChange={(e) => updateForm('message', e.target.value)} placeholder="Previsão principal do dia..." rows={3} required value={form.message} />
          </label>

          <div className="admin-form-grid">
            <label>
              Amor
              <input onChange={(e) => updateForm('love', e.target.value)} placeholder="Previsão amorosa" value={form.love} />
            </label>
            <label>
              Trabalho
              <input onChange={(e) => updateForm('work', e.target.value)} placeholder="Previsão profissional" value={form.work} />
            </label>
          </div>

          <div className="admin-form-grid">
            <label>
              Saúde
              <input onChange={(e) => updateForm('health', e.target.value)} placeholder="Previsão de saúde" value={form.health} />
            </label>
            <label>
              Dinheiro
              <input onChange={(e) => updateForm('money', e.target.value)} placeholder="Previsão financeira" value={form.money} />
            </label>
          </div>

          <label>
            Dica do dia
            <input onChange={(e) => updateForm('advice', e.target.value)} placeholder="Conselho do dia" value={form.advice} />
          </label>

          <div className="admin-form-grid">
            <label>
              Número da sorte
              <input onChange={(e) => updateForm('luckyNumber', e.target.value)} placeholder="Ex: 7" value={form.luckyNumber} />
            </label>
            <label>
              Cor do dia
              <input onChange={(e) => updateForm('color', e.target.value)} placeholder="Ex: Azul" value={form.color} />
            </label>
            <label>
              Compatibilidade
              <input onChange={(e) => updateForm('compatibility', e.target.value)} placeholder="Ex: Leão" value={form.compatibility} />
            </label>
          </div>

          <div className="admin-form-grid">
            <label>
              Emoji
              <select onChange={(e) => updateForm('emoji', e.target.value)} value={form.emoji}>
                <option value="">Selecione</option>
                {EMOJI_OPTIONS.map((e) => (
                  <option key={e} value={e}>{e}</option>
                ))}
              </select>
            </label>
            <label>
              Link da imagem (opcional)
              <input inputMode="url" onChange={(e) => updateForm('imageUrl', e.target.value)} placeholder="https://..." value={form.imageUrl} />
            </label>
          </div>
          {form.imageUrl ? (
            <div className="admin-image-preview">
              <img alt="Preview" src={form.imageUrl} />
            </div>
          ) : null}

          <label className="admin-checkbox">
            <input checked={form.status === 'published'} onChange={(e) => updateForm('status', e.target.checked ? 'published' : 'draft')} type="checkbox" />
            Publicada
          </label>

          {errorMessage ? <p className="admin-feedback is-error">{errorMessage}</p> : null}
          {feedback ? <p className="admin-feedback is-success">{feedback}</p> : null}

          <div className="admin-hero-actions">
            <button className="advertise-primary admin-hero-action" disabled={isSaving} type="submit">
              {isSaving ? 'Salvando...' : isEditing ? 'Salvar edição' : 'Criar previsão'}
            </button>
            {isEditing ? (
              <button className="advertise-secondary admin-hero-action" type="button" onClick={resetForm}>
                Cancelar edição
              </button>
            ) : null}
          </div>
        </form>

        <div className="admin-news-list" aria-live="polite">
          <div className="admin-news-list-header">
            <div>
              <p className="eyebrow">Coleção horoscopePredictions</p>
              <h2>Previsões cadastradas</h2>
            </div>
          </div>

          <div className="admin-form-grid" style={{ marginBottom: 12 }}>
            <label>
              Filtrar data
              <input type="date" onChange={(e) => setFilterDate(e.target.value)} value={filterDate} />
            </label>
            <label>
              Filtrar signo
              <select onChange={(e) => setFilterSign(e.target.value)} value={filterSign}>
                <option value="">Todos</option>
                {ZODIAC_SIGNS.map((s) => (
                  <option key={s.name} value={s.name}>{s.symbol} {s.name}</option>
                ))}
              </select>
            </label>
            <label>
              Status
              <select onChange={(e) => setFilterStatus(e.target.value as 'all' | 'published' | 'draft')} value={filterStatus}>
                <option value="all">Todos</option>
                <option value="published">Publicados</option>
                <option value="draft">Rascunhos</option>
              </select>
            </label>
          </div>

          {isLoading ? <p className="admin-feedback">Carregando previsões...</p> : null}

          {!isLoading && filtered.length === 0 ? (
            <div className="admin-empty-state">
              <p className="eyebrow">Estado vazio</p>
              <h3>Nenhuma previsão encontrada</h3>
              <p>Crie a primeira previsão para validar a conexão com o Firestore.</p>
            </div>
          ) : null}

          {filtered.map((item) => (
            <article className={`admin-news-card${item.status === 'draft' ? '' : ' admin-job-urgent'}`} key={item.id}>
              <div>
                <span>{item.emoji} {item.sign} — {item.date}</span>
                <h3>{item.message.slice(0, 120)}{item.message.length > 120 ? '...' : ''}</h3>
                {item.love ? <p>❤️ {item.love}</p> : null}
                {item.work ? <p>💼 {item.work}</p> : null}
              </div>
              <dl>
                <div>
                  <dt>Status</dt>
                  <dd>{item.status === 'published' ? 'Publicada' : 'Rascunho'}</dd>
                </div>
                <div>
                  <dt>Cor</dt>
                  <dd>{item.color || '—'}</dd>
                </div>
                <div>
                  <dt>Sorte</dt>
                  <dd>{item.luckyNumber || '—'}</dd>
                </div>
              </dl>
              <div className="admin-card-actions">
                <button type="button" onClick={() => void handleToggleStatus(item)}>
                  {item.status === 'published' ? 'Despublicar' : 'Publicar'}
                </button>
                <button type="button" onClick={() => handleEdit(item)}>
                  Editar
                </button>
                <button type="button" onClick={() => void handleDuplicate(item)}>
                  Duplicar
                </button>
                <button type="button" onClick={() => void handleDelete(item)}>
                  Excluir
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
