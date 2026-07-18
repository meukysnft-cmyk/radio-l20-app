export type TeamProfile = {
  id: string
  name: string
  city: string
  category: string
  logoUrl?: string
  alt: string
  colors?: {
    primary: string
    secondary: string
  }
}

// Times mockados: substituir por equipes reais somente quando houver confirmação.
// Use logoUrl para links externos da logo. Deixe vazio para usar fallback visual.
export const teamsContent = [
  {
    id: 'time-exemplo-a',
    name: 'Time Exemplo A',
    city: 'Pilar, AL',
    category: 'Futebol amador',
    logoUrl: '',
    alt: 'Placeholder visual do Time Exemplo A',
    colors: {
      primary: '#0057D9',
      secondary: '#FFD400',
    },
  },
  {
    id: 'equipe-exemplo-b',
    name: 'Equipe Exemplo B',
    city: 'Pilar, AL',
    category: 'Futsal',
    logoUrl: '',
    alt: 'Placeholder visual da Equipe Exemplo B',
    colors: {
      primary: '#1E90FF',
      secondary: '#FFFFFF',
    },
  },
  {
    id: 'projeto-esportivo-c',
    name: 'Projeto Esportivo C',
    city: 'Pilar, AL',
    category: 'Base comunitária',
    logoUrl: '',
    alt: 'Placeholder visual do Projeto Esportivo C',
    colors: {
      primary: '#071A33',
      secondary: '#FFD400',
    },
  },
  {
  id: "asp",
  name: "ASP",
  city: "Pilar",
  category: "Futebol",
  logoUrl: "https://i.ibb.co/nMndkGxJ/ASP.png",
  alt: "Escudo do ASP",
},
] satisfies TeamProfile[]
