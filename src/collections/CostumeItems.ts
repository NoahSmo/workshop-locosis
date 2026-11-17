import type { CollectionConfig } from 'payload'
import { isAdmin, publishedOrAdmin } from '../lib/access'
import { slugFrom } from '../lib/slug'

export const CostumeItems: CollectionConfig = {
  slug: 'costume-items',
  labels: { singular: 'Costume à louer', plural: 'Catalogue de location' },
  admin: { useAsTitle: 'name', group: 'Contenu', defaultColumns: ['name', 'size', 'pricePerDay', 'available', 'availableFrom', 'published'] },
  access: { read: publishedOrAdmin, create: isAdmin, update: isAdmin, delete: isAdmin },
  fields: [
    { name: 'name', type: 'text', label: 'Nom', required: true },
    { name: 'slug', type: 'text', unique: true, index: true, admin: { position: 'sidebar' }, hooks: { beforeValidate: [slugFrom('name')] } },
    { name: 'published', type: 'checkbox', label: 'Publié', defaultValue: false, admin: { position: 'sidebar' } },
    {
      name: 'available',
      type: 'checkbox',
      label: 'Disponible à la location',
      defaultValue: true,
      admin: {
        position: 'sidebar',
        description: 'Décochez quand le costume est loué. Dans la liste, un clic sur la pastille bascule Disponible / Loué.',
        components: { Cell: '/components/admin/AvailabilityToggle#AvailabilityToggle' },
      },
      // Remis en location : la date de retour n'a plus de sens.
      hooks: { beforeChange: [({ value, siblingData }) => { if (value) siblingData.availableFrom = null; return value }] },
    },
    {
      name: 'availableFrom',
      type: 'date',
      label: 'Disponible à partir du',
      admin: {
        position: 'sidebar',
        condition: (data) => !data?.available,
        date: { pickerAppearance: 'dayOnly', displayFormat: 'dd/MM/yyyy' },
        description: 'Date de retour, affichée sur le site. Une fois passée, le costume apparaît disponible.',
      },
    },
    { name: 'photos', type: 'upload', relationTo: 'media', hasMany: true, label: 'Photos', required: true },
    { name: 'era', type: 'text', label: 'Époque' },
    { name: 'size', type: 'text', label: 'Taille' },
    { name: 'condition', type: 'select', label: 'État', options: [
      { label: 'Excellent', value: 'excellent' },
      { label: 'Bon', value: 'bon' },
      { label: 'Usé (patiné)', value: 'use' },
    ] },
    { name: 'pricePerDay', type: 'number', label: 'Prix / jour (€)' },
    { name: 'deposit', type: 'number', label: 'Caution (€)' },
    { name: 'description', type: 'textarea', label: 'Description' },
  ],
}
