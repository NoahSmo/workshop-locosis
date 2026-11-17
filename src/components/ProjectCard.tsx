import Link from 'next/link'
import Image from 'next/image'
import type { Media } from '@/payload-types'
import { mediaUrl } from '@/lib/data'
import { Illustration, LilySpray, Sprig } from './ornaments'

/** Carte arquée « vitrine » : titre, image cernée de lys, courte légende, mention facultative, lien Découvrir. */
export function ArchCard({ href, title, image, caption, note, sizes = '(max-width:600px) 90vw, (max-width:1000px) 45vw, 280px' }: { href: string; title: string; image: number | Media | null | undefined; caption?: string | null; note?: string | null; sizes?: string }) {
  const src = mediaUrl(image, 'card')
  return (
    <Link href={href} className="arch-card">
      <div className="arch-card__frame">
        <h3>{title}</h3>
        <div className="arch-card__visual">
          <LilySpray className="arch-card__lily arch-card__lily--l" />
          <LilySpray className="arch-card__lily arch-card__lily--r" flip />
          <div className="arch-card__img">
            {src ? <Image src={src} alt={typeof image === 'object' && image ? image.alt : title} fill sizes={sizes} /> : <Illustration />}
          </div>
        </div>
        {caption && <p>{caption}</p>}
        {note && <p className="arch-card__note">{note}</p>}
        <Sprig />
      </div>
      <span className="arch-card__more">Découvrir</span>
    </Link>
  )
}
