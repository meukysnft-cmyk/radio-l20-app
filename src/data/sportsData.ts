export type Sport = {
  name: string
  slug: string
  icon: string
  color: string
}

export const SPORTS: Sport[] = [
  { name: 'Futebol', slug: 'futebol', icon: '⚽', color: '#22c55e' },
  { name: 'Futsal', slug: 'futsal', icon: '🏃', color: '#3b82f6' },
  { name: 'Jiu-Jitsu', slug: 'jiu-jitsu', icon: '🥋', color: '#8b5cf6' },
  { name: 'Atletismo', slug: 'atletismo', icon: '🏃', color: '#f59e0b' },
  { name: 'Skate', slug: 'skate', icon: '🛹', color: '#ef4444' },
  { name: 'Bike', slug: 'bike', icon: '🚴', color: '#06b6d4' },
  { name: 'Queimado', slug: 'queimado', icon: '🔥', color: '#f97316' },
  { name: 'Vôlei', slug: 'volei', icon: '🏐', color: '#ec4899' },
  { name: 'Basquete', slug: 'basquete', icon: '🏀', color: '#f97316' },
  { name: 'Handebol', slug: 'handebol', icon: '🤾', color: '#14b8a6' },
  { name: 'Natação', slug: 'natacao', icon: '🏊', color: '#0ea5e9' },
  { name: 'Eventos', slug: 'eventos', icon: '📣', color: '#a855f7' },
]

export function getSportBySlug(slug: string): Sport | undefined {
  return SPORTS.find((s) => s.slug === slug)
}
