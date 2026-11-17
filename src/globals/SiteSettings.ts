import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Réglages du site',
  admin: { group: 'Réglages' },
  access: { read: () => true, update: ({ req }) => Boolean(req.user) },
  fields: [
    { name: 'brandName', type: 'text', label: 'Nom de la marque', defaultValue: 'Atelier Locosis', required: true },
    { name: 'tagline', type: 'text', label: 'Accroche', defaultValue: 'Costumes sur mesure, cousus à la main.' },
    { name: 'heroIntro', type: 'textarea', label: "Texte d'accueil" },
    { name: 'heroImage', type: 'upload', relationTo: 'media', label: "Image d'accueil" },
    { name: 'aboutText', type: 'richText', label: 'Page « À propos »' },
    { name: 'aboutImage', type: 'upload', relationTo: 'media', label: 'Portrait / atelier' },
    {
      type: 'row',
      fields: [
        { name: 'contactEmail', type: 'email', label: 'Email public' },
        { name: 'contactPhone', type: 'text', label: 'Téléphone public' },
      ],
    },
    { name: 'location', type: 'text', label: 'Ville / zone' },
    {
      name: 'socials',
      type: 'array',
      label: 'Réseaux sociaux',
      fields: [
        { name: 'label', type: 'text', label: 'Nom (Instagram…)', required: true },
        { name: 'url', type: 'text', label: 'Lien', required: true },
      ],
    },
    {
      name: 'catalogueEnabled',
      type: 'checkbox',
      label: 'Afficher le catalogue de location',
      defaultValue: false,
      admin: { description: 'Coche quand tu es prêt à lancer la location. Sinon la page reste invisible.' },
    },
    { name: 'legalName', type: 'text', label: 'Raison sociale / nom légal' },
    { name: 'siret', type: 'text', label: 'SIRET' },
    { name: 'legalAddress', type: 'text', label: 'Adresse légale' },
  ],
}
