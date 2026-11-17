import type { Metadata } from 'next'
import Link from 'next/link'
import { getProjects } from '@/lib/data'
import { ArchCard } from '@/components/ProjectCard'
import { Flourish, Panel } from '@/components/ornaments'

export const metadata: Metadata = { title: 'Réalisations' }

const CATS: Record<string, string> = { historique: 'Historique', fantasy: 'Fantasy', scene: 'Scène', cosplay: 'Cosplay', autre: 'Autre' }

export default async function Page({ searchParams }: { searchParams: Promise<{ cat?: string }> }) {
  const { cat } = await searchParams
  const all = await getProjects()
  const active = cat && CATS[cat] ? cat : undefined
  const projects = active ? all.filter((p) => p.category === active) : all
  const present = Object.keys(CATS).filter((k) => all.some((p) => p.category === k))
  return (
    <Panel className="panel--top page">
      <header className="page__head">
        <h1>Réalisations</h1>
        <Flourish />
      </header>
      {present.length > 1 && (
        <nav className="filters" aria-label="Filtrer par catégorie">
          <Link className="chip" href="/realisations" aria-current={!active}>Toutes</Link>
          {present.map((k) => (
            <Link key={k} className="chip" href={`/realisations?cat=${k}`} aria-current={active === k}>{CATS[k]}</Link>
          ))}
        </nav>
      )}
      {projects.length ? (
        <div className="cards">
          {projects.map((p) => (
            <ArchCard key={p.id} href={`/realisations/${p.slug}`} title={p.title} image={p.cover} caption={[p.era, p.year].filter(Boolean).join(', ')} />
          ))}
        </div>
      ) : (
        <p className="center">Aucune réalisation publiée pour le moment. <Link href="/commande">Proposer un projet</Link></p>
      )}
    </Panel>
  )
}
