'use server';

import { auditService } from '@/services/container';
import { auditSchema } from '@/lib/validations/audit';
import { redirect } from 'next/navigation';
import { getLocale } from 'next-intl/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

export type FormState = {
  success?: boolean;
  message?: string;
  errors?: {
    url?: string[];
    email?: string[];
  };
};

function getMainOrgId() {
  return process.env.NEXT_PUBLIC_MAIN_ORG_ID;
}

// ==========================================
// 1️⃣ ACTION PÚBLICA (Landing Page)
// ==========================================
export async function processWebAudit(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const locale = await getLocale();

  console.log("🚀 [Audit] Iniciant procés d'auditoria..."); // LOG 1

  const rawData = {
    url: formData.get('url'),
    email: formData.get('email'),
  };

  const validation = auditSchema.safeParse(rawData);

  if (!validation.success) {
    console.log("❌ [Audit] Error de validació:", validation.error.flatten().fieldErrors); // LOG 2
    return {
      success: false,
      errors: validation.error.flatten().fieldErrors,
      message: "Revisa les dades del formulari.",
    };
  }

  const email = validation.data.email || '';
  const { url } = validation.data;

  try {
    console.log(`🔍 [Audit] URL: ${url}, Email: ${email}`); // LOG 3

    // 1. Fem l'auditoria
    await auditService.performPublicAudit(url, email, locale);
    console.log("✅ [Audit] Servei d'auditoria completat."); // LOG 4

    if (email) {
      const mainOrgId = getMainOrgId();

      if (!mainOrgId) {
        console.error("❌ [Audit] FATAL: Manca MAIN_ORG_ID a les variables d'entorn.");
        throw new Error("Configuració incorrecta");
      }

      const supabaseAdmin = createAdminClient();

      console.log(`🏢 [Audit] Buscant usuari a la taula profiles. OrgID: ${mainOrgId}, Email: ${email}`); // LOG 5

      // Comprovem si l'usuari existeix A AQUESTA ORGANITZACIÓ
      const { data: existingProfile, error: dbError } = await supabaseAdmin
        .from('profiles')
        .select('id')
        .ilike('email', email)
        .eq('organization_id', mainOrgId)
        .maybeSingle();

      if (dbError) console.error("❌ [Audit] Error DB cercant profile:", dbError); // LOG 6

      console.log("👤 [Audit] Resultat cerca profile:", existingProfile ? "TROBAT (Redirigint a Login)" : "NO TROBAT (Redirigint a Register)"); // LOG 7

      const params = new URLSearchParams({
        email: email,
        trigger: 'audit_ready'
      });

      if (existingProfile) {
        // Usuari existeix a l'organització -> LOGIN
        redirect(`/${locale}/auth/login?${params.toString()}&next=/dashboard`);
      } else {
        // Usuari NO existeix a l'organització -> REGISTER
        redirect(`/${locale}/auth/register?${params.toString()}`);
      }
    }

  } catch (err) {
    // Ignorem l'error de redirecció de Next.js
    if ((err as Error).message === 'NEXT_REDIRECT') {
      throw err;
    }
    console.error("💥 [Audit] Error tècnic no controlat:", err);
    return { success: false, message: "Error tècnic durant l'anàlisi." };
  }

  return { success: true };
}

// ==========================================
// 2️⃣ ACTION PRIVADA (Dashboard)
// ==========================================

export async function createAuditAction(url: string) {
  const locale = await getLocale();
  let auditId = null;

  // 👇 AQUÍ ESTAVA L'ERROR
  // Utilitzem shape.url per validar només l'string
  const validation = auditSchema.shape.url.safeParse(url);

  if (!validation.success) {
    // ✅ CORRECCIÓ: En primitives, els errors estan a 'formErrors' després de fer flatten()
    // Això retorna un array de strings directament, així que agafem el primer [0].
    const errorMessage = validation.error.flatten().formErrors[0];

    return {
      success: false,
      message: errorMessage || 'URL invàlida.'
    };
  }

  const cleanUrl = validation.data; // Aquí ja tenim la URL neta (https://...)

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !user.email) {
    return { success: false, message: 'Sessió caducada. Torna a iniciar sessió.' };
  }

  try {
    auditId = await auditService.performUserAudit(cleanUrl, user.id, user.email, locale);
  } catch (e) {
    console.error("Error createAuditAction:", e);
    return { success: false, message: 'Error al processar l\'auditoria. Intenta-ho més tard.' };
  }

  if (auditId) {
    redirect(`/${locale}/dashboard/audits/${auditId}`);
  }

  return { success: false, message: 'No s\'ha pogut crear l\'auditoria.' };
}
