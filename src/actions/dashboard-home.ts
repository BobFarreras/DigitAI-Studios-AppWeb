'use server';

import { createClient } from '@/lib/supabase/server';
import { auditRepository } from '@/services/container';

export async function getDashboardHomeData() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !user.email) {
    return { success: false, authRequired: true as const };
  }

  const audits = await auditRepository.getAuditsByUserEmail(user.email);
  return {
    success: true,
    userEmail: user.email,
    audits,
  };
}
