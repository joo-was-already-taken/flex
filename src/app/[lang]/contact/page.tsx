import layoutStyles from '../page.module.scss'
import styles from './contact.module.scss'
import Glass from '../../../components/Glass'
import CopyButton from '../../../components/CopyButton'
import IconButton from '../../../components/IconButton'
import socials from '../../../data/socials.json'
const contacts = [
  {
    id: 'github',
    href: socials.github,
    icon: 'github.svg',
    label: 'GitHub',
    display: socials.github.replace(/^https?:\/\//, ''),
    isExternal: true,
  },
  {
    id: 'linkedin',
    href: socials.linkedin,
    icon: 'linkedin.png',
    label: 'LinkedIn',
    display: socials.linkedin.replace(/^https?:\/\//, ''),
    isExternal: true,
  },
  {
    id: 'email',
    href: `mailto:${socials.email}`,
    icon: 'email.svg',
    label: 'Email',
    display: socials.email,
    isExternal: false,
    copyable: true,
  },
]

export default function ContactPage() {
  return (
    <main className={layoutStyles.container}>
      <div className={styles.contactPanels}>
        {contacts.map((contact) => {
          const linkElement = (
            <a
              href={contact.href}
              target={contact.isExternal ? '_blank' : undefined}
              rel={contact.isExternal ? 'noopener noreferrer' : undefined}
              className={styles.readableLink}
            >
              {contact.display}
            </a>
          )

          return (
            <Glass key={contact.id} className={styles.contactPanel}>
              <div className={styles.contactContent}>
                <IconButton
                  href={contact.href}
                  icon={contact.icon}
                  label={contact.label}
                  isExternal={contact.isExternal}
                />

                {contact.copyable ? (
                  <div className={styles.linkWrapper}>
                    <div className={styles.linkCenter}>{linkElement}</div>
                    <div className={styles.linkRight}>
                      <CopyButton textToCopy={contact.display} />
                    </div>
                  </div>
                ) : (
                  linkElement
                )}
              </div>
            </Glass>
          )
        })}
      </div>
    </main>
  )
}
