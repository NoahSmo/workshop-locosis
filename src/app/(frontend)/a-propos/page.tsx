import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { getSettings, mediaUrl } from '@/lib/data'
import { Flourish, Illustration, MedallionDecor, Panel } from '@/components/ornaments'

export const metadata: Metadata = { title: "L'atelier" }

export default async function Page() {
  const s = await getSettings()
  const img = mediaUrl(s.aboutImage, 'large')
  return (
    <Panel className="panel--top page">
      <div className="about">
        <div className="about__text">
          <h1>L'atelier</h1>
          <Flourish />
          <div className="prose">
            {s.aboutText ? <RichText data={s.aboutText} /> : <p>{s.heroIntro || s.tagline}</p>}
          </div>
          <p><Link href="/commande" className="btn">Proposer un projet</Link></p>
        </div>
        <div className="hero__visual about__visual">
          <MedallionDecor />
          <div className="medallion">{img ? <Image src={img} alt="" fill sizes="(max-width:900px) 80vw, 440px" /> : <Illustration />}</div>
        </div>
      </div>
    </Panel>
  )
}
