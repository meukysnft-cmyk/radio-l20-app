import { type ReactNode, useEffect, useMemo, useState } from 'react'
import { subscribeDocuments } from '../services/firestoreService'
import type { PlayerDocument, ProgramDocument, LiveStreamDocument } from '../types/content'
import { LiveStatusContext, type LiveStatusContextValue } from './liveStatusState'

export function LiveStatusProvider({ children }: { children: ReactNode }) {
  const [player, setPlayer] = useState<PlayerDocument | null>(null)
  const [programs, setPrograms] = useState<Array<ProgramDocument & { id: string }>>([])
  const [liveStreams, setLiveStreams] = useState<Array<LiveStreamDocument & { id: string }>>([])

  useEffect(() => {
    const unsubPlayer = subscribeDocuments<PlayerDocument>('player', (docs) => {
      if (docs.length > 0) setPlayer(docs[0])
    }, () => {})
    const unsubPrograms = subscribeDocuments<ProgramDocument>('programs', (docs) => {
      setPrograms(docs)
    }, () => {})
    const unsubStreams = subscribeDocuments<LiveStreamDocument>('liveStreams', (docs) => {
      setLiveStreams(docs)
    }, () => {})
    return () => { unsubPlayer(); unsubPrograms(); unsubStreams() }
  }, [])

  const isLive = useMemo(() => {
    if (player?.isLive) return true
    if (player?.youtubeIsLive && !!player?.youtubeLiveUrl) return true
    if (player?.instagramIsLive && !!player?.instagramLiveUrl) return true
    if (programs.some((p) => p.liveStatus === 'live')) return true
    if (liveStreams.some((s) => s.status === 'live')) return true
    return false
  }, [player, programs, liveStreams])

  const value = useMemo<LiveStatusContextValue>(() => ({ player, programs, liveStreams, isLive }), [player, programs, liveStreams, isLive])

  return <LiveStatusContext.Provider value={value}>{children}</LiveStatusContext.Provider>
}
