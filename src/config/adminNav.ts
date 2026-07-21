import {
  IoHomeOutline,
  IoNewspaperOutline,
  IoFootballOutline,
  IoCalendarOutline,
  IoMicOutline,
  IoRadioOutline,
  IoVideocamOutline,
  IoStarOutline,
  IoImagesOutline,
  IoLinkOutline,
  IoGlobeOutline,
  IoColorPaletteOutline,
  IoSettingsOutline,
  IoPeopleOutline,
  IoDocumentTextOutline,
  IoBriefcaseOutline,
  IoSparklesOutline,
  IoBarChartOutline,
  IoChatbubblesOutline,
} from 'react-icons/io5'
import type { ComponentType } from 'react'

export type AdminNavItem = {
  key: string
  label: string
  path: string
  icon: ComponentType<{ size?: number; className?: string }>
  group: 'principal' | 'conteudo' | 'engajamento' | 'sistema'
}

export const adminNavItems: AdminNavItem[] = [
  { key: 'dashboard', label: 'Dashboard', path: '/admin', icon: IoHomeOutline, group: 'principal' },
  { key: 'news', label: 'Notícias', path: '/admin/noticias', icon: IoNewspaperOutline, group: 'conteudo' },
  { key: 'sports', label: 'Esportes', path: '/admin/esportes', icon: IoFootballOutline, group: 'conteudo' },
  { key: 'agenda', label: 'Agenda', path: '/admin/agenda', icon: IoCalendarOutline, group: 'conteudo' },
  { key: 'programs', label: 'Programação', path: '/admin/programacao', icon: IoMicOutline, group: 'conteudo' },
  { key: 'liveStreams', label: 'Transmissões', path: '/admin/live-streams', icon: IoRadioOutline, group: 'conteudo' },
  { key: 'videos', label: 'Vídeos', path: '/admin/videos', icon: IoVideocamOutline, group: 'conteudo' },
  { key: 'sponsors', label: 'Patrocinadores', path: '/admin/patrocinadores', icon: IoStarOutline, group: 'engajamento' },
  { key: 'jobs', label: 'Empregos', path: '/admin/empregos', icon: IoBriefcaseOutline, group: 'engajamento' },
  { key: 'horoscope', label: 'Horóscopo', path: '/admin/horoscopo', icon: IoSparklesOutline, group: 'engajamento' },
  { key: 'wordOfLife', label: 'Analisador Palavra de Vida', path: '/admin/palavra-de-vida', icon: IoBarChartOutline, group: 'engajamento' },

  { key: 'gallery', label: 'Galeria de Fotos', path: '/admin/galeria', icon: IoImagesOutline, group: 'engajamento' },
  { key: 'links', label: 'Links Úteis', path: '/admin/links', icon: IoLinkOutline, group: 'engajamento' },
  { key: 'social', label: 'Redes Sociais', path: '/admin/redes-sociais', icon: IoGlobeOutline, group: 'engajamento' },
  { key: 'chat', label: 'Chat', path: '/admin/chat', icon: IoChatbubblesOutline, group: 'engajamento' },
  { key: 'appearance', label: 'Aparência', path: '/admin/aparencia', icon: IoColorPaletteOutline, group: 'sistema' },
  { key: 'settings', label: 'Configurações', path: '/admin/configuracoes', icon: IoSettingsOutline, group: 'sistema' },
  { key: 'users', label: 'Usuários', path: '/admin/usuarios', icon: IoPeopleOutline, group: 'sistema' },
  { key: 'logs', label: 'Logs do Sistema', path: '/admin/logs', icon: IoDocumentTextOutline, group: 'sistema' },
]

export const adminNavGroups = [
  { key: 'principal', label: 'Principal' },
  { key: 'conteudo', label: 'Conteúdo' },
  { key: 'engajamento', label: 'Engajamento' },
  { key: 'sistema', label: 'Sistema' },
] as const
