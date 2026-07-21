import { createContext } from 'react'
import type { PlayerDocument, ProgramDocument, LiveStreamDocument } from '../types/content'

export type PlayerRecord = PlayerDocument | null
export type ProgramRecord = ProgramDocument & { id: string }
export type LiveStreamRecord = LiveStreamDocument & { id: string }

export type LiveStatusContextValue = {
  player: PlayerRecord
  programs: ProgramRecord[]
  liveStreams: LiveStreamRecord[]
  isLive: boolean
}

export const LiveStatusContext = createContext<LiveStatusContextValue>({
  player: null,
  programs: [],
  liveStreams: [],
  isLive: false,
})
