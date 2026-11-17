import type { Access } from 'payload'

export const isAdmin: Access = ({ req }) => Boolean(req.user)

/** Public voit uniquement le publié ; admin voit tout. */
export const publishedOrAdmin: Access = ({ req }) => {
  if (req.user) return true
  return { published: { equals: true } }
}
