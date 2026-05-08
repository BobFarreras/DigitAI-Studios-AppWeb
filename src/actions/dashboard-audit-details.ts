'use server';

import { createClient } from '@/lib/supabase/server';
import { auditRepository } from '@/services/container';
import { AuditDTO } from '@/types/models';

type DashboardAuditDetailResult =
  | { success: true; audit: AuditDTO }
  | { success: false; authRequired?: true; notFound?: true; forbidden?: true };

/**
 * Retorna el detall d'una auditoria per al dashboard d'usuari.
 * Responsabilitat: authn/authz i recuperació de l'auditoria.
 */
export async function getDashboardAuditDetail(id: string): Promise<DashboardAuditDetailResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !user.email) {
    return { success: false, authRequired: true };
  }

  const audit = await auditRepository.getAuditById(id);
  if (!audit) {
    return { success: false, notFound: true };
  }

  if (audit.email !== user.email) {
    return { success: false, forbidden: true };
  }

  return { success: true, audit };
}
