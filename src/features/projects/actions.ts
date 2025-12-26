'use server';

import { InfrastructureService } from '@/services/factory/InfrastrocutreService';
import { TenantService } from '@/services/TenantService';
import { AIService } from '@/services/ai/AIService'; // Assegura't de la ruta (ai/AIService o AIService directe)
import { ImageService } from '@/services/ImageService';
import { createClient } from '@/lib/supabase/server';
import { ActionResult } from '@/types/actions';
import { getSectorConfig } from '@/types/sectors';
import { I18nSchema } from '@/types/i18n';

const infra = new InfrastructureService();
const tenant = new TenantService();
const ai = new AIService();
const imageService = new ImageService();

// 🦴 ESQUELET ESTRUCTURAL (Base segura)
const BASE_SKELETON = {
    Navbar: {
        links: { home: "Inici", services: "Serveis", blog: "Blog", shop: "Botiga", contact: "Contacte", about: "Nosaltres" },
        cta: "Accés Clients",
        actions: { login: "Entrar", cart: "Cistella", menu: "Menú" }
    },
    Footer: {
        description: "Transformem idees en realitats digitals.",
        rights_reserved: "Tots els drets reservats.",
        legal: { privacy: "Privacitat", cookies: "Cookies", terms: "Termes" }
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

    // 3. SECCIONS DINÀMIQUES (Nou DesignSection) 🌟 IMPORTANT
    const enabledSectionsRaw = formData.get('enabledSections') as string;
    console.log(`📋 [ACTION] Seccions rebudes del formulari (Raw): ${enabledSectionsRaw}`);
    
    // Default mínim per seguretat
    let landingSections = [
        { id: 'hero', type: 'hero' },
        { id: 'services', type: 'services' },
        { id: 'contact', type: 'contact' }
    ];

    if (enabledSectionsRaw) {
        try {
            const sectionIds = JSON.parse(enabledSectionsRaw) as string[];
            // Mapegem IDs a objectes { id, type } per complir amb el nou SiteConfig
            landingSections = sectionIds.map(id => ({ id, type: id }));
            
            console.log(`✅ [ACTION] Seccions processades correctament:`, JSON.stringify(landingSections));
        } catch (e) {
            console.error("⚠️ [ACTION] Error parsejant enabledSections, usant default:", e);
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
        console.log(`✅ [ACTION] Repo creat i llest: ${repoData.html_url}`);

        // 🧠 5. GENERAR CONTINGUT
        let finalContent: I18nSchema; 
        const sectorConfig = getSectorConfig(sector);

        try {
            console.log("🚀 [ACTION] Cridant IA (Gemini/OpenAI) per generar textos...");
            const aiContent = await ai.generateTranslationFile(businessName, description, sector);
            
            console.log("🔗 [ACTION] Fusionant contingut IA amb esquelet base...");
            const mergedContent = { ...aiContent, ...BASE_SKELETON } as I18nSchema;
            
            console.log("🎨 [ACTION] Enriquint amb imatges...");
            finalContent = imageService.enrichWithImages(mergedContent);

            // LOG DE VERIFICACIÓ
            console.log(`🔍 [ACTION] Verificació contingut: Té Mapa? ${!!finalContent.map}. Té Productes? ${!!finalContent.featured_products}`);

        } catch (e) {
            console.error("⚠️ [ACTION] Error greu a la IA, usant FALLBACK manual.", e);
            // Fallback robust amb MAPA i PRODUCTES assegurats
            finalContent = {
                ...BASE_SKELETON,
                hero: { title: businessName, subtitle: description, cta: "Contactar", image_prompt: "" },
                about: { badge: "Info", title: "Sobre nosaltres", description: description, image_prompt: "", stats: { label1: "Exp", value1: "+1", label2: "Clients", value2: "+10", label3: "Servei", value3: "24/7" } },
                services: { badge: "Serveis", title: "Serveis", subtitle: "El que oferim", items: [] },
                testimonials: { badge: "Opinions", title: "Opinions", subtitle: "", reviews: [] },
                
                // ASSEGUREM ELS CAMPS NOUS
                featured_products: { title: "Productes Destacats", subtitle: "La nostra millor selecció", limit: 4 },
                map: { title: "On Som", subtitle: "Vine a visitar-nos." },
                cta_banner: { heading: "Impulsa el teu negoci", subheading: "Contacta'ns", buttonText: "Contactar" },
                
                faq: { title: "FAQ", subtitle: "", items: [] },
                contact: { title: "Contacte", description: "Parlem-ne.", button: "Enviar" }
            } as I18nSchema;
        }

        // 🗄️ 6. DATABASE (Tenant)
        console.log("🗄️ [ACTION] Guardant Tenant a Supabase...");
        const { org } = await tenant.createTenantStructure({
            businessName, slug, repoUrl: repoData.html_url,
            branding: { colors: { primary: primaryColor } },
            creatorUserId: user.id, creatorEmail: user.email
        });

        // 📦 7. INJECCIÓ DE FITXERS
        console.log("📦 [ACTION] Preparant fitxers de configuració...");
        
        // Creem l'objecte de config per poder-lo loguejar abans d'enviar
        const siteConfigData = {
            name: businessName,
            description: finalContent.hero.subtitle,
            sector: sectorConfig.key,
            features: sectorConfig.features,
            
            // 👇 AQUI ÉS ON ES DEFINEIX QUÈ ES VEU
            theme: { primary: primaryColor, layout: layoutVariant },
            landing: { sections: landingSections }, 
            
            contact: { 
                email: publicEmail || user.email, 
                phone: phone || "+34 600 000 000", 
                address: address || "Catalunya", 
                socials 
            }
        };

        console.log(`📦 [ACTION] site-config.json a injectar (Landing Sections):`, JSON.stringify(siteConfigData.landing.sections));

        const filesToInject: Record<string, string> = {
            'src/messages/ca.json': JSON.stringify(finalContent, null, 2),
            'src/config/site-config.json': JSON.stringify(siteConfigData, null, 2)
        };

        await infra.commitFiles(slug, filesToInject);

        // 🚀 8. DEPLOY & LOGO
        console.log("🚀 [ACTION] Desplegant a Vercel...");
        if (logoFile && logoFile.size > 0) {
            await infra.uploadLogo(slug, logoFile);
        }
        await infra.deployToVercel(slug, org.id, repoData.id);

        console.log("🎉 [ACTION] PROJECET COMPLETAT AMB ÈXIT!");
        return { success: true, repoUrl: repoData.html_url };

    } catch (error: unknown) {
        console.error("❌ [ACTION] ERROR FATAL:", error);
        return { success: false, error: error instanceof Error ? error.message : "Error desconegut" };
    }
}