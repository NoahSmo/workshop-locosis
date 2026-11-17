import { getPayload } from 'payload'
import config from '@payload-config'
import { NextResponse } from 'next/server'
import { inquirySchema } from '@/lib/inquirySchema'
import { rateLimit } from '@/lib/rateLimit'

const MAX_FILES = 3
const MAX_BYTES = 5 * 1024 * 1024

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!)

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local'
  if (!rateLimit(ip)) {
    return NextResponse.json({ ok: false, error: 'Trop de demandes envoyées. Réessayez dans une heure.' }, { status: 429 })
  }

  const form = await req.formData()
  const parsed = inquirySchema.safeParse(Object.fromEntries([...form.entries()].filter(([, v]) => typeof v === 'string')))
  if (!parsed.success) {
    // Honeypot rempli → on répond OK sans rien faire.
    if (form.get('website')) return NextResponse.json({ ok: true })
    return NextResponse.json({ ok: false, errors: parsed.error.flatten().fieldErrors }, { status: 400 })
  }
  const d = parsed.data

  const files = form.getAll('references').filter((f): f is File => f instanceof File && f.size > 0)
  if (files.length > MAX_FILES || files.some((f) => f.size > MAX_BYTES || !f.type.startsWith('image/'))) {
    return NextResponse.json({ ok: false, error: 'Images : 3 maximum, 5 Mo chacune.' }, { status: 400 })
  }

  const payload = await getPayload({ config })

  // Client : retrouvé par email, sinon créé.
  const email = d.email.toLowerCase()
  const existing = await payload.find({ collection: 'clients', where: { email: { equals: email } }, limit: 1 })
  const client =
    existing.docs[0] ??
    (await payload.create({ collection: 'clients', data: { name: d.name, email, phone: d.phone || undefined } }))

  const refIds: number[] = []
  for (const f of files) {
    const media = await payload.create({
      collection: 'media',
      data: { alt: `Inspiration — ${d.name}` },
      file: { data: Buffer.from(await f.arrayBuffer()), mimetype: f.type, name: f.name, size: f.size },
    })
    refIds.push(media.id)
  }

  await payload.create({
    collection: 'inquiries',
    data: {
      client: client.id,
      clientEmail: email,
      type: d.type,
      subject: d.subject,
      description: d.description,
      deadline: d.deadline ? new Date(d.deadline).toISOString() : undefined,
      budget: d.budget || undefined,
      references: refIds,
      status: 'new',
    },
  })

  // Emails : un échec d'envoi ne doit pas perdre la demande.
  const site = process.env.NEXT_PUBLIC_SITE_URL || ''
  try {
    await payload.sendEmail({
      to: process.env.NOTIFY_EMAIL,
      replyTo: email,
      subject: `Nouvelle demande : ${d.subject}`,
      html: `<p><b>${esc(d.name)}</b> (${esc(email)}) — ${esc(d.type)}</p><p>${esc(d.description).replace(/\n/g, '<br>')}</p><p><a href="${site}/admin/collections/inquiries">Ouvrir dans le CRM</a></p>`,
    })
    await payload.sendEmail({
      to: email,
      subject: 'Votre demande est bien reçue, Atelier Locosis',
      html: `<p>Bonjour ${esc(d.name)},</p><p>J'ai bien reçu votre demande « ${esc(d.subject)} ». Je vous réponds sous quelques jours.</p><p>— Atelier Locosis</p>`,
    })
  } catch (e) {
    payload.logger.error({ err: e }, 'Envoi email demande échoué')
  }

  return NextResponse.json({ ok: true })
}
