import Link from 'next/link'

/** « Atelier Locosis » → grand nom « Locosis », mention « Atelier de costumes ». */
export function Logo({ brand, className = '' }: { brand: string; className?: string }) {
  const name = brand.replace(/^atelier\s+/i, '') || brand
  return (
    <Link href="/" className={`logo ${className}`} aria-label={`${brand}, accueil`}>
      <svg className="logo__orn" viewBox="0 0 120 30" aria-hidden="true">
        <path d="M6 24c18 0 30-4 40-12M114 24c-18 0-30-4-40-12M60 4v22M52 26h16" className="o-line" />
        <path d="M60 4c-6 6-6 12 0 16 6-4 6-10 0-16z" className="o-gild" />
        <path d="M46 12c-4-6 2-10 6-6M74 12c4-6-2-10-6-6" className="o-line" />
      </svg>
      <span className="logo__name">{name}</span>
      <span className="logo__sub">Atelier de costumes</span>
    </Link>
  )
}
