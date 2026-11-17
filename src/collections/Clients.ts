import type { CollectionConfig } from 'payload'
import { isAdmin } from '../lib/access'

export const Clients: CollectionConfig = {
  slug: 'clients',
  labels: { singular: 'Client', plural: 'Clients' },
  admin: { useAsTitle: 'name', group: 'CRM', defaultColumns: ['name', 'email', 'phone', 'updatedAt'] },
  access: { read: isAdmin, create: isAdmin, update: isAdmin, delete: isAdmin },
  fields: [
    { name: 'name', type: 'text', label: 'Nom', required: true },
    { name: 'email', type: 'email', label: 'Email', required: true, unique: true, index: true },
    { name: 'phone', type: 'text', label: 'Téléphone' },
    { name: 'organization', type: 'text', label: 'Structure (troupe, asso…)' },
    { name: 'notes', type: 'textarea', label: 'Notes internes' },
    {
      name: 'inquiries',
      type: 'join',
      collection: 'inquiries',
      on: 'client',
      label: 'Demandes',
    },
  ],
}
