import { useEffect, useMemo, useState } from 'react'
import { ScheduleCard, SectionHeader } from '../components/ContentCards'
import { siteContent } from '../data/siteContent'
import {
  subscribeDocuments,
  type FirestoreRecord,
} from '../services/firestoreService'
import type { AgendaDocument } from '../types/content'

type ScheduleLike = {
  id?: string
  title: string
  time: string
  description: string
  isTemporary: boolean
}

export function SchedulePage() {
  const content = siteContent
  const [agendaItems, setAgendaItems] = useState<Array<FirestoreRecord<AgendaDocument>>>([])

  useEffect(() => {
    return subscribeDocuments<AgendaDocument>('agenda', (documents) => {
      setAgendaItems(documents)
    })
  }, [])

  const orderedAgenda = useMemo<Array<ScheduleLike>>(() => {
    if (agendaItems.length === 0) {
      return content.broadcastSchedule.map((item) => ({
        title: item.title,
        time: item.time,
        description: item.description,
        isTemporary: true,
      }))
    }

    return [...agendaItems]
      .sort((first, second) => `${first.date} ${first.time}`.localeCompare(`${second.date} ${second.time}`))
      .map((item) => ({
        id: item.id,
        title: item.title,
        time: item.time,
        description: item.description,
        isTemporary: false,
      }))
  }, [agendaItems, content.broadcastSchedule])

  return (
    <section className="content-section page-section">
      <SectionHeader
        eyebrow={content.sections.schedule.eyebrow}
        title={content.sections.schedule.title}
        description={content.sections.schedule.description}
      />

      <div className="schedule-list">
        {orderedAgenda.map((item) => (
          <div className="schedule-admin-wrap" key={item.id ?? `${item.time}-${item.title}`}>
            <ScheduleCard item={item} />
          </div>
        ))}
      </div>
    </section>
  )
}
