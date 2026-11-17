/**
 * Ornements art nouveau dessinés en SVG : lys, volutes, médaillons, blason.
 * Couleurs pilotées par les classes CSS (.o-*), voir styles.css.
 */
import type { ReactNode } from 'react'

const PETAL = 'M0 -2C17 -10 24 -32 10 -52C6 -58 2 -60 4 -64C-2 -62 -6 -58 -10 -52C-24 -32 -17 -10 0 -2Z'
const SHADE = 'M0 -4C9 -12 12 -24 6 -34C2 -24 -4 -14 0 -4Z'
const LEAF = 'M0 0C18 -30 16 -76 -6 -124C-26 -76 -20 -28 0 0Z'
const BUD = 'M0 0C10 -10 11 -30 2 -52C-9 -30 -9 -10 0 0Z'

type T = { x: number; y: number; s?: number; r?: number }
const tf = ({ x, y, s = 1, r = 0 }: T) => `translate(${x} ${y}) rotate(${r}) scale(${s})`

export function Bloom(p: T) {
  // Pétales arrière (décalés de 30°) puis pétales avant, pour une fleur pleine.
  return (
    <g transform={tf(p)}>
      {[30, 90, 150, 210, 270, 330].map((a) => (
        <g key={a} transform={`rotate(${a}) scale(0.9)`}>
          <path d={PETAL} className="o-petal o-petal--back" />
        </g>
      ))}
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <g key={a} transform={`rotate(${a})`}>
          <path d={PETAL} className="o-petal" />
          <path d={SHADE} className="o-shade" />
          <path d="M0 -8Q3 -30 0 -50" className="o-vein" />
        </g>
      ))}
      {[-54, -30, -8, 14, 36, 58].map((a) => (
        <g key={a} transform={`rotate(${a})`}>
          <path d="M0 0Q4 -16 0 -34" className="o-stamen" />
          <ellipse cx="0" cy="-36" rx="2.4" ry="5" className="o-anther" />
        </g>
      ))}
      <circle r="5" className="o-heart" />
    </g>
  )
}

export function Leaf(p: T) {
  return (
    <g transform={tf(p)}>
      <path d={LEAF} className="o-leaf" />
      <path d="M0 -4Q-2 -60 -4 -112" className="o-leafvein" />
    </g>
  )
}

export function Bud(p: T) {
  return (
    <g transform={tf(p)}>
      <path d="M0 0V18" className="o-stem" />
      <path d={BUD} className="o-petal" />
      <path d="M0 -4Q2 -22 0 -40" className="o-vein" />
    </g>
  )
}

/** Gerbe de lys : tige, feuilles, trois fleurs, boutons. viewBox 0 0 220 320. */
export function LilySpray({ className = '', flip = false }: { className?: string; flip?: boolean }) {
  return (
    <svg className={`lily-spray ${className}`} viewBox="0 0 220 320" aria-hidden="true" style={flip ? { transform: 'scaleX(-1)' } : undefined}>
      <path d="M100 320C104 250 112 170 124 74M108 230C92 200 80 180 64 150M118 140C138 120 152 100 166 44M116 176C140 166 160 146 180 118" className="o-stem" />
      <Leaf x={100} y={318} r={-34} s={1.1} />
      <Leaf x={104} y={316} r={24} s={1} />
      <Leaf x={106} y={300} r={-66} s={0.8} />
      <Leaf x={110} y={290} r={56} s={0.72} />
      <Leaf x={116} y={176} r={-12} s={0.5} />
      <Bud x={166} y={46} r={18} s={0.95} />
      <Bud x={180} y={120} r={48} s={0.8} />
      <Bud x={64} y={152} r={-40} s={0.75} />
      <Bloom x={124} y={74} s={1.05} r={-8} />
      <Bloom x={66} y={200} s={0.82} r={-34} />
    </svg>
  )
}

/** Volute d'angle à feuilles d'acanthe. Les autres coins sont des miroirs CSS. */
function Corner({ pos }: { pos: 'tl' | 'tr' | 'bl' | 'br' }) {
  return (
    <svg className={`corner corner--${pos}`} viewBox="0 0 140 140" aria-hidden="true">
      <path d="M4 136C4 70 22 24 136 4" className="o-line" />
      <path d="M12 136C12 78 30 36 136 12" className="o-line o-thin" />
      <path d="M4 92c30 2 46-20 36-36-9-14-30-8-26 6 3 10 16 9 16 1" className="o-line" />
      <path d="M92 4c2 30-20 46-36 36-14-9-8-30 6-26 10 3 9 16 1 16" className="o-line" />
      <path d="M40 40c26 2 40 20 38 46-18-8-34-24-38-46z" className="o-gild" />
      <path d="M40 40c-2 26 14 40 38 46" className="o-line o-thin" />
      <path d="M58 30c18-8 36-2 44 12-16 4-32 0-44-12zM30 58c-8 18-2 36 12 44 4-16 0-32-12-44z" className="o-gild" />
      <circle cx="40" cy="40" r="3" className="o-dot" />
    </svg>
  )
}

/** Panneau encadré : double filet doré, angles à volutes. */
export function Panel({ children, className = '', as: Tag = 'section', corners = true }: { children: ReactNode; className?: string; as?: 'section' | 'div' | 'article'; corners?: boolean }) {
  return (
    <Tag className={`panel ${className}`}>
      {corners && (
        <>
          <Corner pos="tl" />
          <Corner pos="tr" />
          <Corner pos="bl" />
          <Corner pos="br" />
        </>
      )}
      {children}
    </Tag>
  )
}

/** Filet ornemental à nœuds, sous les titres. */
export function Flourish({ className = '' }: { className?: string }) {
  return (
    <svg className={`flourish ${className}`} viewBox="0 0 360 24" aria-hidden="true">
      <path d="M14 12h128M218 12h128" className="o-line" />
      <path d="M142 12c10 0 12-8 20-8s7 9 0 9-8-6-2-6M218 12c-10 0-12 8-20 8s-7-9 0-9 8 6 2 6" className="o-line" />
      <path d="M180 3l9 9-9 9-9-9z" className="o-gild" />
      <circle cx="180" cy="12" r="2.4" className="o-dot" />
      <circle cx="8" cy="12" r="5" className="o-line" />
      <circle cx="352" cy="12" r="5" className="o-line" />
      <circle cx="8" cy="12" r="1.6" className="o-dot" />
      <circle cx="352" cy="12" r="1.6" className="o-dot" />
    </svg>
  )
}

/** Petit motif central (sous les cartes). */
export function Sprig({ className = '' }: { className?: string }) {
  return (
    <svg className={`sprig ${className}`} viewBox="0 0 80 16" aria-hidden="true">
      <path d="M4 8h22M54 8h22M26 8c6 0 8-5 14-5s8 5 14 5c-6 0-8 5-14 5s-8-5-14-5z" className="o-line" />
      <circle cx="40" cy="8" r="2" className="o-dot" />
    </svg>
  )
}

/** Illustration de remplacement : mannequin de couture drapé, entouré de lys. */
export function Illustration({ className = '' }: { className?: string }) {
  return (
    <svg className={`illus ${className}`} viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect width="400" height="500" className="o-bg" />
      <path d="M0 500C60 380 40 260 120 160S330 60 400 0V500Z" className="o-wash" />
      <g transform="translate(200 120)">
        <path d="M-16 0h32v18c0 10 40 14 52 34-8 34-18 64-14 98 3 22 14 40 14 62H-62c0-22 11-40 14-62 4-34-6-64-14-98 12-20 52-24 52-34z" className="o-form" />
        <path d="M-58 60c40 30 90 28 120-6M-50 120c30 30 80 40 110 20" className="o-drape" />
        <path d="M-56 52C-90 140 -70 220 -40 300c20-30 30-60 24-110-4-40-24-80-40-138z" className="o-cloth" />
        <path d="M0 212v80M-40 296h80" className="o-stand" />
        <circle cx="0" cy="-4" r="7" className="o-stand" />
      </g>
      <g transform="translate(-30 250) scale(1.1)">
        <path d="M100 320C104 250 112 170 124 74M118 140C138 120 152 100 162 50" className="o-stem" />
        <Leaf x={100} y={318} r={-20} />
        <Leaf x={104} y={316} r={26} s={0.85} />
        <Bud x={162} y={52} r={18} s={0.9} />
        <Bloom x={124} y={74} s={0.9} />
      </g>
      <g transform="translate(430 230) scale(-1.05 1.05)">
        <path d="M100 320C104 250 112 170 124 74M108 230C92 200 80 180 70 150" className="o-stem" />
        <Leaf x={100} y={318} r={-24} />
        <Leaf x={106} y={300} r={40} s={0.7} />
        <Bud x={70} y={150} r={-40} s={0.8} />
        <Bloom x={124} y={74} s={0.8} r={10} />
      </g>
    </svg>
  )
}

/** Blason à initiale, dans un cartouche ovale. */
export function Crest({ letter = 'L', className = '' }: { letter?: string; className?: string }) {
  return (
    <svg className={`crest ${className}`} viewBox="0 0 140 170" aria-hidden="true">
      <ellipse cx="70" cy="96" rx="40" ry="52" className="o-line" />
      <ellipse cx="70" cy="96" rx="34" ry="46" className="o-line o-thin" />
      <path d="M30 96c-22-4-28-26-14-34 10-6 20 4 14 12M110 96c22-4 28-26 14-34-10-6-20 4-14 12" className="o-line" />
      <path d="M32 120c-20 6-24 26-10 32 10 4 18-8 10-14M108 120c20 6 24 26 10 32-10 4-18-8-10-14" className="o-line" />
      <path d="M22 70c-6-10 0-22 10-22M118 70c6-10 0-22-10-22" className="o-line o-thin" />
      <path d="M70 148v16M60 158h20" className="o-line" />
      <Bloom x={70} y={36} s={0.42} />
      <Leaf x={66} y={50} r={-62} s={0.32} />
      <Leaf x={74} y={50} r={62} s={0.32} />
      <text x="70" y="116" textAnchor="middle" className="o-letter">
        {letter}
      </text>
    </svg>
  )
}

/** Ligne en coup de fouet qui part du haut du cadre et s'enroule autour du médaillon. viewBox 0 0 500 500. */
export function MedallionDecor() {
  return (
    <svg className="medallion-decor" viewBox="0 0 500 500" aria-hidden="true">
      <circle cx="250" cy="250" r="244" className="o-line" />
      <circle cx="250" cy="250" r="254" className="o-line o-thin" />
      <path d="M-560 -80C-420 -80 -330 -150 -200 -110-80 -74-60 30 40 30c70 0 110-30 150-34" className="o-line whip" pathLength={1} />
      <path d="M-200 -110c30 14 46 40 40 70-26-14-40-38-40-70z" className="o-gild" />
      <path d="M-60 16c-16 2-26-10-20-20 6-8 18-4 16 4" className="o-line" />
      <path d="M440 330C470 260 470 160 430 90M455 230c18-10 30-24 36-44" className="o-stem" />
      <Leaf x={470} y={300} r={-6} s={0.8} />
      <Bud x={430} y={92} r={-24} s={0.8} />
      <Bud x={490} y={186} r={30} s={0.6} />
      <g transform="translate(330 300) scale(1.05)">
        <path d="M100 320C104 250 112 170 124 74M118 140C138 120 152 100 162 50M108 230C92 200 80 180 70 150" className="o-stem" />
        <Leaf x={100} y={318} r={-40} s={1.05} />
        <Leaf x={104} y={316} r={24} s={0.85} />
        <Leaf x={106} y={300} r={-78} s={0.8} />
        <Bud x={162} y={52} r={18} s={0.9} />
        <Bud x={70} y={150} r={-40} s={0.7} />
        <Bloom x={124} y={74} s={1} r={-8} />
        <Bloom x={60} y={200} s={0.75} r={-30} />
      </g>
      <g transform="translate(-60 360) scale(0.7)">
        <path d="M100 320C104 250 112 170 124 74M108 230C92 200 80 180 70 150" className="o-stem" />
        <Leaf x={100} y={318} r={-30} />
        <Leaf x={104} y={316} r={34} s={0.8} />
        <Bud x={70} y={150} r={-40} s={0.8} />
        <Bloom x={124} y={74} s={0.9} />
      </g>
    </svg>
  )
}

/** Liane de lys le long du bord gauche du panneau d'accueil. viewBox 0 0 120 600. */
export function SideVine({ className = '' }: { className?: string }) {
  return (
    <svg className={`side-vine ${className}`} viewBox="0 0 120 600" preserveAspectRatio="xMinYMax meet" aria-hidden="true">
      <path d="M30 600C20 480 50 380 34 260S40 80 60 20M36 420c20-20 40-30 58-60M30 300c-14-20-18-50-10-80" className="o-stem" />
      <Leaf x={30} y={598} r={20} s={0.9} />
      <Leaf x={34} y={560} r={-30} s={0.7} />
      <Leaf x={36} y={420} r={50} s={0.6} />
      <Bud x={60} y={22} r={10} s={0.8} />
      <Bud x={20} y={222} r={-14} s={0.7} />
      <Bloom x={94} y={360} s={0.62} r={20} />
      <Bloom x={40} y={150} s={0.55} r={-10} />
    </svg>
  )
}

/** Grande goutte sauge avec bouquet, pour la section savoir-faire. viewBox 0 0 400 440. */
export function Teardrop() {
  return (
    <svg className="teardrop" viewBox="0 0 400 440" aria-hidden="true">
      <path d="M200 430C90 430 10 350 10 240 10 130 90 60 200 40c70-14 130-14 190-34-20 60-24 110-10 170 20 90 2 160-40 200-40 36-90 54-140 54z" className="o-bg" />
      <path d="M200 430C90 430 10 350 10 240 10 130 90 60 200 40c70-14 130-14 190-34-20 60-24 110-10 170 20 90 2 160-40 200-40 36-90 54-140 54z" className="o-line" />
      <path d="M200 440C84 440 0 356 0 240 0 122 84 50 198 30c72-12 128-14 196-30" className="o-line o-thin" />
      <path d="M0 440C80 360 60 270 140 180S340 90 400 10" className="o-wash" />
      <g transform="translate(40 120) scale(1.05)">
        <path d="M100 320C104 250 112 170 124 74M108 230C92 200 80 180 70 150M118 140C138 120 152 100 162 50M116 170C140 160 160 140 176 120" className="o-stem" />
        <Leaf x={100} y={318} r={-28} s={1.05} />
        <Leaf x={104} y={316} r={20} s={0.9} />
        <Leaf x={106} y={300} r={-62} s={0.7} />
        <Bud x={162} y={52} r={18} s={0.9} />
        <Bud x={176} y={122} r={48} s={0.8} />
        <Bloom x={124} y={74} s={1.15} r={-8} />
        <Bloom x={64} y={196} s={0.9} r={-34} />
        <Bloom x={180} y={210} s={0.62} r={24} />
      </g>
    </svg>
  )
}

/* Icônes au trait (48×48) */
const ICONS: Record<string, ReactNode> = {
  croquis: <path d="M10 38l3-11L33 7l8 8-20 20zM13 27l8 8M29 11l8 8M8 42h16" />,
  ciseaux: <><circle cx="14" cy="36" r="5" /><circle cx="30" cy="38" r="5" /><path d="M17 32L38 8M27 34L12 9" /></>,
  aiguille: <><path d="M10 40L38 10" /><ellipse cx="36" cy="12" rx="1.6" ry="3.2" transform="rotate(45 36 12)" /><path d="M36 12c6 8-4 14-12 12s-18 4-14 14" /></>,
  cintre: <><path d="M24 12a4 4 0 1 1 4 4c-2 0-4 1-4 4M24 20L6 32h36z" /><path d="M14 32l-4 12h28l-4-12" /></>,
  bobine: <><path d="M12 8h24M12 40h24M16 8v32M32 8v32" /><path d="M16 14l16 6M16 20l16 6M16 26l16 6M16 32l16 6" /></>,
  mesure: <><circle cx="20" cy="22" r="13" /><circle cx="20" cy="22" r="4" /><path d="M33 22h10v10H20M26 32v-4M31 32v-4M36 32v-4" /></>,
  tissu: <><path d="M8 14c8-6 24-6 32 0v20c-8-6-24-6-32 0z" /><path d="M8 34c8 6 24 6 32 0" /><path d="M16 12v24M24 11v26M32 12v24" /></>,
}

export function Icon({ name, className = '' }: { name: keyof typeof ICONS | string; className?: string }) {
  return (
    <svg className={`icon ${className}`} viewBox="0 0 48 48" aria-hidden="true">
      <g className="o-icon">{ICONS[name]}</g>
    </svg>
  )
}

/** Icône de réseau social selon le libellé saisi dans l'admin. */
export function SocialIcon({ label }: { label: string }) {
  const k = label.toLowerCase()
  const d = k.includes('insta')
    ? <><rect x="8" y="8" width="32" height="32" rx="9" /><circle cx="24" cy="24" r="7.5" /><circle cx="33.5" cy="14.5" r="1.6" /></>
    : k.includes('face')
      ? <path d="M27 40V26h5l1-6h-6v-4c0-2 1-3 3-3h3V8h-5c-5 0-8 3-8 8v4h-5v6h5v14" />
      : k.includes('tiktok')
        ? <path d="M26 8v22a6 6 0 1 1-6-6M26 8c1 5 5 9 10 9" />
        : k.includes('youtube')
          ? <><rect x="6" y="12" width="36" height="24" rx="7" /><path d="M21 18v12l10-6z" /></>
          : k.includes('pinterest')
            ? <><circle cx="24" cy="24" r="16" /><path d="M22 20l-5 22M20 30c6 3 12-1 12-8a8 8 0 0 0-15-3" /></>
            : null
  return d ? (
    <svg className="icon icon--social" viewBox="0 0 48 48" role="img" aria-label={label}>
      <g className="o-icon">{d}</g>
    </svg>
  ) : (
    <span>{label}</span>
  )
}
