import { createClient, createAdminClient } from '@/lib/supabase/server';
import { Database } from '@/types/database.types';
import { CampaignContext, TestCampaignDTO, TestTaskDTO, TestResultDTO, TesterProfile } from '@/types/models';
import type { MissionStats } from '@/services/GamificationService'; // 👈 Importamos el tipo para asegurar que cumplimos el contrato
type TestCampaignRow = Database['public']['Tables']['test_campaigns']['Row'];

type CampaignQueryResponse = TestCampaignRow & {
  projects: { name: string; domain: string | null } | null;
  test_tasks: {
    id: string;
    test_results: { count: number }[];
  }[];
};
// 1. Tipus per a la resposta "bruta" de Supabase (Raw Data)
// Això ens evita usar 'any' quan fem el cast
type CampaignResponse = {
  id: string;
  campaign: {
    id: string;
    title: string;
    description: string | null;
    status: string | null;
    project_id: string;
    test_tasks: { id: string }[]; // Array d'objectes amb id
  } | null;
};

// 2. Tipus per al resultat d'usuari
type UserResultRow = {
  task_id: string;
  status: string;
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

  async getActiveMissionsForUser(userId: string, projectId: string) {
    const supabase = await createClient();

    // 1. QUERY
    const { data: assignmentsData } = await supabase
      .from('test_assignments')
      .select(`
            id,
            campaign:test_campaigns (
                id, title, description, status, project_id,
                test_tasks ( id ) 
            )
        `)
      .eq('user_id', userId)
      .not('campaign', 'is', null);

    const assignments = (assignmentsData || []) as unknown as CampaignResponse[];

    // 2. FILTRATGE
    const activeAssignments = assignments.filter(a =>
      a.campaign &&
      a.campaign.status === 'active' &&
      a.campaign.project_id === projectId
    );

    // 3. OBTENIR RESULTATS
    const allTaskIds = activeAssignments.flatMap(a =>
      a.campaign ? a.campaign.test_tasks.map(t => t.id) : []
    );

    let userResults: UserResultRow[] = [];

    if (allTaskIds.length > 0) {
      const { data: res } = await supabase
        .from('test_results')
        .select('task_id, status')
        .eq('user_id', userId)
        .in('task_id', allTaskIds);

      if (res) {
        userResults = res as UserResultRow[];
      }
    }

    // 4. MAPATGE FINAL (DTO)
    return activeAssignments.map(assign => {
      const campaign = assign.campaign!;

      const campaignTaskIds = new Set(campaign.test_tasks.map(t => t.id));
      const relevantResults = userResults.filter(r => campaignTaskIds.has(r.task_id));

      // --- 🧮 CÀLCULS COMPLETES PER A MISSIONSTATS ---
      const totalTasks = campaign.test_tasks.length;

      // Comptem per estat
      const passed = relevantResults.filter(r => r.status === 'pass').length;
      const failed = relevantResults.filter(r => r.status === 'fail').length;
      const blocked = relevantResults.filter(r => r.status === 'blocked').length;

      // Pendents són els que no tenen cap resultat registrat
      const pending = totalTasks - (passed + failed + blocked);

      // Progrés basat en TASQUES PASSADES (Èxit)
      const progress = totalTasks > 0 ? Math.round((passed / totalTasks) * 100) : 0;

      // XP Reward (Lògica de negoci: 100 XP per tasca)
      const xpReward = totalTasks * 100;

      // Construïm l'objecte que compleix amb MissionStats
      const stats: MissionStats = {
        total: totalTasks,
        passed,
        failed,
        blocked,
        pending,
        progress,
        xpReward
      };

      return {
        id: campaign.id,
        title: campaign.title,
        description: campaign.description,
        stats: stats // ✅ Ara sí que té totes les propietats requerides
      };
    });
  }
  // K. Obtenir resultats detallats d'una campanya (Analytics)
  async getCampaignResults(campaignId: string) {
    const supabase = createAdminClient();

    // 1. Obtenim totes les tasques de la campanya (per saber el total)
    const { data: tasks } = await supabase
      .from('test_tasks')
      .select('id, title')
      .eq('campaign_id', campaignId);

    if (!tasks) return { results: [], totalTasks: 0 };

    const taskIds = tasks.map(t => t.id);
    const taskMap = new Map(tasks.map(t => [t.id, t.title]));

    // 2. Obtenim tots els resultats d'aquestes tasques
    const { data: results } = await supabase
      .from('test_results')
      .select(`
        id, status, comment, updated_at, task_id, user_id
      `)
      .in('task_id', taskIds)
      .order('updated_at', { ascending: false });

    // 3. Obtenim els usuaris involucrats (per mostrar noms)
    const userIds = Array.from(new Set(results?.map(r => r.user_id) || []));
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, full_name, email, avatar_url')
      .in('id', userIds);

    const profileMap = new Map(profiles?.map(p => [p.id, p]));

    // 4. Combinem les dades en un objecte fàcil de consumir per la UI
    const enrichedResults = results?.map(r => ({
      id: r.id,
      // ✅ CORRECCIÓ: Fem un cast explícit a l'estat
      status: (r.status as 'pass' | 'fail' | 'blocked') || 'blocked',
      comment: r.comment,
      updated_at: r.updated_at || new Date().toISOString(), // Assegurem data
      task_id: r.task_id,
      user_id: r.user_id,
      taskTitle: taskMap.get(r.task_id) || 'Tasca desconeguda',
      tester: profileMap.get(r.user_id) || { id: 'unknown', full_name: 'Desconegut', email: '...', avatar_url: null }
    })) || [];

    return {
      results: enrichedResults,
      totalTasks: tasks.length,
      tasks: tasks // Retornem també l'estructura per si cal
    };
  }
}


