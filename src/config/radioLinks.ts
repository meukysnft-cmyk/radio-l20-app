export const radioLinks = {
  instagram: 'https://www.instagram.com/l20radio',
  youtube: 'https://youtube.com/@radiol20',
  whatsapp: 'https://wa.me/5582993979423',
  whatsappMessage: 'Olá, Rádio L20! Vim pelo site.',
  home: '/',
  liveSection: '#ao-vivo',
  contactSection: '#contato',
  streamUrl: 'https://stm4.conectastreaming.com:23844/stream',
} as const

export const radioRoutes = {
  home: '/',
  live: '/ao-vivo',
  news: '/noticias',
  sport: '/esporte',
  schedule: '/agenda',
  programs: '/programas',
  advertise: '/anuncie',
  sponsors: '/patrocinadores',
  videos: '/videos',
  horoscope: '/horoscopo',
  wordOfLife: '/palavra-de-vida',
  jobs: '/empregos',
  contact: '/contato',
  register: '/cadastro',
  profile: '/perfil',
  chat: '/bate-papo',
  admin: '/admin',
  adminLogin: '/admin/login',
  adminNews: '/admin/noticias',
  adminChampionships: '/admin/campeonatos',
  adminTeams: '/admin/times',
  adminLogos: '/admin/logos',
  adminSchedule: '/admin/agenda',
  adminPrograms: '/admin/programacao',
  adminVideos: '/admin/videos',
  adminSponsors: '/admin/patrocinadores',
  adminAdvertise: '/admin/anuncie',
  adminHoroscope: '/admin/horoscopo',
  adminWordOfLife: '/admin/palavra-de-vida',
  adminJobs: '/admin/empregos',
  adminLinks: '/admin/links',
  adminPlayer: '/admin/player',
  adminLiveStreams: '/admin/live-streams',
  adminTheme: '/admin/tema',
  adminNotifications: '/admin/notificacoes',
  adminSettings: '/admin/configuracoes',
  programDetail: (slug: string) => `/programas/${slug}`,
} as const

export const radioDesktopNavItems = [
  { label: 'Início', to: radioRoutes.home },
  { label: 'Notícias', to: radioRoutes.news },
  { label: 'Esportes', to: radioRoutes.sport },
  { label: 'Ao Vivo', to: radioRoutes.live },
  { label: 'Programas', to: radioRoutes.programs },
  { label: 'Agenda', to: radioRoutes.schedule },
  { label: 'Vídeos', to: radioRoutes.videos },
] as const

export const radioNavItems = radioDesktopNavItems

export const radioMobileMenuItems = [
  { label: 'Agenda', to: radioRoutes.schedule },
  { label: 'Programas', to: radioRoutes.programs },
  { label: 'Anuncie', to: radioRoutes.advertise },
  { label: 'Patrocinadores', to: radioRoutes.sponsors },
  { label: 'Horóscopo', to: radioRoutes.horoscope },
  { label: 'Contato e Redes Sociais', to: radioRoutes.contact },
  { label: 'Admin', to: radioRoutes.admin },
] as const

export const radioBottomNavItems = [
  { label: 'Início', to: radioRoutes.home, marker: 'IN' },
  { label: 'Ao Vivo', to: radioRoutes.live, marker: 'ON' },
  { label: 'Notícias', to: radioRoutes.news, marker: 'NT' },
  { label: 'Esporte', to: radioRoutes.sport, marker: 'ES' },
  { label: 'Vídeos', to: radioRoutes.videos, marker: 'VD' },
  { label: 'Horóscopo', to: radioRoutes.horoscope, marker: 'HR' },
  { label: 'Chat', to: radioRoutes.chat, marker: 'CH' },
  { label: 'Empregos', to: radioRoutes.jobs, marker: 'EM' },
] as const

export const radioSocialLinks = {
  instagram: radioLinks.instagram,
  youtube: radioLinks.youtube,
  whatsapp: `${radioLinks.whatsapp}?text=${encodeURIComponent(
    radioLinks.whatsappMessage,
  )}`,
} as const

export const radioSocialItems = [
  {
    label: 'Instagram',
    href: radioSocialLinks.instagram,
    marker: 'IG',
    detail: '@l20radio',
    external: true,
  },
  {
    label: 'YouTube',
    href: radioSocialLinks.youtube,
    marker: 'YT',
    detail: '@radiol20',
    external: true,
  },
  {
    label: 'WhatsApp',
    href: radioSocialLinks.whatsapp,
    marker: 'WA',
    detail: radioLinks.whatsappMessage,
    external: true,
  },
] as const
