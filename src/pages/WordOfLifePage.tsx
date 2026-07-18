import { SectionHeader } from '../components/ContentCards'
import { siteContent } from '../data/siteContent'

const METRICAS_URL = 'https://metricas-palavra-de-vida.onrender.com'

export function WordOfLifePage() {
  const content = siteContent

  return (
    <section className="content-section page-section word-page" aria-labelledby="word-title">
      <SectionHeader
        eyebrow={content.sections.wordOfLife.eyebrow}
        title={content.sections.wordOfLife.title}
        description={content.sections.wordOfLife.description}
      />

      <div style={{ width: '100%', height: 'calc(100vh - 180px)', minHeight: 500, borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border, #e8e2d8)' }}>
        <iframe
          src={METRICAS_URL}
          title="Metricas Palavra de Vida"
          style={{ width: '100%', height: '100%', border: 'none' }}
          allow="clipboard-write"
        />
      </div>
    </section>
  )
}
