import styles from './TechMarquee.module.scss'
import { basePath } from '../lib/basePath'

const ICONS = [
  'linux',
  'python',
  'nixos',
  'bash',
  'javascript',
  'rust',
  'docker',
  'c',
  'sql',
  'neovim',
  'nextjs',
  'webgl',
]

export default function TechMarquee() {
  return (
    <div className={styles.marqueeContainer}>
      <div className={styles.marqueeContent}>
        {[...ICONS, ...ICONS].map((icon, idx) => (
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
