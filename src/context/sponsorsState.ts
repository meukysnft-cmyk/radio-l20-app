import { createContext } from 'react'
import type { SponsorDocument } from '../types/content'

export type SponsorRecord = SponsorDocument & { id: string }

export type SponsorsContextValue = {
  sponsors: SponsorRecord[]
}

export const SponsorsContext = createContext<SponsorsContextValue>({ sponsors: [] })
