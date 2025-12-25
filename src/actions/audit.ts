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

const MAIN_ORG_ID = process.env.NEXT_PUBLIC_MAIN_ORG_ID;

// ==========================================
// 1️⃣ ACTION PÚBLICA (Landing Page)
// ==========================================
export async function processWebAudit(
  prevState: FormState, 
  formData: FormData
): Promise<FormState> {
  const locale = await getLocale();

  const rawData = {
    url: formData.get('url'),
    email: formData.get('email'),
  };

  const validation = auditSchema.safeParse(rawData);

  if (!validation.success) {
    return {
      success: false,
      errors: validation.error.flatten().fieldErrors,
      message: "Revisa les dades del formulari.",
    };
  }

  const email = validation.data.email || '';
  const { url } = validation.data; 

  try {
    await auditService.performPublicAudit(url, email, locale);
    
    if (email) {
        const supabaseAdmin = createAdminClient();
        
        const { data: existingProfile } = await supabaseAdmin
          .from('profiles')
          .select('id')
          .ilike('email', email)
          .eq('organization_id', MAIN_ORG_ID!)
          .maybeSingle();

        const encodedEmail = encodeURIComponent(email);

        if (existingProfile) {
          redirect(`/${locale}/auth/login?email=${encodedEmail}&next=/dashboard`);
        } else {
          redirect(`/${locale}/auth/register?email=${encodedEmail}`);
        }
    }

  } catch (err) {
    if ((err as Error).message === 'NEXT_REDIRECT') {
        throw err;
    }
    console.error("Error processWebAudit:", err);
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