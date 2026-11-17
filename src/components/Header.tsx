import Link from 'next/link'
import { Logo } from './Logo'
import { NavActive } from './NavActive'

export function Header({ brand, catalogue }: { brand: string; catalogue: boolean }) {
  const links = [
    { href: '/', label: 'Accueil' },
    { href: '/realisations', label: 'Réalisations' },
    ...(catalogue ? [{ href: '/catalogue', label: 'Location' }] : []),
    { href: '/a-propos', label: "L'atelier" },
    { href: '/commande', label: 'Contact' },
  ]
  return (
    <header className="header">
      <Logo brand={brand} />
      <nav className="nav" aria-label="Navigation principale">
        {links.map((l) => (
          <Link key={l.href} href={l.href}>
            {l.label}
          </Link>
        ))}
      </nav>
      <NavActive />
      <details className="menu">
        <summary>Menu</summary>
        <nav aria-label="Navigation mobile">
          {links.map((l) => (
            <Link key={l.href} href={l.href}>
              {l.label}
            </Link>
          ))}
        </nav>
      </details>
    </header>
  )
}
