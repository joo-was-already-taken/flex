import styles from './skills.module.scss'
import Glass from '../../../components/Glass'
import skillsData from '../../../data/skills.json'
import { getDictionary, Locale } from '../../../get-dictionary'

export default async function SkillsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const dict = await getDictionary(lang as Locale)

  return (
    <main className={styles.container}>
      <div className={styles.masonryGrid}>
        {skillsData.map((skill, idx) => {
          type SkillItem = { usedFor?: string; usage?: string | string[] }
          const itemsDict = (dict.skills as { items: Record<string, SkillItem> }).items
          const itemDict = itemsDict[skill.slug] || {}
          const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''

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
    </main>
  )
}
