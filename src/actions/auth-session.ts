/**
 * @file src/actions/auth-session.ts
 * @updated 2026-05-08
 * @summary Server actions per src/actions/auth-session.ts
 * @scope Operacions de servidor, validacio i orquestracio de capa aplicacio.
 */
'use server';

import { createClient } from '@/lib/supabase/server';

export async function hasAuthenticatedSession() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return { success: true, hasSession: !!user };
}

