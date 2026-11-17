import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayloadClient, getSettings, mediaUrl } from '@/lib/data'
import { Flourish, Illustration, LilySpray, Panel } from '@/components/ornaments'

const CONDITION: Record<string, string> = { excellent: 'Excellent', bon: 'Bon', use: 'Usé (patiné)' }

async function load(slug: string) {
  const s = await getSettings()
  if (!s.catalogueEnabled) return null
  const payload = await getPayloadClient()
  const res = await payload.find({ collection: 'costume-items', where: { slug: { equals: slug }, published: { equals: true } }, limit: 1, depth: 1 })
  return res.docs[0] ?? null
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const c = await load((await params).slug)
  return c ? { title: c.name, description: c.description || undefined } : {}
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const c = await load((await params).slug)
  if (!c) notFound()
  const photos = (Array.isArray(c.photos) ? c.photos : []).map((p) => mediaUrl(p, 'large')).filter(Boolean) as string[]
  const rows = ([
    ['Époque', c.era],
    ['Taille', c.size],
    ['État', c.condition && CONDITION[c.condition]],
    ['Prix par jour', c.pricePerDay != null && `${c.pricePerDay} €`],
    ['Caution', c.deposit != null && `${c.deposit} €`],
    ['Disponibilité', c.available ? 'Disponible' : 'Déjà loué'],
  ] as const).filter(([, v]) => v)
  return (
    <Panel className="panel--top page">
      <nav className="crumbs" aria-label="Fil d'Ariane">
        <Link href="/catalogue">Location</Link>
        <span aria-current="page">{c.name}</span>
      </nav>
      <div className="detail">
        <div className="detail__visual">
          <LilySpray className="detail__lily detail__lily--l" />
          <LilySpray className="detail__lily detail__lily--r" flip />
          <div className="detail__arch">{photos[0] ? <Image src={photos[0]} alt={c.name} fill priority sizes="(max-width:900px) 90vw, 520px" /> : <Illustration />}</div>
        </div>
        <div className="detail__text">
          <h1>{c.name}</h1>
          <Flourish />
          {c.description && <p className="detail__lede">{c.description}</p>}
          <dl className="specs">
            {rows.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
          </dl>
          <p><Link href="/commande?type=location" className="btn">Demander la location</Link></p>
        </div>
      </div>
      {photos.length > 1 && (
        <div className="gallery">
          {photos.slice(1).map((src) => <figure key={src}><Image src={src} alt={c.name} width={900} height={1125} sizes="(max-width:600px) 100vw, 50vw" /></figure>)}
        </div>
      )}
    </Panel>
  )
}
