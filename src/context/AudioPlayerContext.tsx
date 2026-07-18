import { type ReactNode, useCallback, useMemo, useRef, useState } from 'react'
import { radioLinks } from '../config/radioLinks'
import { siteContent } from '../data/siteContent'
import { AudioPlayerContext } from './audioPlayerState'

export function AudioPlayerProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [volume, setVolumeState] = useState(1)
  const [isMuted, setIsMuted] = useState(false)

  const togglePlayback = useCallback(() => {
    const audio = audioRef.current

    if (!audio) {
      return
    }

    if (isPlaying) {
      audio.pause()
      return
    }

    setErrorMessage('')
    setIsLoading(true)
    audio.play().catch(() => {
      setIsPlaying(false)
      setIsLoading(false)
      setErrorMessage(siteContent.radio.livePlayer.errorMessage)
    })
  }, [isPlaying])

  const stopPlayback = useCallback(() => {
    const audio = audioRef.current

    if (!audio) {
      return
    }

    audio.pause()
    setIsPlaying(false)
    setIsLoading(false)
  }, [])

  const setVolume = useCallback((v: number) => {
    const audio = audioRef.current
    const clamped = Math.max(0, Math.min(1, v))

    setVolumeState(clamped)
    setIsMuted(clamped === 0)

    if (audio) {
      audio.volume = clamped
    }
  }, [])

  const toggleMute = useCallback(() => {
    const audio = audioRef.current

    if (isMuted) {
      const restore = volume > 0 ? volume : 0.5
      setVolumeState(restore)
      setIsMuted(false)

      if (audio) {
        audio.volume = restore
      }
    } else {
      setVolumeState(0)
      setIsMuted(true)

      if (audio) {
        audio.volume = 0
      }
    }
  }, [isMuted, volume])

  const value = useMemo(
    () => ({
      isPlaying,
      isLoading,
      errorMessage,
      volume,
      isMuted,
      togglePlayback,
      stopPlayback,
      setVolume,
      toggleMute,
    }),
    [isPlaying, isLoading, errorMessage, volume, isMuted, stopPlayback, togglePlayback, setVolume, toggleMute],
  )

  return (
    <AudioPlayerContext.Provider value={value}>
      {children}
      <audio
        ref={audioRef}
        src={radioLinks.streamUrl}
        preload="none"
        onPlay={() => {
          setIsLoading(false)
          setIsPlaying(true)
          setErrorMessage('')
        }}
        onPlaying={() => {
          setIsLoading(false)
          setIsPlaying(true)
          setErrorMessage('')
        }}
        onWaiting={() => setIsLoading(true)}
        onPause={() => {
          setIsPlaying(false)
          setIsLoading(false)
        }}
        onEnded={() => {
          setIsPlaying(false)
          setIsLoading(false)
        }}
        onError={() => {
          setIsPlaying(false)
          setIsLoading(false)
          setErrorMessage(siteContent.radio.livePlayer.errorMessage)
        }}
      />
    </AudioPlayerContext.Provider>
  )
}
