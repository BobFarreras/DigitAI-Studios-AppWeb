/**
 * @file src/actions/session-user.ts
 * @updated 2026-05-08
 * @summary Server actions per src/actions/session-user.ts
 * @scope Operacions de servidor, validacio i orquestracio de capa aplicacio.
 */
'use server';

import { createClient } from '@/lib/supabase/server';

export async function getSessionUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return { success: true, user };
}

