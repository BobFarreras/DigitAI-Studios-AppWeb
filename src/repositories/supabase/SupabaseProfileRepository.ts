import { createAdminClient } from '@/lib/supabase/server';

export class SupabaseProfileRepository {

    // Buscar si existeix perfil per a un email en una ORG concreta
    // Usem admin client per saltar-nos RLS si cal, o per seguretat en server actions
    async findByEmailAndOrg(email: string, orgId: string) {
        const supabase = createAdminClient();

        const { data } = await supabase
            .from('profiles')
            .select('id')
            .eq('email', email)
            .eq('organization_id', orgId)
            .maybeSingle();

        return data;
    }

    // Crear perfil manualment (quan l'usuari d'Auth ja existeix)
    async createProfile(userId: string, email: string, orgId: string, fullName?: string) {
        const supabase = createAdminClient();

        return await supabase.from('profiles').insert({
            id: userId, // Mateix ID que auth.users
            email: email,
            organization_id: orgId,
            full_name: fullName
        });
    }
}