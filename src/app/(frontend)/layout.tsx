import React from 'react'
import type { Metadata } from 'next'
import { Macondo_Swash_Caps, Cormorant_Garamond } from 'next/font/google'
import './styles.css'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { getSettings } from '@/lib/data'

const display = Macondo_Swash_Caps({ subsets: ['latin'], weight: '400', variable: '--font-display' })
const body = Cormorant_Garamond({ subsets: ['latin'], weight: ['500', '600'], style: ['normal', 'italic'], variable: '--font-body' })

// Contenu géré dans l'admin : rendu à la demande, jamais figé au build.
export const dynamic = 'force-dynamic'

const site = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings()
  return {
    metadataBase: new URL(site),
    title: { default: `${s.brandName} — Créations de costumes`, template: `%s — ${s.brandName}` },
    description: s.tagline || 'Costumes sur mesure, cousus à la main.',
    openGraph: { type: 'website', locale: 'fr_FR', siteName: s.brandName },
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const s = await getSettings()
  return (
    <html lang="fr" className={`${display.variable} ${body.variable}`}>
      <body>
        <div className="shell">
          <Header brand={s.brandName} catalogue={Boolean(s.catalogueEnabled)} />
          <main>{children}</main>
          <Footer s={s} />
        </div>
      </body>
    </html>
  )
}
