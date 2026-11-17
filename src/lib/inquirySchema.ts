import { z } from 'zod'

export const inquirySchema = z.object({
  name: z.string().trim().min(2, 'Indiquez votre nom').max(120),
  email: z.string().trim().email('Adresse email incomplète ou incorrecte').max(200),
  phone: z.string().trim().max(40).optional().or(z.literal('')),
  type: z.enum(['commande', 'location', 'retouche', 'autre']),
  subject: z.string().trim().min(3, 'Donnez un titre à votre projet').max(160),
  description: z.string().trim().min(20, 'Décrivez le projet en quelques phrases (20 caractères minimum)').max(5000),
  deadline: z.string().optional().or(z.literal('')),
  budget: z.string().trim().max(80).optional().or(z.literal('')),
  consent: z.literal('on', { message: 'Cochez la case pour envoyer la demande' }),
  website: z.string().max(0).optional(), // honeypot
})

export type InquiryInput = z.infer<typeof inquirySchema>
