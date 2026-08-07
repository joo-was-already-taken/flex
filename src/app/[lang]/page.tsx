import { redirect } from 'next/navigation'

export default async function LangRootRedirect({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params

  redirect(`/${lang}/home`)
}
