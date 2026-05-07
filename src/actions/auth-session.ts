'use server';

import { createClient } from '@/lib/supabase/server';

export async function hasAuthenticatedSession() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return { success: true, hasSession: !!user };
}
