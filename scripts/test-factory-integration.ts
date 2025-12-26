// FITXER: scripts/test-factory-integration.ts
import { InfrastructureService } from '../src/services/factory/InfrastrocutreService';
import { TenantService } from '../src/services/TenantService';
import { AIService } from '../src/services/ai/AIService';
import { ImageService } from '../src/services/ImageService';
import { getSectorConfig } from '../src/types/sectors';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("❌ Falten les variables d'entorn de Supabase.");
}

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ... (BASE_TRANSLATION_SKELETON es queda igual) ...
const BASE_TRANSLATION_SKELETON = {
  Navbar: { links: { home: "Inici", services: "Serveis", blog: "Blog", shop: "Botiga", contact: "Contacte", about: "Nosaltres" }, cta: "Accés Clients", actions: { login: "Entrar", cart: "Cistella", menu: "Menú" } },
  Footer: { description: "Transformem idees.", rights_reserved: "Tots els drets.", legal: { privacy: "Privacitat", cookies: "Cookies", terms: "Termes" } },
  Booking: { title: "Reserva", subtitle: "Selecciona hora", steps: { services: { title: "S", select: "Sel", duration: "min" }, datetime: { select_day_title: "Dia", select_time_title: "Hora", loading: "...", back: "<", empty_state_day: "-", empty_state_slots: "-" }, form: { title: "Dades", subtitle: "...", personal_info: "Info", labels: { name: "N", email: "E" }, submit: "OK", submitting: "..." }, success: { title: "OK", message: "Ok", home_button: "Home" } }, errors: { load_slots: "Err", required_field: "Req" } },
  Shop: { featuredTitle: "Botiga", featuredSubtitle: "Productes", addToCart: "Add", outOfStock: "Out" },
  Blog: { title: "Blog", subtitle: "News", readMore: "Read", empty: "Empty" }
};

async function runIntegrationTest() {
  console.log("🏭 [FASE 1] INICIANT SIMULACIÓ TOTAL DE LA FACTORY");

  const infra = new InfrastructureService();
  const tenant = new TenantService();
  const ai = new AIService();
  const imageService = new ImageService();

  const TEST_SCENARIO = {
    businessName: "Bistrot del Port",
    description: "Restaurant de cuina marinera. Especialitat en arrossos.",
    sector: "restaurant",
    primaryColor: "#0ea5e9",
    publicEmail: "info@bistrotdelport.cat",
    layoutVariant: "modern" as const
  };

  const LANDING_SECTIONS = [
    { id: 'hero', type: 'hero' },
    { id: 'about', type: 'about' },
    { id: 'services', type: 'services' },
    { id: 'featured_products', type: 'featured_products' },
    { id: 'testimonials', type: 'testimonials' },
    { id: 'map', type: 'map' },
    { id: 'contact', type: 'contact' }
  ];

  const slug = `test-bistrot-${Math.floor(Math.random() * 10000)}`;

  try {
    // 1. Validar Usuari
    const { data: users } = await supabaseAdmin.auth.admin.listUsers();
    const testUser = users.users?.[0];
    if (!testUser) throw new Error("❌ Error crític: No hi ha usuaris.");
    console.log(`👤 Owner: ${testUser.email}`);

    // 2. Infraestructura
    console.log(`\n🏗️ [1/6] Creant Repo: ${slug}...`);
    const repoData = await infra.createRepository(slug, TEST_SCENARIO.description);
    await infra.waitForRepoReady(slug);
    console.log("   ✅ Repo llest.");

    // 3. IA
    console.log(`\n🧠 [2/6] Generant Contingut IA...`);
    const aiContent = await ai.generateTranslationFile(TEST_SCENARIO.businessName, TEST_SCENARIO.description, TEST_SCENARIO.sector);
    const finalContent = { ...aiContent, ...BASE_TRANSLATION_SKELETON };
    const enrichedContent = imageService.enrichWithImages(finalContent);
    console.log("   ✅ IA completada.");

    // 4. Config
    console.log(`\n⚙️ [3/6] Configurant...`);
    const sectorConfig = getSectorConfig(TEST_SCENARIO.sector);

    // 5. Base de Dades (Supabase Tenant)
    console.log(`\n🗄️ [4/6] Creant Tenant a Supabase...`);

    // Assegura't que el teu tenant service retorna l'objecte 'org'
    const { org } = await tenant.createTenantStructure({
      businessName: TEST_SCENARIO.businessName,
      slug: slug,
      repoUrl: repoData.html_url,
      branding: { colors: { primary: TEST_SCENARIO.primaryColor } },
      creatorUserId: testUser.id,
      creatorEmail: testUser.email!
    });
    console.log(`   ✅ Organization ID: ${org.id}`);

    // 🔥 PAS 4.5: SEEDING (ADAPTAT A LA TEVA TAULA REAL)
    console.log(`\n🌱 [4.5/6] Sembrant productes d'exemple...`);

    const sampleProducts = [
      {
        organization_id: org.id, // 👈 CLAU: Usem organization_id
        slug: "arros-caldos-llamantol", // 👈 CLAU: Slug obligatori
        name: "Arròs Caldós de llamàntol",
        description: "Especialitat de la casa amb marisc fresc de la llotja.",
        price: 24.50,
        currency: "EUR",
        stock: 100,
        images: ["https://images.unsplash.com/photo-1534080564583-6be75777b70a?auto=format&fit=crop&w=800&q=80"], // 👈 CLAU: Array de textos
        active: true
      },
      {
        organization_id: org.id,
        slug: "suquet-de-peix",
        name: "Suquet de Peix",
        description: "Recepta tradicional de pescadors.",
        price: 18.90,
        currency: "EUR",
        stock: 50,
        images: ["https://images.unsplash.com/photo-1626804475297-411dbe655d82?auto=format&fit=crop&w=800&q=80"],
        active: true
      },
      {
        organization_id: org.id,
        slug: "gambes-palamos",
        name: "Gambes de Palamós",
        description: "A la planxa amb sal grossa.",
        price: 32.00,
        currency: "EUR",
        stock: 20,
        images: ["https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80"],
        active: true
      },
      {
        organization_id: org.id,
        slug: "vi-blanc-emporda",
        name: "Vi Blanc Empordà",
        description: "D.O. Empordà, fresc i afruitat.",
        price: 14.00,
        currency: "EUR",
        stock: 200,
        images: ["https://images.unsplash.com/photo-1585553616435-2dc0a54e271d?auto=format&fit=crop&w=800&q=80"],
        active: true
      }
    ];

    const { error: seedError } = await supabaseAdmin.from('products').insert(sampleProducts);

    if (seedError) {
      console.error("   ⚠️ Error fent seeding de productes:", seedError);
      console.error("   DETALLS:", seedError.message, seedError.details);
    } else {
      console.log(`   ✅ 4 productes creats correctament a la DB.`);
    }
    // 6. Inject Files
    console.log(`\n📦 [5/6] Injectant fitxers...`);
    const filesToInject = {
      'src/messages/ca.json': JSON.stringify(enrichedContent, null, 2),
      'src/config/site-config.json': JSON.stringify({
        name: TEST_SCENARIO.businessName,
        description: enrichedContent.hero.subtitle,
        sector: sectorConfig.key,
        features: { booking: true, ecommerce: true, blog: true, gallery: true, faq: true },
        theme: { primary: TEST_SCENARIO.primaryColor, layout: TEST_SCENARIO.layoutVariant },
        landing: { sections: LANDING_SECTIONS }, // 👈 LES SECCIONS
        contact: { email: TEST_SCENARIO.publicEmail, phone: "+34 972 00 00 00", address: "Palamós", socials: {} }
      }, null, 2)
    };
    await infra.commitFiles(slug, filesToInject);

    // 7. Deploy
    console.log(`\n🚀 [FINAL] Desplegant...`);
    await infra.deployToVercel(slug, org.id, repoData.id);

    console.log(`\n🌍 Repo: ${repoData.html_url}`);
    console.log(`🌐 URL: https://${slug}.vercel.app`);

  } catch (error) {
    console.error("ERROR:", error);
  }
}

runIntegrationTest();