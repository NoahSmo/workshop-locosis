import Link from 'next/link'
import Image from 'next/image'

/** Monogramme « LC » dans sa couronne de volutes (esquisse du logo, public/logo.png). */
export function Monogram({ className = '', size = 120, preload = false }: { className?: string; size?: number; preload?: boolean }) {
  return <Image src="/logo.png" alt="" width={size} height={size} className={`monogram ${className}`} preload={preload} />
}

/** « Atelier Locosis » → monogramme, grand nom « Locosis », mention « Atelier de costumes ». */
export function Logo({ brand, className = '', mark = true }: { brand: string; className?: string; mark?: boolean }) {
  const name = brand.replace(/^atelier\s+/i, '') || brand
  return (
    <Link href="/" className={`logo ${className}`} aria-label={`${brand}, accueil`}>
      {mark && <Monogram className="logo__mark" size={88} preload />}
      <span className="logo__text">
        <span className="logo__name">{name}</span>
        <span className="logo__sub">Atelier de costumes</span>
      </span>
    </Link>
  )
}
