import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';

type SocialConnection = Database['public']['Tables']['social_connections']['Row'];

export class AdminSettingsRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async getOrganizationIdByUserId(userId: string): Promise<string | null> {
    const { data, error } = await this.supabase
      .from('profiles')
      .select('organization_id')
      .eq('id', userId)
      .single();

    if (error || !data?.organization_id) return null;
    return data.organization_id;
  }

  async getSocialConnectionsByOrganization(organizationId: string): Promise<SocialConnection[]> {
    const { data, error } = await this.supabase
      .from('social_connections')
      .select('*')
      .eq('organization_id', organizationId);

    if (error || !data) return [];
    return data;
  }
}
