'use server';

import { InfrastructureService } from '@/services/factory/InfrastrocutreService'; // Corregit typo
import { TenantService } from '@/services/TenantService';
import { AIService, AIContentResult } from '@/services/AIService';
import { createClient } from '@/lib/supabase/server';
import { ActionResult } from '@/types/actions';
import { MasterConfig, ConfigLandingSection } from '@/types/config';

// Instanciem els serveis (Singleton pattern implícit per mòdul)
const infra = new InfrastructureService();
const tenant = new TenantService();
const ai = new AIService();

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
    // 1. EXTRACCIÓ DE DADES DEL FORMULARI
    const businessName = formData.get('businessName') as string;
    const slug = formData.get('slug') as string;
    const description = formData.get('description') as string;
    const primaryColor = formData.get('primaryColor') as string;
    const logoFile = formData.get('logo') as File;
    const layoutVariant = (formData.get('layoutVariant') as 'modern' | 'shop') || 'modern';
    const sector = formData.get('sector') as string || "General"; // FASE 3

    // Dades de Contacte (FASE 1)
    const publicEmail = formData.get('publicEmail') as string;
    const phone = formData.get('phone') as string;
    const address = formData.get('address') as string;
    const instagram = formData.get('instagram') as string;
    const linkedin = formData.get('linkedin') as string;
    const twitter = formData.get('twitter') as string;

    // Gestió de Seccions amb Casting Segur
    const landingSectionsRaw = formData.getAll('landing_sections') as string[];
    const landingSections = landingSectionsRaw as ConfigLandingSection[];

    // Validació bàsica
    if (!businessName || !slug) {
        return { success: false, error: "Falten dades obligatòries (Nom o Slug)." };
    }

    try {
        // 🔐 AUTH CHECK
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user || !user.email) {
            return { success: false, error: "Accés denegat: Has d'iniciar sessió." };
        }

        // 🧠 FASE 3: GENERACIÓ DE CONTINGUT (IA)
        let aiContent: AIContentResult;
        try {
            console.log("🚀 [ACTION] Cridant AIService...");
            aiContent = await ai.generateSiteContent(businessName, description, sector);

            // LOG DE DEBUG 5: Què tenim abans d'injectar?
            console.log("📦 [ACTION] Resultat final IA:", JSON.stringify(aiContent, null, 2));

        } catch (e) {
            console.error("⚠️ [ACTION] Error inesperat cridant AI:", e);
            // Fallback d'emergència
            aiContent = {
                hero: { title: businessName, subtitle: description, cta: 'Contactar' },
                about: { title: 'Sobre Nosaltres', description: description, stats: [] },
                services_intro: { title: 'Els nostres serveis', subtitle: '', items: [] },
                testimonials: { title: "Opinions", subtitle: "", items: [] }
            };
        }

        // 🏗️ INFRAESTRUCTURA (GitHub)
        const repoData = await infra.createRepository(slug, description);

        // Esperem fins que el repo estigui llest (retry logic dins del servei)
        const isReady = await infra.waitForRepoReady(slug);
        if (!isReady) throw new Error("GitHub Timeout: El repo no s'ha creat a temps.");

        // FASE 2: Upload Logo
        if (logoFile && logoFile.size > 0) {
            await infra.uploadLogo(slug, logoFile);
        }

        // 🗄️ DATABASE (Tenant)
        const { org } = await tenant.createTenantStructure({
            businessName,
            slug,
            repoUrl: repoData.html_url,
            branding: { colors: { primary: primaryColor } },
            creatorUserId: user.id,
            creatorEmail: user.email
        });

        // 📝 CONSTRUCCIÓ DE L'OBJECTE CONFIG (Dades Reals)

        // Preparem el Footer dinàmic
        const footerLinks = [];
        if (publicEmail) footerLinks.push({ label: publicEmail, href: `mailto:${publicEmail}` });
        if (phone) footerLinks.push({ label: phone, href: `tel:${phone}` });
        if (address) footerLinks.push({ label: "Ubicació", href: "/#map" });

        const footerColumns = [];
        if (footerLinks.length > 0) footerColumns.push({ title: "Contacte", links: footerLinks });

        footerColumns.push({
            title: "Empresa",
            links: [
                { label: "Sobre Nosaltres", href: "/#about" },
                { label: "Serveis", href: "/#services" },
                { label: "Avís Legal", href: "/legal" }
            ]
        });

        const socialsMap: Record<string, string> = {};
        if (instagram) socialsMap['instagram'] = instagram;
        if (linkedin) socialsMap['linkedin'] = linkedin;
        if (twitter) socialsMap['twitter'] = twitter;

        // Construïm la configuració final
        const config: MasterConfig = {
            organizationId: org.id,
            identity: {
                name: businessName,
                description: aiContent.hero!.subtitle || description,
                logoUrl: "/branding/logo.png", // FASE 2: Ruta fixa estàndard
                faviconUrl: "/favicon.ico",
                contactEmail: publicEmail || user.email,
                address: address || undefined
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
            // FASE 3: Injectem contingut IA
            content: {
                hero: aiContent.hero,
                about: aiContent.about,
                services_intro: aiContent.services_intro,
                testimonials: aiContent.testimonials // ✅ AFEGIT: Injectem els testimonis
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
                ecommerce: formData.get('module_ecommerce') === 'on',
                accessControl: true,
                chatbot: formData.get('module_chatbot') === 'on',
            },
            i18n: { locales: ['ca', 'es'], defaultLocale: 'ca' },
            footer: {
                columns: footerColumns,
                socials: Object.keys(socialsMap).length > 0 ? socialsMap : undefined,
                bottomText: `© ${new Date().getFullYear()} ${businessName}. Tots els drets reservats.`
            }
        };

        // 💉 INJECCIÓ DE CONFIGURACIÓ AL REPO
        await infra.injectConfig(slug, config);

        // 🚀 DESPLEGAMENT A VERCEL
        await infra.deployToVercel(slug, org.id, repoData.id);

        return { success: true, repoUrl: repoData.html_url };

    } catch (error: unknown) {
        console.error("❌ Action Error:", error);
        let errorMessage = 'Error desconegut';
        if (error instanceof Error) errorMessage = error.message;

        return {
            success: false,
            error: errorMessage,
            fields: { businessName, slug, description, primaryColor }
        };
    }
}