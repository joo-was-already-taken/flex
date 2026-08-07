import fs from 'fs'
import path from 'path'
import localFont from 'next/font/local'
import Navbar from '../../components/Navbar'
import StarBackground from '../../components/StarBackground'
import PageTransition from '../../components/PageTransition'
import '../global.scss'
import { getDictionary, Locale } from '../../get-dictionary'
import type { Metadata } from 'next'

const primaryFont = localFont({
  src: [
    {
      path: '../../../public/fonts/SpaceMono/SpaceMonoNerdFont-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/SpaceMono/SpaceMonoNerdFont-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-primary',
})

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  const dict = await getDictionary(lang as Locale)

  return {
    title: dict.meta.title,
  }
}

export async function generateStaticParams() {
  const dir = path.join(process.cwd(), 'src/dictionaries')
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => ({ lang: f.replace('.json', '') }))
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const dict = await getDictionary(lang as Locale)

  return (
    <html lang={lang} className={primaryFont.variable}>
      <body
        style={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          margin: 0,
          padding: 0,
          backgroundColor: '#000',
        }}
      >
        <StarBackground />
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            width: '100vw',
          }}
        >
          <Navbar dict={dict} lang={lang} />
          <PageTransition>{children}</PageTransition>
        </div>
      </body>
    </html>
  )
}
