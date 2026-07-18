export type ProgramContent = {
  slug: string
  name: string
  slogan: string
  description: string
  focus: string
  highlightLabel: string
  logoPath: string
  blocks: Array<{
    eyebrow: string
    title: string
    text: string
  }>
  closingNote: string
}

export const radioPrograms = [
  {
    slug: 'esporte-conectado',
    name: 'Esporte Conectado',
    slogan: 'O esporte local em foco',
    description:
      'Programa voltado para notícias, bastidores, agenda de jogos e transmissões ligadas ao esporte da cidade.',
    focus: 'Cobertura esportiva, resultados, entrevistas e chamadas ao vivo.',
    highlightLabel: 'Esporte',
    logoPath: '/esporte-conectado.svg',
    blocks: [
      {
        eyebrow: 'Cobertura local',
        title: 'Resultados, bastidores e agenda',
        text: 'Mostra o que está acontecendo no esporte amador da cidade, com placar, próxima rodada e contexto para o torcedor entender o momento dos times.',
      },
      {
        eyebrow: 'Ao vivo',
        title: 'Voz de quem está no jogo',
        text: 'Traz entrevistas curtas com atletas, técnicos e organizadores, além de entradas rápidas durante eventos e transmissões especiais.',
      },
    ],
    closingNote: 'Aqui a ideia é sentir clima de arquibancada, urgência de notícia e identidade esportiva local.',
  },
  {
    slug: 'palavra-de-vida',
    name: 'Programa Palavra de Vida',
    slogan: 'Mensagem, fé e reflexão',
    description:
      'Espaço dedicado a mensagens de fé, reflexão e conteúdo comunitário para começar ou encerrar o dia.',
    focus: 'Devocional, reflexão, mensagens especiais e conteúdo espiritual.',
    highlightLabel: 'Reflexão',
    logoPath: '/palavra-de-vida.svg',
    blocks: [
      {
        eyebrow: 'Mensagem',
        title: 'Palavra para começar o dia',
        text: 'Mostra uma reflexão curta, acolhedora e prática, com foco em esperança, fé e rotina da comunidade.',
      },
      {
        eyebrow: 'Comunidade',
        title: 'Conteúdo que aproxima',
        text: 'Traz espaço para pedidos, mensagens especiais, leitura de textos e participação de ouvintes com tom leve e respeitoso.',
      },
    ],
    closingNote: 'Esse programa deve soar sereno, humano e com cara de momento de pausa dentro da programação.',
  },
  {
    slug: 'sem-freio',
    name: 'Sem Freio',
    slogan: 'Energia e entretenimento',
    description:
      'Programa com clima leve, musical e descontraído, pensado para dar ritmo à programação da rádio.',
    focus: 'Música, participação do ouvinte e quadros de entretenimento.',
    highlightLabel: 'Show',
    logoPath: '/sem-freio.svg',
    blocks: [
      {
        eyebrow: 'Entretenimento',
        title: 'Ritmo, música e interação',
        text: 'Mostra um programa mais solto, com músicas, brincadeiras e participação do público para manter energia alta no ar.',
      },
      {
        eyebrow: 'Quadros',
        title: 'Momentos rápidos e dinâmicos',
        text: 'Pode exibir chamadas curtas, enquetes, recados e blocos de destaque para deixar a página mais viva e divertida.',
      },
    ],
    closingNote: 'A identidade ideal aqui é mais vibrante, moderna e divertida, com sensação de movimento constante.',
  },
  {
    slug: 'central-l20',
    name: 'Central L20',
    slogan: 'Informação e utilidade pública',
    description:
      'Programa central com notícias, avisos, utilidade pública e entradas mais importantes do dia.',
    focus: 'Notícias, serviço, avisos e chamadas da cidade.',
    highlightLabel: 'Informativo',
    logoPath: '/central-l20.svg',
    blocks: [
      {
        eyebrow: 'Notícia',
        title: 'O centro da informação',
        text: 'Aqui entra o resumo mais importante do dia, com manchetes, avisos e tudo que precisa estar em evidência na rádio.',
      },
      {
        eyebrow: 'Serviço',
        title: 'Utilidade pública e chamada local',
        text: 'Mostra alertas, recados da cidade, agenda comunitária e conteúdo que ajuda o ouvinte a se localizar rápido.',
      },
    ],
    closingNote: 'Esse programa pede presença forte, visual sério e leitura rápida para quem quer informação sem perder tempo.',
  },
  {
    slug: 'conectado-com-deus',
    name: 'Conectado com Deus',
    slogan: 'Mensagem de esperança',
    description:
      'Momento especial com mensagens de fé, esperança, oração e conteúdo espiritual para a comunidade.',
    focus: 'Fé, oração, reflexão e mensagens especiais.',
    highlightLabel: 'Espiritual',
    logoPath: '/conectado-com-deus.svg',
    blocks: [
      {
        eyebrow: 'Fé',
        title: 'Esperança e oração',
        text: 'Mostra mensagens de fé, devocionais e reflexões que criam um ambiente acolhedor e respeitoso.',
      },
      {
        eyebrow: 'Palavra',
        title: 'Momento de edificação',
        text: 'Pode trazer trechos bíblicos, pensamentos do dia e chamadas para escuta atenta e participação da comunidade.',
      },
    ],
    closingNote: 'A página deve transmitir paz, clareza e confiança, sem excesso visual.',
  },
  {
    slug: 'programa-do-val',
    name: 'Programa do Val',
    slogan: 'A voz de quem conhece a comunidade',
    description:
      'Programa com espaço para conversa, informação, participação do ouvinte e conteúdo local apresentado pelo Val.',
    focus: 'Entrevistas, participação popular, avisos e temas da cidade.',
    highlightLabel: 'Apresentação',
    logoPath: '/programa-do-val.svg',
    blocks: [
      {
        eyebrow: 'Apresentação',
        title: 'A voz do programa',
        text: 'Mostra o Val como centro da experiência, com conteúdo mais pessoal, conversa direta e sensação de proximidade.',
      },
      {
        eyebrow: 'Interação',
        title: 'Ouvinte participando',
        text: 'Inclui espaço para recados, perguntas, opinião popular e assuntos que puxam a comunidade para dentro do programa.',
      },
    ],
    closingNote: 'Essa página deve parecer acolhedora e pessoal, como um programa de conversa com identidade própria.',
  },
] satisfies Array<ProgramContent>

export function getProgramBySlug(slug: string) {
  return radioPrograms.find((program) => program.slug === slug) ?? null
}

export function getProgramLabelBySlug(slug?: string) {
  if (!slug) {
    return ''
  }

  return getProgramBySlug(slug)?.name ?? ''
}
