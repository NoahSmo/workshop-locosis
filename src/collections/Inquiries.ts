import type { CollectionBeforeChangeHook, CollectionConfig } from 'payload'
import { isAdmin } from '../lib/access'

export const INQUIRY_STATUSES = [
  { label: '🆕 Nouveau', value: 'new' },
  { label: 'Contacté', value: 'contacted' },
  { label: 'Devis envoyé', value: 'quoted' },
  { label: 'En cours', value: 'in_progress' },
  { label: 'Livré', value: 'delivered' },
  { label: 'Perdu / refusé', value: 'lost' },
]

// Demande saisie depuis l'admin : reprend l'email de la fiche client.
const fillClientEmail: CollectionBeforeChangeHook = async ({ data, req }) => {
  if (data.clientEmail || !data.client) return data
  const id = typeof data.client === 'object' ? data.client.id : data.client
  const c = await req.payload.findByID({ collection: 'clients', id, depth: 0, req })
  return { ...data, clientEmail: c.email }
}

export const Inquiries: CollectionConfig = {
  slug: 'inquiries',
  labels: { singular: 'Demande', plural: 'Demandes' },
  admin: {
    useAsTitle: 'subject',
    group: 'CRM',
    defaultColumns: ['subject', 'client', 'clientEmail', 'type', 'status', 'deadline', 'createdAt'],
    listSearchableFields: ['subject', 'description', 'clientEmail'],
  },
  defaultSort: '-createdAt',
  hooks: { beforeChange: [fillClientEmail] },
  // Création publique passe par /api/inquiry (Local API) : pas d'accès REST anonyme.
  access: { read: isAdmin, create: isAdmin, update: isAdmin, delete: isAdmin },
  fields: [
    {
      name: 'status',
      type: 'select',
      label: 'Statut',
      defaultValue: 'new',
      required: true,
      index: true,
      options: INQUIRY_STATUSES,
      admin: { position: 'sidebar' },
    },
    { name: 'client', type: 'relationship', relationTo: 'clients', label: 'Client', required: true, admin: { position: 'sidebar' } },
    { name: 'clientEmail', type: 'email', label: 'Email du client', admin: { position: 'sidebar' } },
    {
      name: 'type',
      type: 'select',
      label: 'Type de demande',
      required: true,
      options: [
        { label: 'Commande sur mesure', value: 'commande' },
        { label: 'Location', value: 'location' },
        { label: 'Retouche / réparation', value: 'retouche' },
        { label: 'Autre', value: 'autre' },
      ],
    },
    { name: 'subject', type: 'text', label: 'Sujet', required: true },
    { name: 'description', type: 'textarea', label: 'Description du projet', required: true },
    { name: 'deadline', type: 'date', label: 'Date souhaitée', admin: { date: { pickerAppearance: 'dayOnly' } } },
    { name: 'budget', type: 'text', label: 'Budget indicatif' },
    { name: 'references', type: 'upload', relationTo: 'media', hasMany: true, label: "Images d'inspiration" },
    { name: 'quote', type: 'number', label: 'Montant du devis (€)', admin: { position: 'sidebar' } },
    { name: 'internalNotes', type: 'textarea', label: 'Notes internes' },
  ],
}
