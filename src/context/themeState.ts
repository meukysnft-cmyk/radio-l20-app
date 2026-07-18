import { createContext } from 'react'

export type Theme = 'dark' | 'light'

export type ThemeVarMap = Record<string, string>

export type ThemeStyleDefinition = {
  id: string
  label: string
  description: string
  dark: ThemeVarMap
  light: ThemeVarMap
}

export const THEME_STYLES: ThemeStyleDefinition[] = [
  {
    id: 'moderno',
    label: 'Moderno',
    description: 'Visual tech com brilho e profundidade',
    dark: {
      '--bg': '#03060b',
      '--bg-elevated': '#071b35',
      '--bg-soft': 'rgba(7,27,53,.66)',
      '--surface': 'rgba(7,26,51,.88)',
      '--surface-deep': 'rgba(5,7,10,.92)',
      '--surface-overlay': 'rgba(5,7,10,.96)',
      '--brand-tint': 'rgba(0,87,217,.16)',
      '--line': 'rgba(176,191,220,.12)',
      '--text': '#d0dbef',
      '--text-secondary': '#a2b3cd',
      '--text-muted': '#8493ad',
      '--text-strong': '#ffffff',
      '--brand': '#0a4ec9',
      '--brand-bright': '#2e8fff',
      '--ink': '#06162d',
      '--shadow-soft': '0 16px 34px rgba(0,0,0,.24)',
      '--shadow-blue': '0 16px 34px rgba(10,78,201,.2)',
    },
    light: {
      '--bg': '#f5f7fb',
      '--bg-elevated': '#ffffff',
      '--bg-soft': 'rgba(230,235,245,.8)',
      '--surface': 'rgba(255,255,255,.92)',
      '--surface-deep': 'rgba(240,243,250,.95)',
      '--surface-overlay': 'rgba(255,255,255,.97)',
      '--brand-tint': 'rgba(10,78,201,.08)',
      '--line': 'rgba(0,0,0,.08)',
      '--text': '#1e293b',
      '--text-secondary': '#4a5568',
      '--text-muted': '#718096',
      '--text-strong': '#0f172a',
      '--brand': '#0a4ec9',
      '--brand-bright': '#1a6fd4',
      '--ink': '#ffffff',
      '--shadow-soft': '0 4px 16px rgba(0,0,0,.08)',
      '--shadow-blue': '0 4px 16px rgba(10,78,201,.1)',
    },
  },
  {
    id: 'minimalista',
    label: 'Minimalista',
    description: 'Limpo, suave e sem excessos',
    dark: {
      '--bg': '#0a0c10',
      '--bg-elevated': '#12151c',
      '--bg-soft': 'rgba(18,21,28,.7)',
      '--surface': 'rgba(18,21,28,.9)',
      '--surface-deep': 'rgba(8,10,14,.95)',
      '--surface-overlay': 'rgba(8,10,14,.98)',
      '--brand-tint': 'rgba(140,160,200,.08)',
      '--line': 'rgba(140,160,200,.08)',
      '--text': '#b0bcd0',
      '--text-secondary': '#8892a6',
      '--text-muted': '#6b7586',
      '--text-strong': '#e8ecf4',
      '--brand': '#6880a8',
      '--brand-bright': '#8ea2c4',
      '--ink': '#0a0c10',
      '--shadow-soft': '0 2px 8px rgba(0,0,0,.18)',
      '--shadow-blue': '0 2px 8px rgba(0,0,0,.12)',
    },
    light: {
      '--bg': '#f8f9fb',
      '--bg-elevated': '#ffffff',
      '--bg-soft': 'rgba(240,242,246,.7)',
      '--surface': 'rgba(255,255,255,.95)',
      '--surface-deep': 'rgba(245,247,250,.98)',
      '--surface-overlay': '#ffffff',
      '--brand-tint': 'rgba(100,120,160,.06)',
      '--line': 'rgba(0,0,0,.06)',
      '--text': '#3a4150',
      '--text-secondary': '#5c6478',
      '--text-muted': '#8890a0',
      '--text-strong': '#1a1f2c',
      '--brand': '#5a7098',
      '--brand-bright': '#7088b0',
      '--ink': '#ffffff',
      '--shadow-soft': '0 1px 4px rgba(0,0,0,.06)',
      '--shadow-blue': '0 1px 4px rgba(0,0,0,.04)',
    },
  },
  {
    id: 'classico',
    label: 'Classico',
    description: 'Solido, tradicional e confiavel',
    dark: {
      '--bg': '#0c0a08',
      '--bg-elevated': '#1a1612',
      '--bg-soft': 'rgba(26,22,18,.7)',
      '--surface': 'rgba(26,22,18,.9)',
      '--surface-deep': 'rgba(10,8,6,.95)',
      '--surface-overlay': 'rgba(10,8,6,.98)',
      '--brand-tint': 'rgba(180,120,40,.1)',
      '--line': 'rgba(180,150,100,.1)',
      '--text': '#c8bfb0',
      '--text-secondary': '#a09888',
      '--text-muted': '#807868',
      '--text-strong': '#f0e8d8',
      '--brand': '#b8860b',
      '--brand-bright': '#d4a020',
      '--ink': '#0c0a08',
      '--shadow-soft': '0 8px 24px rgba(0,0,0,.28)',
      '--shadow-blue': '0 8px 24px rgba(184,134,11,.12)',
    },
    light: {
      '--bg': '#f7f4ef',
      '--bg-elevated': '#fffef9',
      '--bg-soft': 'rgba(245,240,230,.7)',
      '--surface': 'rgba(255,254,249,.95)',
      '--surface-deep': 'rgba(248,244,236,.98)',
      '--surface-overlay': '#fffef9',
      '--brand-tint': 'rgba(184,134,11,.06)',
      '--line': 'rgba(0,0,0,.08)',
      '--text': '#3d3428',
      '--text-secondary': '#5c5040',
      '--text-muted': '#8a7e6e',
      '--text-strong': '#1a150e',
      '--brand': '#a07008',
      '--brand-bright': '#c49010',
      '--ink': '#ffffff',
      '--shadow-soft': '0 4px 12px rgba(0,0,0,.07)',
      '--shadow-blue': '0 4px 12px rgba(184,134,11,.06)',
    },
  },
  {
    id: 'vibrante',
    label: 'Vibrante',
    description: 'Forte, expressivo e cheio de energia',
    dark: {
      '--bg': '#06020e',
      '--bg-elevated': '#1a0830',
      '--bg-soft': 'rgba(26,8,48,.6)',
      '--surface': 'rgba(26,8,48,.85)',
      '--surface-deep': 'rgba(6,2,14,.94)',
      '--surface-overlay': 'rgba(6,2,14,.97)',
      '--brand-tint': 'rgba(168,40,255,.14)',
      '--line': 'rgba(168,120,255,.12)',
      '--text': '#d4c8f0',
      '--text-secondary': '#a898d0',
      '--text-muted': '#8878b0',
      '--text-strong': '#f0e8ff',
      '--brand': '#a828ff',
      '--brand-bright': '#c858ff',
      '--ink': '#06020e',
      '--shadow-soft': '0 20px 40px rgba(0,0,0,.32)',
      '--shadow-blue': '0 16px 32px rgba(168,40,255,.18)',
    },
    light: {
      '--bg': '#f6f0ff',
      '--bg-elevated': '#ffffff',
      '--bg-soft': 'rgba(230,216,255,.6)',
      '--surface': 'rgba(255,255,255,.92)',
      '--surface-deep': 'rgba(242,236,255,.96)',
      '--surface-overlay': '#ffffff',
      '--brand-tint': 'rgba(168,40,255,.07)',
      '--line': 'rgba(0,0,0,.07)',
      '--text': '#2a1848',
      '--text-secondary': '#5a4878',
      '--text-muted': '#8878a8',
      '--text-strong': '#120828',
      '--brand': '#9020e8',
      '--brand-bright': '#b048ff',
      '--ink': '#ffffff',
      '--shadow-soft': '0 6px 20px rgba(168,40,255,.08)',
      '--shadow-blue': '0 4px 16px rgba(168,40,255,.06)',
    },
  },
]

export const DEFAULT_THEME_STYLE_ID = 'moderno'

export type AccentPreset = {
  id: string
  label: string
  dark: { accent: string; accentTint: string }
  light: { accent: string; accentTint: string }
}

export const ACCENT_PRESETS: AccentPreset[] = [
  { id: 'gold', label: 'Dourado', dark: { accent: '#f3c71a', accentTint: 'rgba(255,212,0,.12)' }, light: { accent: '#d4a800', accentTint: 'rgba(212,168,0,.1)' } },
  { id: 'emerald', label: 'Esmeralda', dark: { accent: '#34d399', accentTint: 'rgba(52,211,153,.12)' }, light: { accent: '#059669', accentTint: 'rgba(5,150,105,.1)' } },
  { id: 'coral', label: 'Coral', dark: { accent: '#fb7185', accentTint: 'rgba(251,113,133,.12)' }, light: { accent: '#e11d48', accentTint: 'rgba(225,29,72,.1)' } },
  { id: 'purple', label: 'Lavanda', dark: { accent: '#a78bfa', accentTint: 'rgba(167,139,250,.12)' }, light: { accent: '#7c3aed', accentTint: 'rgba(124,58,237,.1)' } },
  { id: 'teal', label: 'Turquesa', dark: { accent: '#2dd4bf', accentTint: 'rgba(45,212,191,.12)' }, light: { accent: '#0d9488', accentTint: 'rgba(13,148,136,.1)' } },
  { id: 'rose', label: 'Rosa', dark: { accent: '#f472b6', accentTint: 'rgba(244,114,182,.12)' }, light: { accent: '#db2777', accentTint: 'rgba(219,39,119,.1)' } },
  { id: 'sky', label: 'Céu', dark: { accent: '#38bdf8', accentTint: 'rgba(56,189,248,.12)' }, light: { accent: '#0284c7', accentTint: 'rgba(2,132,199,.1)' } },
  { id: 'amber', label: 'Âmbar', dark: { accent: '#fbbf24', accentTint: 'rgba(251,191,36,.12)' }, light: { accent: '#d97706', accentTint: 'rgba(217,119,6,.1)' } },
]

export const DEFAULT_ACCENT_ID = 'gold'

export type ThemeContextValue = {
  theme: Theme
  toggleTheme: () => void
  themeStyleId: string
  setThemeStyleId: (id: string) => void
  accentId: string
  setAccentId: (id: string) => void
}

export const ThemeContext = createContext<ThemeContextValue>({
  theme: 'dark',
  toggleTheme: () => {},
  themeStyleId: DEFAULT_THEME_STYLE_ID,
  setThemeStyleId: () => {},
  accentId: DEFAULT_ACCENT_ID,
  setAccentId: () => {},
})
