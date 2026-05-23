import styles from '../page.module.scss'
import Glass from '../../../components/Glass'
import { getDictionary, Locale } from '../../../get-dictionary'

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const dict = await getDictionary(lang as Locale)

  return (
    <main className={styles.container}>
      <Glass className={styles.greeting}>
        <h1>{dict.about.title}</h1>
        <p style={{ fontSize: '1.4rem' }}>
          {dict.about.description}
          <br />
          {dict.about.interests}
        </p>
      </Glass>
    </main>
  )
}
