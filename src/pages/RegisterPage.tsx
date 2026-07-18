import { useMemo, useState } from 'react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { radioRoutes } from '../config/radioLinks'
import { createDocument } from '../services/firestoreService'
import { hasCommunityAccess, markCommunityAccessGranted } from '../routes/RequireCommunityAccess'
import type { CommunityUserDocument } from '../types/content'

export function RegisterPage() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [nickname, setNickname] = useState('')
  const [age, setAge] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [city, setCity] = useState('Pilar')
  const [interest, setInterest] = useState('Ouvinte da rádio')
  const origin = 'site'
  const [isSaving, setIsSaving] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [error, setError] = useState('')

  const title = useMemo(() => 'Cadastro da Rádio L20', [])

  useEffect(() => {
    if (hasCommunityAccess()) {
      navigate(radioRoutes.home, { replace: true })
    }
  }, [navigate])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSaving(true)
    setError('')
    setFeedback('')

    try {
      await createDocument<CommunityUserDocument>('communityUsers', {
        name: name.trim(),
        nickname: nickname.trim(),
        age: age.trim(),
        whatsapp: whatsapp.trim(),
        city: city.trim(),
        interest: interest.trim(),
        origin,
      })

      markCommunityAccessGranted()
      setFeedback('Cadastro realizado com sucesso. Obrigado por participar da Rádio L20.')
      setIsSubmitted(true)
      setName('')
      setNickname('')
      setAge('')
      setWhatsapp('')
      setCity('Pilar')
      setInterest('Ouvinte da rádio')
      setTimeout(() => navigate(radioRoutes.home), 1200)
    } catch (err) {
      console.error('Falha ao cadastrar usuário comunitário.', err)
      const message = err instanceof Error ? err.message : ''
      setError(
        message
          ? `Não foi possível concluir o cadastro agora: ${message}`
          : 'Não foi possível concluir o cadastro agora. Tente novamente.',
      )
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <section className="content-section page-section register-page" aria-labelledby="register-title">
      <div className="section-header">
        <p className="eyebrow">Abertura social</p>
        <h1 id="register-title">{title}</h1>
        <p>
          Faça seu cadastro para participar do app, receber novidades e aparecer no painel do
          admin como um contato real da comunidade.
        </p>
      </div>

      <div className="register-layout">
        <form className="register-card" onSubmit={handleSubmit}>
          <label>
            Nome completo
            <input value={name} onChange={(event) => setName(event.target.value)} required />
          </label>
          <label>
            Apelido
            <input
              value={nickname}
              onChange={(event) => setNickname(event.target.value)}
              placeholder="Como quer ser chamado(a)"
              required
            />
          </label>
          <label>
            Idade
            <input
              value={age}
              onChange={(event) => setAge(event.target.value)}
              inputMode="numeric"
              min="1"
              max="120"
              placeholder="Ex.: 24"
              required
              type="number"
            />
          </label>
          <label>
            WhatsApp
            <input
              value={whatsapp}
              onChange={(event) => setWhatsapp(event.target.value)}
              placeholder="Opcional"
            />
          </label>
          <label>
            Cidade / Bairro
            <input value={city} onChange={(event) => setCity(event.target.value)} />
          </label>
          <label>
            Interesse principal
            <select value={interest} onChange={(event) => setInterest(event.target.value)}>
              <option>Ouvinte da rádio</option>
              <option>Notícias locais</option>
              <option>Esporte amador</option>
              <option>Programação</option>
              <option>Patrocínio</option>
            </select>
          </label>
          {error ? <p className="admin-feedback is-error">{error}</p> : null}
          {feedback ? <p className="admin-feedback is-success">{feedback}</p> : null}

          {!isSubmitted ? (
            <button className="advertise-primary" disabled={isSaving} type="submit">
              {isSaving ? 'Salvando...' : 'Cadastrar agora'}
            </button>
          ) : null}
        </form>

        <aside className="register-sidecard">
          <p className="card-eyebrow">Como isso ajuda</p>
          <h2>Esse cadastro aparece no admin</h2>
          <p>
            Assim a abertura do app fica mais sociável e o painel passa a receber contatos reais
            da comunidade para futuras campanhas, mensagens e relacionamento.
          </p>
        </aside>
      </div>
    </section>
  )
}
