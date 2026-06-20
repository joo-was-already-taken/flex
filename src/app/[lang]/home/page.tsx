import styles from '../page.module.scss'
import Glass from '../../../components/Glass'
import IconButton from '../../../components/IconButton'
import socials from '../../../data/socials.json'
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
      <div className={styles.socialLinks}>
        <IconButton href={socials.github} icon="github.svg" label="GitHub" />
        <IconButton href={socials.linkedin} icon="linkedin.png" label="LinkedIn" />
      </div>
    </main>
  )
}
