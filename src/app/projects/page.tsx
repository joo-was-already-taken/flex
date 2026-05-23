'use client'

import styles from './projects.module.scss'
import Glass from '../../components/Glass'
import projectsData from '../../data/projects.json'
export default function ProjectsPage() {
  return (
    <main className={styles.container}>
      {projectsData.map((project) => (
        <Glass key={project.id} className={styles.projectCard}>
          <h1>{project.title}</h1>
          <div className={styles.techStack}>
            {project.techSlugs?.map((slug, idx) => {
              const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''
              return (
                <span key={slug} className={styles.techItem}>
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
          <p style={{ fontSize: '1.2rem', lineHeight: '1.5' }}>{project.description}</p>
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.projectLink}
            >
              View source code →
            </a>
          )}
        </Glass>
      ))}
    </main>
  )
}
