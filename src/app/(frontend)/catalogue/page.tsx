import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPayloadClient, getSettings } from '@/lib/data'
import { ArchCard } from '@/components/ProjectCard'
import { Flourish, Panel } from '@/components/ornaments'
import { availability } from '@/lib/availability'

export const metadata: Metadata = { title: 'Location de costumes' }

export default async function Page() {
  const s = await getSettings()
  if (!s.catalogueEnabled) notFound()
  const payload = await getPayloadClient()
  const { docs } = await payload.find({ collection: 'costume-items', where: { published: { equals: true } }, limit: 100, depth: 1 })
  return (
    <Panel className="panel--top page">
      <header className="page__head">
        <h1>Costumes à louer</h1>
        <Flourish />
      </header>
      <div className="cards">
        {docs.map((c) => {
          const a = availability(c.available, c.availableFrom)
          return (
            <ArchCard
              key={c.id}
              href={`/catalogue/${c.slug}`}
              title={c.name}
              image={Array.isArray(c.photos) ? c.photos[0] : null}
              caption={[c.size && `Taille ${c.size}`, c.pricePerDay && `${c.pricePerDay} € par jour`].filter(Boolean).join(', ')}
              note={a.free ? null : a.label}
            />
          )
        })}
      </div>
    </Panel>
  )
}
