import localFont from 'next/font/local'
import Navbar from '../components/Navbar'
import StarBackground from '../components/StarBackground'
import PageTransition from '../components/PageTransition'
import './global.scss'

const primaryFont = localFont({
  src: [
    {
      path: '../../public/fonts/SpaceMono/SpaceMonoNerdFont-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/SpaceMono/SpaceMonoNerdFont-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-primary',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={primaryFont.variable}>
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
          <Navbar />
          <PageTransition>{children}</PageTransition>
        </div>
      </body>
    </html>
  )
}
