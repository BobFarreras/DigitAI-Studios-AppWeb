'use server'

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { getLocale } from 'next-intl/server';
// Només necessitem el servei, ja no cridem al repositori directament des d'aquí
import { auditService } from '@/services/container';

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
    // ❌ LÍNIA ELIMINADA: await auditRepository.createAudit(...)
    
    // ✅ CORRECTE: Cridem al servei que orquestra tot el procés (Crear + Escanejar)
    await auditService.performFullAudit(validation.data.url, validation.data.email);
    
    console.log("AUDITORIA INICIADA:", validation.data);
  } catch (err) {
    console.error(err);
    return { message: "Error durant l'anàlisi. Verifica la URL o prova més tard." };
  }

  // Redirecció
  redirect(`/${locale}/auth/register?email=${encodeURIComponent(validation.data.email)}`);
}