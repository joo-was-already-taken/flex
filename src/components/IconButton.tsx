import styles from './IconButton.module.scss'

interface IconButtonProps {
  href: string
  icon: string
  label: string
  isExternal?: boolean
}

export default function IconButton({ href, icon, label, isExternal = true }: IconButtonProps) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''
  return (
    <a
      href={href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      className={styles.iconButton}
      aria-label={label}
    >
      <img src={`${basePath}/icons/social/${icon}`} alt={label} />
    </a>
  )
}
