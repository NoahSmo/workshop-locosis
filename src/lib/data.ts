import { getPayload } from 'payload'
import config from '@payload-config'
import { cache } from 'react'
import type { Media } from '@/payload-types'

export const getPayloadClient = cache(async () => getPayload({ config }))

export const getSettings = cache(async () => {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'site-settings', depth: 1 })
})

export const getProjects = cache(async (opts: { featured?: boolean; limit?: number } = {}) => {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'projects',
    where: { published: { equals: true }, ...(opts.featured ? { featured: { equals: true } } : {}) },
    sort: 'order',
    limit: opts.limit ?? 100,
    depth: 1,
  })
  return res.docs
})

export const mediaUrl = (m: number | Media | null | undefined, size: 'thumb' | 'card' | 'large' = 'card') => {
  if (!m || typeof m === 'number') return null
  return m.sizes?.[size]?.url || m.url || null
}
