export type HoroscopeSign = {
  name: string
  period: string
  element: string
  message: string
  details: {
    love: string
    work: string
    health: string
    advice: string
  }
}

export const horoscopeContent = {
  title: 'Horóscopo',
  subtitle: 'Confira mensagens diárias para cada signo.',
  note: 'Conteúdo de entretenimento.',
  signs: [
    {
      name: 'Áries',
      period: '21/03 a 20/04',
      element: 'Fogo',
      message: 'O dia favorece atitude, mas pede cuidado com decisões impulsivas.',
      details: {
        love: 'Demonstre interesse com clareza e escute antes de responder.',
        work: 'Organize prioridades antes de assumir novas tarefas.',
        health: 'Movimente o corpo, mas respeite seus limites.',
        advice: 'Direcione sua energia para o que realmente importa.',
      },
    },
    {
      name: 'Touro',
      period: '21/04 a 20/05',
      element: 'Terra',
      message: 'Um ritmo mais estável ajuda você a tomar decisões melhores.',
      details: {
        love: 'Gestos simples fortalecem a confiança.',
        work: 'Atenção aos detalhes pode evitar retrabalho.',
        health: 'Cuide da alimentação e desacelere quando possível.',
        advice: 'Valorize constância mais do que pressa.',
      },
    },
    {
      name: 'Gêmeos',
      period: '21/05 a 20/06',
      element: 'Ar',
      message: 'Conversas importantes podem abrir novos caminhos.',
      details: {
        love: 'Fale com leveza e evite ruídos de comunicação.',
        work: 'Boas ideias surgem quando você troca informações.',
        health: 'Descanse a mente entre uma tarefa e outra.',
        advice: 'Use sua curiosidade para construir pontes.',
      },
    },
    {
      name: 'Câncer',
      period: '21/06 a 22/07',
      element: 'Água',
      message: 'O dia pede acolhimento, mas também limites claros.',
      details: {
        love: 'Atenção e presença contam mais do que grandes palavras.',
        work: 'Evite carregar responsabilidades que não são suas.',
        health: 'Reserve tempo para recuperar energia emocional.',
        advice: 'Cuide de si com a mesma dedicação que oferece aos outros.',
      },
    },
    {
      name: 'Leão',
      period: '23/07 a 22/08',
      element: 'Fogo',
      message: 'Sua presença ganha destaque quando vem acompanhada de escuta.',
      details: {
        love: 'Valorize o diálogo e compartilhe bons momentos.',
        work: 'Mostre suas ideias com objetividade.',
        health: 'Atividades criativas podem aliviar tensões.',
        advice: 'Brilhe sem apagar o espaço de ninguém.',
      },
    },
    {
      name: 'Virgem',
      period: '23/08 a 22/09',
      element: 'Terra',
      message: 'Organização ajuda, mas evite cobrar perfeição de tudo.',
      details: {
        love: 'Pequenos cuidados deixam o vínculo mais leve.',
        work: 'Revise processos e simplifique o que estiver pesado.',
        health: 'Rotina equilibrada favorece bem-estar.',
        advice: 'Faça o possível com serenidade.',
      },
    },
    {
      name: 'Libra',
      period: '23/09 a 22/10',
      element: 'Ar',
      message: 'Buscar equilíbrio será mais produtivo do que agradar a todos.',
      details: {
        love: 'Converse sobre expectativas com honestidade.',
        work: 'Parcerias podem render bons resultados.',
        health: 'Ambientes tranquilos ajudam na concentração.',
        advice: 'Escolha com firmeza, mesmo quando houver várias opções.',
      },
    },
    {
      name: 'Escorpião',
      period: '23/10 a 21/11',
      element: 'Água',
      message: 'Intuição em alta, mas confirme informações antes de agir.',
      details: {
        love: 'Evite guardar incômodos por muito tempo.',
        work: 'Foco e discrição ajudam em assuntos delicados.',
        health: 'Respiração e pausa ajudam a reduzir intensidade.',
        advice: 'Transforme intensidade em estratégia.',
      },
    },
    {
      name: 'Sagitário',
      period: '22/11 a 21/12',
      element: 'Fogo',
      message: 'O desejo de movimento cresce, mas planejar evita tropeços.',
      details: {
        love: 'Leveza combina com sinceridade.',
        work: 'Explore ideias novas sem perder prazos de vista.',
        health: 'Atividades ao ar livre podem renovar o ânimo.',
        advice: 'Avance, mas leve um mapa.',
      },
    },
    {
      name: 'Capricórnio',
      period: '22/12 a 20/01',
      element: 'Terra',
      message: 'Responsabilidade será aliada quando houver espaço para descanso.',
      details: {
        love: 'Demonstre afeto também nas pequenas pausas.',
        work: 'Metas realistas deixam o dia mais produtivo.',
        health: 'Evite acumular tensão por excesso de cobrança.',
        advice: 'Persistência também precisa de respiro.',
      },
    },
    {
      name: 'Aquário',
      period: '21/01 a 19/02',
      element: 'Ar',
      message: 'Ideias diferentes podem encontrar boa recepção se forem bem explicadas.',
      details: {
        love: 'Respeite diferenças e abra espaço para diálogo.',
        work: 'Inovação funciona melhor com organização.',
        health: 'Mude a rotina de forma leve para renovar energia.',
        advice: 'Originalidade fica mais forte quando vira ação concreta.',
      },
    },
    {
      name: 'Peixes',
      period: '20/02 a 20/03',
      element: 'Água',
      message: 'Sensibilidade ajuda a perceber nuances, mas mantenha os pés no chão.',
      details: {
        love: 'Carinho e escuta fortalecem conexões.',
        work: 'Anote ideias para não se perder em muitas possibilidades.',
        health: 'Momentos de silêncio podem restaurar seu equilíbrio.',
        advice: 'Sonhe, mas dê um passo prático hoje.',
      },
    },
  ] satisfies HoroscopeSign[],
} as const
