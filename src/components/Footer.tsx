import Link from 'next/link'
import type { SiteSetting } from '@/payload-types'
import { Crest, Flourish, LilySpray, SocialIcon } from './ornaments'
import { Logo } from './Logo'

export function Footer({ s }: { s: SiteSetting }) {
  const letter = (s.brandName.replace(/^atelier\s+/i, '')[0] || 'L').toUpperCase()
  return (
    <footer className="footer">
      <LilySpray className="footer__lily footer__lily--l" />
      <LilySpray className="footer__lily footer__lily--r" flip />
      <div className="footer__cta">
        <h2>Un costume en tête ?</h2>
        <Flourish />
        <p>Laissez votre adresse, puis décrivez la pièce que vous imaginez. Je vous réponds avec une première piste et un ordre de prix.</p>
        <form action="/commande" className="footer__form">
          <label htmlFor="footer-email" className="sr-only">Votre email</label>
          <input id="footer-email" name="email" type="email" placeholder="Votre adresse email" autoComplete="email" />
          <button type="submit">Proposer un projet</button>
        </form>
      </div>
      <div className="footer__bottom">
        <Logo brand={s.brandName} className="logo--light" />
        <div className="footer__center">
          {!!s.socials?.length && (
            <ul className="footer__socials">
              {s.socials.map((x) => (
                <li key={x.id}><a href={x.url} target="_blank" rel="noopener noreferrer"><SocialIcon label={x.label} /></a></li>
              ))}
            </ul>
          )}
          <p>
            {s.contactEmail && <><a href={`mailto:${s.contactEmail}`}>{s.contactEmail}</a>{' '}</>}
            {s.location && <span>{s.location}</span>}
          </p>
          <p className="footer__legal">© {new Date().getFullYear()} {s.brandName}. <Link href="/mentions-legales">Mentions légales</Link></p>
        </div>
        <Crest letter={letter} className="footer__crest" />
      </div>
    </footer>
  )
}
