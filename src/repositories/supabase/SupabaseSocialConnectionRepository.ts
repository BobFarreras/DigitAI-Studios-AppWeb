/**
 * @file src/repositories/supabase/SupabaseSocialConnectionRepository.ts
 * @updated 2026-05-20
 * @summary Supabase implementation for social connections data access.
 * @scope Data access only; no business logic.
 */
import { createClient } from '@/lib/supabase/server';

interface SocialConnectionUpsertData {
  organization_id: string;
  user_id: string;
  provider: 'linkedin' | 'facebook';
  access_token: string;
  provider_account_id: string;
  provider_page_id: string;
  provider_page_name: string;
  provider_avatar_url?: string;
  expires_at: number | null;
  updated_at: string;
}

export class SupabaseSocialConnectionRepository {
  async upsert(data: SocialConnectionUpsertData) {
    const supabase = await createClient();
    const { error } = await supabase.from('social_connections').upsert(data, {
      onConflict: 'organization_id, provider, provider_page_id',
    });
    if (error) throw error;
  }
}