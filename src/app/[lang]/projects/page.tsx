import styles from './projects.module.scss'
import Glass from '../../../components/Glass'
import projectsData from '../../../data/projects.json'
import { getDictionary, Locale } from '../../../get-dictionary'

type ProjectDict = {
  title?: string
  description: string
}

export default async function ProjectsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const dict = await getDictionary(lang as Locale)

  return (
    <main className={styles.container}>
      <p className={styles.generalDescription}>{dict.projects.description}</p>
      {projectsData.map((project) => {
        const projectDicts: Record<string, ProjectDict> = dict.projects.items
        const itemDict = projectDicts[project.id]
        const title = itemDict?.title || project.title
        const description = itemDict?.description

        return (
          <Glass key={project.id} className={styles.projectCard}>
            <h1>{title}</h1>
            <div className={styles.techStack}>
              {project.techSlugs?.map((slug, idx) => {
                const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''
                return (
                  <span key={`${slug}-${idx}`} className={styles.techItem}>
                    <img
                      src={`${basePath}/icons/tech/${slug}.svg`}
                      alt=""
                      className={styles.techIcon}
                    />
                    {project.techNames?.[idx]}
                  </span>
                )
              })}
            </div>
            <p style={{ fontSize: '1.2rem', lineHeight: '1.5' }}>{description}</p>
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.projectLink}
              >
                {dict.projects.view_source}
              </a>
            )}
          </Glass>
        )
      })}
    </main>
  )
}
