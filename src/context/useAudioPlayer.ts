import { useContext } from 'react'
import { AudioPlayerContext } from './audioPlayerState'

export function useAudioPlayer() {
  const context = useContext(AudioPlayerContext)

  if (!context) {
    throw new Error('useAudioPlayer deve ser usado dentro de AudioPlayerProvider.')
  }

  return context
}
