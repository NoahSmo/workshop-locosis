import type { CollectionConfig } from 'payload'
import { isAdmin, publishedOrAdmin } from '../lib/access'
import { slugFrom } from '../lib/slug'

export const Projects: CollectionConfig = {
  slug: 'projects',
  labels: { singular: 'Réalisation', plural: 'Réalisations' },
  admin: {
    useAsTitle: 'title',
    group: 'Contenu',
    defaultColumns: ['title', 'year', 'category', 'featured', 'published'],
  },
  access: {
    read: publishedOrAdmin,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  defaultSort: 'order',
  fields: [
    { name: 'title', type: 'text', label: 'Titre', required: true },
    {
      name: 'slug',
      type: 'text',
      label: 'Adresse (auto)',
      unique: true,
      index: true,
      admin: { position: 'sidebar' },
      hooks: { beforeValidate: [slugFrom('title')] },
    },
    { name: 'published', type: 'checkbox', label: 'Publié', defaultValue: false, admin: { position: 'sidebar' } },
    { name: 'featured', type: 'checkbox', label: 'Mis en avant (accueil)', defaultValue: false, admin: { position: 'sidebar' } },
    { name: 'order', type: 'number', label: 'Ordre (petit = en premier)', defaultValue: 100, admin: { position: 'sidebar' } },
    { name: 'year', type: 'number', label: 'Année' },
    {
      name: 'category',
      type: 'select',
      label: 'Catégorie',
      options: [
        { label: 'Historique', value: 'historique' },
        { label: 'Fantasy / Fantastique', value: 'fantasy' },
        { label: 'Théâtre / Scène', value: 'scene' },
        { label: 'Cosplay', value: 'cosplay' },
        { label: 'Autre', value: 'autre' },
      ],
    },
    { name: 'era', type: 'text', label: 'Époque / inspiration', admin: { description: 'ex. « Années folles », « Renaissance »' } },
    { name: 'materials', type: 'text', label: 'Matières', admin: { description: 'ex. velours, laine, dentelle' } },
    { name: 'duration', type: 'text', label: 'Durée de réalisation', admin: { description: 'ex. 60 h' } },
    { name: 'cover', type: 'upload', relationTo: 'media', label: 'Image principale', required: true },
    {
      name: 'gallery',
      type: 'array',
      label: 'Galerie',
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
        { name: 'caption', type: 'text', label: 'Légende' },
      ],
    },
    { name: 'summary', type: 'textarea', label: 'Résumé court' },
    { name: 'description', type: 'richText', label: 'Description détaillée' },
  ],
}
