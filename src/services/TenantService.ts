import { createAdminClient } from '@/lib/supabase/server';
import { Database, Json } from '@/types/database.types'; // 👈 Importem 'Json'

// Helpers de tipus
type TableInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
type UserRole = Database['public']['Enums']['user_role'];

export class TenantService {
    private supabase = createAdminClient();

    async createTenantStructure(data: {
        businessName: string;
        slug: string;
        repoUrl: string;
        branding: Record<string, unknown>;
        creatorUserId: string;
        creatorEmail: string;
    }) {
        console.log(`🏗️ [Tenant] 1. Iniciant procés per: ${data.slug}`);

        // ---------------------------------------------------------
        // PAS 1: ORGANITZACIÓ
        // ---------------------------------------------------------
        let org;
        
        const orgPayload: TableInsert<'organizations'> = {
            name: data.businessName,
            slug: data.slug,
        };

        const { data: newOrg, error: orgError } = await this.supabase
            .from('organizations')
            .insert(orgPayload)
            .select()
            .single();

        if (orgError) {
            if (orgError.code === '23505') { 
                console.warn(`⚠️ [Tenant] L'Org ja existeix. Recuperant...`);
                const { data: existingOrg } = await this.supabase
                    .from('organizations')
                    .select('*')
                    .eq('slug', data.slug)
                    .single();
                
                if (!existingOrg) throw new Error("No s'ha pogut recuperar l'org existent.");
                org = existingOrg;
            } else {
                throw new Error(`Error DB Org: ${orgError.message}`);
            }
        } else {
            org = newOrg;
            console.log(`✅ [Tenant] Organització creada: ${org.id}`);
        }

        // ---------------------------------------------------------
        // PAS 2: PERFIL (Imprescindible abans del projecte)
        // ---------------------------------------------------------
        console.log(`🏗️ [Tenant] 2. Assegurant Perfil...`);
        
        // Assegura't que 'admin' existeix al teu enum SQL. Si no, posa 'lead'.
        const role: UserRole = 'admin'; 

        const profilePayload: TableInsert<'profiles'> = {
            id: data.creatorUserId,
            organization_id: org.id,
            email: data.creatorEmail,
            role: role,
            full_name: data.businessName,
        };

        const { error: profileError } = await this.supabase
            .from('profiles')
            .upsert(profilePayload, { onConflict: 'id, organization_id' });

        if (profileError) {
            console.error("❌ Error profile:", profileError);
            throw new Error(`Error DB Profile: ${profileError.message}`);
        }

        // ---------------------------------------------------------
        // PAS 3: PROJECTE
        // ---------------------------------------------------------
        console.log(`🏗️ [Tenant] 3. Creant Projecte...`);

        const { data: existingProject } = await this.supabase
            .from('projects')
            .select('*')
            .eq('organization_id', org.id)
            .eq('domain', data.slug) 
            .maybeSingle();

        let project;

        if (existingProject) {
            console.warn(`⚠️ [Tenant] El projecte ja existeix.`);
            project = existingProject;
        } else {
            // ✅ SOLUCIÓ AL 'ANY': Casting segur a Json
            // 'unknown' esborra el tipus original, 'Json' aplica el de Supabase
            const brandingJson = data.branding as unknown as Json;

            const projectPayload: TableInsert<'projects'> = {
                client_id: data.creatorUserId,
                name: data.businessName,
                domain: data.slug,
                repository_url: data.repoUrl,
                organization_id: org.id,
                status: 'pending',
                
                // Utilitzem la variable amb el cast correcte
                branding_config: brandingJson, 
                
                // Cast manual per a objectes literals
                features_config: { blog: true, booking: false, ecommerce: false } as unknown as Json 
            };

            const { data: newProj, error: projError } = await this.supabase
                .from('projects')
                .insert(projectPayload)
                .select()
                .single();

            if (projError) throw new Error(`Error DB Project: ${projError.message}`);
            project = newProj;
            console.log(`✅ [Tenant] Projecte creat: ${project.id}`);
        }

        return { org, project };
    }
}