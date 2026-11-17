const hits = new Map<string, number[]>()

/** Limiteur en mémoire (1 instance suffit sur le VPS). */
export function rateLimit(key: string, max = 5, windowMs = 60 * 60 * 1000) {
  const now = Date.now()
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs)
  if (recent.length >= max) {
    hits.set(key, recent)
    return false
  }
  recent.push(now)
  hits.set(key, recent)
  return true
}
