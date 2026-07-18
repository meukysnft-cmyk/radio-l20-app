import { type ReactNode, useEffect, useMemo, useState } from 'react'
import { subscribeDocuments } from '../services/firestoreService'
import type { SponsorDocument } from '../types/content'
import { SponsorsContext, type SponsorRecord } from './sponsorsState'

export function SponsorsProvider({ children }: { children: ReactNode }) {
  const [sponsors, setSponsors] = useState<SponsorRecord[]>([])

  useEffect(() => {
    return subscribeDocuments<SponsorDocument>(
      'sponsors',
      (documents) => {
        const active = documents.filter((item) => item.active !== false && item.status !== 'archived')
        const ordered = [...active].sort((first, second) => (first.displayOrder ?? 0) - (second.displayOrder ?? 0))
        setSponsors(ordered)
      },
      (error) => {
        console.error('Falha ao ouvir patrocinadores do Firestore.', error)
        setSponsors([])
      },
    )
  }, [])

  const value = useMemo(() => ({ sponsors }), [sponsors])

  return <SponsorsContext.Provider value={value}>{children}</SponsorsContext.Provider>
}
