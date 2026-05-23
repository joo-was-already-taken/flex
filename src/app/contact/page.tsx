'use client'

import styles from '../page.module.scss'
import Glass from '../../components/Glass'

export default function ContactPage() {
  return (
    <main className={styles.container}>
      <Glass className={styles.greeting}>
        <h1>Contact</h1>
        <p style={{ fontSize: '1.4rem' }}>Transmit a message to my local coordinates.</p>
      </Glass>
    </main>
  )
}
