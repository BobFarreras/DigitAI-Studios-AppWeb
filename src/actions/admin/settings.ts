'use server';

import { createClient } from '@/lib/supabase/server';
import { AdminSettingsRepository } from '@/repositories/supabase/AdminSettingsRepository';
import { AdminSettingsService } from '@/services/AdminSettingsService';

export async function getAdminSettingsData() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, authRequired: true as const };
  }

  const service = new AdminSettingsService(new AdminSettingsRepository(supabase));
  const connections = await service.getSocialConnectionsForUser(user.id);

  return { success: true, connections };
}
