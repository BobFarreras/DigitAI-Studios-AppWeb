'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { getLocale } from 'next-intl/server';

export async function signOutAction() {
  const locale = await getLocale();
  const supabase = await createClient();
  
  // 1. Tanquem sessió al servidor (neteja cookies)
  await supabase.auth.signOut();

  // 2. Redirigim al login (això automàticament fa neteja de cache de ruta)
  redirect(`/${locale}/auth/login`);
}