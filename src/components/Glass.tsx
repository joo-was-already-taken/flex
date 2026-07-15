'use client'

import { ReactNode, useEffect, useRef } from 'react'
import styles from './Glass.module.scss'

interface GlassProps {
  children: ReactNode
  className?: string
}

export default function Glass({ children, className = '' }: GlassProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const updatePosition = (clientX: number, clientY: number) => {
      if (!cardRef.current) return
      const rect = cardRef.current.getBoundingClientRect()
      const x = clientX - rect.left
      const y = clientY - rect.top

      cardRef.current.style.setProperty('--mouse-x', `${x}px`)
      cardRef.current.style.setProperty('--mouse-y', `${y}px`)
    }

    const handleMouseMove = (e: MouseEvent) => {
      updatePosition(e.clientX, e.clientY)
    }

    const handleScroll = () => {
      // @ts-expect-error: Custom window property
      const lastPos = window._lastMousePos
      if (lastPos) {
        updatePosition(lastPos.x, lastPos.y)
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('scroll', handleScroll, { capture: true, passive: true })

    let frameId: number
    const startTime = Date.now()
    const syncDuringTransition = () => {
      // @ts-expect-error: Custom window property from Navbar
      let lastPos = window._lastMousePos

      // best effort: fallback to session storage if window memory is wiped
      if (!lastPos) {
        try {
          const saved = sessionStorage.getItem('_lastMousePos')
          if (saved) lastPos = JSON.parse(saved)
        } catch (e) {
          /* ignore */
        }
      }

      if (lastPos) {
        updatePosition(lastPos.x, lastPos.y)
      } else if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect()
        cardRef.current.style.setProperty('--mouse-x', `${rect.width / 2}px`)
        cardRef.current.style.setProperty('--mouse-y', `${rect.height / 2}px`)
      }

      if (Date.now() - startTime < 1000) {
        frameId = requestAnimationFrame(syncDuringTransition)
      }
    }

    syncDuringTransition()

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('scroll', handleScroll, { capture: true })
      cancelAnimationFrame(frameId)
    }
  }, [])

  return (
    <div ref={cardRef} className={`${className} ${styles.glassCard}`.trim()}>
      <div className={styles.glassBackground} />
      <div className={styles.glassHighlight} />
      <div className={styles.content}>{children}</div>
    </div>
  )
}
