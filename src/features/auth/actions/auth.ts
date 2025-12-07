'use server';

import { createClient } from '@/lib/supabase/server';

export async function signOutAction() {
  const supabase = await createClient();
  
  // 1. Tanquem sessió al servidor (neteja cookies)
  await supabase.auth.signOut();
return { success: true };
}