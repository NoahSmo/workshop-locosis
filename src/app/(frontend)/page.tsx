import Link from 'next/link'
import Image from 'next/image'
import { getProjects, getSettings, mediaUrl } from '@/lib/data'
import { ArchCard } from '@/components/ProjectCard'
import { Crest, Flourish, Icon, Illustration, MedallionDecor, Panel, SideVine, Teardrop } from '@/components/ornaments'

const CATS: Record<string, string> = { historique: 'Historique', fantasy: 'Fantasy', scene: 'Scène', cosplay: 'Cosplay', autre: 'Autre' }

const STEPS = [
  { icon: 'croquis', title: 'Premier échange', text: "Vous décrivez le costume, l'époque, l'usage et votre budget.", note: 'Par le formulaire ou par email' },
  { icon: 'ciseaux', title: 'Croquis et devis', text: 'Je dessine la pièce, propose les matières et chiffre le travail.', note: 'Devis gratuit, sans engagement' },
  { icon: 'aiguille', title: 'Patron et couture', text: 'Patron à vos mesures, essayages, finitions à la main.', note: 'Un ou deux essayages selon la pièce' },
  { icon: 'cintre', title: 'Remise du costume', text: "Vous repartez avec la pièce et ses conseils d'entretien.", note: 'En main propre ou par envoi' },
]

const PROMISES = [
  { icon: 'bobine', label: 'Cousu main' },
  { icon: 'mesure', label: 'À vos mesures' },
  { icon: 'tissu', label: 'Tissus choisis' },
]

const fmt = (d: string) => new Date(d).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })

export default async function HomePage() {
  const [s, featured, all] = await Promise.all([getSettings(), getProjects({ featured: true, limit: 4 }), getProjects({ limit: 100 })])
  const hero = mediaUrl(s.heroImage, 'large')
  const about = mediaUrl(s.aboutImage, 'card')
  const latest = [...all].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 3)
  const cats = Object.keys(CATS).filter((k) => all.some((p) => p.category === k))
  const letter = (s.brandName.replace(/^atelier\s+/i, '')[0] || 'L').toUpperCase()

  return (
    <>
      <Panel className="panel--top hero">
        <SideVine className="hero__vine" />
        <div className="hero__grid">
          <div className="hero__title">
            <Crest letter={letter} className="hero__crest" />
            <h1>Costumes sur mesure, de l'esquisse au dernier point.</h1>
            <Flourish />
          </div>
          <div className="hero__visual">
            <MedallionDecor />
            <div className="medallion">
              {hero ? <Image src={hero} alt="" fill priority sizes="(max-width:900px) 80vw, 460px" /> : <Illustration />}
            </div>
          </div>
          <div className="hero__copy">
            <p>{s.heroIntro || s.tagline}</p>
            <Link href="/commande" className="btn">
              Proposer un projet
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2v20M2 12h20M5 5l14 14M19 5L5 19" className="o-line" /><circle cx="12" cy="12" r="4" className="o-gild" /></svg>
            </Link>
          </div>
        </div>
        {cats.length > 0 && (
          <nav className="hero__cats" aria-label="Catégories de réalisations">
            <span>Spécialités</span>
            {cats.map((k) => <Link key={k} href={`/realisations?cat=${k}`}>{CATS[k]}</Link>)}
          </nav>
        )}
      </Panel>

      <Panel className="showcase">
        <h2 className="sr-only">Réalisations à la une</h2>
        {featured.length ? (
          <div className="cards">
            {featured.map((p) => (
              <ArchCard key={p.id} href={`/realisations/${p.slug}`} title={p.title} image={p.cover} caption={[p.era, p.year].filter(Boolean).join(', ')} />
            ))}
          </div>
        ) : (
          <p className="center">Les premières pièces sont encore sur la table de coupe.</p>
        )}
      </Panel>

      <Panel className="craft">
        <Teardrop />
        <div className="craft__body">
          <h2 className="title-orn">Une commande, pas à pas</h2>
          <ol className="steps">
            {STEPS.map((st, i) => (
              <li key={st.title}>
                <Icon name={st.icon} className="steps__icon" />
                <div>
                  <h3>{st.title}</h3>
                  <p>{st.text}</p>
                  <p className="steps__note">{st.note}</p>
                </div>
                <span className="steps__num" aria-hidden="true">{i + 1}</span>
              </li>
            ))}
          </ol>
          <Link href="/commande" className="link-caps">Proposer un projet</Link>
        </div>
      </Panel>

      <Panel className="split">
        <div className="split__promise">
          <h2>Le travail d'atelier</h2>
          <p>Chaque pièce est pensée pour la personne qui la portera, coupée et cousue à la main.</p>
          <ul className="promises">
            {PROMISES.map((x) => (
              <li key={x.label}><span className="promises__ring"><Icon name={x.icon} /></span>{x.label}</li>
            ))}
          </ul>
        </div>
        <div className="split__medallion">
          <div className="medallion medallion--small">{about ? <Image src={about} alt="" fill sizes="280px" /> : <Illustration />}</div>
        </div>
        <div className="split__journal">
          <div className="split__head">
            <h2>Carnet d'atelier</h2>
            <Link href="/realisations" className="link-caps">Toutes les réalisations</Link>
          </div>
          <p>Les dernières pièces sorties de l'atelier.</p>
          <ul className="minis">
            {latest.map((p) => {
              const src = mediaUrl(p.cover, 'thumb')
              return (
                <li key={p.id}>
                  <Link href={`/realisations/${p.slug}`} className="mini">
                    <span className="mini__img">{src ? <Image src={src} alt="" fill sizes="160px" /> : <Illustration />}</span>
                    <span className="mini__title">{p.title}</span>
                    <span className="mini__date">{fmt(p.createdAt)}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </Panel>
    </>
  )
}
