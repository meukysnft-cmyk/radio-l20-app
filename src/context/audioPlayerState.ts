import { createContext } from 'react'

export type AudioPlayerContextValue = {
  isPlaying: boolean
  isLoading: boolean
  errorMessage: string
  volume: number
  isMuted: boolean
  togglePlayback: () => void
  stopPlayback: () => void
  setVolume: (v: number) => void
  toggleMute: () => void
}

export const AudioPlayerContext = createContext<AudioPlayerContextValue | null>(null)
