import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { radioRoutes } from '../config/radioLinks'
import { useAuth } from '../context/useAuth'
import { useTheme } from '../context/useTheme'
import { THEME_STYLES, ACCENT_PRESETS } from '../context/themeState'
import { storage } from '../lib/firebase'
import { getDocument, setDocument } from '../services/firestoreService'
import { getZodiacFromBirthday, ELEMENT_EMOJI, ELEMENT_LABELS } from '../utils/zodiac'
import type { UserProfileDocument } from '../types/content'

const INTEREST_OPTIONS = [
  'Notícias locais',
  'Esporte amador',
  'Programação',
  'Música',
  'Horóscopo',
  'Empregos',
  'Eventos comunitários',
  'Patrocínio',
]

const PROFILE_COLLECTION = 'userProfiles'

function buildProfileId(uid: string) {
  return uid
}

export function ProfilePage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { theme, toggleTheme, themeStyleId, setThemeStyleId, accentId, setAccentId } = useTheme()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [displayName, setDisplayName] = useState('')
  const [bio, setBio] = useState('')
  const [city, setCity] = useState('Pilar')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [avatarPreview, setAvatarPreview] = useState('')
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [interests, setInterests] = useState<string[]>([])
  const [birthday, setBirthday] = useState('')
  const [horoscopeNotification, setHoroscopeNotification] = useState(false)
  const [horoscopeNotificationTime, setHoroscopeNotificationTime] = useState('08:00')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) return

    let cancelled = false

    async function loadProfile() {
      try {
        const profile = await getDocument<UserProfileDocument>(PROFILE_COLLECTION, buildProfileId(user!.uid))
        if (cancelled || !profile) return

        setDisplayName(profile.displayName || '')
        setBio(profile.bio || '')
        setCity(profile.city || 'Pilar')
        setAvatarUrl(profile.avatarUrl || '')
        setAvatarPreview(profile.avatarUrl || '')
        setInterests(profile.interests || [])
        setBirthday(profile.birthday || '')
        setHoroscopeNotification(profile.horoscopeNotification || false)
        setHoroscopeNotificationTime(profile.horoscopeNotificationTime || '08:00')

        if (profile.accentColor) setAccentId(profile.accentColor)
      } catch {
        // Profile doesn't exist yet
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadProfile()
    return () => { cancelled = true }
  }, [user, setAccentId])

  function handleAvatarSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      setError('A imagem deve ter no máximo 2 MB.')
      return
    }

    setAvatarFile(file)
    setError('')

    const reader = new FileReader()
    reader.onload = () => setAvatarPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  function toggleInterest(interest: string) {
    setInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest],
    )
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!user) return

    setSaving(true)
    setError('')
    setFeedback('')

    try {
      let finalAvatarUrl = avatarUrl

      if (avatarFile) {
        const storageRef = ref(storage, `avatars/${user.uid}.jpg`)
        await uploadBytes(storageRef, avatarFile)
        finalAvatarUrl = await getDownloadURL(storageRef)
        setAvatarUrl(finalAvatarUrl)
        setAvatarPreview(finalAvatarUrl)
      }

      await setDocument<UserProfileDocument>(PROFILE_COLLECTION, buildProfileId(user.uid), {
        uid: user.uid,
        displayName: displayName.trim() || user.displayName || user.email?.split('@')[0] || 'Ouvinte',
        bio: bio.trim(),
        city: city.trim(),
        avatarUrl: finalAvatarUrl,
        interests,
        accentColor: accentId,
        birthday: birthday || undefined,
        zodiacSign: birthday ? getZodiacFromBirthday(birthday)?.name : undefined,
        horoscopeNotification,
        horoscopeNotificationTime,
      })

      setFeedback('Perfil salvo com sucesso.')
    } catch (err) {
      console.error('Falha ao salvar perfil.', err)
      const message = err instanceof Error ? err.message : ''
      setError(message ? `Não foi possível salvar: ${message}` : 'Não foi possível salvar o perfil.')
    } finally {
      setSaving(false)
    }
  }

  if (!user) {
    return (
      <section className="content-section page-section profile-page" aria-labelledby="profile-title">
        <div className="section-header">
          <p className="eyebrow">Conta</p>
          <h1 id="profile-title">Meu Perfil</h1>
          <p>Faça login para ver e editar seu perfil.</p>
        </div>
        <button className="advertise-primary" onClick={() => navigate(radioRoutes.adminLogin)}>
          Entrar com Google
        </button>
      </section>
    )
  }

  if (loading) {
    return (
      <section className="content-section page-section profile-page" aria-labelledby="profile-title">
        <div className="section-header">
          <p className="eyebrow">Conta</p>
          <h1 id="profile-title">Meu Perfil</h1>
          <p>Carregando...</p>
        </div>
      </section>
    )
  }

  const initials = (displayName || user.email || 'U').slice(0, 2).toUpperCase()
  const currentStyleDef = THEME_STYLES.find((s) => s.id === themeStyleId)
  const currentStyleVars = currentStyleDef ? (theme === 'dark' ? currentStyleDef.dark : currentStyleDef.light) : null

  return (
    <section className="content-section page-section profile-page" aria-labelledby="profile-title">
      <div className="section-header">
        <p className="eyebrow">Conta</p>
        <h1 id="profile-title">Meu Perfil</h1>
        <p>Personalize como você aparece e como o app parece pra você.</p>
      </div>

      <div className="profile-layout">
        <form className="profile-card" onSubmit={handleSubmit}>
          <div className="profile-avatar-area">
            <button
              type="button"
              className="profile-avatar-trigger"
              onClick={() => fileInputRef.current?.click()}
              aria-label="Trocar foto do perfil"
            >
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar" className="profile-avatar-img" />
              ) : (
                <span className="profile-avatar-initials">{initials}</span>
              )}
              <span className="profile-avatar-overlay">Trocar foto</span>
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarSelect} hidden />
          </div>

          <label>
            Nome de exibição
            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder={user.displayName || user.email?.split('@')[0] || 'Ouvinte'}
            />
          </label>

          <label>
            Biografia
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Conte um pouco sobre você..."
              rows={3}
              maxLength={200}
            />
            <span className="field-hint">{bio.length}/200</span>
          </label>

          <label>
            Cidade
            <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Sua cidade" />
          </label>

          <fieldset className="profile-interests">
            <legend>Interesses</legend>
            <div className="interest-chips">
              {INTEREST_OPTIONS.map((interest) => (
                <button
                  key={interest}
                  type="button"
                  className={`interest-chip${interests.includes(interest) ? ' is-selected' : ''}`}
                  onClick={() => toggleInterest(interest)}
                >
                  {interest}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="profile-theme-section">
            <legend>Data de nascimento</legend>
            <label>
              Data de nascimento
              <input
                type="date"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
                max={new Date().toISOString().slice(0, 10)}
              />
            </label>
            {birthday && (() => {
              const sign = getZodiacFromBirthday(birthday)
              if (!sign) return null
              return (
                <div className="profile-zodiac-preview">
                  <span className="profile-zodiac-symbol">{sign.symbol}</span>
                  <div>
                    <strong>{sign.name}</strong>
                    <span>{ELEMENT_EMOJI[sign.element]} {ELEMENT_LABELS[sign.element]} — {sign.period}</span>
                  </div>
                </div>
              )
            })()}
          </fieldset>

          <fieldset className="profile-theme-section">
            <legend>Horóscopo</legend>
            <label className="admin-checkbox">
              <input
                checked={horoscopeNotification}
                onChange={(e) => setHoroscopeNotification(e.target.checked)}
                type="checkbox"
              />
              Receber previsão do horóscopo diariamente
            </label>
            {horoscopeNotification && (
              <label>
                Horário da notificação
                <select value={horoscopeNotificationTime} onChange={(e) => setHoroscopeNotificationTime(e.target.value)}>
                  <option value="07:00">07h</option>
                  <option value="08:00">08h</option>
                  <option value="09:00">09h</option>
                  <option value="12:00">12h</option>
                  <option value="18:00">18h</option>
                  <option value="20:00">20h</option>
                </select>
              </label>
            )}
          </fieldset>

          <fieldset className="profile-theme-section">
            <legend>Aparência</legend>

            <div className="theme-mode-row">
              <span className="theme-mode-label">Modo</span>
              <button
                type="button"
                className={`theme-mode-toggle${theme === 'dark' ? ' is-dark' : ' is-light'}`}
                onClick={toggleTheme}
              >
                <span className="theme-mode-track">
                  <span className="theme-mode-thumb" />
                </span>
                <span>{theme === 'dark' ? 'Escuro' : 'Claro'}</span>
              </button>
            </div>

            <div className="theme-style-picker">
              <span className="theme-style-label">Estilo visual</span>
              <div className="theme-style-grid">
                {THEME_STYLES.map((styleDef) => {
                  const previewVars = theme === 'dark' ? styleDef.dark : styleDef.light
                  const isActive = themeStyleId === styleDef.id
                  return (
                    <button
                      key={styleDef.id}
                      type="button"
                      className={`theme-style-card${isActive ? ' is-active' : ''}`}
                      onClick={() => setThemeStyleId(styleDef.id)}
                    >
                      <div className="theme-style-preview">
                        <span className="tsv-bg" style={{ background: previewVars['--bg'] }} />
                        <span className="tsv-surface" style={{ background: previewVars['--surface'] }} />
                        <span className="tsv-brand" style={{ background: previewVars['--brand'] }} />
                        <span className="tsv-accent" style={{ background: previewVars['--accent'] ?? 'var(--accent)' }} />
                      </div>
                      <span className="theme-style-name">{styleDef.label}</span>
                      <span className="theme-style-desc">{styleDef.description}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="accent-picker">
              <span className="accent-picker-label">Cor de destaque</span>
              <div className="accent-options">
                {ACCENT_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    className={`accent-swatch${accentId === preset.id ? ' is-selected' : ''}`}
                    style={{ '--swatch-color': preset.dark.accent } as React.CSSProperties}
                    onClick={() => setAccentId(preset.id)}
                    title={preset.label}
                    aria-label={`Cor: ${preset.label}`}
                  >
                    <span className="accent-swatch-inner" />
                  </button>
                ))}
              </div>
            </div>
          </fieldset>

          {error ? <p className="admin-feedback is-error">{error}</p> : null}
          {feedback ? <p className="admin-feedback is-success">{feedback}</p> : null}

          <button className="advertise-primary" disabled={saving} type="submit">
            {saving ? 'Salvando...' : 'Salvar perfil'}
          </button>
        </form>

        <aside className="profile-sidecard">
          <p className="card-eyebrow">Visibilidade</p>
          <h2>Como seu perfil aparece</h2>
          <p>
            Seu nome, foto e interesses podem ser vistos por outros ouvintes na comunidade.
            A biografia é opcional, mas ajuda a criar conexões.
          </p>
          <div className="profile-preview">
            <div className="profile-preview-avatar">
              {avatarPreview ? <img src={avatarPreview} alt="" /> : <span>{initials}</span>}
            </div>
            <div>
              <strong>{displayName || 'Ouvinte'}</strong>
              <span>{city || 'Pilar'}</span>
            </div>
          </div>

          <div className="profile-theme-preview">
            <p className="card-eyebrow">Tema atual</p>
            <div className="theme-preview-row">
              <span className="theme-preview-mode">{theme === 'dark' ? '🌙 Escuro' : '☀️ Claro'}</span>
              <span className="theme-preview-style">{currentStyleDef?.label ?? 'Moderno'}</span>
            </div>
            {currentStyleVars && (
              <div className="theme-preview-colors">
                <span style={{ background: currentStyleVars['--bg'] }} title="Fundo" />
                <span style={{ background: currentStyleVars['--surface'] }} title="Superfície" />
                <span style={{ background: currentStyleVars['--brand'] }} title="Marca" />
                <span style={{ background: currentStyleVars['--accent'] ?? 'var(--accent)' }} title="Destaque" />
              </div>
            )}
          </div>
        </aside>
      </div>
    </section>
  )
}
