import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'
import { getSettings } from '@/lib/data'

export const alt = 'Atelier Locosis — Créations de costumes'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Lit les réglages en base : rendu à la demande, pas au build (pas de DB dans le build Docker).
export const dynamic = 'force-dynamic'

export default async function OpengraphImage() {
  const [s, logo] = await Promise.all([getSettings(), readFile(join(process.cwd(), 'public/logo.png'))])
  const name = s.brandName.replace(/^atelier\s+/i, '') || s.brandName
  const logoSrc = `data:image/png;base64,${logo.toString('base64')}`

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
          background: '#273f2c',
          color: '#f1e9d2',
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
            border: '3px solid #a87a42',
            borderRadius: 40,
          }}
        >
          <div style={{ display: 'flex', width: 190, height: 190, marginBottom: 18, borderRadius: 999, background: '#f1e9d2', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 0 2px #ddd08a' }}>
            <img src={logoSrc} width={170} height={170} alt="" />
          </div>
          <div style={{ fontSize: 30, letterSpacing: 10, textTransform: 'uppercase', color: '#ddd08a' }}>
            Atelier de costumes
          </div>
          <div style={{ fontSize: 110, margin: '4px 0 8px', color: '#fbf7ea' }}>{name}</div>
          <div style={{ width: 220, height: 3, background: '#a87a42', marginBottom: 22 }} />
          <div style={{ fontSize: 34, fontStyle: 'italic', color: '#aebb80', textAlign: 'center' }}>
            {s.tagline || 'Costumes sur mesure, cousus à la main.'}
          </div>
        </div>
      </div>
    ),
    size,
  )
}
