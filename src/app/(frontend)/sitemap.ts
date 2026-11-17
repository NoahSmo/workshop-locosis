import type { MetadataRoute } from 'next'
import { getProjects, getSettings } from '@/lib/data'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const [projects, s] = await Promise.all([getProjects(), getSettings()])
  return [
    '', '/realisations', '/a-propos', '/commande', ...(s.catalogueEnabled ? ['/catalogue'] : []),
  ].map((p) => ({ url: base + p })).concat(projects.map((p) => ({ url: `${base}/realisations/${p.slug}` })))
}
