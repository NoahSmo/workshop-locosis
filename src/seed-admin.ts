/**
 * Crée (ou réinitialise) un accès admin au back-office. Sans données de démo.
 *
 *   ADMIN_EMAIL=frere@exemple.fr ADMIN_NAME="Prénom" pnpm seed:admin
 *
 * - ADMIN_PASSWORD absent → mot de passe aléatoire généré et affiché une fois.
 * - Compte déjà existant → ignoré, sauf ADMIN_RESET=1 (nouveau mot de passe).
 */
import { randomBytes } from 'crypto'
import { getPayload } from 'payload'
import config from '@payload-config'

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase()
  if (!email) throw new Error('ADMIN_EMAIL requis.')

  const name = process.env.ADMIN_NAME?.trim() || undefined
  const generated = !process.env.ADMIN_PASSWORD
  const password = process.env.ADMIN_PASSWORD || randomBytes(15).toString('base64url')
  if (password.length < 12) throw new Error('ADMIN_PASSWORD : 12 caractères minimum.')

  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'users',
    where: { email: { equals: email } },
    limit: 1,
  })

  if (docs[0] && process.env.ADMIN_RESET !== '1') {
    payload.logger.info(`${email} existe déjà — rien à faire (ADMIN_RESET=1 pour réinitialiser).`)
    process.exit(0)
  }

  if (docs[0]) {
    await payload.update({
      collection: 'users',
      id: docs[0].id,
      data: { password, ...(name ? { name } : {}) },
    })
    payload.logger.info(`Mot de passe réinitialisé : ${email}`)
  } else {
    await payload.create({ collection: 'users', data: { email, password, name } })
    payload.logger.info(`Admin créé : ${email}`)
  }

  if (generated) console.log(`\n  Mot de passe : ${password}\n  (à noter maintenant, il ne sera plus affiché)\n`)
  process.exit(0)
}

await main()
