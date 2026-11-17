import type { Metadata } from 'next'
import { getSettings } from '@/lib/data'
import { Flourish, Panel } from '@/components/ornaments'

export const metadata: Metadata = { title: 'Mentions légales' }

export default async function Page() {
  const s = await getSettings()
  const editor = s.legalName || s.brandName
  const contact = s.contactEmail || "l'adresse de contact"
  return (
    <Panel className="panel--top page">
      <header className="page__head">
        <h1>Mentions légales</h1>
        <Flourish />
      </header>
      <div className="prose prose--narrow">
        <h2>Éditeur du site</h2>
        <p>
          {editor}, entrepreneur individuel{s.siret ? `, SIRET ${s.siret}` : ''}.
          {s.legalAddress && <><br />{s.legalAddress}</>}
          {s.contactEmail && <><br /><a href={`mailto:${s.contactEmail}`}>{s.contactEmail}</a></>}
          {s.contactPhone && <><br />{s.contactPhone}</>}
        </p>
        <p>Directeur de la publication : {editor}.</p>

        <h2>Hébergement</h2>
        <p>
          Le site est hébergé sur un serveur privé virtuel (VPS) loué auprès de :<br />
          OVH SAS, société par actions simplifiée, RCS Lille Métropole 424 761 419.<br />
          Siège social : 2 rue Kellermann, 59100 Roubaix, France.<br />
          Téléphone : 1007 (depuis la France) · <a href="https://www.ovhcloud.com" rel="noopener noreferrer">ovhcloud.com</a>
        </p>

        <h2 id="donnees">Données personnelles</h2>
        <p>Responsable du traitement : {editor}.</p>
        <p>
          Les informations saisies dans le formulaire de demande (nom, email, téléphone, description du projet, images d'inspiration) servent uniquement à répondre à votre demande, établir un devis et suivre la commande ou la location. Base légale : mesures précontractuelles prises à votre demande.
        </p>
        <p>Elles ne sont ni revendues ni transmises à des tiers, et restent stockées sur le serveur décrit ci-dessus. Conservation : 3 ans après le dernier contact, puis suppression.</p>
        <p>
          Vous pouvez accéder à vos données, les rectifier, les faire supprimer ou vous opposer à leur traitement en écrivant à {s.contactEmail ? <a href={`mailto:${s.contactEmail}`}>{s.contactEmail}</a> : contact}. En cas de désaccord, vous pouvez saisir la CNIL (<a href="https://www.cnil.fr" rel="noopener noreferrer">cnil.fr</a>).
        </p>

        <h2>Cookies</h2>
        <p>Ce site n'utilise aucun cookie de suivi ni outil de mesure d'audience. Seul l'espace d'administration dépose un cookie de session, nécessaire à la connexion.</p>

        <h2>Propriété intellectuelle</h2>
        <p>Les photographies, créations, dessins et le logo présentés sur ce site sont la propriété de {editor}. Toute reproduction sans autorisation est interdite.</p>
      </div>
    </Panel>
  )
}
