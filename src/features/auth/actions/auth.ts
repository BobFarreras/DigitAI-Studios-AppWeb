'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  // Redirigim a la home pública amb el locale per defecte o l'actual si el passem
  redirect('/');
}