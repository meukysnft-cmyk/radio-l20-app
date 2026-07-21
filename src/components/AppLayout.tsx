import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { radioRoutes } from '../config/radioLinks'
import { useAuth } from '../context/useAuth'
import { hasCommunityAccess } from '../routes/RequireCommunityAccess'
import { FloatingChat } from './FloatingChat'
import { Footer } from './Footer'
import { Header } from './Header'
import { LiveBanner } from './LiveBanner'
import { MobileBottomNav } from './MobileBottomNav'
import { NotificationToast } from './NotificationToast'
import { Sidenav } from './SideNav'
import { SponsorBanner } from './SponsorBanner'

const seoMap: Record<string, { title: string; description: string }> = {
  [radioRoutes.home]: {
    title: 'Rádio L20 | Ao Vivo, Notícias e Esporte Amador',
    description:
      'Rádio web local de Pilar, Alagoas, com transmissão ao vivo, notícias, esporte amador e programação comunitária.',
  },
  [radioRoutes.live]: {
    title: 'Ao Vivo | Rádio L20',
    description: 'Ouça a Rádio L20 ao vivo e acompanhe a programação em tempo real.',
  },
  [radioRoutes.news]: {
    title: 'Notícias | Rádio L20',
    description: 'Notícias locais de Pilar, Alagoas, com cobertura comunitária e esportiva.',
  },
  [radioRoutes.sport]: {
    title: 'Esporte Amador | Rádio L20',
    description: 'Cobertura do esporte amador, campeonatos e destaques da cidade.',
  },
  [radioRoutes.schedule]: {
    title: 'Agenda | Rádio L20',
    description: 'Veja as próximas transmissões, programas e coberturas especiais da rádio.',
  },
  [radioRoutes.programs]: {
    title: 'Programação | Rádio L20',
    description: 'Conheça a programação diária da Rádio L20, com conteúdo jornalístico e comunitário.',
  },
  [radioRoutes.videos]: {
    title: 'Vídeos | Rádio L20',
    description: 'Veja vídeos, transmissões e registros dos eventos da Rádio L20.',
  },
  [radioRoutes.advertise]: {
    title: 'Anuncie Conosco | Rádio L20',
    description: 'Conheça os espaços comerciais e divulgue sua marca na Rádio L20.',
  },
  [radioRoutes.sponsors]: {
    title: 'Patrocinadores | Rádio L20',
    description: 'Empresas e parceiros que apoiam a Rádio L20 e a comunidade local.',
  },
  [radioRoutes.contact]: {
    title: 'Contato | Rádio L20',
    description: 'Fale com a Rádio L20, envie mensagens e acompanhe nossos canais oficiais.',
  },
  [radioRoutes.horoscope]: {
    title: 'Horóscopo | Rádio L20',
    description: 'Confira o horóscopo do dia com leitura leve e acessível.',
  },
  [radioRoutes.wordOfLife]: {
    title: 'Palavra de Vida | Rádio L20',
    description: 'Mensagens de reflexão, fé e esperança para o seu dia.',
  },
  [radioRoutes.jobs]: {
    title: 'Empregos | Rádio L20',
    description: 'Vagas de emprego em Pilar, Delmiro Goveia, Piaçabuçu e cidades vizinhas. Encontre oportunidades de trabalho na região.',
  },
  [radioRoutes.adminLogin]: {
    title: 'Login Administrativo | Rádio L20',
    description: 'Área administrativa da Rádio L20 para acesso interno e gerenciamento do site.',
  },
}

export function AppLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()
  const { user, isAdmin } = useAuth()
  const isAuthPage = location.pathname === radioRoutes.adminLogin || location.pathname === radioRoutes.register
  const isLockedOnboarding = Boolean(user) && !isAdmin && !hasCommunityAccess()

  const handleMenuClick = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  useEffect(() => {
    document.body.classList.toggle('menu-is-open', isMenuOpen)

    return () => document.body.classList.remove('menu-is-open')
  }, [isMenuOpen])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [location.pathname])

  useEffect(() => {
    const seo = seoMap[location.pathname] ?? seoMap[radioRoutes.home]

    document.title = seo.title

    const descriptionTag = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    if (descriptionTag) {
      descriptionTag.setAttribute('content', seo.description)
    }

    const ogTitleTag = document.querySelector<HTMLMetaElement>('meta[property="og:title"]')
    if (ogTitleTag) {
      ogTitleTag.setAttribute('content', seo.title)
    }

    const ogDescriptionTag = document.querySelector<HTMLMetaElement>('meta[property="og:description"]')
    if (ogDescriptionTag) {
      ogDescriptionTag.setAttribute('content', seo.description)
    }

    const twitterTitleTag = document.querySelector<HTMLMetaElement>('meta[name="twitter:title"]')
    if (twitterTitleTag) {
      twitterTitleTag.setAttribute('content', seo.title)
    }

    const twitterDescriptionTag = document.querySelector<HTMLMetaElement>('meta[name="twitter:description"]')
    if (twitterDescriptionTag) {
      twitterDescriptionTag.setAttribute('content', seo.description)
    }

    const canonicalUrl = `${window.location.origin}${location.pathname}`
    const canonicalTag = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (canonicalTag) {
      canonicalTag.setAttribute('href', canonicalUrl)
    }
  }, [location.pathname])

  return (
    <div className="site-shell" id="inicio">
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>

      {!isAuthPage && !isLockedOnboarding ? <Header isMenuOpen={isMenuOpen} onMenuClick={handleMenuClick} /> : null}
      {!isAuthPage && !isLockedOnboarding ? <LiveBanner /> : null}

      {isMenuOpen && !isAuthPage && !isLockedOnboarding ? <Sidenav onClose={() => setIsMenuOpen(false)} /> : null}

      {!isAuthPage && !isLockedOnboarding ? <SponsorBanner /> : null}

      <main id="conteudo" className="site-main">
        <Outlet />
      </main>

      <NotificationToast />

      {!isAuthPage && !isLockedOnboarding ? <Footer /> : null}
      {!isAuthPage && !isLockedOnboarding ? <MobileBottomNav /> : null}
      {!isAuthPage && !isLockedOnboarding ? <FloatingChat /> : null}
    </div>
  )
}
