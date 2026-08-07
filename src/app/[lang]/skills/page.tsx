import styles from './skills.module.scss'
import { basePath } from '../../../lib/basePath'
import Glass from '../../../components/Glass'
import skillsData from '../../../data/skills.json'
import { getDictionary, Locale } from '../../../get-dictionary'

export default async function SkillsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const dict = await getDictionary(lang as Locale)

  return (
    <main className={styles.container}>
      <div className={styles.masonryGrid}>
        {skillsData.main.map((skill, idx) => {
          type SkillItem = { usedFor?: string; usage?: string | string[] }
          const itemsDict = (dict.skills as { items: Record<string, SkillItem> }).items
          const itemDict = itemsDict[skill.slug] || {}

          return (
            <Glass key={idx} className={styles.skillsCard}>
              <div className={styles.cardHeader}>
                <div className={styles.titleContainer}>
                  {skill.slug && (
                    <img
                      src={`${basePath}/icons/tech/${skill.slug}.svg`}
                      alt={`${skill.name} icon`}
                      className={styles.techIcon}
                    />
                  )}
                  <h2>{skill.name}</h2>
                </div>
                <span className={styles.usedFor}>{itemDict.usedFor}</span>
                <span className={`${styles.level} ${styles[skill.level] || ''}`}>
                  {skill.level}
                </span>
              </div>
              {itemDict.usage && (
                <ul className={styles.usageList}>
                  {Array.isArray(itemDict.usage) ? (
                    itemDict.usage.map((item: string, i: number) => <li key={i}>{item}</li>)
                  ) : (
                    <li>{itemDict.usage}</li>
                  )}
                </ul>
              )}
            </Glass>
          )
        })}
      </div>

      <div className={styles.otherTechContainer}>
        <Glass className={styles.otherTechCard}>
          <h3>{dict.skills?.otherTitle || 'Other Technologies'}</h3>
          <p>
            {dict.skills?.otherDescription ||
              "Technologies I've had contact with at university or otherwise:"}
          </p>
          <ul className={styles.techList}>
            {skillsData.other.map((tech: string, idx: number) => (
              <li key={idx}>{tech}</li>
            ))}
          </ul>
        </Glass>
      </div>
    </main>
  )
}
