import { createClient, createAdminClient } from '@/lib/supabase/server';
import { Database } from '@/types/database.types';
import { CampaignContext, TestCampaignDTO, TestTaskDTO, TestResultDTO, TesterProfile } from '@/types/models';

type TestCampaignRow = Database['public']['Tables']['test_campaigns']['Row'];

type CampaignQueryResponse = TestCampaignRow & {
  projects: { name: string; domain: string | null } | null;
  test_tasks: {
    id: string;
    test_results: { count: number }[];
  }[];
};

export class SupabaseTestRepository {

  // A. Context del Test (Admin o User)
  async getCampaignWithContext(campaignId: string, userId: string): Promise<CampaignContext> {
    const supabase = createAdminClient();

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

    // Mapeig
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

  // --- MÈTODES D'ESCRIPTURA ---

  async saveResult(userId: string, taskId: string, status: string, comment: string) {
    const supabase = await createClient(); // Usuari normal
    return supabase.from('test_results').upsert({
      user_id: userId,
      task_id: taskId,
      status,
      comment,
      updated_at: new Date().toISOString()
    }, { onConflict: 'task_id, user_id' });
  }

  async createTask(data: { campaignId: string; title: string; description?: string; orderIndex: number }) {
    const supabase = createAdminClient();
    return supabase.from('test_tasks').insert({
      campaign_id: data.campaignId,
      title: data.title,
      description: data.description,
      order_index: data.orderIndex
    }).select().single();
  }

  async deleteTask(taskId: string) {
    const supabase = createAdminClient();
    return supabase.from('test_tasks').delete().eq('id', taskId);
  }

  async reorderTasks(tasks: { id: string; order_index: number }[]) {
    const supabase = createAdminClient();
    for (const t of tasks) {
      await supabase.from('test_tasks').update({ order_index: t.order_index }).eq('id', t.id);
    }
  }

  async assignTester(campaignId: string, userId: string) {
    const supabase = createAdminClient();
    return supabase.from('test_assignments').insert({
      campaign_id: campaignId,
      user_id: userId
    });
  }

  async removeTester(campaignId: string, userId: string) {
    const supabase = createAdminClient();
    return supabase.from('test_assignments').delete()
      .eq('campaign_id', campaignId)
      .eq('user_id', userId);
  }

  async createCampaign(data: { projectId: string; title: string; description: string; instructions: string }) {
    const supabase = createAdminClient();
    return supabase.from('test_campaigns').insert({
      project_id: data.projectId,
      title: data.title,
      description: data.description,
      instructions: data.instructions,
      status: 'active'
    }).select().single();
  }

  async updateCampaign(id: string, data: { title?: string; description?: string; instructions?: string; status?: string }) {
    const supabase = createAdminClient();
    return supabase.from('test_campaigns').update(data).eq('id', id);
  }

  // --- MÈTODES DE LECTURA (Corregits amb Manual Join) ---

  async getAllCampaignsForAdmin() {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('test_campaigns')
      .select(`
        *,
        projects(name, domain),
        test_tasks ( id, test_results (count) )
      `)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);

    const typedData = data as unknown as CampaignQueryResponse[];

    return typedData.map((camp) => {
      const totalResults = camp.test_tasks?.reduce((acc, task) => {
        const count = task.test_results?.[0]?.count || 0;
        return acc + count;
      }, 0) || 0;

      return {
        ...camp,
        stats: {
          total_tasks: camp.test_tasks?.length || 0,
          total_results: totalResults
        }
      };
    });
  }

  async getCampaignsByProject(projectId: string) {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('test_campaigns')
      .select(`
        *,
        test_assignments (count),
        test_tasks (count)
      `)
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    if (error) return [];

    return data.map(camp => ({
      id: camp.id,
      title: camp.title,
      status: camp.status,
      testerCount: camp.test_assignments?.[0]?.count || 0,
      taskCount: camp.test_tasks?.[0]?.count || 0,
      createdAt: camp.created_at
    }));
  }

  // A. Llistar tots els usuaris (Legacy - potser ja no s'usa)
  async getAvailableTesters(): Promise<TesterProfile[]> {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from('profiles')
      .select('id, email, full_name, avatar_url')
      .neq('role', 'admin')
      .order('email');
    return data || [];
  }

  // src/repositories/supabase/SupabaseTestRepository.ts

  // ...

  // B. Llistar testers assignats (i filtrar duplicats per OrgID implícitament agafant el primer)
  async getAssignedTesters(campaignId: string): Promise<TesterProfile[]> {
    const supabase = createAdminClient();

    const { data: assignments } = await supabase
      .from('test_assignments')
      .select('user_id')
      .eq('campaign_id', campaignId);

    if (!assignments || assignments.length === 0) return [];

    const userIds = assignments.map(a => a.user_id);
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, email, full_name, avatar_url')
      .in('id', userIds);

    // Netejar duplicats en JS (el mètode ràpid)
    const uniqueMap = new Map();
    profiles?.forEach(p => {
      if (!uniqueMap.has(p.id)) uniqueMap.set(p.id, p);
    });

    return Array.from(uniqueMap.values());
  }

  // D. Obtenir candidats vàlids per a un test
  async getProjectMembersForTest(campaignId: string, projectId: string, organizationId: string): Promise<TesterProfile[]> {
    const supabase = createAdminClient();

    // 1. Membres del Projecte (IDs)
    const { data: projectMembers } = await supabase
      .from('project_members')
      .select('user_id')
      .eq('project_id', projectId);

    if (!projectMembers || projectMembers.length === 0) return [];

    // 2. Membres del Test (per excloure)
    const { data: testMembers } = await supabase
      .from('test_assignments')
      .select('user_id')
      .eq('campaign_id', campaignId);

    const assignedIds = new Set(testMembers?.map(t => t.user_id));

    // 3. Filtrar IDs
    const candidateIds = projectMembers
      .map(pm => pm.user_id)
      .filter(uid => !assignedIds.has(uid));

    if (candidateIds.length === 0) return [];

    // 4. Obtenir perfils (FILTRANT PER ORGANITZACIÓ)
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, email, full_name, avatar_url')
      .in('id', candidateIds)
      .eq('organization_id', organizationId); // 👈 Filtre clau

    return profiles || [];
  }
  // I. Eliminar Campanya (Admin)
  async deleteCampaign(campaignId: string) {
    const supabase = createAdminClient(); // Admin per saltar restriccions
    return supabase
      .from('test_campaigns')
      .delete()
      .eq('id', campaignId);
  }
  // J. Obtenir les meves missions (Tester Dashboard)
  async getMyAssignments(userId: string) {
    const supabase = await createClient(); // Client normal (RLS aplicat)

    const { data, error } = await supabase
      .from('test_assignments')
      .select(`
        id, 
        assigned_at,
        campaign:test_campaigns (
            id, title, description, status, project_id,
            project:projects ( name, domain ),
            test_tasks ( count )
        )
      `) // 👆 He afegit 'id' al principi perquè el necessites abaix
      .eq('user_id', userId)
      .order('assigned_at', { ascending: false });

    if (error || !data) return [];

    // 1. Definim el tipus del resultat del Join per treure l'any
    type AssignmentRow = {
        id: string;
        assigned_at: string | null;
        campaign: {
            id: string;
            title: string;
            description: string | null;
            status: string | null;
            project: { name: string; domain: string | null } | null;
            test_tasks: { count: number }[];
        } | null;
    };

    // 2. Fem el cast segur
    const rows = data as unknown as AssignmentRow[];

    // 3. Mapegem
    return rows.map((row) => {
      const campaign = row.campaign;
      
      // Si per algun motiu la campanya s'ha esborrat però l'assignació no, evitem error
      if (!campaign) return null;

      return {
        assignmentId: row.id,
        campaignId: campaign.id,
        title: campaign.title,
        description: campaign.description,
        projectName: campaign.project?.name,
        projectDomain: campaign.project?.domain,
        // Supabase torna el count dins d'un array d'objectes
        totalTasks: campaign.test_tasks?.[0]?.count || 0,
        status: campaign.status,
        assignedAt: row.assigned_at
      };
    })
    // Filtrem els nuls (campanyes esborrades) i només les actives
    // Aquest "predicate" (item is ...) ajuda a TS a saber que ja no hi ha nulls
    .filter((item): item is NonNullable<typeof item> => item !== null && item.status === 'active');
  }


}