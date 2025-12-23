'use server';


import { InfrastructureService } from '@/services/InfrastrocutreService'; // Assegura't que el path sigui correcte (minúscules?)
import { TenantService } from '@/services/TenantService';
import { AIService, AIContentResult } from '@/services/AIService';
import { createClient } from '@/lib/supabase/server';
import { ActionResult } from '@/types/actions';
import { MasterConfig } from '@/types/config';


// Instanciem els serveis
const infra = new InfrastructureService();
const tenant = new TenantService();
const ai = new AIService();

export async function createProjectAction(prevState: unknown, formData: FormData): Promise<ActionResult> {
    // 1. Extracció de Dades
    const businessName = formData.get('businessName') as string;
    const slug = formData.get('slug') as string;
    const description = formData.get('description') as string;
    const primaryColor = formData.get('primaryColor') as string;
    const logoFile = formData.get('logo') as File;
    
    // Recuperem els camps complexos
    const layoutVariant = (formData.get('layoutVariant') as 'modern' | 'shop') || 'modern';
    const landingSections = formData.getAll('landing_sections') as string[];

    // Validació bàsica de formulari
    if (!businessName || !slug) {
        return { success: false, error: "Falten dades obligatòries (Nom o Slug)." };
    }

    try {
        // ---------------------------------------------------------
        // 🔐 0. SEGURETAT (Autenticació Obligatòria)
        // ---------------------------------------------------------
        // Això soluciona l'error de TypeScript i protegeix l'acció
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        // Si no hi ha usuari o no té email, no podem continuar
        if (!user || !user.email) {
            return { success: false, error: "Accés denegat: Has d'iniciar sessió per crear projectes." };
        }

        // ---------------------------------------------------------
        // 🧠 1. INTEL·LIGÈNCIA ARTIFICIAL
        // ---------------------------------------------------------
        let aiContent: AIContentResult;

        try {
            aiContent = await ai.generateSiteContent(businessName, description);
        } catch (e) {
            console.error("⚠️ AI Fallback activat:", e);
            aiContent = {
                hero: { title: businessName, subtitle: description, cta: 'Contactar' },
                about: { title: 'Sobre Nosaltres', description: '' },
                services_intro: { title: 'Els nostres serveis', subtitle: '' }
            };
        }

        // ---------------------------------------------------------
        // 🏗️ 2. INFRAESTRUCTURA (GitHub)
        // ---------------------------------------------------------
        const repoData = await infra.createRepository(slug, description);
        
        const isReady = await infra.waitForRepoReady(slug);
        if (!isReady) throw new Error("GitHub Timeout: El repo no s'ha creat a temps.");

        if (logoFile && logoFile.size > 0) {
            await infra.uploadLogo(slug, logoFile);
        }

        // ---------------------------------------------------------
        // 🗄️ 3. DATABASE (Supabase Org & Project)
        // ---------------------------------------------------------
        /* ARA PODEM PASSAR ELS CAMPS SENSE POR.
           TypeScript ja sap que 'user.id' i 'user.email' són strings perquè 
           hem fet la comprovació al pas 0.
        */
        const { org } = await tenant.createTenantStructure({
            businessName,
            slug,
            repoUrl: repoData.html_url,
            branding: { colors: { primary: primaryColor } },
            creatorUserId: user.id,   // ✅ Ara és segur (string)
            creatorEmail: user.email  // ✅ Ara és segur (string)
        });

        // ---------------------------------------------------------
        // ⚙️ 4. CONFIGURACIÓ (Injectar codi)
        // ---------------------------------------------------------
        // Usem l'email de l'usuari real per al contacte, o un genèric si ho prefereixes
        const contactEmail = user.email; 

        const config: MasterConfig = {
            organizationId: org.id,
            identity: {
                name: businessName,
                description: aiContent.hero.subtitle || description,
                logoUrl: "/branding/logo.png",
                faviconUrl: "/favicon.ico",
                contactEmail: contactEmail
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
            content: {
                hero: aiContent.hero,
                about: aiContent.about,
                services_intro: aiContent.services_intro
            },
            modules: {
                layout: { variant: layoutVariant, stickyHeader: true },
                landing: {
                    active: true,
                    sections: landingSections.length > 0 ? landingSections : ['hero', 'services', 'contact']
                },
                auth: {
                    active: true,
                    allowPublicRegistration: false,
                    redirects: { admin: '/dashboard', client: '/my-account' }
                },
                dashboard: true,
                booking: formData.get('module_booking') === 'on',
                blog: formData.get('module_blog') === 'on',
                inventory: formData.get('module_inventory') === 'on',
                ecommerce: false,
                accessControl: true
            },
            i18n: { locales: ['ca', 'es'], defaultLocale: 'ca' },
            footer: {
                columns: [],
                bottomText: `© ${new Date().getFullYear()} ${businessName}`
            }
        };

        await infra.injectConfig(slug, config);

        // ---------------------------------------------------------
        // 🚀 5. VERCEL (Deploy)
        // ---------------------------------------------------------
        await infra.deployToVercel(slug, org.id, repoData.id);

        return { success: true, repoUrl: repoData.html_url };

    } catch (error: unknown) {
        console.error("❌ Action Error:", error);

        let errorMessage = 'Error desconegut';
        if (error instanceof Error) {
            errorMessage = error.message;
        } else if (typeof error === 'object' && error !== null && 'message' in error) {
            errorMessage = String((error as { message: unknown }).message);
        }

        return {
            success: false,
            error: errorMessage,
            fields: { businessName, slug, description, primaryColor }
        };
    }
}