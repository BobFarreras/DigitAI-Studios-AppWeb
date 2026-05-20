/**
 * @file src/repositories/supabase/SupabaseUserSettingsRepository.ts
 * @updated 2026-05-20
 * @summary Supabase implementation for user settings reads.
 * @scope Data access only; no business logic.
 */
import { createAdminClient } from '@/lib/supabase/server';
import type { IUserSettingsRepository } from '@/repositories/interfaces/IUserSettingsRepository';

export class SupabaseUserSettingsRepository implements IUserSettingsRepository {
  async getLocale(userId: string): Promise<string> {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('profiles')
      .select('locale')
      .eq('id', userId)
      .single();

    if (error) {
      console.warn('Could not fetch user locale, defaulting to ca:', error.message);
      return 'ca';
    }

    return (data as { locale?: string })?.locale ?? 'ca';
  }
}