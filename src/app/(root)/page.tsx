'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function RootRedirect() {
  const router = useRouter()

  useEffect(() => {
    const browserLang = navigator.language.toLowerCase()

    let preferredLang = 'en'
    if (browserLang.startsWith('pl')) preferredLang = 'pl'
    else if (browserLang.startsWith('de')) preferredLang = 'de'

    router.replace(`/${preferredLang}/home`)
  })

  return <div style={{ height: '100vh' }}>{/* black screen while redirecting */}</div>
}
