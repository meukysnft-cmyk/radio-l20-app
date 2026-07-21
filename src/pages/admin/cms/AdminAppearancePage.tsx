import { useTheme } from '../../../context/useTheme'
import { THEME_STYLES, ACCENT_PRESETS } from '../../../context/themeState'
import { ModulePage } from './ModulePage'

export function AdminAppearancePage() {
  const { theme, toggleTheme, themeStyleId, setThemeStyleId, accentId, setAccentId } = useTheme()

  const currentStyleDef = THEME_STYLES.find((s) => s.id === themeStyleId)
  const currentStyleVars = currentStyleDef
    ? theme === 'dark' ? currentStyleDef.dark : currentStyleDef.light
    : null

  return (
    <ModulePage
      eyebrow="Sistema"
      title="Aparência"
      description="Altere cores, tipografia, estilo visual e layout do site diretamente pelo painel administrativo."
    >
      <div className="admin-appearance-layout">
        <div className="admin-appearance-controls">

          <fieldset className="profile-theme-section">
            <legend>Modo</legend>
            <div className="theme-mode-row">
              <span className="theme-mode-label">Tema</span>
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
          </fieldset>

          <fieldset className="profile-theme-section">
            <legend>Estilo visual</legend>
            <div className="theme-style-picker">
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
          </fieldset>

          <fieldset className="profile-theme-section">
            <legend>Cor de destaque</legend>
            <div className="accent-picker">
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

          <p className="admin-appearance-note">
            As alterações são aplicadas imediatamente na sua sessão.
            Para definir estas opções como padrão do site, será necessário salvar no servidor futuramente.
          </p>
        </div>

        <aside className="admin-appearance-preview">
          <p className="card-eyebrow">Preview ao vivo</p>
          <h3 className="admin-appearance-preview-title">Visualização do tema</h3>
          <div className="admin-appearance-box" style={{ background: currentStyleVars?.['--surface'] ?? 'var(--surface)', borderColor: 'var(--line)' }}>
            <div className="admin-appearance-box-header" style={{ background: currentStyleVars?.['--brand'] ?? 'var(--brand)' }}>
              <span className="admin-appearance-box-label">RÁDIO L20</span>
              <span className="admin-appearance-box-badge" style={{ background: currentStyleVars?.['--accent'] ?? 'var(--accent)' }}>AO VIVO</span>
            </div>
            <div className="admin-appearance-box-body">
              <p className="admin-appearance-box-heading" style={{ color: 'var(--text-strong)' }}>Título em destaque</p>
              <p className="admin-appearance-box-text" style={{ color: 'var(--text-secondary)' }}>
                Texto de exemplo com a cor secundária para descrições e detalhes.
              </p>
              <div className="admin-appearance-box-footer">
                <span className="admin-appearance-box-btn" style={{ background: currentStyleVars?.['--brand'] ?? 'var(--brand)' }}>Ação</span>
                <span className="admin-appearance-box-btn is-outline" style={{ border: '1px solid var(--line)', color: 'var(--text)' }}>Cancelar</span>
              </div>
            </div>
          </div>

          <div className="admin-appearance-current-info">
            <div className="theme-preview-row">
              <span className="theme-preview-mode">{theme === 'dark' ? '🌙 Escuro' : '☀️ Claro'}</span>
              <span className="theme-preview-style">{currentStyleDef?.label ?? 'Moderno'}</span>
            </div>
            <div className="admin-appearance-accent-row">
              <span className="admin-appearance-accent-label">Destaque:</span>
              <span className="admin-appearance-accent-value">{ACCENT_PRESETS.find((p) => p.id === accentId)?.label ?? 'Dourado'}</span>
              <span className="admin-appearance-accent-dot" style={{ background: 'var(--accent)' }} />
            </div>
          </div>
        </aside>
      </div>
    </ModulePage>
  )
}
