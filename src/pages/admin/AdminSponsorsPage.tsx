import { useEffect, useMemo, useState } from 'react'
import { createDocument, deleteDocument, subscribeDocuments, updateDocument } from '../../services/firestoreService'
import '../../styles/admin.css'
import type { ContentStatus, SponsorDocument } from '../../types/content'
import { ModulePage } from './cms/ModulePage'

const emptyForm = {
  name: '',
  category: 'Patrocinador',
  logoFile: '',
  bannerFile: '',
  bannerSize: 'small' as 'small' | 'medium' | 'large',
  bannerPosition: 'center' as 'left' | 'center' | 'right',
  linkLabel: '',
  linkUrl: '',
  info: '',
  note: '',
  displayOrder: '0',
  status: 'published' as ContentStatus,
}

function createEmptyForm() {
  return { ...emptyForm }
}

export function AdminSponsorsPage() {
  const [items, setItems] = useState<Array<SponsorDocument & { id: string }>>([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState('')
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const unsubscribe = subscribeDocuments<SponsorDocument>('sponsors', (documents) => {
      setItems(documents)
    })

    return unsubscribe
  }, [])

  const sortedItems = useMemo(
    () => [...items].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0)),
    [items],
  )

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    setError('')
    setFeedback('')

    try {
      const payload: SponsorDocument = {
        name: form.name.trim(),
        category: form.category.trim(),
        logoFile: form.logoFile.trim(),
        bannerFile: form.bannerFile.trim(),
        bannerSize: form.bannerSize,
        bannerPosition: form.bannerPosition,
        linkLabel: form.linkLabel.trim(),
        linkUrl: form.linkUrl.trim(),
        info: form.info.trim(),
        note: form.note.trim(),
        displayOrder: Number(form.displayOrder) || 0,
        active: true,
        status: form.status,
      }

      if (editingId) {
        await updateDocument<SponsorDocument>('sponsors', editingId, payload)
      } else {
        await createDocument<SponsorDocument>('sponsors', payload)
      }

      setFeedback(editingId ? 'Patrocinador atualizado com sucesso.' : 'Patrocinador salvo com sucesso.')
      setForm(createEmptyForm())
      setEditingId('')
    } catch (err) {
      console.error('Falha ao salvar patrocinador.', err)
      const message = err instanceof Error ? err.message : ''
      setError(message ? `Não foi possível salvar agora: ${message}` : 'Não foi possível salvar agora.')
    } finally {
      setSaving(false)
    }
  }

  function beginEdit(item: SponsorDocument & { id: string }) {
    setEditingId(item.id)
    setForm({
      name: item.name ?? '',
      category: item.category ?? '',
      logoFile: item.logoFile ?? '',
      bannerFile: item.bannerFile ?? '',
      bannerSize: item.bannerSize ?? 'small',
      bannerPosition: item.bannerPosition ?? 'center',
      linkLabel: item.linkLabel ?? '',
      linkUrl: item.linkUrl ?? '',
      info: item.info ?? '',
      note: item.note ?? '',
      displayOrder: String(item.displayOrder ?? 0),
      status: item.status ?? 'published',
    })
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Tem certeza que deseja excluir este patrocinador?')) {
      return
    }

    setError('')
    setFeedback('')

    try {
      await deleteDocument('sponsors', id)
      if (editingId === id) {
        setEditingId('')
        setForm(createEmptyForm())
      }
      setFeedback('Patrocinador excluído com sucesso.')
    } catch (err) {
      console.error('Falha ao excluir patrocinador.', err)
      const message = err instanceof Error ? err.message : ''
      setError(message ? `Não foi possível excluir agora: ${message}` : 'Não foi possível excluir agora.')
    }
  }

  return (
    <ModulePage
      eyebrow="Engajamento"
      title="Patrocinadores"
      description="Cadastre logos, banners e links de patrocinadores para exibir no site."
    >
      <div className="admin-sponsors-layout">
        <section className="admin-sponsor-editor">
          <div className="section-title-row">
            <div>
              <p className="eyebrow">Novo patrocinador</p>
              <h2>{editingId ? 'Editar patrocinador' : 'Cadastro completo'}</h2>
            </div>
          </div>

          <form className="admin-sponsor-create-form" onSubmit={handleSubmit}>
            <div className="admin-sponsor-form-grid">
              <label>
                Nome
                <input
                  value={form.name}
                  onChange={(e) => setForm((current) => ({ ...current, name: e.target.value }))}
                  required
                />
              </label>
              <label>
                Categoria
                <input
                  value={form.category}
                  onChange={(e) => setForm((current) => ({ ...current, category: e.target.value }))}
                />
              </label>
              <label>
                Logo do arquivo
                <input
                  value={form.logoFile}
                  onChange={(e) => setForm((current) => ({ ...current, logoFile: e.target.value }))}
                  placeholder="logo-nome.svg"
                  required
                />
              </label>
              <label>
                Banner do arquivo
                <input
                  value={form.bannerFile}
                  onChange={(e) => setForm((current) => ({ ...current, bannerFile: e.target.value }))}
                  placeholder="banner-nome.svg"
                />
              </label>
              <label>
                Tamanho do banner
                <select
                  value={form.bannerSize}
                  onChange={(e) =>
                    setForm((current) => ({
                      ...current,
                      bannerSize: e.target.value as 'small' | 'medium' | 'large',
                    }))
                  }
                >
                  <option value="small">Pequeno</option>
                  <option value="medium">Médio</option>
                  <option value="large">Grande</option>
                </select>
              </label>
              <label>
                Posição do banner
                <select
                  value={form.bannerPosition}
                  onChange={(e) =>
                    setForm((current) => ({
                      ...current,
                      bannerPosition: e.target.value as 'left' | 'center' | 'right',
                    }))
                  }
                >
                  <option value="left">Esquerda</option>
                  <option value="center">Centro</option>
                  <option value="right">Direita</option>
                </select>
              </label>
              <label>
                Texto do link
                <input
                  value={form.linkLabel}
                  onChange={(e) => setForm((current) => ({ ...current, linkLabel: e.target.value }))}
                  placeholder="Saiba mais"
                />
              </label>
              <label>
                Link de destino
                <input
                  value={form.linkUrl}
                  onChange={(e) => setForm((current) => ({ ...current, linkUrl: e.target.value }))}
                  placeholder="https://..."
                />
              </label>
              <label>
                Ordem
                <input
                  value={form.displayOrder}
                  onChange={(e) =>
                    setForm((current) => ({ ...current, displayOrder: e.target.value }))
                  }
                  type="number"
                />
              </label>
              <label className="admin-sponsor-full">
                Informações
                <textarea
                  value={form.info}
                  onChange={(e) => setForm((current) => ({ ...current, info: e.target.value }))}
                  rows={3}
                />
              </label>
              <label className="admin-sponsor-full">
                Observação
                <textarea
                  value={form.note}
                  onChange={(e) => setForm((current) => ({ ...current, note: e.target.value }))}
                  rows={2}
                />
              </label>
            </div>

            {error ? <p className="admin-feedback is-error">{error}</p> : null}
            {feedback ? <p className="admin-feedback is-success">{feedback}</p> : null}

            <button className="advertise-primary" disabled={saving} type="submit">
              {saving ? 'Salvando...' : editingId ? 'Atualizar patrocinador' : 'Salvar patrocinador'}
            </button>
          </form>
        </section>

        <aside className="admin-sponsor-preview-panel">
          <div className="section-title-row">
            <div>
              <p className="eyebrow">Pré-visualização</p>
              <h2>Patrocinadores cadastrados</h2>
            </div>
          </div>

          <div className="sponsor-grid admin-sponsor-preview-grid">
            {sortedItems.map((item) => (
              <article className="sponsor-card" key={item.id}>
                <span className="sponsor-logo-frame" aria-hidden="true">
                  {item.logoFile ? (
                    <img src={`/${item.logoFile}`} alt="" loading="lazy" />
                  ) : (
                    item.name.slice(0, 2).toUpperCase()
                  )}
                </span>
                {item.bannerFile ? (
                  <span className={`sponsor-banner-preview is-${item.bannerSize ?? 'small'} is-${item.bannerPosition ?? 'center'}`}>
                    <img src={`/${item.bannerFile}`} alt="" loading="lazy" />
                  </span>
                ) : null}
                <div>
                  <strong>{item.name}</strong>
                  <p>{item.category}</p>
                  {item.info ? <small>{item.info}</small> : null}
                  <div className="sponsor-admin-actions">
                    <button type="button" onClick={() => beginEdit(item)}>
                      Editar
                    </button>
                    <button type="button" onClick={() => handleDelete(item.id)}>
                      Excluir
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </aside>
      </div>
    </ModulePage>
  )
}
