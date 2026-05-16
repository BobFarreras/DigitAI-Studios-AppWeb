import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';

type ProjectWithCampaignCount = Database['public']['Tables']['projects']['Row'] & {
  test_campaigns: Array<{ count: number }>;
};

export class DashboardProjectRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async getMemberProjectIds(userId: string): Promise<string[]> {
    const { data, error } = await this.supabase
      .from('project_members')
      .select('project_id')
      .eq('user_id', userId);

    if (error || !data) return [];
    return data.map((m) => m.project_id);
  }

  async getProjectsForUser(userId: string, memberProjectIds: string[]): Promise<ProjectWithCampaignCount[]> {
    const safeIds = memberProjectIds.join(',') || '00000000-0000-0000-0000-000000000000';
    const { data, error } = await this.supabase
      .from('projects')
      .select('*, test_campaigns(count)')
      .or(`client_id.eq.${userId},id.in.(${safeIds})`)
      .order('created_at', { ascending: false });

    if (error || !data) return [];
    return data as ProjectWithCampaignCount[];
  }

  async getProjectDetail(projectId: string) {
    const { data, error } = await this.supabase
      .from('projects')
      .select('name, domain, repository_url')
      .eq('id', projectId)
      .single();

    if (error || !data) return null;
    return data;
  }

  async getAdminProjectById(projectId: string) {
    const { data, error } = await this.supabase
      .from('projects')
      .select('*, organizations(*)')
      .eq('id', projectId)
      .single();

    if (error || !data) return null;
    return data;
  }
}
