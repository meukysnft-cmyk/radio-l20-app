import { Link } from 'react-router-dom'
import { ProgramPreviewCard, SectionHeader } from '../components/ContentCards'
import { siteContent } from '../data/siteContent'
import { radioPrograms } from '../data/programsContent'
import { radioRoutes } from '../config/radioLinks'

export function ProgramsPage() {
  const content = siteContent

  return (
    <section className="content-section page-section">
      <SectionHeader
        eyebrow={content.sections.programs.eyebrow}
        title={content.sections.programs.title}
        description={content.sections.programs.description}
      />

      <div className="program-grid">
        {radioPrograms.map((program) => (
          <Link
            className="program-link"
            key={program.slug}
            to={radioRoutes.programDetail(program.slug)}
          >
            <ProgramPreviewCard
              logoPath={program.logoPath}
              label={program.highlightLabel}
              title={program.name}
              description={program.slogan}
            />
          </Link>
        ))}
      </div>
    </section>
  )
}
