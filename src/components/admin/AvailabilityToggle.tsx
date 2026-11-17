'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast, useConfig } from '@payloadcms/ui'
import type { CheckboxFieldClient, DefaultCellComponentProps } from 'payload'

/** Cellule de la liste « Catalogue de location » : bascule Disponible / Loué en un clic. */
export function AvailabilityToggle({ cellData, rowData, collectionSlug }: DefaultCellComponentProps<CheckboxFieldClient>) {
  const { config } = useConfig()
  const router = useRouter()
  const [available, setAvailable] = useState(cellData !== false)
  const [busy, setBusy] = useState(false)

  async function toggle() {
    const next = !available
    setBusy(true)
    setAvailable(next)
    const res = await fetch(`${config.serverURL}${config.routes.api}/${collectionSlug}/${rowData.id}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ available: next }),
    }).catch(() => null)
    setBusy(false)
    if (!res?.ok) {
      setAvailable(!next)
      return toast.error("La disponibilité n'a pas été enregistrée. Réessayez.")
    }
    toast.success(next ? `${rowData.name} : disponible` : `${rowData.name} : loué`)
    router.refresh()
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={busy}
      aria-pressed={available}
      title={available ? 'Marquer comme loué' : 'Marquer comme disponible'}
      style={{
        cursor: busy ? 'progress' : 'pointer',
        border: 0,
        borderRadius: 999,
        padding: '4px 12px',
        font: 'inherit',
        fontWeight: 600,
        background: available ? '#dfe8d2' : '#efdcd9',
        color: available ? '#35553a' : '#7a4a44',
      }}
    >
      {available ? '● Disponible' : '○ Loué'}
    </button>
  )
}
