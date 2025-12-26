'use server';

import { InfrastructureService } from '@/services/factory/InfrastrocutreService';
import { TenantService } from '@/services/TenantService';
import { AIService } from '@/services/AIService';
import { ImageService } from '@/services/ImageService';
import { createClient } from '@/lib/supabase/server';
import { ActionResult } from '@/types/actions';
import { getSectorConfig } from '@/types/sectors';
import { I18nSchema } from '@/types/i18n'; // ✅ ARA SÍ QUE S'USA

const infra = new InfrastructureService();
const tenant = new TenantService();
const ai = new AIService();
const imageService = new ImageService();

// 🦴 ESQUELET ESTRUCTURAL
const BASE_SKELETON = {
    Navbar: {
        links: { home: "Inici", services: "Serveis", blog: "Blog", shop: "Botiga", contact: "Contacte", about: "Nosaltres" },
        cta: "Accés Clients",
        actions: { login: "Entrar", cart: "Cistella", menu: "Menú" }
    },
    Footer: {
        description: "Transformem idees en realitats digitals.",
        rights_reserved: "Tots els drets reservats.",
        legal: { privacy: "Privacitat", cookies: "Cookies", terms: "Termes" } // Afegit per complir schema si cal
    },
    Booking: {
        title: "Reserva la teva cita",
        subtitle: "Selecciona el servei i l'hora.",
        steps: {
            services: { title: "Serveis", select: "Seleccionar", duration: "min" },
            datetime: { select_day_title: "Tria dia", select_time_title: "Tria hora", loading: "Cercant...", back: "Enrere", empty_state_day: "Selecciona dia", empty_state_slots: "No hi ha hores" },
            form: { title: "Dades", subtitle: "Completa la reserva", personal_info: "Info", labels: { name: "Nom", email: "Email" }, submit: "Confirmar", submitting: "Enviant..." },
            success: { title: "Reserva Confirmada!", message: "Rebràs un email.", home_button: "Inici" }
        },
        errors: { load_slots: "Error horaris", required_field: "Obligatori" }
    },
    Shop: { featuredTitle: "Destacats", featuredSubtitle: "Selecció exclusiva", addToCart: "Afegir", outOfStock: "Esgotat" },
    featured_products: { title: "Selecció", subtitle: "Els nostres millors productes", limit: 4 },
    Blog: { title: "Blog", subtitle: "Notícies i consells", readMore: "Llegir més", empty: "No hi ha articles" }
};

export async function createProjectAction(prevState: ActionResult | unknown, formData: FormData): Promise<ActionResult> {
    const businessName = formData.get('businessName') as string;
    const slug = formData.get('slug') as string;
    const description = formData.get('description') as string;
    const primaryColor = formData.get('primaryColor') as string;
    const logoFile = formData.get('logo') as File;
    const layoutVariant = (formData.get('layoutVariant') as 'modern' | 'shop') || 'modern';
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

    if (!businessName || !slug) return { success: false, error: "Falten dades obligatòries." };

    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user || !user.email) return { success: false, error: "Sessió caducada." };

        // 1. REPO
        const repoData = await infra.createRepository(slug, description);
        const isReady = await infra.waitForRepoReady(slug);
        if (!isReady) throw new Error("GitHub Timeout.");

        // 2. CONTINGUT (Fix Tipatge)
        // ✅ ELIMINAT 'any'. Usem la interfície correcta.
        let finalContent: I18nSchema;
        const sectorConfig = getSectorConfig(sector);

        try {
            console.log("🚀 [ACTION] Generant AI + Imatges...");
            const aiContent = await ai.generateTranslationFile(businessName, description, sector);

            // Fusió segura: TypeScript ara sap que el resultat és un I18nSchema vàlid
            const mergedContent = { ...aiContent, ...BASE_SKELETON } as I18nSchema;

            finalContent = imageService.enrichWithImages(mergedContent);

        } catch (e) {
            console.error("⚠️ Error IA, usant fallback.", e);

            // Fallback tipat correctament i COMPLET
            finalContent = {
                ...BASE_SKELETON, // Ja inclou Navbar, Footer, Booking, Blog i Shop (si està definit dalt)

                hero: {
                    title: businessName,
                    subtitle: description,
                    cta: "Contactar",
                    image_prompt: ""
                },
                about: {
                    badge: "Info",
                    title: "Sobre nosaltres",
                    description: description,
                    image_prompt: "",
                    stats: { label1: "Experiència", value1: "+10", label2: "Clients", value2: "100%", label3: "Projectes", value3: "+50" }
                },
                services: {
                    badge: "Serveis",
                    title: "Què oferim",
                    subtitle: "Solucions professionals per a tu",
                    items: []
                },
                // 👇 AFEGIT: Productes (per si BASE_SKELETON no ho té o volem assegurar)
                featured_products: {
                    title: "Productes Destacats",
                    subtitle: "La nostra millor selecció",
                    limit: 4
                },
                testimonials: {
                    badge: "Opinions",
                    title: "Clients Feliços",
                    subtitle: "El que diuen de nosaltres",
                    reviews: []
                },
                cta_banner: {
                    heading: "Impulsa el teu negoci",
                    subheading: "Contacta amb nosaltres avui mateix",
                    buttonText: "Contactar"
                },
                // 👇 AFEGIT: Mapa (Importantíssim perque surti la secció)
                map: {
                    title: "On Som",
                    subtitle: "Vine a visitar-nos a les nostres oficines."
                },
                faq: {
                    title: "Preguntes Freqüents",
                    subtitle: "Dubtes habituals",
                    items: []
                },
                contact: {
                    title: "Contacte",
                    description: "Parlem del teu projecte.",
                    button: "Enviar Missatge"
                }
            } as I18nSchema;
        }

        // 3. TENANT
        const { org } = await tenant.createTenantStructure({
            businessName, slug, repoUrl: repoData.html_url,
            branding: { colors: { primary: primaryColor } },
            creatorUserId: user.id, creatorEmail: user.email
        });

        // 4. INJECCIÓ
        const filesToInject: Record<string, string> = {
            'src/messages/ca.json': JSON.stringify(finalContent, null, 2),
            'src/config/site-config.json': JSON.stringify({
                name: businessName,
                description: finalContent.hero.subtitle,
                sector: sectorConfig.key,
                features: sectorConfig.features,
                theme: { primary: primaryColor, layout: layoutVariant },
                contact: {
                    email: publicEmail || user.email,
                    phone: phone || "+34 600 000 000",
                    address: address || "Catalunya",
                    socials
                }
            }, null, 2)
        };

        await infra.commitFiles(slug, filesToInject);

        // 5. DEPLOY & LOGO
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