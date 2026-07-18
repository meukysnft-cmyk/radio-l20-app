export type AdminModule = {
  icon: string
  name: string
  description: string
  status: string
}

export const adminContent = {
  title: 'Administrador',
  subtitle: 'Central de controle da Rádio L20',
  notice: 'Área administrativa em desenvolvimento.',
  modules: [
    {
      icon: '📝',
      name: 'Publicações',
      description: 'Gerenciar avisos, chamadas e conteúdos rápidos do site.',
      status: 'Em breve',
    },
    {
      icon: '📰',
      name: 'Notícias',
      description: 'Cadastrar e atualizar notícias locais da Rádio L20.',
      status: 'Em breve',
    },
    {
      icon: '⚽',
      name: 'Esporte Amador',
      description: 'Organizar conteúdos, times, jogos e chamadas esportivas.',
      status: 'Em breve',
    },
    {
      icon: '🛡️',
      name: 'Times e Escudos',
      description: 'Cadastre times e informe o link da logo para exibição no site/app.',
      status: 'Em breve',
    },
    {
      icon: '📅',
      name: 'Agenda',
      description: 'Controlar jogos, eventos e transmissões programadas.',
      status: 'Em breve',
    },
    {
      icon: '🎙️',
      name: 'Programação',
      description: 'Editar programas, horários e categorias da grade.',
      status: 'Em breve',
    },
    {
      icon: '▶️',
      name: 'Vídeos',
      description: 'Destacar lives, programas e transmissões do YouTube.',
      status: 'Em breve',
    },
    {
      icon: '✨',
      name: 'Horóscopo',
      description: 'Atualizar mensagens de entretenimento para os signos.',
      status: 'Em breve',
    },
    {
      icon: '🤝',
      name: 'Patrocinadores',
      description: 'Gerenciar espaços de marcas, apoiadores e banners.',
      status: 'Em breve',
    },
    {
      icon: '💼',
      name: 'Anuncie Conosco',
      description: 'Editar textos comerciais e chamadas para anunciantes.',
      status: 'Em breve',
    },
    {
      icon: '🔗',
      name: 'Links e redes sociais',
      description: 'Manter Instagram, YouTube, WhatsApp e links oficiais.',
      status: 'Em breve',
    },
    {
      icon: '📻',
      name: 'Player da rádio',
      description: 'Visualizar status e configurações do streaming ao vivo.',
      status: 'Em breve',
    },
    {
      icon: '🎨',
      name: 'Cores e identidade visual',
      description: 'Preparar ajustes de marca, cores e identidade do app.',
      status: 'Em breve',
    },
    {
      icon: '⚙️',
      name: 'Configurações do app',
      description: 'Centralizar preferências futuras do PWA e do site.',
      status: 'Em breve',
    },
  ] satisfies AdminModule[],
  nextSteps: [
    'Login seguro',
    'Cadastro de notícias',
    'Edição de programação',
    'Gerenciamento de patrocinadores',
    'Alteração de cores do app',
    'Publicação de avisos',
  ],
} as const
