'use client'

import styles from '../page.module.scss'
import Glass from '../../components/Glass'

export default function HomePage() {
  return (
    <main className={styles.container}>
      <Glass className={styles.greeting}>
        <h1>Hello World!</h1>
        <p style={{ fontSize: '1.4rem' }}>Welcome to my website.</p>
      </Glass>
    </main>
  )
}
