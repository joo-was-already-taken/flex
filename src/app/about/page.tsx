'use client'

import styles from '../page.module.scss'
import Glass from '../../components/Glass'

export default function AboutPage() {
  return (
    <main className={styles.container}>
      <Glass className={styles.greeting}>
        <h1>About Me</h1>
        <p style={{ fontSize: '1.4rem' }}>
          I am a Computer Science student pursuing a Bachelor&apos;s degree at the Warsaw University
          of Technology.
          <br />
          My interests are DevOps, system tools and OS design.
        </p>
      </Glass>
    </main>
  )
}
