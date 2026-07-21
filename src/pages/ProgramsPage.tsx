import { Link } from 'react-router-dom'
import { SectionHeader } from '../components/ContentCards'
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

      <div className="programs-grid-4">
        {radioPrograms.map((program) => (
          <Link
            className="programs-card-4"
            key={program.slug}
            to={radioRoutes.programDetail(program.slug)}
          >
            <img src={program.logoPath} alt={program.name} width={48} height={48} />
          </Link>
        ))}
      </div>
    </section>
  )
}
