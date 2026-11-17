'use client'
import { useRef, useState, type FormEvent } from 'react'

type Errors = Record<string, string[] | undefined>

function FieldError({ k, msg }: { k: string; msg?: string }) {
  return msg ? <span className="err" id={`${k}-err`}>{msg}</span> : null
}

export function InquiryForm({ defaultType = 'commande', defaultEmail }: { defaultType?: string; defaultEmail?: string }) {
  const [state, setState] = useState<'idle' | 'sending' | 'done'>('idle')
  const [errors, setErrors] = useState<Errors>({})
  const [globalError, setGlobalError] = useState('')
  const formRef = useRef<HTMLFormElement>(null)

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setState('sending'); setErrors({}); setGlobalError('')
    try {
      const res = await fetch('/api/inquiry', { method: 'POST', body: new FormData(e.currentTarget) })
      const json = await res.json()
      if (json.ok) return setState('done')
      const errs: Errors = json.errors ?? {}
      setErrors(errs)
      setGlobalError(json.error ?? '')
      // Ramène le focus sur le premier champ à corriger.
      const first = Object.keys(errs)[0]
      if (first) formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus()
    } catch {
      setGlobalError("La demande n'est pas partie : connexion interrompue. Vérifiez votre réseau puis renvoyez.")
    }
    setState('idle')
  }

  if (state === 'done')
    return (
      <div className="sent" role="status">
        <h2>Demande envoyée</h2>
        <p>Un accusé de réception vient de partir vers votre adresse email. Je vous réponds sous quelques jours.</p>
      </div>
    )

  const err = (k: string) => errors[k]?.[0]
  const aria = (k: string) => (err(k) ? { 'aria-invalid': true as const, 'aria-describedby': `${k}-err` } : {})

  return (
    <form ref={formRef} className="form" onSubmit={onSubmit} noValidate>
      <div className="row2">
        <div className="field"><label htmlFor="name">Nom</label><input id="name" name="name" required autoComplete="name" {...aria('name')} /><FieldError k="name" msg={err("name")} /></div>
        <div className="field"><label htmlFor="email">Email</label><input id="email" name="email" type="email" required autoComplete="email" defaultValue={defaultEmail} {...aria('email')} /><FieldError k="email" msg={err("email")} /></div>
      </div>
      <div className="row2">
        <div className="field"><label htmlFor="phone">Téléphone <span className="hint">(facultatif)</span></label><input id="phone" name="phone" type="tel" autoComplete="tel" /></div>
        <div className="field">
          <label htmlFor="type">Type de demande</label>
          <select id="type" name="type" defaultValue={defaultType}>
            <option value="commande">Commande sur mesure</option>
            <option value="location">Location</option>
            <option value="retouche">Retouche ou réparation</option>
            <option value="autre">Autre</option>
          </select>
        </div>
      </div>
      <div className="field">
        <label htmlFor="subject">Titre du projet</label>
        <input id="subject" name="subject" required {...aria('subject')} />
        <span className="hint">Par exemple : robe médiévale pour un mariage</span>
        <FieldError k="subject" msg={err("subject")} />
      </div>
      <div className="field">
        <label htmlFor="description">Description</label>
        <textarea id="description" name="description" required {...aria('description')} />
        <span className="hint">Époque, usage, tailles, couleurs, inspirations</span>
        <FieldError k="description" msg={err("description")} />
      </div>
      <div className="row2">
        <div className="field"><label htmlFor="deadline">Date souhaitée <span className="hint">(facultatif)</span></label><input id="deadline" name="deadline" type="date" /></div>
        <div className="field"><label htmlFor="budget">Budget indicatif <span className="hint">(facultatif)</span></label><input id="budget" name="budget" /></div>
      </div>
      <div className="field">
        <label htmlFor="references">Images d'inspiration <span className="hint">(facultatif)</span></label>
        <input id="references" name="references" type="file" accept="image/*" multiple />
        <span className="hint">3 images maximum, 5 Mo chacune</span>
      </div>
      <input className="hp" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <div className="field">
        <label className="check"><input type="checkbox" name="consent" required {...aria('consent')} /><span>J'accepte que ces informations servent à répondre à ma demande.</span></label>
        <FieldError k="consent" msg={err("consent")} />
      </div>
      {globalError && <p className="err" role="alert">{globalError}</p>}
      <div><button className="btn" disabled={state === 'sending'}>{state === 'sending' ? 'Envoi en cours' : 'Envoyer la demande'}</button></div>
    </form>
  )
}
