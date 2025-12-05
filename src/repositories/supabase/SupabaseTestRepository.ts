import { createClient } from '@/lib/supabase/server';
import { CampaignContext, TestCampaignDTO, TestTaskDTO, TestResultDTO, TesterProfile } from '@/types/models';

export class SupabaseTestRepository {

  async getCampaignWithContext(campaignId: string, userId: string): Promise<CampaignContext> {
    const supabase = await createClient();

    // 1. Campanya
    const { data: campaignData } = await supabase
      .from('test_campaigns')
      .select('*')
      .eq('id', campaignId)
      .single();

    if (!campaignData) return { campaign: null, tasks: [], results: [] };

    // 2. Tasques
    const { data: tasksData } = await supabase
      .from('test_tasks')
      .select('*')
      .eq('campaign_id', campaignId)
      .order('order_index', { ascending: true });

    // 3. Resultats
    const taskIds = tasksData?.map(t => t.id) || [];
    const { data: resultsData } = await supabase
      .from('test_results')
      .select('*')
      .in('task_id', taskIds)
      .eq('user_id', userId);

    // Mapeig manual per assegurar tipus (evitar errors de nulls)
    const campaign: TestCampaignDTO = {
      id: campaignData.id,
      projectId: campaignData.project_id,
      title: campaignData.title,
      description: campaignData.description,
      instructions: campaignData.instructions,
      status: campaignData.status || 'active',
      createdAt: new Date(campaignData.created_at || Date.now())
    };

    const tasks: TestTaskDTO[] = (tasksData || []).map(t => ({
      id: t.id,
      campaignId: t.campaign_id,
      title: t.title,
      description: t.description,
      orderIndex: t.order_index ?? 0
    }));

    const results: TestResultDTO[] = (resultsData || []).map(r => ({
      id: r.id,
      taskId: r.task_id,
      userId: r.user_id,
      status: (r.status as 'pass' | 'fail' | 'blocked') || 'blocked',
      comment: r.comment,
      updatedAt: new Date(r.updated_at || Date.now())
    }));

    return { campaign, tasks, results };
  }

  async saveResult(userId: string, taskId: string, status: string, comment: string) {
    const supabase = await createClient();
    return supabase.from('test_results').upsert({
      user_id: userId,
      task_id: taskId,
      status,
      comment,
      updated_at: new Date().toISOString()
    }, { onConflict: 'task_id, user_id' });
  }
  // A. Llistar tots els usuaris disponibles per ser testers (excepte admins)
  async getAvailableTesters(): Promise<TesterProfile[]> {
    const supabase = await createClient();
    // Filtrem per rol 'client' o 'staff', o tots els que no siguin admin pur
    const { data } = await supabase
      .from('profiles')
      .select('id, email, full_name, avatar_url')
      .neq('role', 'admin')
      .order('email');

    return data || [];
  }

  // B. Llistar testers ja assignats a una campanya
  async getAssignedTesters(campaignId: string): Promise<TesterProfile[]> {
    const supabase = await createClient();
    const { data } = await supabase
      .from('test_assignments')
      .select(`
        user_id,
        profiles:user_id (
          id, email, full_name, avatar_url
        )
      `)
      .eq('campaign_id', campaignId);

    // 1. Definim el que esperem rebre d'aquesta query específica
    type AssignmentRow = {
      user_id: string;
      profiles: TesterProfile | null; // Pot ser null si la relació falla (encara que no hauria)
    };

    // 2. Fem el cast segur utilitzant 'unknown' primer per "netejar" el tipus inferit
    const rows = data as unknown as AssignmentRow[] | null;

    // 3. Mapegem i filtrem els nulls amb un "Type Predicate" (p is TesterProfile)
    return rows
      ?.map((item) => item.profiles)
      .filter((p): p is TesterProfile => p !== null) || [];
  }

  // C. Assignar Usuari
  async assignTester(campaignId: string, userId: string) {
    const supabase = await createClient();
    return supabase.from('test_assignments').insert({
      campaign_id: campaignId,
      user_id: userId
    });
  }

  // D. Eliminar Usuari
  async removeTester(campaignId: string, userId: string) {
    const supabase = await createClient();
    return supabase.from('test_assignments').delete()
      .eq('campaign_id', campaignId)
      .eq('user_id', userId);
  }
}