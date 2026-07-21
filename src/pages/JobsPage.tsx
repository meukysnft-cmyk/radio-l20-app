import { useEffect, useMemo, useState } from 'react'
import { subscribeDocuments } from '../services/firestoreService'
import { SectionHeader } from '../components/ContentCards'
import { SkJobCard, Sk, SkGrid } from '../components/Skeleton'
import { siteContent } from '../data/siteContent'
import type { JobDocument } from '../types/content'

const JOB_TYPES = ['CLT', 'PJ', 'Estágio', 'Temporário', 'Freelancer', 'A combinar'] as const

export function JobsPage() {
  const [jobs, setJobs] = useState<Array<JobDocument & { id: string }>>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')

  useEffect(() => {
    const unsub = subscribeDocuments<JobDocument>(
      'jobs',
      (docs) => {
        setJobs(
          docs
            .filter((j) => j.published)
            .sort((a, b) => {
              if (a.urgent && !b.urgent) return -1
              if (!a.urgent && b.urgent) return 1
              const aTime = (a.createdAt as { seconds?: number } | undefined)?.seconds ?? 0
              const bTime = (b.createdAt as { seconds?: number } | undefined)?.seconds ?? 0
              return bTime - aTime
            }),
        )
        setIsLoading(false)
      },
      () => setIsLoading(false),
    )
    return () => unsub()
  }, [])

  const filteredJobs = useMemo(() => {
    const search = filter.toLowerCase()
    return jobs.filter((job) => {
      const matchesSearch =
        !search ||
        job.title.toLowerCase().includes(search) ||
        job.company.toLowerCase().includes(search) ||
        job.city.toLowerCase().includes(search) ||
        job.description.toLowerCase().includes(search)
      const matchesType = !typeFilter || job.type === typeFilter
      return matchesSearch && matchesType
    })
  }, [jobs, filter, typeFilter])

  return (
    <section className="content-section page-section jobs-page" aria-labelledby="jobs-title">
      <SectionHeader
        eyebrow={siteContent.sections.jobs.eyebrow}
        title={siteContent.sections.jobs.title}
        description={siteContent.sections.jobs.description}
      />

      {!isLoading && jobs.length > 0 ? (
        <div className="jobs-filters">
          <input
            type="search"
            className="jobs-search-input"
            placeholder={siteContent.jobs.filterPlaceholder}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            aria-label="Filtrar vagas"
          />
          <div className="jobs-type-filters" role="radiogroup" aria-label="Filtrar por tipo">
            <button
              className={`jobs-type-pill${typeFilter === '' ? ' is-active' : ''}`}
              onClick={() => setTypeFilter('')}
              type="button"
            >
              Todas
            </button>
            {JOB_TYPES.map((t) => (
              <button
                key={t}
                className={`jobs-type-pill${typeFilter === t ? ' is-active' : ''}`}
                onClick={() => setTypeFilter(typeFilter === t ? '' : t)}
                type="button"
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {isLoading ? (
        <>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            <Sk width="100%" height="42px" radius="var(--radius-md)" />
          </div>
          <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap' }}>
            {Array.from({ length: 7 }, (_, i) => (
              <Sk key={i} width={60 + (i % 3) * 20} height="32px" radius="var(--radius-pill)" />
            ))}
          </div>
          <SkGrid count={4}>{() => <SkJobCard />}</SkGrid>
        </>
      ) : filteredJobs.length === 0 ? (
        <div className="jobs-empty">
          <p>{siteContent.jobs.emptyState}</p>
        </div>
      ) : (
        <div className="jobs-list">
          {filteredJobs.map((job) => (
            <article className={`jobs-card${job.urgent ? ' is-urgent' : ''}`} key={job.id}>
              {job.imageUrl ? (
                <div className="jobs-card-image">
                  <img alt={job.title} src={job.imageUrl} loading="lazy" />
                </div>
              ) : null}
              <div className="jobs-card-header">
                <h3>{job.title}</h3>
                {job.urgent ? <span className="jobs-urgent-badge">Urgente</span> : null}
              </div>
              <div className="jobs-card-meta">
                {job.company ? <span className="jobs-company">{job.company}</span> : null}
                {job.city ? <span className="jobs-city">{job.city}</span> : null}
                {job.type ? <span className="jobs-type">{job.type}</span> : null}
              </div>
              {job.description ? <p className="jobs-description">{job.description}</p> : null}
              <div className="jobs-card-details">
                {job.salary ? (
                  <div className="jobs-detail">
                    <strong>Salário:</strong> {job.salary}
                  </div>
                ) : null}
                {job.requirements ? (
                  <div className="jobs-detail">
                    <strong>Requisitos:</strong> {job.requirements}
                  </div>
                ) : null}
              </div>
              {job.contact ? (
                <div className="jobs-card-contact">
                  <strong>Contato:</strong> {job.contact}
                </div>
              ) : null}
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
