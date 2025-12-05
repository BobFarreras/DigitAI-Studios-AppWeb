'use server';

import { FactoryService } from '@/services/FactoryService';
import { AIService } from '@/services/AIService';
import { MasterConfig } from '@/types/config';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import { ActionResult } from '@/types/actions';
import { Json } from '@/types/database.types';

const factory = new FactoryService();
const ai = new AIService();

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Funció robusta per esperar que el repo existeixi
async function waitForRepoReady(slug: string, attempts = 20): Promise<boolean> {
    for (let i = 0; i < attempts; i++) {
        try {
            // Intentem llegir el package.json per veure si ja s'ha copiat el template
            await factory.getFileSha(slug, 'package.json');
            return true;
        } catch (e) {
            console.log(`⏳ [Factory] Esperant inicialització... (${i + 1}/${attempts})`);
            await wait(3000); // 3 segons entre intents
        }
    }
    return false;
}

export async function createProjectAction(prevState: unknown, formData: FormData): Promise<ActionResult> {
    try {
        const businessName = formData.get('businessName') as string;
        const slug = formData.get('slug') as string;
        const description = formData.get('description') as string;
        const primaryColor = formData.get('primaryColor') as string;
        const logoFile = formData.get('logo') as File;

        if (!businessName || !slug) {
            return {
                error: "Falten dades.",
                fields: { 
                    businessName, 
                    slug, 
                    description, 
                    primaryColor 
                }
            };
        }

        // 1. IA
        console.log(`🤖 [IA] Generant textos per: ${businessName}`);
        const aiContent = await ai.generateSiteContent(businessName, description);

        // 2. GITHUB: Crear Repo
        const repoData = await factory.createRepository(slug, `Web de ${businessName}`);

        // ESPERA ACTIVA: No seguim fins que el repo estigui llest
        console.log("⏳ [Factory] Verificant estat del repositori...");
        const isReady = await waitForRepoReady(slug);
        
        if (!isReady) {
            throw new Error("Timeout: GitHub ha trigat massa a crear els fitxers.");
        }

        // 3. GITHUB: Pujar Logo
        await factory.uploadLogo(slug, logoFile);

        // 4. PREPARAR CONFIG
        const config: MasterConfig = {
            identity: {
                name: businessName,
                description: aiContent.hero.subtitle || description,
                logoUrl: "/branding/logo.png",
                faviconUrl: "/favicon.ico",
                contactEmail: "info@client.com"
            },
            branding: {
                colors: {
                    primary: primaryColor,
                    secondary: "#10b981",
                    background: "#ffffff",
                    foreground: "#0f172a"
                },
                radius: 0.5
            },
            modules: {
                landing: { active: true, sections: ['hero', 'services', 'contact'] },
                auth: true,
                dashboard: true,
                booking: formData.get('module_booking') === 'on',
                blog: formData.get('module_blog') === 'on',
                inventory: formData.get('module_inventory') === 'on',
                ecommerce: false,
                accessControl: false
            },
            i18n: { locales: ['ca', 'es'], defaultLocale: 'ca' }
        };

        // 5. GITHUB: Injectar Config
        await factory.injectConfiguration(slug, config);

        // 6. DB LOCAL: Guardar (Admin Client)
        const supabaseAdmin = createAdminClient();
        const supabaseUser = await createClient();
        const { data: { user } } = await supabaseUser.auth.getUser();

        // 6.1 Crear Organització
        const { data: newOrg, error: orgError } = await supabaseAdmin
            .from('organizations')
            .insert({
                name: businessName,
                slug: slug,
                domain: `${slug}.vercel.app`,
                plan: 'basic',
                branding_config: config.branding as unknown as Json
            })
            .select()
            .single();

        if (orgError) throw new Error(`Error DB Org: ${orgError.message}`);

        // 6.2 Crear Projecte
        const { error: projectError } = await supabaseAdmin
            .from('projects')
            .insert({
                name: businessName,
                domain: slug,
                repository_url: repoData.html_url,
                status: 'pending',
                client_id: user?.id || newOrg.id,
                organization_id: newOrg.id
            });

        if (projectError) console.error("❌ Error DB Projecte:", projectError);

        return { success: true, repoUrl: repoData.html_url };

    } catch (error: unknown) {
        // Gestió d'errors segura (Type-Safe)
        let errorMessage = "Error desconegut al procés de fàbrica.";
        if (error instanceof Error) {
            errorMessage = error.message;
        } else if (typeof error === 'object' && error !== null && 'message' in error) {
            errorMessage = String((error as Record<string, unknown>).message);
        }

        console.error("❌ FACTORY ERROR:", errorMessage);
        
        return { 
            error: errorMessage,
            fields: {
                businessName: formData.get('businessName') as string,
                slug: formData.get('slug') as string,
                description: formData.get('description') as string,
                primaryColor: formData.get('primaryColor') as string
            }
        };
    }
}


// 1. Definim el tipus aquí (o a /types) per assegurar coherència
export type InviteState = {
    success: boolean;
    error: string | null;
    message: string | null;
};




export async function inviteClientAction(
    prevState: InviteState,
    formData: FormData
): Promise<InviteState> {

    const supabaseAdmin = createAdminClient();
    const email = formData.get('email') as string;
    const projectId = formData.get('projectId') as string;
    const orgId = formData.get('orgId') as string;

    console.log("🔍 [INVITE] Iniciant per:", email);

    if (!email || !orgId) {
        return { success: false, error: "Falten dades obligatòries.", message: null };
    }

    try {
        let userIdToLink = '';

        // 1. Busquem a la taula PROFILES
        // Usem maybeSingle() per evitar errors si no en troba cap
        const { data: existingProfile } = await supabaseAdmin
            .from('profiles')
            .select('id')
            .eq('email', email)
            .maybeSingle();

        if (existingProfile) {
            console.log("✅ [INVITE] Usuari trobat a Profiles. ID:", existingProfile.id);
            userIdToLink = existingProfile.id;

            // Assegurem que tingui accés a aquesta organització
            // Usem UPSERT aquí també per si de cas
            await supabaseAdmin
                .from('profiles')
                .upsert({ 
                    id: userIdToLink,
                    email: email,
                    organization_id: orgId, 
                    role: 'client' 
                });

        } else {
            console.log("⚠️ [INVITE] No trobat a profiles. Provant invitació Auth...");
            
            const { data: inviteData, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
                data: { org_id: orgId, role: 'client', full_name: 'Client' },
                redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/update-password`
            });

            if (inviteError) {
                // CAS: L'email existeix a Auth (però ha fallat el pas 1 per algun motiu)
                if (inviteError.code === 'email_exists' || inviteError.message.includes('already been registered')) {
                    console.log("🧟 [INVITE] Usuari existent a Auth. Recuperant ID...");
                    
                    const { data: authUsers } = await supabaseAdmin.auth.admin.listUsers();
                    const zombieUser = authUsers.users.find(u => u.email === email);

                    if (zombieUser) {
                        userIdToLink = zombieUser.id;
                        console.log("✅ [INVITE] ID recuperat:", userIdToLink);

                        // 🔥 CORRECCIÓ CLAU: Usem UPSERT en lloc d'INSERT
                        // Això arregla tant si falta el perfil com si ja existeix
                        const { error: upsertError } = await supabaseAdmin
                            .from('profiles')
                            .upsert({
                                id: userIdToLink,
                                email: email,
                                organization_id: orgId,
                                role: 'client',
                                full_name: zombieUser.user_metadata?.full_name || 'Client Recuperat'
                            }, { onConflict: 'id, organization_id' }); // Especifiquem la clau de conflicte

                        if (upsertError) {
                            console.error("❌ [INVITE] Error al Upsert:", upsertError);
                            return { success: false, error: "Error de base de dades: " + upsertError.message, message: null };
                        }
                        console.log("✅ [INVITE] Perfil sincronitzat correctament.");

                    } else {
                        return { success: false, error: "Error crític: L'email consta com a registrat però no es troba.", message: null };
                    }
                } else {
                    return { success: false, error: "Error invitació: " + inviteError.message, message: null };
                }
            } else {
                console.log("✨ [INVITE] Nova invitació enviada.");
                userIdToLink = inviteData.user.id;
            }
        }

        // 2. VINCULACIÓ FINAL DEL PROJECTE
        console.log(`🔗 [INVITE] Vinculant projecte a ${userIdToLink}...`);
        
        const { error: updateError } = await supabaseAdmin
            .from('projects')
            .update({ 
                status: 'active',
                client_id: userIdToLink 
            })
            .eq('id', projectId);

        if (updateError) {
            console.error("❌ [INVITE] Error update project:", updateError);
            return { success: false, error: "Error vinculant el projecte.", message: null };
        }

        return { 
            success: true, 
            message: "Client vinculat i activat correctament!", 
            error: null 
        };

    } catch (error: unknown) {
        console.error("💥 [INVITE] Excepció:", error);
        return { success: false, error: "Error inesperat al servidor", message: null };
    }
}