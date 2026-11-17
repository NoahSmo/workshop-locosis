import { postgresAdapter } from '@payloadcms/db-postgres'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { fr } from '@payloadcms/translations/languages/fr'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Projects } from './collections/Projects'
import { Clients } from './collections/Clients'
import { Inquiries } from './collections/Inquiries'
import { CostumeItems } from './collections/CostumeItems'
import { SiteSettings } from './globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: { titleSuffix: ' — Atelier Locosis' },
  },
  i18n: { supportedLanguages: { fr }, fallbackLanguage: 'fr' },
  collections: [Projects, Inquiries, Clients, CostumeItems, Media, Users],
  globals: [SiteSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URL || '' },
  }),
  email: nodemailerAdapter({
    defaultFromAddress: (process.env.EMAIL_FROM || 'contact@example.fr').match(/<(.+)>/)?.[1] ?? process.env.EMAIL_FROM ?? 'contact@example.fr',
    defaultFromName: (process.env.EMAIL_FROM || '').match(/^"?([^"<]+)"?\s*</)?.[1]?.trim() || 'Atelier Locosis',
    transportOptions: {
      host: process.env.SMTP_HOST || 'localhost',
      port: Number(process.env.SMTP_PORT || 1025),
      secure: Number(process.env.SMTP_PORT) === 465,
      ...(process.env.SMTP_USER
        ? { auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } }
        : {}),
    },
  }),
  sharp,
  plugins: [],
})
