import { createClient, createAdminClient } from '@/lib/supabase/server';

export type ProjectMember = {
    user_id: string;
    role: string;
    profile: {
        full_name: string | null;
        email: string;
        avatar_url: string | null;
    };
};
// 1. Definim el tipus exacte que esperem de la consulta SQL
type ProjectMemberRow = {
    user_id: string;
    role: string;
    // Supabase retorna l'objecte relacionat aquí
    profiles: {
        full_name: string | null;
        email: string;
        avatar_url: string | null;
    } | null; // Pot ser null si l'usuari s'ha esborrat però la relació encara existeix (rar, però possible)
};
export class SupabaseProjectRepository {

    // A. Afegir membre al projecte
    async addMember(projectId: string, userId: string, role: string = 'member') {
        const supabase = createAdminClient(); // Admin powers
        return supabase
            .from('project_members')
            .insert({ project_id: projectId, user_id: userId, role })
            .select()
            .single();
    }

    // B. Eliminar membre
    async removeMember(projectId: string, userId: string) {
        const supabase = createAdminClient();
        return supabase
            .from('project_members')
            .delete()
            .eq('project_id', projectId)
            .eq('user_id', userId);
    }


    // D. Obtenir candidats
    async getAvailableCandidates(projectId: string, organizationId: string) {
        // 🔥 CANVI CLAU: AdminClient per poder llistar TOTS els perfils de l'org
        const supabase = createAdminClient();

        // 1. Tots els de l'organització
        const { data: orgUsers } = await supabase
            .from('profiles')
            .select('*')
            .eq('organization_id', organizationId);

        // 2. Els que ja són al projecte
        const { data: currentMembers } = await supabase
            .from('project_members')
            .select('user_id')
            .eq('project_id', projectId);

        if (!orgUsers) return [];

        const memberIds = new Set(currentMembers?.map(m => m.user_id));

        // Retornem només els que NO són membres encara
        return orgUsers.filter(u => !memberIds.has(u.id));
    }
    // C. Obtenir membres del projecte
   // C. Obtenir membres del projecte
  async getMembers(projectId: string): Promise<ProjectMember[]> {
    const supabase = createAdminClient();

    // 1. Obtenim la relació projecte-usuari
    const { data: members, error } = await supabase
      .from('project_members')
      .select('user_id, role')
      .eq('project_id', projectId);

    if (error || !members) return [];

    // 2. Obtenim els detalls dels perfils
    const userIds = members.map(m => m.user_id);
    if (userIds.length === 0) return [];

    const { data: userDetails } = await supabase
      .from('profiles')
      .select('id, full_name, email, avatar_url')
      .in('id', userIds);

    // 3. Unim les dades i assegurem el tipatge (Evitem errors TS)
    return members.map(m => {
      const profileData = userDetails?.find(u => u.id === m.user_id);

      return {
        user_id: m.user_id,
        // ✅ CORRECCIÓ 1: Si role és null, posem 'member' per defecte
        role: m.role || 'member', 
        
        // ✅ CORRECCIÓ 2: Construïm l'objecte profile netament
        profile: {
          full_name: profileData?.full_name || 'Usuari Desconegut',
          email: profileData?.email || 'Sense email',
          avatar_url: profileData?.avatar_url || null
        }
      };
    });
  }
}