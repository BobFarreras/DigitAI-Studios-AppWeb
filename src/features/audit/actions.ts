'use server';

import { auditService } from '@/services/container';
import { z } from 'zod';
import { redirect } from 'next/navigation';
import { getLocale } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';

// --- 1. SCHEMAS DE VALIDACIÓ ---

const PublicAuditSchema = z.object({
  url: z.string().url({ message: "La URL ha de ser vàlida (https://...)" }),
  email: z.string().email({ message: "L'email no és correcte" }),
});

const PrivateAuditSchema = z.string().url();

// --- 2. TIPUS PER A ELS FORMULARIS ---

export type FormState = {
  success?: boolean;
  message?: string;
  errors?: {
    url?: string[];
    email?: string[];
  };
};

// --- 3. ACTION PÚBLICA (Landing Page) ---
// Aquesta és la que crida l'AuditForm de la home
export async function processWebAudit(prevState: FormState, formData: FormData): Promise<FormState> {
  const locale = await getLocale();

  const rawData = {
    url: formData.get('url'),
    email: formData.get('email'),
  };

  // 1. Validem URL i Email
  const validation = PublicAuditSchema.safeParse(rawData);

  if (!validation.success) {
    return {
      success: false,
      errors: validation.error.flatten().fieldErrors,
      message: "Revisa les dades del formulari.",
    };
  }

  try {
    // 2. Cridem al servei per fer l'auditoria PÚBLICA
    // (Aquest mètode s'encarregarà de crear l'usuari o lligar-ho per email)
    await auditService.performPublicAudit(validation.data.url, validation.data.email);
    
  } catch (err) {
    console.error(err);
    return { success: false, message: "Error durant l'anàlisi. Prova més tard." };
  }

  // 3. Redirecció a Registre (perquè vegi el resultat allà)
  redirect(`/${locale}/auth/register?email=${encodeURIComponent(validation.data.email)}`);
}


// --- 4. ACTION PRIVADA (Dashboard) ---
// Aquesta és la que crida el CreateAuditForm del panell
export async function createAuditAction(url: string) {
  const locale = await getLocale();
  let auditId = null;

  // 1. Validem només URL
  const validation = PrivateAuditSchema.safeParse(url);
  if (!validation.success) {
    return { success: false, message: 'URL invàlida.' };
  }

  // 2. Comprovem sessió
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !user.email) {
    return { success: false, message: 'No estàs autenticat.' };
  }

  try {
    // 3. Cridem al servei per fer l'auditoria PRIVADA (ja tenim user.id)
    auditId = await auditService.performUserAudit(url, user.id, user.email);

  } catch (e) {
    console.error(e);
    return { success: false, message: 'Error al processar l\'auditoria.' };
  }

  // 4. Redirecció al detall de l'informe
  if (auditId) {
    redirect(`/${locale}/dashboard/audits/${auditId}`);
  }
  
  return { success: false, message: 'Error desconegut al crear.' };
}