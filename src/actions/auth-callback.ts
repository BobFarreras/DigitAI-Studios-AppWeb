/**
 * @file src/actions/auth-callback.ts
 * @updated 2026-05-08
 * @summary Server actions per src/actions/auth-callback.ts
 * @scope Operacions de servidor, validacio i orquestracio de capa aplicacio.
 */
'use server';

import { createClient } from '@/lib/supabase/server';
import { SupabaseProfileRepository } from '@/repositories/supabase/SupabaseProfileRepository';

export async function resolveLocaleAuthCallback(requestUrl: string) {
  const { searchParams, origin } = new URL(requestUrl);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';
  const mainOrgId = process.env.NEXT_PUBLIC_MAIN_ORG_ID;

  if (!code) {
    return `${origin}/ca/auth/login?error=auth-code-error`;
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return `${origin}/ca/auth/login?error=auth-code-error`;
  }

  if (mainOrgId) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user && user.email) {
        const profileRepo = new SupabaseProfileRepository();
        const existingProfile = await profileRepo.findByEmailAndOrg(user.email, mainOrgId);

        if (!existingProfile) {
          const fullName = user.user_metadata.full_name || user.user_metadata.name || user.email.split('@')[0];
          await profileRepo.createProfile(user.id, user.email, mainOrgId, fullName);
        }
      }
    } catch (profileError) {
      console.error('❌ Error en Auto-Join OAuth:', profileError);
    }
  }

  return `${origin}/ca${next}`;
}

