import type { FieldHook } from 'payload'

export const slugify = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

/** Génère le slug depuis `source` si vide. */
export const slugFrom =
  (source: string): FieldHook =>
  ({ value, data }) =>
    value ? slugify(String(value)) : slugify(String(data?.[source] ?? ''))
