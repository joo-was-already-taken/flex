'use client'

import { usePathname } from 'next/navigation'
import { ReactNode, useState, useRef, useContext } from 'react'
import { AnimatePresence, motion, Variants } from 'framer-motion'
import { LayoutRouterContext } from 'next/dist/shared/lib/app-router-context.shared-runtime'

const ROUTES = ['/home', '/about', '/projects', '/contact']

function FrozenRouter(props: { children: ReactNode }) {
  const context = useContext(LayoutRouterContext ?? {})
  const frozen = useRef(context).current

  if (!LayoutRouterContext) {
    return <>{props.children}</>
  }

  return (
    <LayoutRouterContext.Provider value={frozen}>{props.children}</LayoutRouterContext.Provider>
  )
}

export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  const [state, setState] = useState({
    prevPath: pathname,
    direction: 0,
  })

  // derived state to calculate direction synchronously before render finishes
  if (pathname !== state.prevPath) {
    const curIndex = ROUTES.indexOf(pathname)
    const prevIndex = ROUTES.indexOf(state.prevPath)
    const newDirection = curIndex > prevIndex ? 1 : -1
    setState({
      prevPath: pathname,
      direction: newDirection,
    })
  }

  const variants: Variants = {
    initial: (dir: number) => ({
      x: dir > 0 ? '50vw' : dir < 0 ? '-50vw' : '0vw',
      opacity: 0,
    }),
    animate: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.4, ease: 'easeInOut' },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? '-50vw' : dir < 0 ? '50vw' : '0vw',
      opacity: 0,
      transition: { duration: 0.4, ease: 'easeInOut' },
    }),
  }

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <AnimatePresence mode="popLayout" custom={state.direction} initial={false}>
        <motion.div
          key={pathname}
          custom={state.direction}
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <FrozenRouter>{children}</FrozenRouter>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
