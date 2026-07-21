export type SignProfile = {
  slug: string
  name: string
  symbol: string
  element: string
  period: string
  rulingPlanet: string
  luckyDay: string
  luckyNumber: string
  color: string
  compatibility: string
  summary: string
  personality: string
  strengths: string[]
  weaknesses: string[]
  love: string
  work: string
  health: string
  friendship: string
  elementalAdvice: string
}

export const SIGN_PROFILES: SignProfile[] = [
  {
    slug: 'aries', name: 'Áries', symbol: '♈', element: 'Fogo', period: '21/03 a 20/04',
    rulingPlanet: 'Marte', luckyDay: 'Terça-feira', luckyNumber: '9', color: 'Vermelho',
    compatibility: 'Leão, Sagitário, Gêmeos',
    summary: 'O primeiro signo do zodíaco, Áries representa início, coragem e energia pura. Pessoas nascidas sob este signo são pioneiras por natureza, sempre prontas para encarar novos desafios com entusiasmo e determinação.',
    personality: 'Áries é impulsivo, apaixonado e cheio de vida. Gosta de liderar e não tem medo de arriscar. Sua energia é contagiante, mas pode ser vista como impulsividade quando não canalizada. É direto, leal e protetor dos que ama.',
    strengths: ['Corajoso', 'Determinado', 'Enérgico', 'Honesto', 'Líder nato'],
    weaknesses: ['Impulsivo', 'Impaciente', 'Agressivo', 'Teimoso', 'Inquieto'],
    love: 'Em relacionamentos, Áries é intenso e apaixonado. Precisa de alguém que aguente seu ritmo e que admire sua determinação. É protetor e leal, mas precisa aprender a escutar e ter paciência.',
    work: 'Nasce para liderar. Funciona melhor em ambientes dinâmicos onde pode tomar decisões rápidas. Empreendedorismo e carreiras que exigem ação são ideais para ele.',
    health: 'Muita energia que precisa ser canalizada. Exercícios físicos intensos são fundamentais. Cuidado com acidentes e inflamações, comuns neste signo.',
    friendship: 'Amigo leal e protetor. Está presente nos momentos difíceis e sempre oferece uma solução prática. Pode ser direto demais, mas nunca com má intenção.',
    elementalAdvice: 'Seu elemento Fogo te dá uma chama interior que nunca se apaga. Use essa energia para construir, não para destruir. Aprenda a pausar antes de agir.',
  },
  {
    slug: 'touro', name: 'Touro', symbol: '♉', element: 'Terra', period: '21/04 a 20/05',
    rulingPlanet: 'Vênus', luckyDay: 'Sexta-feira', luckyNumber: '6', color: 'Verde',
    compatibility: 'Virgem, Capricórnio, Câncer',
    summary: 'Touro é o signo da estabilidade, sensibilidade e prazeres da vida. Leal e paciente, valoriza o conforto, a natureza e os laços que constrói ao longo do tempo.',
    personality: 'Prático, confiável e determinado. Touro não corre atrás de nada — ele caminha com firmeza. Gosta de segurança material e emocional. É generoso com quem ama, mas não perdoa traições.',
    strengths: ['Leal', 'Paciente', 'Confiável', 'Generoso', 'Prático'],
    weaknesses: ['Teimoso', 'Materialista', 'Ciumento', 'Resistente a mudanças', 'Possessivo'],
    love: 'Touro é romântico e constante. Busca parcerias duradouras baseadas em confiança mútua. É sensual e atencioso, mas precisa de segurança para se entregar completamente.',
    work: 'Excelente em trabalhos que exigem consistência e atenção aos detalhes. Finanças, gastronomia, arte e áreas ligadas à natureza são onde mais brilha.',
    health: 'Precisa de uma rotina equilibrada. Cuidado com alimentação excessiva e resistência a mudanças de hábito. Exercícios regulares mantêm o corpo e a mente saudáveis.',
    friendship: 'Amigo para toda a vida. Touro lembra de datas importantes, presenteia com cuidado e está sempre disponível. Valoriza amizades de longa data.',
    elementalAdvice: 'Sua Terra te ancora e te dá força. Use essa base para cultivar o que é realmente importante. Não tenha medo de mudar quando necessário.',
  },
  {
    slug: 'gemeos', name: 'Gêmeos', symbol: '♊', element: 'Ar', period: '21/05 a 20/06',
    rulingPlanet: 'Mercúrio', luckyDay: 'Quarta-feira', luckyNumber: '5', color: 'Amarelo',
    compatibility: 'Libra, Aquário, Áries',
    summary: 'Gêmeos é o signo da comunicação, curiosidade e versatilidade. Duas faces de uma mesma moeda — intelectualmente brilhante e socialmente envolvente.',
    personality: 'Esperto, adaptável e comunicativo. Gêmeos tem uma mente ágil e consegue se situar em qualquer ambiente. Pode ser inquieto e disperso, mas sua capacidade de aprender é impressionante.',
    strengths: ['Comunicativo', 'Versátil', 'Esperto', 'Curioso', 'Adaptável'],
    weaknesses: ['Indeciso', 'Superficial', 'Inquieto', 'Dual', 'Ansioso'],
    love: 'Precisa de estímulo intelectual e emocional. Gêmeos se apaixona pela mente da outra pessoa. Pode ter dificuldade em se comprometer, mas quando encontra o parceiro certo, é fiel e divertido.',
    work: 'Brilha em comunicação, vendas, mídia, ensino e qualquer área que exija criatividade e interação social. Odeia rotina monótona.',
    health: 'Mente acelerada pode gerar ansiedade. Precisa de atividades que acalmem: leitura, meditação, conversas profundas. Cuidado com o sistema nervoso.',
    friendship: 'O amigo que conhece todo mundo. Gêmeos é a alma das festas e sempre traz uma boa história. Pode ser inconstante, mas sua energia é contagiante.',
    elementalAdvice: 'Seu elemento Ar te dá leveza e perspectiva. Use sua mente para conectar pessoas e ideias. Aprenda a se aprofundar antes de pular para o próximo assunto.',
  },
  {
    slug: 'cancer', name: 'Câncer', symbol: '♋', element: 'Água', period: '21/06 a 22/07',
    rulingPlanet: 'Lua', luckyDay: 'Segunda-feira', luckyNumber: '2', color: 'Branco',
    compatibility: 'Peixes, Escorpião, Touro',
    summary: 'Câncer é o signo da proteção, lar e emocionalidade profunda. Regido pela Lua, é sensível, intuitivo e profundamente ligado aos laços familiares.',
    personality: 'Protetor, sentimental e intuitivo. Câncer cria uma concha dura por fora, mas por dentro é extremamente sensível. Valoriza o lar, a família e os rituais que trazem conforto.',
    strengths: ['Protetor', 'Intuitivo', 'Leal', 'Empático', 'Criativo'],
    weaknesses: ['Choroso', 'Manipulador', 'Resentido', 'Inseguro', 'Indeciso'],
    love: 'Câncer ama com a alma. Busca segurança emocional e um parceiro que valorize a família. É romântico, cuidadoso e extremamente leal quando se sente seguro.',
    work: 'Excelente em áreas que envolvem cuidar dos outros: enfermagem, psicologia, educação, gastronomia. O ambiente de trabalho precisa ser acolhedor.',
    health: 'Muita energia emocional pode se manifestar fisicamente. Cuidado com o estômago e seios. Exercícios aquáticos são ideais.',
    friendship: 'Amigo de coração. Câncer prepara a comida, ouve seus problemas e nunca esquece seu aniversário. É o amigo que vira família.',
    elementalAdvice: 'Sua Água te dá profundidade emocional. Use sua intuição para guiar seus passos. Não tenha vergonha de sentir — suas emoções são sua força.',
  },
  {
    slug: 'leao', name: 'Leão', symbol: '♌', element: 'Fogo', period: '23/07 a 22/08',
    rulingPlanet: 'Sol', luckyDay: 'Domingo', luckyNumber: '1', color: 'Dourado',
    compatibility: 'Áries, Sagitário, Libra',
    summary: 'Leão é o signo do brilho, liderança e generosidade. Regido pelo Sol, é o centro de atenção onde quer que vá, com um coração generoso por trás da confiança.',
    personality: 'Carismático, generoso e orgulhoso. Leão quer ser admirado e reconhecido. É leal e protetor com seus entes queridos, mas pode ser dramático e vaidoso.',
    strengths: ['Carismático', 'Generoso', 'Líder', 'Criativo', 'Determinado'],
    weaknesses: ['Orgulhoso', 'Teimoso', 'Dramático', 'Vaidoso', 'Egoísta'],
    love: 'Leão ama com intensidade e quer ser amado da mesma forma. É romântico, generoso e protetor. Precisa de um parceiro que admire sua luz sem competir com ela.',
    work: 'Nasceu para liderar e brilhar. Artes, entretenimento, política, gestão — qualquer área que permita ser reconhecido. Não funciona bem em subordinação.',
    health: 'Precisa de atividades que alimentem seu ego saudável. Exercícios que envolvamPerformance e estética são ideais. Cuidado com o coração e a coluna.',
    friendship: 'O amigo que organiza tudo e sempre paga a conta. Leão é generoso e leal, mas espera reciprocidade. Não aceita ser ignorado.',
    elementalAdvice: 'Seu elemento Fogo te torna luminoso. Use essa luz para iluminar o caminho dos outros. A humildade não apaga seu brilho — ela o multiplica.',
  },
  {
    slug: 'virgem', name: 'Virgem', symbol: '♍', element: 'Terra', period: '23/08 a 22/09',
    rulingPlanet: 'Mercúrio', luckyDay: 'Quarta-feira', luckyNumber: '5', color: 'Verde',
    compatibility: 'Touro, Capricórnio, Câncer',
    summary: 'Virgem é o signo da precisão, análise e serviço. Prática e observadora, é a perfeccionista do zodíaco com um coração generoso escondido atrás da critica.',
    personality: 'Analítica, meticulosa e humilde. Virgem nota detalhes que ninguém vê. É trabalhadora incansável e busca a perfeição em tudo que faz, às vezes custo da própria saúde.',
    strengths: ['Meticulosa', 'Trabalhadora', 'Confiável', 'Prática', 'Analítica'],
    weaknesses: ['Crítica', 'Perfeccionista', 'Ansiosa', 'Insegura', 'Reclamona'],
    love: 'Virgem demonstra amor através de atos, não de palavras. É dedicada e leal, mas precisa aprender a relaxar e aceitar imperfeições no parceiro.',
    work: 'Excepcional em áreas que exigem precisão: saúde, administração, tecnologia, contabilidade. Sua atenção aos detalhes é uma vantagem competitiva.',
    health: 'Pode ser excessivamente autocobrante. Precisa de atividades que relaxem a mente: yoga, caminhada, meditação. Cuidado com problemas intestinais e pele.',
    friendship: 'O amigo que te dá conselhos honestos. Virgem é leal e prática, sempre disposta a ajudar com problemas reais, não só com papo furado.',
    elementalAdvice: 'Sua Terra te dá fundamentos sólidos. Use sua análise para melhorar o que é importante, mas não se perca em detalhes que não mudam nada.',
  },
  {
    slug: 'libra', name: 'Libra', symbol: '♎', element: 'Ar', period: '23/09 a 22/10',
    rulingPlanet: 'Vênus', luckyDay: 'Sexta-feira', luckyNumber: '6', color: 'Rosa',
    compatibility: 'Gêmeos, Aquário, Leão',
    summary: 'Libra é o signo da harmonia, justiça e beleza. Diplomata e encantador, busca equilíbrio em todas as áreas da vida e tem um senso estético apurado.',
    personality: 'Social, diplomático e encantador. Libra é o medíador natural do grupo. Gosta de harmonia e pode ter dificuldade em tomar decisões por medo de desagradar.',
    strengths: ['Diplomático', 'Justo', 'Encantador', 'Social', 'Artístico'],
    weaknesses: ['Indeciso', 'Confronto-evitante', 'Superficial', 'Vaidoso', 'Passivo-agressivo'],
    love: 'Libra é o romântico do zodíaco. Busca uma parceria equilibrada e bonita. É gentil, atencioso e sempre procura o consenso. Precisa de um parceiro que tome decisões.',
    work: 'Brilha em áreas que envolvem pessoas, estética e justiça: direito, artes, diplomacia, design, relações públicas. Precisa de um ambiente harmonioso.',
    health: 'O estresse por desequilíbrios pode afetar rins e pele. Precisa de rotina equilibrada: sono regular, alimentação leve e exercícios moderados.',
    friendship: 'O amigo que faz a paz entre todos. Libra une grupo, organiza encontros e sempre vê o melhor de cada pessoa. Pode ser superficial, mas é muito querido.',
    elementalAdvice: 'Seu Ar te dá visão ampla. Use sua capacidade de ver os dois lados para criar pontes. Mas lembre: escolher um lado também é uma forma de justiça.',
  },
  {
    slug: 'escorpiao', name: 'Escorpião', symbol: '♏', element: 'Água', period: '23/10 a 21/11',
    rulingPlanet: 'Plutão', luckyDay: 'Terça-feira', luckyNumber: '8', color: 'Vermelho escuro',
    compatibility: 'Câncer, Peixes, Virgem',
    summary: 'Escorpião é o signo da intensidade, transformação e profundidade. Misterioso e poderoso, é capaz de ver além das aparências e se reinventar completamente.',
    personality: 'Intenso, determinado e misterioso. Escorpião vive tudo no máximo. É extremamente leal, mas não perdoa traições. Sua capacidade de regeneração é impressionante.',
    strengths: ['Intenso', 'Determinado', 'Leal', 'Intuitivo', 'Corajoso'],
    weaknesses: ['Ciumento', 'Vingativo', 'Secretivo', 'Manipulador', 'Teimoso'],
    love: 'Escorpião ama com intensidade total. É o signo mais apaixonado do zodíaco. Busca uma conexão profunda e não se contenta com superficialidade. Pode ser possessivo.',
    work: 'Excelente em investigação, psicologia, medicina, finanças e qualquer área que exija profundidade e investigação. Não tolera mentiras.',
    health: 'A intensidade emocional pode se manifestar fisicamente. Cuidado com o sistema reprodutor e urinário. Exercícios que liberem tensão são essenciais.',
    friendship: 'Amigo para sempre e para tudo. Escorpião guarda segredos como ninguém e é o melhor confidente. Mas se te trair, nunca mais será o mesmo.',
    elementalAdvice: 'Sua Água te dá profundidade transformadora. Use essa intensidade para se reconstruir sempre que necessário. Aprenda a soltar — nem tudo precisa ser controle.',
  },
  {
    slug: 'sagitario', name: 'Sagitário', symbol: '♐', element: 'Fogo', period: '22/11 a 21/12',
    rulingPlanet: 'Júpiter', luckyDay: 'Quinta-feira', luckyNumber: '3', color: 'Azul',
    compatibility: 'Áries, Leão, Aquário',
    summary: 'Sagitário é o signo da aventura, liberdade e filosofia. O explorador do zodíaco, sempre em busca de novas experiências e verdades universais.',
    personality: 'Aventureiro, otimista e filosófico. Sagitário odeia ser preso. É entusiasta, honesto ao extremo e tem um senso de humor irresistible. Vê o mundo como um campo de possibilidades.',
    strengths: ['Aventureiro', 'Otimista', 'Filosófico', 'Honesto', 'Generoso'],
    weaknesses: ['Desatento', 'Irresponsável', 'Impaciente', 'Exagerado', 'Inconsistente'],
    love: 'Sagitário precisa de liberdade até dentro de um relacionamento. É leal, mas não possessivo. Busca um parceiro que também queira explorar o mundo.',
    work: 'Viajante, professor, escritor, empreendedor. Precisa de flexibilidade e significado no que faz. Rotinas engessadas são sua prisão.',
    health: 'Exercícios ao ar livre são ideais. Precisa de movimento constante. Cuidado com fígado e quadris. Uma boa viagem pode ser remédio para a alma.',
    friendship: 'O amigo que te arrasta para aventuras. Sagitário é o animador do grupo, sempre com uma ideia maluca e uma história épica para contar.',
    elementalAdvice: 'Seu Fogo te dá a chama da curiosidade. Use essa energia para explorar, aprender e crescer. Mas lembre: a liberdade vem com responsabilidade.',
  },
  {
    slug: 'capricornio', name: 'Capricórnio', symbol: '♑', element: 'Terra', period: '22/12 a 20/01',
    rulingPlanet: 'Saturno', luckyDay: 'Sábado', luckyNumber: '8', color: 'Preto',
    compatibility: 'Touro, Virgem, Peixes',
    summary: 'Capricórnio é o signo da ambição, disciplina e responsabilidade. O construtor do zodíaco, que transforma sonhos em realidade com trabalho duro e paciência.',
    personality: 'Sério, trabalhador e ambicioso. Capricórnio sabe que grandes coisas levam tempo. É disciplinado, responsável e às vezes excessivamente conservador. Por trás da seriedade, tem um humor seco encantador.',
    strengths: ['Ambicioso', 'Disciplinado', 'Responsável', 'Paciente', 'Prático'],
    weaknesses: ['Rígido', 'Pessimista', 'Emocionalmente fechado', 'Teimoso', 'Materialista'],
    love: 'Capricórnio é leal e estável. Busca parcerias sérias e duradouras. Pode parecer frio, mas demonstra amor através de atos concretos e segurança.',
    work: 'Nasceu para construir impérios. Finanças, engenharia, administração, carreiras tradicionais. Sua disciplina é sua maior ferramenta.',
    health: 'Pode acumular estresse sem perceber. Cuidado com articulações, joelhos e ossos. Exercícios regulares e pausas são essenciais.',
    friendship: 'O amigo que te dá conselhos práticos. Capricórnio não é de floreios, mas está presente quando importa. Seu apoio é silencioso e firme.',
    elementalAdvice: 'Sua Terra te dá raízes profundas. Use essa base para construir algo que dure. Mas não esqueça de aproveitar o caminho — o sucesso não é só o destino.',
  },
  {
    slug: 'aquario', name: 'Aquário', symbol: '♒', element: 'Ar', period: '21/01 a 19/02',
    rulingPlanet: 'Urano', luckyDay: 'Quarta-feira', luckyNumber: '11', color: 'Azul elétrico',
    compatibility: 'Gêmeos, Libra, Sagitário',
    summary: 'Aquário é o signo da inovação, humanitarismo e liberdade. O visionário do zodíaco, sempre à frente do seu tempo, pensando no coletivo.',
    personality: 'Original, humanitário e independente. Aquário quebra regras por natureza. É progressista, amigo de todos e defende causas sociais. Pode parecer distante, mas se importa profundamente.',
    strengths: ['Original', 'Humanitário', 'Independente', 'Visionário', 'Amigável'],
    weaknesses: ['Distante', 'Emocionalmente frio', 'Teimoso', 'Rebelde', 'Imprevisível'],
    love: 'Aquário precisa de espaço e liberdade dentro do relacionamento. É leal à sua maneira e busca um parceiro que seja também amigo. Relacionamentos tradicionais podem ser desafiadores.',
    work: 'Tecnologia, ciência, ativismo, arte experimental. Precisa de um propósito maior. Rotinas convencionais não funcionam para ele.',
    health: 'Precisa de estímulos mentais e sociais. Circulação sanguínea e tornozelos podem ser pontos fracos. Atividades em grupo mantêm a energia.',
    friendship: 'O amigo de todos e de ninguém ao mesmo tempo. Aquário tem muitos conhecimentos, mas poucos amigos íntimos. É o mais leal quando encontra sua tribo.',
    elementalAdvice: 'Seu Ar te dá visão de futuro. Use essa perspectiva para criar mudanças positivas. Mas não se esqueça de estar presente — o futuro também é agora.',
  },
  {
    slug: 'peixes', name: 'Peixes', symbol: '♓', element: 'Água', period: '20/02 a 20/03',
    rulingPlanet: 'Netuno', luckyDay: 'Quinta-feira', luckyNumber: '7', color: 'Lilás',
    compatibility: 'Câncer, Escorpião, Touro',
    summary: 'Peixes é o signo da intuição, empatia e espiritualidade. O sonhador do zodíaco, com uma conexão profunda com o mundo emocional e espiritual.',
    personality: 'Empático, criativo e intuitivo. Peixes absorve as emoções do ambiente como uma esponja. É artístico, compassivo e às vezes se perde entre sonhos e realidade.',
    strengths: ['Empático', 'Criativo', 'Intuitivo', 'Compassivo', 'Espiritual'],
    weaknesses: ['Escapista', 'Indeciso', 'Vítima', 'Iludido', 'Indisciplinado'],
    love: 'Peixes ama de forma incondicional e romântica. Busca uma conexão espiritual e emocional profunda. Pode se apaixonar facilmente e se machucar.',
    work: 'Artes, música, psicologia, trabalho social, espiritualidade. Precisa de um ambiente que nutra sua alma, não só seu bolso.',
    health: 'Muito sensível a energias negativas. Precisa de momentos de solidão e conexão com a natureza. Cuidado com vícios e escapismo.',
    friendship: 'O amigo que sente o que você sente. Peixes é o melhor ouvinte do zodíaco. Sua empatia é incomparável, mas precisa proteger sua própria energia.',
    elementalAdvice: 'Sua Água te conecta com o invisível. Use sua intuição para guiar sua vida. Mas lembre: os pés precisam ficar no chão enquanto a cabeça está nas nuvens.',
  },
]

export function getSignBySlug(slug: string): SignProfile | undefined {
  return SIGN_PROFILES.find((s) => s.slug === slug)
}

export function getSignSlug(name: string): string {
  const found = SIGN_PROFILES.find((s) => s.name === name)
  return found?.slug ?? name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-')
}
