/**
 * @file src/actions/user-settings.ts
 * @updated 2026-05-20
 * @summary Server action for updating user settings including locale.
 * @scope Auth gate, input validation, and service orchestration only.
 */
'use server';

import { SupabaseProfileRepository } from '@/repositories/supabase/SupabaseProfileRepository';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const localeSchema = z.object({
  locale: z.enum(['ca', 'es', 'en', 'it']),
});

type SettingsResult = { success: true } | { success: false; error: string };

export async function updateUserLocale(input: unknown): Promise<SettingsResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'auth_required' };
  }

  const parsed = localeSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: 'invalid_payload' };
  }

  try {
    const profileRepo = new SupabaseProfileRepository();
    const profile = await profileRepo.updateLocale(user.id, parsed.data.locale);

    if (profile) {
      revalidatePath('/dashboard');
      revalidatePath('/dashboard/profile');
      revalidatePath('/dashboard/learn');
      revalidatePath('/dashboard/review');
    }

    return { success: true };
  } catch {
    return { success: false, error: 'update_failed' };
  }
}