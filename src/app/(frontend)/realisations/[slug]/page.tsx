import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { getPayloadClient, mediaUrl } from '@/lib/data'
import { Flourish, Illustration, LilySpray, Panel } from '@/components/ornaments'

const CATS: Record<string, string> = { historique: 'Historique', fantasy: 'Fantasy', scene: 'Scène', cosplay: 'Cosplay', autre: 'Autre' }

async function load(slug: string) {
  const payload = await getPayloadClient()
  const res = await payload.find({ collection: 'projects', where: { slug: { equals: slug }, published: { equals: true } }, limit: 1, depth: 2 })
  return res.docs[0]
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = await load((await params).slug)
  if (!p) return {}
  const img = mediaUrl(p.cover, 'large')
  return { title: p.title, description: p.summary || undefined, openGraph: img ? { images: [img] } : undefined }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const p = await load((await params).slug)
  if (!p) notFound()
  const cover = mediaUrl(p.cover, 'large')
  const rows = ([['Année', p.year], ['Époque', p.era], ['Matières', p.materials], ['Temps de travail', p.duration]] as const).filter(([, v]) => v)
  return (
    <>
      <Panel className="panel--top page">
        <nav className="crumbs" aria-label="Fil d'Ariane">
          <Link href="/realisations">Réalisations</Link>
          {p.category && <Link href={`/realisations?cat=${p.category}`}>{CATS[p.category]}</Link>}
          <span aria-current="page">{p.title}</span>
        </nav>
        <div className="detail">
          <div className="detail__visual">
            <LilySpray className="detail__lily detail__lily--l" />
            <LilySpray className="detail__lily detail__lily--r" flip />
            <div className="detail__arch">
              {cover ? <Image src={cover} alt={typeof p.cover === 'object' ? p.cover.alt : p.title} fill priority sizes="(max-width:900px) 90vw, 520px" /> : <Illustration />}
            </div>
          </div>
          <div className="detail__text">
            <h1>{p.title}</h1>
            <Flourish />
            {p.summary && <p className="detail__lede">{p.summary}</p>}
            {rows.length > 0 && (
              <>
                <h2 className="title-orn title-orn--small">Fiche technique</h2>
                <dl className="specs">
                  {rows.map(([k, v]) => (
                    <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
                  ))}
                </dl>
              </>
            )}
            {p.description && (
              <>
                <h2 className="title-orn title-orn--small">Notes d'atelier</h2>
                <div className="prose"><RichText data={p.description} /></div>
              </>
            )}
            <p><Link href="/commande" className="btn">Proposer un projet similaire</Link></p>
          </div>
        </div>
      </Panel>
      {p.gallery?.length ? (
        <Panel className="page">
          <h2 className="title-orn center">Galerie</h2>
          <div className="gallery">
            {p.gallery.map((g) => {
              const src = mediaUrl(g.image, 'large')
              return src ? (
                <figure key={g.id}>
                  <Image src={src} alt={g.caption || p.title} width={900} height={1125} sizes="(max-width:600px) 100vw, 50vw" />
                  {g.caption && <figcaption>{g.caption}</figcaption>}
                </figure>
              ) : null
            })}
          </div>
        </Panel>
      ) : null}
    </>
  )
}
