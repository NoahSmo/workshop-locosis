/**
 * Données de démo : `pnpm seed`. Idempotent (ne recrée pas ce qui existe).
 * Images générées (aplats + motif) à remplacer par ses vraies photos via /admin.
 */
import { getPayload } from 'payload'
import sharp from 'sharp'
import config from '@payload-config'

const PALETTE = ['#6e1f2b', '#2f4a3a', '#c58b2a', '#d9a89a', '#5a4636', '#8a3b3b']

async function img(label: string, i: number) {
  const c = PALETTE[i % PALETTE.length]
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1500"><rect width="100%" height="100%" fill="${c}"/><circle cx="600" cy="560" r="300" fill="none" stroke="#f3e9d7" stroke-width="3" opacity=".5"/><text x="600" y="1300" font-family="Georgia" font-style="italic" font-size="72" fill="#f3e9d7" text-anchor="middle">${label}</text></svg>`
  return sharp(Buffer.from(svg)).jpeg({ quality: 82 }).toBuffer()
}

async function main() {
    const payload = await getPayload({ config })

  const email = process.env.SEED_ADMIN_EMAIL || 'admin@locosis.local'
  const password = process.env.SEED_ADMIN_PASSWORD || 'changeme-locosis'
  const users = await payload.find({ collection: 'users', limit: 1 })
  if (!users.totalDocs) {
    await payload.create({ collection: 'users', data: { email, password, name: 'Admin' } })
    payload.logger.info(`Admin créé : ${email} / ${password}  (À CHANGER)`)
  }

  const existing = await payload.count({ collection: 'projects' })
  if (!existing.totalDocs) {
    const demo = [
      ['Robe de bal 1890', 'historique', 2025, 'Fin XIXe', 'soie, dentelle, baleines', '80 h'],
      ["Cape d'elfe sylvestre", 'fantasy', 2025, 'Fantasy', 'velours, laine bouillie', '45 h'],
      ['Redingote Régence', 'historique', 2024, 'Régence', 'drap de laine, lin', '60 h'],
      ['Costume de scène « Le Songe »', 'scene', 2024, 'Théâtre', 'satin, tulle', '70 h'],
      ['Armure de cuir du chevalier', 'cosplay', 2024, 'Médiéval', 'cuir, laiton', '55 h'],
      ['Robe années folles', 'historique', 2023, '1920', 'crêpe, perles', '40 h'],
    ] as const
    for (const [i, [title, category, year, era, materials, duration]] of demo.entries()) {
      const cover = await payload.create({
        collection: 'media',
        data: { alt: title },
        file: { data: await img(title, i), mimetype: 'image/jpeg', name: `demo-${i}.jpg`, size: 1 },
      })
      await payload.create({
        collection: 'projects',
        data: {
          title, category, year, era, materials, duration,
          cover: cover.id, published: true, featured: i < 4, order: i,
          summary: `Pièce de démonstration — ${title}. À remplacer par une vraie réalisation.`,
        },
      })
    }
  }

  // Ne touche pas aux réglages déjà saisis dans l'admin.
  const settings = await payload.findGlobal({ slug: 'site-settings' })
  if (!settings.heroIntro) {
    await payload.updateGlobal({
      slug: 'site-settings',
      data: {
        brandName: 'Atelier Locosis',
        tagline: 'Costumes sur mesure, cousus à la main.',
        heroIntro:
          'Étudiant en création de costumes, je dessine, patronne et couds des pièces uniques pour la scène, la reconstitution et le jeu.',
      },
    })
  }

  payload.logger.info('Seed terminé.')
}

await main()
