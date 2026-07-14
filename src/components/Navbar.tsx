'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { ReactNode, useEffect } from 'react'
import styles from './Navbar.module.scss'

interface NavbarLinkProps {
  href: string
  curPath: string
  children: ReactNode
}

function NavbarLink({ href, curPath, children }: NavbarLinkProps) {
  return (
    <Link href={href} className={curPath === href ? styles.active : ''}>
      {children}
    </Link>
  )
}

export default function Navbar({
  dict,
  lang,
}: {
  dict: {
    nav: {
      home: string
      projects: string
      skills: string
      contact: string
    }
  }
  lang: string
}) {
  const pathname = usePathname()
  const router = useRouter()

  const languages = [
    { code: 'pl', label: 'PL', flag: 'pl' },
    { code: 'en', label: 'EN', flag: 'gb' },
    { code: 'de', label: 'DE', flag: 'de' },
    { code: 'tok', label: 'TOK', flag: 'tok' },
  ]

  const handleLanguageChange = (newLang: string) => {
    const segments = pathname.split('/')
    segments[1] = newLang
    router.push(segments.join('/'))
  }

  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('_lastMousePos')
      if (saved) {
        // @ts-expect-error: Custom window property
        window._lastMousePos = JSON.parse(saved)
      }
    } catch (e) {
      console.warn('Failed to restore mouse position', e)
    }

    const handleMouseMove = (e: MouseEvent) => {
      const pos = { x: e.clientX, y: e.clientY }
      // @ts-expect-error: Custom window property
      window._lastMousePos = pos

      sessionStorage.setItem('_lastMousePos', JSON.stringify(pos))
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <nav className={styles.navbar}>
      <div className={styles.navLinks}>
        <NavbarLink href={`/${lang}/home`} curPath={pathname}>
          {dict.nav.home}
        </NavbarLink>
        <NavbarLink href={`/${lang}/projects`} curPath={pathname}>
          {dict.nav.projects}
        </NavbarLink>
        <NavbarLink href={`/${lang}/skills`} curPath={pathname}>
          {dict.nav.skills}
        </NavbarLink>
        <NavbarLink href={`/${lang}/contact`} curPath={pathname}>
          {dict.nav.contact}
        </NavbarLink>
      </div>

      <div className={styles.langSwitcher}>
        {languages.map((l) => (
          <button
            key={l.code}
            onClick={() => handleLanguageChange(l.code)}
            className={lang === l.code ? styles.activeLang : ''}
          >
            <img
              src={`${basePath}/icons/flags/${l.flag}.svg`}
              alt={`${l.label} flag`}
              className={styles.flagIcon}
            />
            {l.label}
          </button>
        ))}
      </div>
    </nav>
  )
}
