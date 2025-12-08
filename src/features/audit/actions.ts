'use server';

import { auditService } from '@/services/container';
import { z } from 'zod';
import { redirect } from 'next/navigation';
import { getLocale } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/server'; // Necessitem client admin per comprovar usuaris
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

// Recuperem la variable d'entorn
const MAIN_ORG_ID = process.env.NEXT_PUBLIC_MAIN_ORG_ID;





export async function processWebAudit(
  prevState: FormState, 
  formData: FormData
): Promise<FormState> {
  const locale = await getLocale();

  const rawData = {
    url: formData.get('url'),
    email: formData.get('email'),
  };

  const validation = PublicAuditSchema.safeParse(rawData);
  if (!validation.success) {
    return {
      success: false,
      errors: validation.error.flatten().fieldErrors,
      message: "Revisa les dades del formulari.",
    };
  }

  const email = validation.data.email.toLowerCase().trim();
  const url = validation.data.url;

  try {
    // 1. Executar Auditoria
    await auditService.performPublicAudit(url, email, locale);
    
    // 2. ✨ LÒGICA MILLORADA: DETECCIÓ PER ORG_ID ✨
    const supabaseAdmin = createAdminClient();
    

    // Busquem si aquest email té un perfil DINS de la teva organització
    const { data: existingProfile } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .ilike('email', email)
      .eq('organization_id', MAIN_ORG_ID!) // 👈 EL FILTRE CLAU
      .maybeSingle();

    const encodedEmail = encodeURIComponent(email);

    if (existingProfile) {
      console.log(`✅ Client existent detectat a l'Org (${email}). Redirigint a Login.`);
      // Si existeix a LA TEVA org -> Login
      redirect(`/${locale}/auth/login?email=${encodedEmail}&next=/dashboard`);
    } else {
      console.log(`🆕 Nou Lead per a l'Org (${email}). Redirigint a Registre.`);
      // Si no existeix a la teva org (encara que tingui compte a altres),
      // l'enviem al registre perquè es creï el perfil a la teva org.
      redirect(`/${locale}/auth/register?email=${encodedEmail}`);
    }

  } catch (err) {
    if ((err as Error).message === 'NEXT_REDIRECT') {
        throw err;
    }

    console.error("Error processWebAudit:", err);
    return { success: false, message: "Error tècnic durant l'anàlisi. Torna-ho a provar." };
  }
  
  return { success: true }; 
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
    auditId = await auditService.performUserAudit(url, user.id, user.email, locale);

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
