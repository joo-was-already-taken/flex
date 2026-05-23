'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
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

export default function Navbar() {
  const pathname = usePathname()

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
        <NavbarLink href="/home" curPath={pathname}>
          Home
        </NavbarLink>
        <NavbarLink href="/about" curPath={pathname}>
          About Me
        </NavbarLink>
        <NavbarLink href="/projects" curPath={pathname}>
          Projects
        </NavbarLink>
        <NavbarLink href="/contact" curPath={pathname}>
          Contact
        </NavbarLink>
      </div>
    </nav>
  )
}
