// FITXER: scripts/test-factory-integration.ts
// ESTAT: FASE 1 - SIMULACIÓ TOTAL
// EXECUCIÓ: npx tsx scripts/test-factory-integration.ts

import { InfrastructureService } from '../src/services/factory/InfrastrocutreService';
import { TenantService } from '../src/services/TenantService';
import { AIService } from '../src/services/ai/AIService';
import { ImageService } from '../src/services/ImageService';
import { getSectorConfig } from '../src/types/sectors';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// 1. Configuració d'Entorn
dotenv.config({ path: '.env.local' });

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("❌ Falten les variables d'entorn de Supabase.");
}

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// 2. Dades Estàtiques Estructurals (Skeleton)
// Aquestes són les claus que el codi del Template NECESSITA sí o sí per funcionar.
// La IA omplirà la resta (Hero, About, Services, etc.)
const BASE_TRANSLATION_SKELETON = {
    Navbar: {
        links: {
            home: "Inici",
            services: "Serveis",
            blog: "Blog",
            shop: "Botiga",
            contact: "Contacte",
            about: "Nosaltres"
        },
        cta: "Accés Clients",
        actions: {
            login: "Entrar",
            cart: "Cistella",
            menu: "Menú"
        }
    },
    Footer: {
        description: "Transformem idees en realitats digitals.",
        rights_reserved: "Tots els drets reservats.",
        legal: {
            privacy: "Privacitat",
            cookies: "Cookies",
            terms: "Termes i Condicions"
        }
    },
    Booking: {
        title: "Reserva la teva cita",
        subtitle: "Selecciona el servei i l'hora que millor et vagi.",
        steps: {
            services: { title: "Serveis", select: "Seleccionar", duration: "min" },
            datetime: { 
                select_day_title: "Tria un dia", 
                select_time_title: "Hores disponibles", 
                loading: "Cercant disponibilitat...", 
                back: "Enrere",
                empty_state_day: "Selecciona un dia del calendari.",
                empty_state_slots: "No hi ha hores per aquest dia."
            },
            form: { 
                title: "Les teves dades", 
                subtitle: "Gairebé ho tenim.", 
                personal_info: "Informació Personal",
                labels: { name: "Nom", email: "Email", phone: "Telèfon" }, 
                submit: "Confirmar Reserva",
                submitting: "Processant..."
            },
            success: { 
                title: "Reserva Confirmada!", 
                message: "T'hem enviat un correu amb els detalls.", 
                home_button: "Tornar a l'inici" 
            }
        },
        errors: { 
            load_slots: "Error carregant horaris.", 
            required_field: "Aquest camp és obligatori." 
        }
    },
    // ✅ AFEGEIX AQUEST BLOC NOU:
    featured_products: {
        title: "Selecció Exclusiva",
        subtitle: "Descobreix els productes més destacats de la nostra col·lecció.",
        limit: 4
    },
    Shop: {
        featuredTitle: "Productes Destacats",
        featuredSubtitle: "La nostra selecció exclusiva per a tu.",
        addToCart: "Afegir",
        outOfStock: "Esgotat"
    },
    Blog: {
        title: "El Nostre Blog",
        subtitle: "Notícies, consells i actualitzacions.",
        readMore: "Llegir més",
        empty: "No hi ha articles encara."
    }
};

async function runIntegrationTest() {
  console.log("🏭 [FASE 1] INICIANT SIMULACIÓ TOTAL DE LA FACTORY");
  console.log("------------------------------------------------");

  const infra = new InfrastructureService();
  const tenant = new TenantService();
  const ai = new AIService();
  const imageService = new ImageService();

  // --- CONFIGURACIÓ DE L'ESCENARI DE TEST ---
  const TEST_SCENARIO = {
    businessName: "Bistrot del Port",
    description: "Restaurant de cuina marinera amb vistes al port de Palamós. Especialitat en arrossos i peix fresc.",
    sector: "restaurant", // Això dispararà la IA per generar contingut de restaurant
    primaryColor: "#0ea5e9", // Blau marí
    publicEmail: "info@bistrotdelport.cat",
    layoutVariant: "modern" as const
  };

  // Generem un slug únic per no xocar amb tests anteriors
  const slug = `test-bistrot-full-${Math.floor(Math.random() * 1000)}`;

  try {
    // 1. Validar Usuari (Necessitem un owner per al tenant)
    const { data: users } = await supabaseAdmin.auth.admin.listUsers();
    const testUser = users.users?.[0];
    if (!testUser) throw new Error("❌ Error crític: No hi ha usuaris a Supabase.");
    console.log(`👤 Owner del projecte: ${testUser.email}`);

    // 2. Infraestructura (GitHub)
    console.log(`\n🏗️ [1/5] Creant Repo GitHub: ${slug}...`);
    const repoData = await infra.createRepository(slug, TEST_SCENARIO.description);
    await infra.waitForRepoReady(slug);
    console.log("   ✅ Repositori llest.");

    // 3. Generació de Contingut (IA + Fusionat)
    console.log(`\n🧠 [2/5] Generant Contingut Intel·ligent...`);
    // La IA genera Hero, About, Services, FAQ, CTA, Testimonials
    const aiContent = await ai.generateTranslationFile(TEST_SCENARIO.businessName, TEST_SCENARIO.description, TEST_SCENARIO.sector);
    
    // FUSIÓ: Contingut IA + L'esquelet estructural (Navbar, Booking, etc.)
    const finalContent = {
        ...aiContent,          // Contingut creatiu (variable)
        ...BASE_TRANSLATION_SKELETON // Contingut estructural (fix)
    };

    // Enriquim amb imatges reals d'Unsplash
    const enrichedContent = imageService.enrichWithImages(finalContent);
    console.log("   ✅ Contingut generat, fusionat i amb imatges.");

    // 4. Configuració del Lloc (Site Config)
    console.log(`\n⚙️ [3/5] Configurant Mòduls...`);
    const sectorConfig = getSectorConfig(TEST_SCENARIO.sector);
    
    // 🔥 FORCEM TOTS ELS MÒDULS A TRUE PER AL TEST COMPLET
    const featuresForTest = {
        booking: true,
        ecommerce: true,
        blog: true,
        gallery: true,
        faq: true
    };
    console.log("   ✅ Features actives:", JSON.stringify(featuresForTest));

    // 5. Base de Dades (Supabase Tenant)
    console.log(`\n🗄️ [4/5] Creant Tenant a Supabase...`);
    const { org } = await tenant.createTenantStructure({
      businessName: TEST_SCENARIO.businessName,
      slug: slug,
      repoUrl: repoData.html_url,
      branding: { colors: { primary: TEST_SCENARIO.primaryColor } },
      creatorUserId: testUser.id,
      creatorEmail: testUser.email!
    });

    // 6. Injecció de Fitxers (El moment de la veritat)
    console.log(`\n📦 [5/5] Injectant fitxers al Repositori...`);

    const filesToInject = {
      // 1. TRADUCCIONS: A src/messages (perquè el Template usa @/messages)
      'src/messages/ca.json': JSON.stringify(enrichedContent, null, 2),

      // 2. CONFIGURACIÓ: A src/config (perquè el Template usa @/config)
      'src/config/site-config.json': JSON.stringify({
        name: TEST_SCENARIO.businessName, // 👈 AQUEST ÉS EL NOM QUE HA DE SORTIR AL NAVBAR
        description: enrichedContent.hero.subtitle,
        sector: sectorConfig.key,
        features: featuresForTest,
        theme: {
          primary: TEST_SCENARIO.primaryColor,
          layout: TEST_SCENARIO.layoutVariant
        },
        contact: {
          email: TEST_SCENARIO.publicEmail,
          phone: "+34 600 000 000",
          address: "Palamós, Girona"
        }
      }, null, 2)
    };

    await infra.commitFiles(slug, filesToInject);
    console.log("   ✅ Injecció completada.");

    // 7. Deploy
    console.log(`\n🚀 [FINAL] Desplegant a Vercel...`);
    await infra.deployToVercel(slug, org.id, repoData.id);

    console.log("\n------------------------------------------------");
    console.log(`🌍 Repo: ${repoData.html_url}`);
    console.log(`🌐 URL: https://${slug}.vercel.app`);
    console.log("------------------------------------------------\n");

  } catch (error) {
    console.error("\n❌ ERROR FATAL DURANT EL TEST:");
    if (error instanceof Error) console.error(error.message);
    else console.error(error);
  }
}

runIntegrationTest();