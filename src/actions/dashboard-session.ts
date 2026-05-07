'use server';

import { createClient } from '@/lib/supabase/server';

export async function getDashboardSessionData() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return { success: false, authRequired: true as const };
  }

  const { data: profiles } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id);

  const isAdmin = profiles?.some((p) => p.role === 'admin') || user.email === process.env.ADMIN_EMAIL;
  const userRole = isAdmin ? 'admin' : 'client';

  return {
    success: true,
    userEmail: user.email ?? '',
    userRole,
    profilesCount: profiles?.length ?? 0,
  };
}
