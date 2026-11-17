/** État de location d'un costume, d'après la case « Disponible » et la date de retour saisies dans l'admin. */
export function availability(available: boolean | null | undefined, availableFrom: string | null | undefined, now = new Date()) {
  if (available !== false) return { free: true, label: 'Disponible' }
  if (!availableFrom) return { free: false, label: 'Déjà loué' }
  const from = new Date(availableFrom)
  // Date de retour passée : le costume redevient disponible sans repasser par l'admin.
  if (from.toLocaleDateString('sv-SE', { timeZone: 'Europe/Paris' }) <= now.toLocaleDateString('sv-SE', { timeZone: 'Europe/Paris' })) {
    return { free: true, label: 'Disponible' }
  }
  const day = from.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Paris' })
  return { free: false, label: `Disponible à partir du ${day}` }
}
