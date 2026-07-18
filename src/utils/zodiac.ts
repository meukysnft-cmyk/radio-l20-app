export type ZodiacElement = 'fogo' | 'terra' | 'ar' | 'agua'

export type ZodiacSign = {
  name: string
  symbol: string
  element: ZodiacElement
  period: string
  startMonth: number
  startDay: number
  endMonth: number
  endDay: number
}

export const ZODIAC_SIGNS: ZodiacSign[] = [
  { name: 'Áries', symbol: '♈', element: 'fogo', period: '21/03 - 20/04', startMonth: 3, startDay: 21, endMonth: 4, endDay: 20 },
  { name: 'Touro', symbol: '♉', element: 'terra', period: '21/04 - 20/05', startMonth: 4, startDay: 21, endMonth: 5, endDay: 20 },
  { name: 'Gêmeos', symbol: '♊', element: 'ar', period: '21/05 - 20/06', startMonth: 5, startDay: 21, endMonth: 6, endDay: 20 },
  { name: 'Câncer', symbol: '♋', element: 'agua', period: '21/06 - 22/07', startMonth: 6, startDay: 21, endMonth: 7, endDay: 22 },
  { name: 'Leão', symbol: '♌', element: 'fogo', period: '23/07 - 22/08', startMonth: 7, startDay: 23, endMonth: 8, endDay: 22 },
  { name: 'Virgem', symbol: '♍', element: 'terra', period: '23/08 - 22/09', startMonth: 8, startDay: 23, endMonth: 9, endDay: 22 },
  { name: 'Libra', symbol: '♎', element: 'ar', period: '23/09 - 22/10', startMonth: 9, startDay: 23, endMonth: 10, endDay: 22 },
  { name: 'Escorpião', symbol: '♏', element: 'agua', period: '23/10 - 21/11', startMonth: 10, startDay: 23, endMonth: 11, endDay: 21 },
  { name: 'Sagitário', symbol: '♐', element: 'fogo', period: '22/11 - 21/12', startMonth: 11, startDay: 22, endMonth: 12, endDay: 21 },
  { name: 'Capricórnio', symbol: '♑', element: 'terra', period: '22/12 - 20/01', startMonth: 12, startDay: 22, endMonth: 1, endDay: 20 },
  { name: 'Aquário', symbol: '♒', element: 'ar', period: '21/01 - 18/02', startMonth: 1, startDay: 21, endMonth: 2, endDay: 18 },
  { name: 'Peixes', symbol: '♓', element: 'agua', period: '19/02 - 20/03', startMonth: 2, startDay: 19, endMonth: 3, endDay: 20 },
]

export const ELEMENT_EMOJI: Record<ZodiacElement, string> = {
  fogo: '🔥',
  terra: '🌍',
  ar: '💨',
  agua: '💧',
}

export const ELEMENT_LABELS: Record<ZodiacElement, string> = {
  fogo: 'Fogo',
  terra: 'Terra',
  ar: 'Ar',
  agua: 'Água',
}

export function getZodiacSign(day: number, month: number): ZodiacSign | null {
  for (const sign of ZODIAC_SIGNS) {
    if (sign.startMonth === sign.endMonth) {
      if (month === sign.startMonth && day >= sign.startDay && day <= sign.endDay) return sign
    } else if (sign.startMonth > sign.endMonth) {
      if ((month === sign.startMonth && day >= sign.startDay) || (month === sign.endMonth && day <= sign.endDay)) return sign
    } else {
      if (month === sign.startMonth && day >= sign.startDay) return sign
      if (month === sign.endMonth && day <= sign.endDay) return sign
    }
  }
  return null
}

export function getZodiacFromBirthday(birthday: string): ZodiacSign | null {
  let day: number
  let month: number

  if (birthday.includes('-')) {
    const parts = birthday.split('-')
    if (parts.length !== 3) return null
    day = parseInt(parts[2], 10)
    month = parseInt(parts[1], 10)
  } else if (birthday.includes('/')) {
    const parts = birthday.split('/')
    if (parts.length !== 3) return null
    day = parseInt(parts[0], 10)
    month = parseInt(parts[1], 10)
  } else {
    return null
  }

  if (isNaN(day) || isNaN(month) || day < 1 || day > 31 || month < 1 || month > 12) return null
  return getZodiacSign(day, month)
}

export function getSignByKey(key: string): ZodiacSign | undefined {
  return ZODIAC_SIGNS.find((s) => s.name.toLowerCase() === key.toLowerCase())
}
