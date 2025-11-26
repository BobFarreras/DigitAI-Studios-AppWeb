'use server'

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { getLocale } from 'next-intl/server';
// 👇 Importem el repositori des del container
import { auditRepository } from '@/services/container';

// Esquema de validació
const AuditSchema = z.object({
  url: z.string().url({ message: "La URL ha de ser vàlida (https://...)" }),
  email: z.string().email({ message: "L'email no és correcte" }),
});

export type FormState = {
  message?: string;
  errors?: {
    url?: string[];
    email?: string[];
  };
};

export async function processWebAudit(prevState: FormState, formData: FormData): Promise<FormState> {
  const locale = await getLocale();

  const rawData = {
    url: formData.get('url'),
    email: formData.get('email'),
  };

  const validation = AuditSchema.safeParse(rawData);

  if (!validation.success) {
    return {
      errors: validation.error.flatten().fieldErrors,
      message: "Revisa les dades del formulari.",
    };
  }

  try {
    // 👇 ARA USEM EL REPOSITORI (Codi net!)
    // Ja no cal fer createClient() ni saber que usem Supabase
    await auditRepository.createAudit(validation.data.url, validation.data.email);
    console.log("ACCION REBUDA AL SERVIDOR:", validation.data);
  } catch (err) {
    console.error(err);
    return { message: "Error al guardar la sol·licitud. Torna-ho a provar." };
  }

  // Redirecció
  redirect(`/${locale}/auth/register?email=${encodeURIComponent(validation.data.email)}`);
}