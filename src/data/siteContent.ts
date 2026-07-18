export type ContentCard = {
  category: string
  title: string
  description: string
  meta: string
  isTemporary: boolean
  author?: string
  imageUrl?: string
  publishedAt?: string
  programLabel?: string
}

export type ScheduleItem = {
  time: string
  title: string
  description: string
  isTemporary: boolean
}

export type SponsorItem = {
  name: string
  category: string
  initials: string
  note: string
  isTemporary: boolean
}

export type ProgramItem = {
  name: string
  time: string
  days: string
  category: string
  description: string
  isOnAir: boolean
  statusLabel?: string
  isTemporary: boolean
}

export type AdvertiseBenefit = {
  title: string
  description: string
}

export type SponsorBanner = {
  title: string
  description: string
  label: string
  isTemporary: boolean
}

export type VideoCardItem = {
  category: string
  title: string
  description: string
  note: string
  isTemporary: boolean
}

export type ContactCardItem = {
  eyebrow: string
  title: string
  description: string
  actionLabel?: string
}

export const siteContent = {
  radio: {
    name: 'Rádio L20',
    shortName: 'L20',
    city: 'Pilar',
    state: 'Alagoas',
    location: 'Pilar, Alagoas',
    type: 'Rádio web local',
    hero: {
      kicker: 'Rádio web local',
      title: 'Rádio L20 Ao Vivo',
      lead:
        'Notícias locais, esporte amador, transmissões ao vivo e programação comunitária para Pilar.',
    },
    livePlayer: {
      idleStatus: 'No ar',
      loadingStatus: 'Carregando',
      playingStatus: 'Tocando agora',
      stationStatus: 'Ao Vivo',
      idleNote: 'Toque no botão para ouvir a Rádio L20 ao vivo.',
      loadingNote: 'Conectando ao streaming da Rádio L20.',
      playingNote: 'Transmissão ao vivo em reprodução.',
      errorMessage: 'Não foi possível carregar a transmissão agora.',
    },
    footer: {
      description: 'Rádio web local de Pilar, Alagoas.',
      note: 'Rádio L20 - Sua rádio web local. Notícias, esporte amador e transmissões ao vivo.',
    },
  },
  sections: {
    news: {
      eyebrow: 'Portal local',
      title: 'Notícias locais',
      description:
        'Chamadas em formato de portal para informar Pilar com clareza, contexto e velocidade.',
    },
    sport: {
      eyebrow: 'Especial',
      title: 'Esporte Amador',
      description:
        'Cobertura local para futebol amador, futsal, jogos, equipes e eventos esportivos da cidade.',
      actionLabel: 'Ver agenda',
    },
    schedule: {
      eyebrow: 'Programação',
      title: 'Agenda de jogos e transmissões',
      description:
        'Grade inicial preparada para publicar eventos, programas e coberturas ao vivo.',
    },
    programs: {
      eyebrow: 'Grade da rádio',
      title: 'Programação da Rádio',
      description:
        'Conteúdos locais, esporte, informação, música e transmissões comunitárias em uma grade preparada para dados reais.',
    },
    advertise: {
      eyebrow: 'Comercial',
      title: 'Anuncie na Rádio L20',
      description:
        'A Rádio L20 aproxima marcas locais de moradores, torcedores, atletas, equipes, famílias e público das transmissões em Pilar.',
    },
    sponsors: {
      eyebrow: 'Apoiadores',
      title: 'Patrocinadores e Apoiadores',
      description:
        'Marcas locais podem apoiar a Rádio L20, a cobertura comunitária e o esporte amador de Pilar.',
    },
    videos: {
      eyebrow: 'YouTube',
      title: 'Vídeos e transmissões',
      description:
        'Espaço preparado para destacar programas, entrevistas e transmissões futuras da Rádio L20 no YouTube.',
    },
    wordOfLife: {
      eyebrow: 'Comunidade',
      title: 'Palavra de Vida',
      description:
        'Mensagens, reflexões e conteúdos comunitários da Rádio L20.',
    },
    jobs: {
      eyebrow: 'Empregos',
      title: 'Vagas de emprego',
      description:
        'Confira as vagas de emprego de Pilar, Delmiro Goveia, Piaçabuçu e cidades vizinhas.',
    },
    contact: {
      eyebrow: 'Contato',
      title: 'Fale com a Rádio L20',
      description:
        'Tem uma notícia, evento ou sugestão de pauta? Fale com a nossa equipe.',
    },
  },
  sportsFeature: {
    category: 'Transmissão esportiva',
    title: 'A emoção do esporte amador com a Rádio L20',
    description:
      'Chamadas de transmissões ao vivo, pré-jogo, entrevistas e cobertura de campo do esporte amador de Pilar.',
    meta: 'Pilar, AL',
    isTemporary: false,
  } satisfies ContentCard,
  amateurSports: [
    {
      category: 'Futebol amador',
      title: 'Times, jogos e bastidores',
      description:
        'Equipes, atletas e partidas do futebol amador local de Pilar.',
      meta: 'Pilar, AL',
      isTemporary: false,
    },
    {
      category: 'Futsal',
      title: 'Quadras e disputas locais',
      description:
        'Jogos de futsal, eventos em ginásios e movimentação das equipes da cidade.',
      meta: 'Pilar, AL',
      isTemporary: false,
    },
    {
      category: 'Campeonatos',
      title: 'Tabela, rodadas e resultados',
      description:
        'Informações de campeonatos, dados oficiais e classificação das equipes.',
      meta: 'Pilar, AL',
      isTemporary: false,
    },
    {
      category: 'Eventos locais',
      title: 'Cobertura esportiva da cidade',
      description:
        'Eventos esportivos comunitários, entrevistas e reportagens especiais.',
      meta: 'Pilar, AL',
      isTemporary: false,
    },
  ] satisfies ContentCard[],
  sportsCallout: {
    title: 'Transmissões esportivas da Rádio L20',
    description:
      'Jogos ao vivo, pré-jogo e cobertura especial no rádio e no YouTube.',
    actionLabel: 'Acompanhar agenda',
    isTemporary: false,
  },
  broadcastSchedule: [
    {
      time: 'Sáb 15h',
      title: 'Pré-jogo da rodada amadora',
      description: 'Acompanhe a rodada do futebol amador de Pilar com a Rádio L20.',
      isTemporary: false,
    },
    {
      time: 'Dom 09h',
      title: 'Mesa esportiva comunitária',
      description: 'Debates e cobertura do esporte amador local.',
      isTemporary: false,
    },
    {
      time: 'Qua 19h',
      title: 'Boletim L20 Notícias',
      description: 'Cobertura local com as principais notícias de Pilar e região.',
      isTemporary: false,
    },
  ] satisfies ScheduleItem[],
  // Programação da rádio: substituir por horários e programas reais quando a grade oficial for definida.
  radioPrograms: [
    {
      name: 'Manhã L20',
      time: '06h às 08h',
      days: 'Segunda a sexta',
      category: 'Notícias',
      description:
        'Resumo local, informações úteis e abertura da programação diária da rádio.',
      isOnAir: true,
      statusLabel: 'No ar',
      isTemporary: true,
    },
    {
      name: 'Giro Local',
      time: '08h às 09h',
      days: 'Segunda a sexta',
      category: 'Comunidade',
      description:
        'Chamadas rápidas sobre cidade, comunidade, serviço e agenda local.',
      isOnAir: false,
      isTemporary: true,
    },
    {
      name: 'Esporte Conectado',
      time: '12h às 13h',
      days: 'Segunda, quarta e sexta',
      category: 'Esporte',
      description:
        'Futebol amador, futsal, agenda de jogos e bastidores do esporte local.',
      isOnAir: false,
      isTemporary: true,
    },
    {
      name: 'Tarde Musical',
      time: '14h às 16h',
      days: 'Segunda a sexta',
      category: 'Música',
      description:
        'Música, entretenimento, recados e participação dos ouvintes.',
      isOnAir: false,
      isTemporary: true,
    },
    {
      name: 'Voz da Comunidade',
      time: '17h às 18h',
      days: 'Terça e quinta',
      category: 'Comunidade',
      description:
        'Entrevistas, histórias locais e pautas comunitárias.',
      isOnAir: false,
      isTemporary: true,
    },
    {
      name: 'Transmissão Esportiva',
      time: 'Horário especial',
      days: 'Fins de semana',
      category: 'Especial',
      description:
        'Jogos, pré-jogo e cobertura esportiva ao vivo do esporte amador.',
      isOnAir: false,
      isTemporary: true,
    },
  ] satisfies ProgramItem[],
  advertise: {
    subtitle:
      'Espaço comercial para comerciantes locais, empresas, prestadores de serviço e apoiadores do esporte amador.',
    audienceText:
      'Sua marca pode aparecer em uma rádio web local com conteúdo de cidade, esporte, informação e cobertura comunitária.',
    localBrandsText:
      'A Rádio L20 oferece espaço para marcas locais se conectarem com a rotina da cidade sem precisar de estrutura complexa.',
    primaryActionLabel: 'Falar pelo WhatsApp',
    secondaryActionLabel: 'Ver contato',
    transmissionTitle: 'Patrocínio em transmissões esportivas',
    transmissionDescription:
      'Destaque sua marca em chamadas de jogos, pré-jogo, cobertura ao vivo e conteúdos ligados ao esporte amador.',
    benefits: [
      {
        title: 'Divulgação em rádio web',
        description:
          'Presença em uma programação digital preparada para notícias, serviços e entretenimento local.',
      },
      {
        title: 'Presença em transmissões esportivas',
        description:
          'Sua marca associada a coberturas, jogos, pré-jogo e conteúdos voltados para torcedores e equipes.',
      },
      {
        title: 'Visibilidade para o público local',
        description:
          'Comunicação pensada para moradores, famílias, atletas, comerciantes e ouvintes de Pilar.',
      },
      {
        title: 'Apoio ao esporte amador',
        description:
          'Fortaleça iniciativas ligadas ao futebol amador, futsal e eventos esportivos comunitários.',
      },
      {
        title: 'Fortalecimento da marca na cidade',
        description:
          'Apareça em um ambiente jornalístico, esportivo e comunitário alinhado com a rotina local.',
      },
      {
        title: 'Possibilidade de banners no site',
        description:
          'Espaços visuais preparados para campanhas, marcas parceiras e apoiadores em etapas futuras.',
      },
    ] satisfies AdvertiseBenefit[],
    isTemporary: true,
  },
  // Patrocinadores mockados: substituir por marcas, logos e links reais somente quando houver confirmação.
  temporarySponsors: [
    {
      name: 'Sua Marca Aqui',
      category: 'Patrocinador',
      initials: 'SM',
      note: 'Exemplo temporário',
      isTemporary: true,
    },
    {
      name: 'Comércio Local',
      category: 'Comércio',
      initials: 'CL',
      note: 'Exemplo temporário',
      isTemporary: true,
    },
    {
      name: 'Parceiro do Esporte',
      category: 'Esporte amador',
      initials: 'PE',
      note: 'Exemplo temporário',
      isTemporary: true,
    },
    {
      name: 'Apoio Cultural',
      category: 'Comunidade',
      initials: 'AC',
      note: 'Exemplo temporário',
      isTemporary: true,
    },
  ] satisfies SponsorItem[],
  sponsorBanners: [
    {
      title: 'Banner comercial principal',
      description:
        'Espaço visual preparado para campanhas, marcas parceiras e chamadas de anunciantes locais.',
      label: 'Exemplo temporário',
      isTemporary: true,
    },
    {
      title: 'Apoio às transmissões esportivas',
      description:
        'Área para destacar apoiadores de jogos, pré-jogo e conteúdos do esporte amador.',
      label: 'Exemplo temporário',
      isTemporary: true,
    },
  ] satisfies SponsorBanner[],
  sponsorCallout: {
    title: 'Quer apoiar a Rádio L20?',
    description:
      'Comerciantes, empresas, prestadores de serviço e apoiadores podem ocupar espaços comerciais no site e nas transmissões.',
    actionLabel: 'Chamar no WhatsApp',
    isTemporary: true,
  },
  // Vídeos mockados: substituir por vídeos reais do YouTube quando houver curadoria/publicação.
  videos: {
    feature: {
      category: 'Canal oficial',
      title: 'Vídeos e Transmissões',
      description:
        'A Rádio L20 também está no YouTube com espaço para lives, esporte amador, cobertura local e programas em vídeo.',
      primaryActionLabel: 'Acessar canal oficial',
      secondaryActionLabel: 'Sugerir pauta pelo WhatsApp',
    },
    liveHighlight: {
      category: 'Ao vivo',
      title: 'Transmissões ao vivo da Rádio L20',
      description:
        'Bloco preparado para destacar lives esportivas, coberturas comunitárias e entradas especiais quando houver programação confirmada.',
      note: 'Exemplo temporário',
      isTemporary: true,
    },
    subscribeCallout: {
      title: 'Inscreva-se no canal da Rádio L20',
      description:
        'Acompanhe novas transmissões, conteúdos locais e programas em vídeo pelo canal oficial no YouTube.',
      actionLabel: 'Inscrever-se no YouTube',
    },
    cards: [
      {
        category: 'Transmissões esportivas',
        title: 'Jogos, pré-jogo e cobertura esportiva',
        description:
          'Card temporário para lives de futebol amador, futsal e eventos esportivos locais.',
        note: 'Exemplo temporário',
        isTemporary: true,
      },
      {
        category: 'Notícias locais',
        title: 'Boletins e entrevistas da cidade',
        description:
          'Área reservada para vídeos jornalísticos e chamadas de notícias apuradas sobre Pilar.',
        note: 'Exemplo temporário',
        isTemporary: true,
      },
      {
        category: 'Programas da rádio',
        title: 'Quadros e programação comunitária',
        description:
          'Espaço preparado para programas, conversas com convidados e conteúdos da Rádio L20.',
        note: 'Exemplo temporário',
        isTemporary: true,
      },
      {
        category: 'Cobertura de eventos',
        title: 'Eventos locais e ações comunitárias',
        description:
          'Card temporário para futuras coberturas em vídeo de eventos da cidade e ações locais.',
        note: 'Exemplo temporário',
        isTemporary: true,
      },
    ] satisfies VideoCardItem[],
  },
  contact: {
    intro:
      'A Rádio L20 está próxima da comunidade, dos bairros, dos atletas e dos eventos locais.',
    primaryCard: {
      eyebrow: 'Atendimento',
      title: 'Chame a Rádio L20 no WhatsApp',
      description:
        'Envie sua mensagem para falar com a equipe, sugerir pauta, pedir cobertura ou tratar de anúncios.',
      actionLabel: 'Chamar no WhatsApp',
    } satisfies ContactCardItem,
    channels: [
      {
        eyebrow: 'WhatsApp',
        title: 'Fale diretamente com a rádio',
        description:
          'Canal principal para contato rápido com a equipe da Rádio L20.',
        actionLabel: 'Chamar no WhatsApp',
      },
      {
        eyebrow: 'Instagram',
        title: 'Acompanhe os bastidores',
        description:
          'Siga a Rádio L20 para novidades, chamadas e movimentação da programação.',
        actionLabel: 'Seguir no Instagram',
      },
      {
        eyebrow: 'YouTube',
        title: 'Lives e transmissões',
        description:
          'Veja conteúdos em vídeo, programas e transmissões no canal oficial.',
        actionLabel: 'Ver canal no YouTube',
      },
    ] satisfies ContactCardItem[],
    topics: [
      {
        eyebrow: 'Sugestão de pauta',
        title: 'Notícias da cidade',
        description:
          'Envie informações, histórias, avisos comunitários e temas relevantes para Pilar.',
      },
      {
        eyebrow: 'Cobertura de eventos',
        title: 'Eventos locais',
        description:
          'Fale com a rádio sobre eventos comunitários, ações da cidade e coberturas especiais.',
      },
      {
        eyebrow: 'Comercial',
        title: 'Anúncios e apoios',
        description:
          'Quer divulgar sua marca, apoiar o esporte amador ou anunciar na programação? Entre em contato.',
      },
    ] satisfies ContactCardItem[],
    communityCallout: {
      title: 'Esporte amador, notícias e eventos locais',
      description:
        'A Rádio L20 abre espaço para pautas da comunidade, cobertura esportiva, eventos da cidade e marcas que querem se aproximar do público local.',
    },
  },
  wordOfLife: {
    title: 'Conteúdo comunitário',
    description:
      'Mensagens, reflexões e quadros especiais da Rádio L20 para a comunidade de Pilar.',
    note: 'Rádio L20',
    isTemporary: false,
  },
  jobs: {
    title: 'Vagas de emprego',
    description:
      'Encontre oportunidades de trabalho em Pilar, Delmiro Goveia, Piaçabuçu e região.',
    emptyState: 'Nenhuma vaga publicada no momento. Volte em breve!',
    filterPlaceholder: 'Filtrar por cidade ou tipo...',
  },
} as const
