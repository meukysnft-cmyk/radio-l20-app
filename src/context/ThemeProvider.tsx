import { type ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import {
  ThemeContext,
  type Theme,
  THEME_STYLES,
  DEFAULT_THEME_STYLE_ID,
  ACCENT_PRESETS,
  DEFAULT_ACCENT_ID,
} from './themeState'

const THEME_KEY = 'radio-l20-theme'
const STYLE_KEY = 'radio-l20-style'
const ACCENT_KEY = 'radio-l20-accent'
const STYLE_TAG_ID = 'theme-style-overrides'

function getInitialTheme(): Theme {
  const stored = localStorage.getItem(THEME_KEY)
  if (stored === 'light' || stored === 'dark') return stored
  if (window.matchMedia?.('(prefers-color-scheme: light)').matches) return 'light'
  return 'dark'
}

function getInitialStyle(): string {
  const stored = localStorage.getItem(STYLE_KEY)
  if (stored && THEME_STYLES.some((s) => s.id === stored)) return stored
  return DEFAULT_THEME_STYLE_ID
}

function getInitialAccent(): string {
  const stored = localStorage.getItem(ACCENT_KEY)
  if (stored && ACCENT_PRESETS.some((p) => p.id === stored)) return stored
  return DEFAULT_ACCENT_ID
}

function buildStyleCss(styleId: string, mode: Theme): string {
  const styleDef = THEME_STYLES.find((s) => s.id === styleId)
  if (!styleDef) return ''

  const vars = mode === 'dark' ? styleDef.dark : styleDef.light
  const selector = mode === 'dark' ? ':root' : '[data-theme="light"]'

  const declarations = Object.entries(vars)
    .map(([key, value]) => `  ${key}: ${value};`)
    .join('\n')

  return `${selector} {\n${declarations}\n}`
}

function injectStyleTag(css: string) {
  let tag = document.getElementById(STYLE_TAG_ID) as HTMLStyleElement | null
  if (!tag) {
    tag = document.createElement('style')
    tag.id = STYLE_TAG_ID
    document.head.appendChild(tag)
  }
  tag.textContent = css
}

function applyAccent(accentId: string, mode: Theme) {
  const preset = ACCENT_PRESETS.find((p) => p.id === accentId) ?? ACCENT_PRESETS[0]
  const vars = mode === 'dark' ? preset.dark : preset.light
  document.documentElement.style.setProperty('--accent', vars.accent)
  document.documentElement.style.setProperty('--accent-tint', vars.accentTint)
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)
  const [themeStyleId, setThemeStyleIdState] = useState<string>(getInitialStyle)
  const [accentId, setAccentIdState] = useState<string>(getInitialAccent)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem(THEME_KEY, theme)

    const css = buildStyleCss(themeStyleId, theme)
    if (css) injectStyleTag(css)

    applyAccent(accentId, theme)
  }, [theme, themeStyleId, accentId])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: light)')
    const handler = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem(THEME_KEY)) {
        setTheme(e.matches ? 'light' : 'dark')
      }
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }, [])

  const setThemeStyleId = useCallback((id: string) => {
    setThemeStyleIdState(id)
    localStorage.setItem(STYLE_KEY, id)
  }, [])

  const setAccentId = useCallback((id: string) => {
    setAccentIdState(id)
    localStorage.setItem(ACCENT_KEY, id)
  }, [])

  const value = useMemo(
    () => ({ theme, toggleTheme, themeStyleId, setThemeStyleId, accentId, setAccentId }),
    [theme, toggleTheme, themeStyleId, setThemeStyleId, accentId, setAccentId],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
