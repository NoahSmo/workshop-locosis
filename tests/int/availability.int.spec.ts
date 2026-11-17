import { describe, expect, it } from 'vitest'
import { availability } from '@/lib/availability'

const now = new Date('2026-11-17T10:00:00Z')

describe('availability', () => {
  it('disponible quand la case est cochée', () => {
    expect(availability(true, '2026-12-12T11:00:00.000Z', now)).toEqual({ free: true, label: 'Disponible' })
  })

  it('déjà loué sans date de retour', () => {
    expect(availability(false, null, now)).toEqual({ free: false, label: 'Déjà loué' })
  })

  it('affiche la date de retour à venir', () => {
    expect(availability(false, '2026-12-12T11:00:00.000Z', now)).toEqual({ free: false, label: 'Disponible à partir du 12 décembre 2026' })
  })

  it('redevient disponible le jour du retour', () => {
    expect(availability(false, '2026-11-17T11:00:00.000Z', now).free).toBe(true)
  })
})
