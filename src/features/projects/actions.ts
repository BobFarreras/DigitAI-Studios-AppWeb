'use server';
/**
 * @file src/features/projects/actions.ts
 * @updated 2026-05-13
 * @summary Action principal de creacio de projecte/client.
 * @scope Orquestracio high-level entre infraestructura, IA, tenant i deploy.
 */

import { InfrastructureService } from '@/services/factory/InfrastructureService';
import { TenantService } from '@/services/TenantService';
import { AIService } from '@/services/ai/AIService'; 
import { ImageService } from '@/services/ImageService';
import { createClient } from '@/lib/supabase/server';
import { ActionResult } from '@/types/actions';
import { getSectorConfig } from '@/types/sectors';
import { I18nSchema } from '@/types/i18n';
import { seedProducts } from '@/actions/projects-seeding';
import { BASE_SKELETON, buildFallbackContent } from './actions/create-project-support';
const infra = new InfrastructureService();
const tenant = new TenantService();
const ai = new AIService();
const imageService = new ImageService();

export async function createProjectAction(prevState: ActionResult | unknown, formData: FormData): Promise<ActionResult> {
    console.log("🏁 [ACTION] Iniciant procés de creació de projecte...");

    // 1. EXTRACCIÓ DE DADES BÀSIQUES
    const businessName = formData.get('businessName') as string;
    const slug = formData.get('slug') as string;
    const description = formData.get('description') as string;
    const primaryColor = formData.get('primaryColor') as string;
    const logoFile = formData.get('logo') as File;
    const layoutVariant = (formData.get('layoutVariant') as 'modern' | 'shop') || 'modern';
    const sector = (formData.get('sector') as string) || "General";

    // 2. DADES DE CONTACTE
    const publicEmail = formData.get('publicEmail') as string;
    const phone = formData.get('phone') as string;
    const address = formData.get('address') as string;
    const socials = {
        instagram: formData.get('instagram') as string,
        linkedin: formData.get('linkedin') as string,
        twitter: formData.get('twitter') as string
    };

    // 3. SECCIONS DINÀMIQUES
    const enabledSectionsRaw = formData.get('enabledSections') as string;
    let landingSections = [
        { id: 'hero', type: 'hero' },
        { id: 'services', type: 'services' },
        { id: 'contact', type: 'contact' }
    ];

    if (enabledSectionsRaw) {
        try {
            const sectionIds = JSON.parse(enabledSectionsRaw) as string[];
            landingSections = sectionIds.map(id => ({ id, type: id }));
        } catch (e) {
            console.error("⚠️ [ACTION] Error parsejant enabledSections:", e);
        }
    }

    if (!businessName || !slug) return { success: false, error: "Falten dades obligatòries." };

    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user || !user.email) return { success: false, error: "Sessió caducada." };

        // 🏗️ 4. CREAR REPO
        console.log(`🏗️ [ACTION] Creant Repositori GitHub: ${slug}...`);
        const repoData = await infra.createRepository(slug, description);
        const isReady = await infra.waitForRepoReady(slug);
        
        if (!isReady) throw new Error("GitHub Timeout.");
        console.log(`✅ [ACTION] Repo creat: ${repoData.html_url}`);

        // 🧠 5. GENERAR CONTINGUT
        let finalContent: I18nSchema; 
        const sectorConfig = getSectorConfig(sector);

        try {
            console.log("🚀 [ACTION] Cridant IA...");
            const aiContent = await ai.generateTranslationFile(businessName, description, sector);
            const mergedContent = { ...aiContent, ...BASE_SKELETON } as I18nSchema;
            finalContent = imageService.enrichWithImages(mergedContent);
        } catch (e) {
            console.error("⚠️ [ACTION] Error IA, usant fallback.", e);
            finalContent = buildFallbackContent(businessName, description);
        }

        // 🗄️ 6. DATABASE (Tenant)
        console.log("🗄️ [ACTION] Guardant Tenant...");
        const { org } = await tenant.createTenantStructure({
            businessName, slug, repoUrl: repoData.html_url,
            branding: { colors: { primary: primaryColor } },
            creatorUserId: user.id, creatorEmail: user.email
        });

        // 🌱 6.5 SEEDING (NOU!)
        // Si el projecte té la secció 'featured_products', creem productes
        if (landingSections.some(s => s.id === 'featured_products')) {
            console.log("🌱 [ACTION] Sembrant productes d'exemple...");
            await seedProducts(supabase, org.id, sector);
        }

        // 📦 7. INJECCIÓ
        console.log("📦 [ACTION] Injectant configuració...");
        const siteConfigData = {
            name: businessName,
            description: finalContent.hero.subtitle,
            sector: sectorConfig.key,
            features: sectorConfig.features,
            theme: { primary: primaryColor, layout: layoutVariant },
            landing: { sections: landingSections }, 
            contact: { 
                email: publicEmail || user.email, 
                phone: phone || "+34 600 000 000", 
                address: address || "Catalunya", 
                socials 
            }
        };

        const filesToInject: Record<string, string> = {
            'src/messages/ca.json': JSON.stringify(finalContent, null, 2),
            'src/config/site-config.json': JSON.stringify(siteConfigData, null, 2)
        };

        await infra.commitFiles(slug, filesToInject);

        // 🚀 8. DEPLOY & LOGO
        console.log("🚀 [ACTION] Desplegant...");
        if (logoFile && logoFile.size > 0) {
            await infra.uploadLogo(slug, logoFile);
        }
        await infra.deployToVercel(slug, org.id, repoData.id);

        console.log("🎉 [ACTION] COMPLETAT!");
        return { success: true, repoUrl: repoData.html_url };

    } catch (error: unknown) {
        console.error("❌ [ACTION] ERROR:", error);
        return { success: false, error: error instanceof Error ? error.message : "Error desconegut" };
    }
}
