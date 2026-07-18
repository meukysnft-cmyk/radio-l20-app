import { useMemo, useState } from 'react'
import { TeamLogo } from '../../components/TeamLogo'
import '../../styles/admin.css'

function toKebabCase(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function AdminTeamsPage() {
  const [teamName, setTeamName] = useState('')
  const [city, setCity] = useState('')
  const [category, setCategory] = useState('')
  const [logoUrl, setLogoUrl] = useState('')

  const generatedCode = useMemo(() => {
    const name = teamName || 'Nome do Time'
    const id = toKebabCase(name) || 'nome-do-time'
    const teamCity = city || 'Pilar'
    const teamCategory = category || 'Categoria'

    return `{
  id: "${id}",
  name: "${name}",
  city: "${teamCity}",
  category: "${teamCategory}",
  logoUrl: "${logoUrl}",
  alt: "Escudo do ${name}",
},`
  }, [category, city, logoUrl, teamName])

  const fallback = (teamName || 'Time')
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2)

  return (
    <section className="content-section page-section admin-logos-page" aria-labelledby="admin-teams-title">
      <div className="admin-hero">
        <p className="eyebrow">Administrador</p>
        <h1 id="admin-teams-title">Times e Escudos</h1>
        <p>
          Protótipo visual para cadastro futuro de times usando link externo da logo.
          Ainda não salva dados e não envia arquivos.
        </p>
        <span>Sem Storage, sem backend e sem upload local.</span>
      </div>

      <div className="admin-logo-workspace">
        <form className="admin-logo-form">
          <label>
            Nome do time
            <input value={teamName} onChange={(event) => setTeamName(event.target.value)} placeholder="Tabajara FC" />
          </label>

          <label>
            Cidade/Bairro
            <input value={city} onChange={(event) => setCity(event.target.value)} placeholder="Pilar" />
          </label>

          <label>
            Categoria
            <input value={category} onChange={(event) => setCategory(event.target.value)} placeholder="Futsal" />
          </label>

          <label>
            Link da logo
            <input
              value={logoUrl}
              onChange={(event) => setLogoUrl(event.target.value)}
              placeholder="https://exemplo.com/logo-time.webp"
              inputMode="url"
            />
          </label>
        </form>

        <div className="admin-logo-preview-grid">
          <article className="admin-logo-preview-card">
            <h2>Prévia da logo</h2>
            <div className="admin-team-logo-preview">
              <TeamLogo
                logoUrl={logoUrl}
                alt={`Escudo do ${teamName || 'time'}`}
                fallback={fallback}
                size={96}
              />
            </div>
            <small>
              {logoUrl
                ? 'A imagem é carregada pelo link informado. Se falhar, o fallback será exibido.'
                : 'Sem link informado: fallback com iniciais.'}
            </small>
          </article>

          <article className="admin-logo-preview-card">
            <h2>Como vai aparecer no app</h2>
            <div className="team-card admin-team-sample">
              <TeamLogo
                logoUrl={logoUrl}
                alt={`Escudo do ${teamName || 'time'}`}
                fallback={fallback}
              />
              <div>
                <h3>{teamName || 'Nome do Time'}</h3>
                <p>{city || 'Pilar'}</p>
                <small>{category || 'Categoria'}</small>
              </div>
            </div>
            <small>Protótipo visual. Ainda não cadastra no arquivo de dados.</small>
          </article>
        </div>
      </div>

      <div className="admin-code-panel">
        <div>
          <p className="eyebrow">Modelo de dados</p>
          <h2>Estrutura futura em src/data/teamsContent.ts</h2>
          <p>Quando o cadastro real existir, o Admin salvará esse tipo de informação.</p>
        </div>
        <pre><code>{generatedCode}</code></pre>
      </div>
    </section>
  )
}
