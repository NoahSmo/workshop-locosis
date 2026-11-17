'use client'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

/** Marque le lien de navigation de la page courante (aria-current) et referme le menu mobile. */
export function NavActive() {
  const path = usePathname()
  useEffect(() => {
    document.querySelectorAll<HTMLAnchorElement>('.nav a, .menu a').forEach((a) => {
      const href = a.getAttribute('href') || ''
      const on = href === '/' ? path === '/' : path.startsWith(href)
      if (on) a.setAttribute('aria-current', 'page')
      else a.removeAttribute('aria-current')
    })
    document.querySelector<HTMLDetailsElement>('.menu')?.removeAttribute('open')
  }, [path])
  return null
}
