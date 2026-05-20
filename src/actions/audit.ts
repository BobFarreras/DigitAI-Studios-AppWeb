/**
 * @file src/actions/audit.ts
 * @updated 2026-05-20
 * @summary Server actions for audit operations.
 * @scope Auth gate, validation, and service orchestration only.
 */
'use server';

import { auditService } from '@/services/container';
import { auditSchema } from '@/lib/validations/audit';
import { getServerEnv } from '@/config/server-env';
import { SupabaseProfileRepository } from '@/repositories/supabase/SupabaseProfileRepository';
import { redirect } from 'next/navigation';
import { getLocale } from 'next-intl/server';

export type FormState = {
  success?: boolean;
  message?: string;
  errors?: {
    url?: string[];
    email?: string[];
  };
};

function getMainOrgId() {
  return getServerEnv().NEXT_PUBLIC_MAIN_ORG_ID;
}

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
      const mainOrgId = getMainOrgId();

      if (!mainOrgId) {
        throw new Error("Configuració incorrecta");
      }

      const profileRepo = new SupabaseProfileRepository();
      const existingProfile = await profileRepo.findByEmailAndOrg(email, mainOrgId);

      const params = new URLSearchParams({
        email: email,
        trigger: 'audit_ready'
      });

      if (existingProfile) {
        redirect(`/${locale}/auth/login?${params.toString()}&next=/dashboard`);
      } else {
        redirect(`/${locale}/auth/register?${params.toString()}`);
      }
    }

  } catch (err) {
    if ((err as Error).message === 'NEXT_REDIRECT') {
      throw err;
    }
    return { success: false, message: "Error tècnic durant l'anàlisi." };
  }

  return { success: true };
}

export async function createAuditAction(url: string) {
  const locale = await getLocale();
  let auditId = null;

  const validation = auditSchema.shape.url.safeParse(url);

  if (!validation.success) {
    const errorMessage = validation.error.flatten().formErrors[0];
    return { success: false, message: errorMessage || 'URL invàlida.' };
  }

  const cleanUrl = validation.data;

  const { createClient } = await import('@/lib/supabase/server');
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !user.email) {
    return { success: false, message: 'Sessió caducada. Torna a iniciar sessió.' };
  }

  try {
    auditId = await auditService.performUserAudit(cleanUrl, user.id, user.email, locale);
  } catch {
    return { success: false, message: 'Error al processar l\'auditoria. Intenta-ho més tard.' };
  }

  if (auditId) {
    redirect(`/${locale}/dashboard`);
  }

  return { success: false, message: 'No s\'ha pogut crear l\'auditoria.' };
}

