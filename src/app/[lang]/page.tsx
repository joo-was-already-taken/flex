import { redirect } from 'next/navigation'

export function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'pl' }, { lang: 'de' }, { lang: 'tok' }]
}

export default async function LangRootRedirect({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params

  redirect(`/${lang}/home`)
}
