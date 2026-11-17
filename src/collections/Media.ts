import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Média', plural: 'Médias' },
  admin: { group: 'Contenu' },
  access: {
    read: () => true,
  },
  fields: [{ name: 'alt', type: 'text', label: 'Texte alternatif', required: true }],
  upload: {
    staticDir: process.env.MEDIA_DIR || 'media',
    mimeTypes: ['image/*'],
    imageSizes: [
      { name: 'thumb', width: 480, height: undefined },
      { name: 'card', width: 900, height: undefined },
      { name: 'large', width: 1800, height: undefined },
    ],
    adminThumbnail: 'thumb',
  },
}
