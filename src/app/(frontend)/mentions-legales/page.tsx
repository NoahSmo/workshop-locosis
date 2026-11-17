import type { Metadata } from 'next'
import { getSettings } from '@/lib/data'
import { Flourish, Panel } from '@/components/ornaments'

export const metadata: Metadata = { title: 'Mentions légales' }

export default async function Page() {
  const s = await getSettings()
  return (
    <Panel className="panel--top page">
      <header className="page__head">
        <h1>Mentions légales</h1>
        <Flourish />
      </header>
      <div className="prose prose--narrow">
      <h2>Éditeur</h2>
      <p>{s.legalName || s.brandName} — entrepreneur individuel{s.siret ? `, SIRET ${s.siret}` : ''}.<br />{s.legalAddress}<br />{s.contactEmail}</p>
      <h2>Hébergement</h2>
      <p>Site hébergé sur un serveur privé virtuel (VPS) — coordonnées de l'hébergeur à compléter.</p>
      <h2>Données personnelles</h2>
      <p>Les informations saisies dans le formulaire de demande (nom, email, téléphone, description du projet, images) sont utilisées uniquement pour répondre à votre demande et gérer la relation client. Elles ne sont ni revendues ni transmises à des tiers. Conservation : 3 ans après le dernier contact. Pour accéder à vos données, les rectifier ou les faire supprimer, écrivez à {s.contactEmail || "l'adresse de contact"}.</p>
      <h2>Cookies</h2>
      <p>Ce site n'utilise aucun cookie de suivi ni outil de mesure d'audience.</p>
      <h2>Propriété intellectuelle</h2>
      <p>Les photographies et créations présentées sont la propriété de leur auteur. Toute reproduction sans autorisation est interdite.</p>
      </div>
    </Panel>
  )
}
