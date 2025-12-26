'use server';

import { InfrastructureService } from '@/services/factory/InfrastrocutreService';
import { TenantService } from '@/services/TenantService';
import { AIService } from '@/services/ai/AIService'; 
import { ImageService } from '@/services/ImageService';
import { createClient } from '@/lib/supabase/server';
import { ActionResult } from '@/types/actions';
import { getSectorConfig } from '@/types/sectors';
import { I18nSchema } from '@/types/i18n';
import { randomUUID } from 'crypto'; // Necessari per generar slugs únics
import { SupabaseClient } from '@supabase/supabase-js'; // 👈 1. IMPORT NECESSARI
// 2. Definim la forma d'un item del catàleg base
interface SeedItem {
    name: string;
    desc: string;
    price: number;
    img: string;
}
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
            finalContent = {
                ...BASE_SKELETON,
                hero: { title: businessName, subtitle: description, cta: "Contactar", image_prompt: "" },
                about: { badge: "Info", title: "Sobre nosaltres", description: description, image_prompt: "", stats: { label1: "Exp", value1: "+1", label2: "Clients", value2: "+10", label3: "Servei", value3: "24/7" } },
                services: { badge: "Serveis", title: "Serveis", subtitle: "El que oferim", items: [] },
                testimonials: { badge: "Opinions", title: "Opinions", subtitle: "", reviews: [] },
                featured_products: { title: "Productes Destacats", subtitle: "La nostra millor selecció", limit: 4 },
                map: { title: "On Som", subtitle: "Vine a visitar-nos." },
                cta_banner: { heading: "Impulsa el teu negoci", subheading: "Contacta'ns", buttonText: "Contactar" },
                faq: { title: "FAQ", subtitle: "", items: [] },
                contact: { title: "Contacte", description: "Parlem-ne.", button: "Enviar" }
            } as I18nSchema;
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

// ------------------------------------------------------------------
// 🛠️ HELPER: SEEDING DE PRODUCTES (Dinàmic per sector)
// ------------------------------------------------------------------
// 3. Tipem el client de Supabase correctament
async function seedProducts(supabase: SupabaseClient, orgId: string, sector: string) {
    const products = getProductsBySector(sector, orgId);

    // Ara TypeScript sap que 'products' té l'estructura correcta per a la DB
    const { error } = await supabase.from('products').insert(products);

    if (error) {
        console.error("⚠️ Error fent seeding:", error.message);
    } else {
        console.log(`✅ Seeding correcte: ${products.length} productes creats.`);
    }
}
function getProductsBySector(sector: string, orgId: string) {
    const common = { 
        organization_id: orgId, 
        currency: 'EUR', 
        stock: 50, 
        active: true 
    };

    // 4. Tipem el diccionari de catàlegs
    const catalogs: Record<string, SeedItem[]> = {
        restaurant: [
            { name: "Menú Degustació", desc: "Experiència gastronòmica completa.", price: 45.00, img: "https://images.unsplash.com/photo-1544025162-d76690b67f11?auto=format&fit=crop&w=800" },
            { name: "Vi de la Casa", desc: "Selecció del sommelier.", price: 18.50, img: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800" },
            { name: "Postres Artesans", desc: "Fets al dia.", price: 8.00, img: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=800" },
            { name: "Còctel Especial", desc: "Per acabar la vetllada.", price: 12.00, img: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800" }
        ],
        fashion: [
            { name: "Jaqueta Premium", desc: "Disseny exclusiu.", price: 89.90, img: "https://images.unsplash.com/photo-1551028919-ac66e6a39d44?auto=format&fit=crop&w=800" },
            { name: "Samarreta Cotó", desc: "100% orgànica.", price: 29.90, img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800" },
            { name: "Bossa de Pell", desc: "Feta a mà.", price: 120.00, img: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800" },
            { name: "Ulleres de Sol", desc: "Protecció UV.", price: 45.00, img: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800" }
        ],
        services: [
            { name: "Consultoria 1h", desc: "Sessió estratègica.", price: 100.00, img: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800" },
            { name: "Auditoria Web", desc: "Anàlisi complet.", price: 250.00, img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800" },
            { name: "Pack Inici", desc: "Tot per començar.", price: 500.00, img: "https://images.unsplash.com/photo-1434626881859-194d67b2b86f?auto=format&fit=crop&w=800" },
            { name: "Suport Mensual", desc: "Manteniment inclòs.", price: 50.00, img: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800" }
        ]
    };

    // Seleccionem el catàleg o el per defecte (services)
    const selectedCatalog = catalogs[sector] || catalogs['services'];

    // Mapegem a l'estructura de la DB
    return selectedCatalog.map((item, index) => ({
        ...common,
        slug: `prod-${index}-${randomUUID().substring(0, 8)}`,
        name: item.name,
        description: item.desc,
        price: item.price,
        images: [item.img] // Array de text
    }));
}