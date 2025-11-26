'use server'

import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { getLocale } from 'next-intl/server';

// 1. Esquema de Validació (Zod)
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

export async function submitAuditAction(prevState: FormState, formData: FormData): Promise<FormState> {
  // Obtenim l'idioma actual per a la redirecció
  const locale = await getLocale();

  // 2. Validació de dades
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

  // 3. Lògica de Base de Dades
  const supabase = await createClient();

  try {
    const { error } = await supabase
      .from('web_audits') // Ara tenim autocompletat gràcies als tipus!
      .insert({
        url: validation.data.url,
        email: validation.data.email,
        status: 'processing' // Ve del teu ENUM
      });

    if (error) {
      console.error('Supabase Error:', error);
      return { message: "Error al guardar la sol·licitud. Torna-ho a provar." };
    }

  } catch {
    return { message: "Error inesperat del servidor." };
  }

  // 4. Redirecció (Èxit)
  // Redirigim a la pàgina de registre passant l'email com a paràmetre
  redirect(`/${locale}/auth/register?email=${encodeURIComponent(validation.data.email)}`);
}