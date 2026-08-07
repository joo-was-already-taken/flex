export default function RootRedirectLayout({ children }: { children: React.ReactNode }) {
  return (
    <html style={{ backgroundColor: '#000' }}>
      <body style={{ margin: 0, backgroundColor: '#000' }}>{children}</body>
    </html>
  )
}
