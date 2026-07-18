import type { HoroscopeSignData } from '../components/HoroscopeCard'

const AZTRO_API = 'https://aztro.sameerkumar.website/'

const SIGNS_PT: Array<{ name: string; key: string; period: string; element: string }> = [
  { name: 'Áries', key: 'aries', period: '21/03 a 20/04', element: 'Fogo' },
  { name: 'Touro', key: 'taurus', period: '21/04 a 20/05', element: 'Terra' },
  { name: 'Gêmeos', key: 'gemini', period: '21/05 a 20/06', element: 'Ar' },
  { name: 'Câncer', key: 'cancer', period: '21/06 a 22/07', element: 'Água' },
  { name: 'Leão', key: 'leo', period: '23/07 a 22/08', element: 'Fogo' },
  { name: 'Virgem', key: 'virgo', period: '23/08 a 22/09', element: 'Terra' },
  { name: 'Libra', key: 'libra', period: '23/09 a 22/10', element: 'Ar' },
  { name: 'Escorpião', key: 'scorpio', period: '23/10 a 21/11', element: 'Água' },
  { name: 'Sagitário', key: 'sagittarius', period: '22/11 a 21/12', element: 'Fogo' },
  { name: 'Capricórnio', key: 'capricorn', period: '22/12 a 20/01', element: 'Terra' },
  { name: 'Aquário', key: 'aquarius', period: '21/01 a 19/02', element: 'Ar' },
  { name: 'Peixes', key: 'pisces', period: '20/02 a 20/03', element: 'Água' },
]

const COLORS = [
  'Vermelho', 'Azul', 'Verde', 'Amarelo', 'Roxo', 'Rosa',
  'Laranja', 'Branco', 'Dourado', 'Prata', 'Turquesa', 'Coral',
  'Índigo', 'Bege', 'Vinho', 'Lilás', 'Marinho', 'Pêssego',
  'Menta', 'Bordô', 'Cinza', 'Caramelo', 'Magenta', 'Oliva',
]

const DAILY_MESSAGES: string[][] = [
  ['O dia favorece atitudes ousadas. Confie na sua intuição e avance com determinação.', 'Energias positivas cercam suas escolhas. Seja firme, mas saiba ouvir antes de decidir.', 'Um novo começo se apresenta. Não tenha medo de mudar o rumo das coisas.', 'A criatividade está em alta. Use-a para resolver pendências e surpreender quem está ao seu redor.', 'Momento de ação e coragem. Seus esforços começam a colher frutos concretos.'],
  ['Estrelas favorecem encontros e conversas importantes. Seja aberto ao diálogo.', 'Uma oportunidade surpresa pode mudar seus planos. Fique atento aos sinais.', 'Há uma renovação de energia. Aproveite para recarregar e planejar o futuro.', 'O dia pede equilíbrio entre trabalho e descanso. Cuide de si mesmo.', 'Sua liderança brilha hoje. Inspire quem está ao seu lado com seu exemplo.'],
  ['A comunicação é a chave. Explique-se com clareza e evite mal-entendidos.', 'Momento favorável para fechar acordos e alianças. Negocie com confiança.', 'Seu carisma abre portas. Use o momento para fortalecer laços pessoais.', 'Uma decisão rápida trará bons resultados. Não deixe o momento passar.', 'Aventure-se em território novo. Conhecimento e experiência se somam hoje.'],
]

const LOVE_MESSAGES: string[][] = [
  ['Demonstre interesse com clareza e escute antes de responder.', 'Gestos simples fortalecem a confiança. Surpreenda com carinho.', 'Um diálogo sincuro pode transformar uma situação complicada.', 'Respeite o espaço do outro e valorize os momentos juntos.', 'A paixão renasce quando há entrega e sinceridade mútua.'],
  ['Esteja presente nos pequenos detalhes. Eles fazem toda a diferença.', 'Evite suposições — pergunte e converse abertamente sobre expectativas.', 'A vulnerabilidade é força. Mostre quem você realmente é.', 'Um passo pequeno pode significar um grande avanço na relação.', 'Cuide da conexão com dedicação e paciência.'],
  ['Surpreenda com gestos inesperados. A rotina não precisa ser monótona.', 'Perdoar libera. Se há mágoa pendente, dialogue com maturidade.', 'Momento de reconexão. Reserve um tempo de qualidade para quem você ama.', 'A confiança se constrói no dia a dia. Seja consistente.', 'Expresse gratidão pelo que a relação oferece. Isso fortalece o vínculo.'],
]

const WORK_MESSAGES: string[][] = [
  ['Organize prioridades antes de assumir novas tarefas.', 'Foco e disciplina trarão resultados sólidos. Evite distrções.', 'Colaboração é a palavra do dia. Trabalhe em equipe para alcançar metas.', 'Revise processos e simplifique o que estiver pesado.', 'Um projeto estagnado pode ganhar novo fôlego com uma abordagem diferente.'],
  ['Demonstre iniciativa. Sua proatividade será reconhecida.', 'Equipe unida alcança mais. Contribua para o bom ambiente de trabalho.', 'Prazos apertados pedem organização. Use listas e priorize o essencial.', 'Seja pragmático. Nem toda ideia precisa ser perfeita para ser útil.', 'Inove sem perder de vista os objetivos principais.'],
  ['Capitaliz no que funciona e ajuste o que precisa melhorar.', 'Assuma responsabilidades com maturidade. Isso demonstra liderança.', 'Mantenha o foco em longo prazo. Resultados virão com consistência.', 'Negocie com inteligência. Saiba ouvir e propor soluções justas.', 'Aprenda com os erros e siga em frente com mais experiência.'],
]

const HEALTH_MESSAGES: string[][] = [
  ['Movimente o corpo, mas respeite seus limites.', 'Hidratação e sono de qualidade fazem toda a diferença.', 'Reserve um momento para desacelerar. Pausas são necessárias.', 'Atividades ao ar livre renovam as energias.', 'Cuide da alimentação com consciência. O corpo agradece.'],
  ['Respiração profunda ajuda a reduzir o estresse. Pratique momentos de pausa.', 'Alongue-se durante o dia. Pequenos gestos fazem diferença.', 'Evite o excesso de estimulantes. Equilíbrio é saúde.', 'Ouça seu corpo e respeite seus sinais de cansaço.', 'Uma caminhada leve pode melhorar muito seu humor.'],
  ['Mente saudável, corpo saudável. Cuide do equilíbrio emocional.', 'Momentos de silêncio e contemplação restauram a energia.', 'Pratique uma atividade prazerosa para aliviar a tensão.', 'Alimentos naturais fortalecem a imunidade e o bem-estar.', 'Incorpore alongamentos na rotina para manter o corpo flexível.'],
]

const ADVICE_MESSAGES: string[][] = [
  ['Direcione sua energia para o que realmente importa.', 'Valorize constância mais do que pressa.', 'Use sua curiosidade para construir pontes.', 'Cuide de si com a mesma dedicação que oferece aos outros.', 'Brilhe sem apagar o espaço de ninguém.'],
  ['Faça o possível com serenidade.', 'Escolha com firmeza, mesmo quando houver várias opções.', 'Transforme intensidade em estratégia.', 'Avance, mas leve um mapa.', 'Persistência também precisa de respiro.'],
  ['Sonhe, mas dê um passo prático hoje.', 'Originalidade fica mais forte quando vira ação concreta.', 'Respeite diferenças e abra espaço para diálogo.', 'Anote ideias para não se perder em muitas possibilidades.', 'Pequenos passos constroem grandes conquistas.'],
]

function dayOfYear(): number {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 0)
  const diff = now.getTime() - start.getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

function pick<T>(arr: T[], signIndex: number, offset: number): T {
  const idx = (dayOfYear() + signIndex + offset) % arr.length
  return arr[idx]
}

function generateLocalContent(signIndex: number, pt: (typeof SIGNS_PT)[number]): HoroscopeSignData {
  const doy = dayOfYear()
  const colorIdx = (doy + signIndex * 3) % COLORS.length
  const luckyNum = ((doy + signIndex * 7) % 77) + 1
  const msgSet = signIndex % DAILY_MESSAGES.length
  const loveSet = signIndex % LOVE_MESSAGES.length
  const workSet = signIndex % WORK_MESSAGES.length
  const healthSet = signIndex % HEALTH_MESSAGES.length
  const adviceSet = signIndex % ADVICE_MESSAGES.length

  return {
    name: pt.name,
    period: pt.period,
    element: pt.element,
    daily: {
      message: pick(DAILY_MESSAGES[msgSet], signIndex, 0),
      love: pick(LOVE_MESSAGES[loveSet], signIndex, 1),
      work: pick(WORK_MESSAGES[workSet], signIndex, 2),
      health: pick(HEALTH_MESSAGES[healthSet], signIndex, 3),
      advice: pick(ADVICE_MESSAGES[adviceSet], signIndex, 4),
      color: COLORS[colorIdx],
      luckyNumber: String(luckyNum),
    },
    weekly: {
      message: 'Momento de reflexão e planejamento. As energias da semana favorecem mudanças internas.',
      love: 'A comunicação abre caminhos. Dedique tempo para conversas importantes.',
      work: 'Firmeza nos objetivos trará bons frutos. Evite dispersão.',
      health: 'Cuidar do corpo e da mente é essencial. Reserve momentos de pausa.',
      advice: 'Equilíbrio é a chave. Distribua energias com sabedoria.',
    },
    monthly: {
      message: 'O mês traz oportunidades de crescimento pessoal e profissional. Esteja atento.',
      love: 'Laços se fortalecem com presença e atenção. Valorize os seus.',
      work: 'Projetos ganham corpo. Mantenha o foco e a disciplina.',
      health: 'Rotinas saudáveis fazem a diferença. Comece pelos pequenos hábitos.',
      advice: 'Paciência e persistência são suas grandes aliadas este mês.',
    },
  }
}

type AztroResponse = {
  sign: string
  date_range: string
  current_date: string
  description: string
  compatibility: string
  mood: string
  color: string
  lucky_number: string
  lucky_time: string
}

async function fetchSignFromAztro(key: string): Promise<AztroResponse> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 5000)
  try {
    const res = await fetch(`${AZTRO_API}?sign=${key}&day=today`, { signal: controller.signal })
    if (!res.ok) throw new Error(`Aztro API error for ${key}: ${res.status}`)
    return res.json()
  } finally {
    clearTimeout(timeout)
  }
}

function mapAztroToSignData(
  pt: (typeof SIGNS_PT)[number],
  aztro: AztroResponse,
  signIndex: number,
): HoroscopeSignData {
  const base = generateLocalContent(signIndex, pt)
  return {
    ...base,
    daily: {
      ...base.daily,
      message: aztro.description || base.daily.message,
      color: aztro.color || base.daily.color,
      luckyNumber: aztro.lucky_number || base.daily.luckyNumber,
    },
  }
}

async function tryAztroAPI(): Promise<HoroscopeSignData[]> {
  const results = await Promise.allSettled(
    SIGNS_PT.map(async (pt, idx) => {
      const aztro = await fetchSignFromAztro(pt.key)
      return mapAztroToSignData(pt, aztro, idx)
    }),
  )

  const successful = results.filter(
    (r): r is PromiseFulfilledResult<HoroscopeSignData> => r.status === 'fulfilled',
  )

  if (successful.length < 6) return []
  return successful.map((r) => r.value)
}

export async function fetchTodayHoroscope(): Promise<HoroscopeSignData[]> {
  try {
    const fromAPI = await tryAztroAPI()
    if (fromAPI.length > 0) return fromAPI
  } catch {
    // API unavailable
  }

  return SIGNS_PT.map((pt, idx) => generateLocalContent(idx, pt))
}
