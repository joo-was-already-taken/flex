import styles from './TechMarquee.module.scss'
import { basePath } from '../lib/basePath'
import skillsData from '../data/skills.json'

export default function TechMarquee() {
  return (
    <div className={styles.marqueeContainer}>
      <div className={styles.marqueeContent}>
        {[...skillsData.marquee, ...skillsData.marquee].map((icon, idx) => (
          <div key={idx} className={styles.iconWrapper}>
            <img
              src={`${basePath}/icons/tech/${icon}.svg`}
              alt={`${icon} icon`}
              className={styles.icon}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
