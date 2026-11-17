import { ImageResponse } from 'next/og'
import { getSettings } from '@/lib/data'

export const alt = 'Atelier Locosis — Créations de costumes'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Lit les réglages en base : rendu à la demande, pas au build (pas de DB dans le build Docker).
export const dynamic = 'force-dynamic'

export default async function OpengraphImage() {
  const s = await getSettings()
  const name = s.brandName.replace(/^atelier\s+/i, '') || s.brandName

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#2a362d',
          color: '#f3e7cf',
          fontFamily: 'serif',
          padding: 48,
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            border: '3px solid #b0874a',
            borderRadius: 40,
          }}
        >
          <div style={{ fontSize: 34, letterSpacing: 10, textTransform: 'uppercase', color: '#d8bb82' }}>
            Atelier de costumes
          </div>
          <div style={{ fontSize: 150, margin: '16px 0', color: '#fbf5e8' }}>{name}</div>
          <div style={{ width: 220, height: 3, background: '#b0874a', marginBottom: 28 }} />
          <div style={{ fontSize: 40, fontStyle: 'italic', color: '#a3b097', textAlign: 'center' }}>
            {s.tagline || 'Costumes sur mesure, cousus à la main.'}
          </div>
        </div>
      </div>
    ),
    size,
  )
}
