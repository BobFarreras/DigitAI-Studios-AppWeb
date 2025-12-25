'use server';

import { InfrastructureService } from '@/services/factory/InfrastrocutreService';
import { TenantService } from '@/services/TenantService';
import { AIService } from '@/services/AIService';       // ✅ Nou Servei IA
import { ImageService } from '@/services/ImageService'; // ✅ Nou Servei Imatges
import { createClient } from '@/lib/supabase/server';
import { ActionResult } from '@/types/actions';
import { getSectorConfig } from '@/types/sectors';      // ✅ Lògica de Sectors
import { I18nSchema } from '@/types/i18n';              // ✅ Tipus Strict

// Instanciem els serveis
const infra = new InfrastructureService();
const tenant = new TenantService();
const ai = new AIService();
const imageService = new ImageService();

export interface InviteState {
    success: boolean;
    error: string | null;
    message: string | null;
}

export async function inviteClientAction(prevState: InviteState, formData: FormData): Promise<InviteState> {
    const email = formData.get('email') as string;
    const orgId = formData.get('orgId') as string;
    const projectId = formData.get('projectId') as string;

    if (!email || !orgId || !projectId) {
        return { success: false, error: "Falten dades.", message: null };
    }

    try {
        await tenant.inviteOrLinkUser(email, orgId, projectId);
        return { success: true, error: null, message: `Invitació enviada a ${email}` };
    } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : "Error desconegut";
        return { success: false, error: msg, message: null };
    }
}



export async function createProjectAction(prevState: ActionResult | unknown, formData: FormData): Promise<ActionResult> {
    // 1. EXTRACCIÓ DE DADES (Igual que tenies)
    const businessName = formData.get('businessName') as string;
    const slug = formData.get('slug') as string;
    const description = formData.get('description') as string;
    const primaryColor = formData.get('primaryColor') as string;
    const logoFile = formData.get('logo') as File;
    const layoutVariant = (formData.get('layoutVariant') as 'modern' | 'shop') || 'modern';
    // Recuperem el sector (o 'General' per defecte)
    const sector = (formData.get('sector') as string) || "General"; 

    // Dades de contacte
    const publicEmail = formData.get('publicEmail') as string;
    const phone = formData.get('phone') as string;
    const address = formData.get('address') as string;
    const socials = {
        instagram: formData.get('instagram') as string,
        linkedin: formData.get('linkedin') as string,
        twitter: formData.get('twitter') as string
    };

    if (!businessName || !slug) {
        return { success: false, error: "Falten dades obligatòries." };
    }

    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user || !user.email) return { success: false, error: "Sessió caducada." };

        // 🏗️ 1. CREAR REPO (Això no canvia)
        const repoData = await infra.createRepository(slug, description);
        const isReady = await infra.waitForRepoReady(slug);
        if (!isReady) throw new Error("GitHub Timeout.");

        // 🧠 2. GENERACIÓ DE CONTINGUT (NOVA LÒGICA)
        let finalContent: I18nSchema;
        try {
            console.log("🚀 [ACTION] Generant AI + Imatges...");
            // A. Textos (Gemini)
            const rawContent = await ai.generateTranslationFile(businessName, description, sector);
            // B. Imatges (Pollinations/Unsplash)
            finalContent = imageService.enrichWithImages(rawContent);
        } catch (e) {
            console.error("⚠️ Error IA, usant fallback.", e);
            // Fallback d'emergència per no aturar el procés
            finalContent = {
                hero: { title: businessName, subtitle: description, cta: "Contactar", image_prompt: "" },
                about: { badge: "Info", title: "Sobre nosaltres", description: description, image_prompt: "", stats: { label1: "Exp", value1: "+1", label2: "", value2: "", label3: "", value3: "" } },
                services: { badge: "Serveis", title: "Serveis", subtitle: "", items: [] },
                testimonials: { badge: "Opinions", title: "Opinions", subtitle: "", reviews: [] },
                contact: { title: "Contacte", subtitle: "", button: "Enviar" }
            };
        }

        // 🧠 3. CONFIGURACIÓ DE SECTOR (NOVA LÒGICA)
        const sectorConfig = getSectorConfig(sector);

        // 🗄️ 4. DATABASE (Igual que tenies)
        const { org } = await tenant.createTenantStructure({
            businessName, slug, repoUrl: repoData.html_url,
            branding: { colors: { primary: primaryColor } },
            creatorUserId: user.id, creatorEmail: user.email
        });

        // 📦 5. INJECCIÓ DE FITXERS (EL CANVI CLAU)
        // En lloc d'injectConfig, preparem els fitxers físics
        const filesToInject: Record<string, string> = {
            // Fitxer de traduccions
            'messages/ca.json': JSON.stringify(finalContent, null, 2),
            
            // Fitxer de configuració
            'config/site-config.json': JSON.stringify({
                name: businessName,
                description: finalContent.hero.subtitle,
                sector: sectorConfig.key,
                features: sectorConfig.features, // ✅ Activa mòduls (booking, blog...) sol
                theme: { primary: primaryColor, layout: layoutVariant },
                contact: { email: publicEmail || user.email, phone, address, socials }
            }, null, 2)
        };

        // Cridem al nou mètode que hem creat al Pas 1
        await infra.commitFiles(slug, filesToInject);

        // 🚀 6. DEPLOY & ASSETS (Igual que tenies)
        if (logoFile && logoFile.size > 0) {
            await infra.uploadLogo(slug, logoFile);
        }
        
        await infra.deployToVercel(slug, org.id, repoData.id);

        return { success: true, repoUrl: repoData.html_url };

    } catch (error: unknown) {
        console.error("❌ Action Error:", error);
        return { success: false, error: error instanceof Error ? error.message : "Error desconegut" };
    }
}