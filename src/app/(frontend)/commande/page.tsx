import type { Metadata } from 'next'
import { InquiryForm } from '@/components/InquiryForm'
import { Flourish, Panel } from '@/components/ornaments'

export const metadata: Metadata = { title: 'Proposer un projet' }

export default async function Page({ searchParams }: { searchParams: Promise<{ type?: string; email?: string }> }) {
  const { type, email } = await searchParams
  return (
    <Panel className="panel--top page">
      <header className="page__head">
        <h1>Proposer un projet</h1>
        <Flourish />
        <p>Décrivez la pièce que vous imaginez. Plus la demande est précise, plus ma première réponse le sera. Réponse sous quelques jours.</p>
      </header>
      <InquiryForm defaultType={type} defaultEmail={email} />
    </Panel>
  )
}
