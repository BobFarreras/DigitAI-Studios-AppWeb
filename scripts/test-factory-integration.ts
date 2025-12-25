// FITXER: scripts/test-factory-integration.ts
// EXECUCIÓ: npx tsx scripts/test-factory-integration.ts

import { InfrastructureService } from '../src/services/factory/InfrastrocutreService';
import { TenantService } from '../src/services/TenantService';
import { AIService } from '../src/services/AIService';
import { ImageService } from '../src/services/ImageService';
import { getSectorConfig } from '../src/types/sectors';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// 1. Carreguem entorn
dotenv.config({ path: '.env.local' });

// 2. Client Supabase ADMIN
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ✅ DEFINIM UN TIPUS PER ALS ERRORS D'API (GitHub/Vercel)
// Això ens permet llegir 'response.data' sense usar 'any'
interface ApiError {
  message?: string;
  response?: {
    data?: unknown;
    status?: number;
  };
}

async function runIntegrationTest() {
  console.log("🏭 INICIANT TEST D'INTEGRACIÓ REAL (E2E)");
  console.log("------------------------------------------------");

  const infra = new InfrastructureService();
  const tenant = new TenantService();
  const ai = new AIService();
  const imageService = new ImageService();

  // Dades de Prova
  const TEST_DATA = {
    businessName: "Bistrot del Port",
    description: "Cuina marinera fresca amb vistes al port de Palamós. Especialitat en arròs caldós.",
    sector: "restaurant",
    primaryColor: "#0ea5e9",
    publicEmail: "hola@bistrotdelport.test",
    layoutVariant: "modern" as const
  };

  const slug = `test-bistrot-${Math.floor(Math.random() * 10000)}`;

  try {
    // 0. OBTENIR UN USUARI REAL
    const { data: users } = await supabaseAdmin.auth.admin.listUsers();
    // Agafem el primer usuari que trobem o llancem error
    const testUser = users.users?.[0];

    if (!testUser) {
      throw new Error("❌ No hi ha usuaris a Supabase. Crea'n un primer per fer el test.");
    }
    console.log(`👤 Simulant usuari: ${testUser.email} (${testUser.id})`);

    // 1. INFRAESTRUCTURA
    console.log(`\n🏗️ [1/5] Creant Repositori GitHub: ${slug}...`);
    const repoData = await infra.createRepository(slug, TEST_DATA.description);

    console.log("   ⏳ Esperant que el repo estigui llest...");
    const isReady = await infra.waitForRepoReady(slug);
    if (!isReady) throw new Error("GitHub Timeout");
    console.log("   ✅ Repo actiu.");

    // 2. INTEL·LIGÈNCIA ARTIFICIAL
    console.log(`\n🧠 [2/5] Generant Contingut (Gemini + Unsplash)...`);
    console.time("   ⏱️ Temps IA");
    const rawContent = await ai.generateTranslationFile(TEST_DATA.businessName, TEST_DATA.description, TEST_DATA.sector);
    const finalContent = imageService.enrichWithImages(rawContent);
    console.timeEnd("   ⏱️ Temps IA");
    console.log("   ✅ Contingut generat.");

    // 3. LÒGICA DE NEGOCI
    console.log(`\n⚙️ [3/5] Aplicant configuració de sector: ${TEST_DATA.sector}...`);
    const sectorConfig = getSectorConfig(TEST_DATA.sector);
    console.log(`   ✅ Features actives: ${JSON.stringify(sectorConfig.features)}`);

    // 4. DATABASE
    console.log(`\n🗄️ [4/5] Creant Tenant a Supabase...`);
    const { org } = await tenant.createTenantStructure({
      businessName: TEST_DATA.businessName,
      slug: slug,
      repoUrl: repoData.html_url,
      branding: { colors: { primary: TEST_DATA.primaryColor } },
      creatorUserId: testUser.id,
      creatorEmail: testUser.email!
    });
    console.log(`   ✅ Organització creada: ${org.id}`);

    // 5. INJECCIÓ DE CODI
    console.log(`\n📦 [5/5] Injectant fitxers al Repositori...`);

    const filesToInject = {
      // ✅ 1. Si al Template tens src/messages, aquí has de posar la ruta completa:
      'src/messages/ca.json': JSON.stringify(finalContent, null, 2),

      // ✅ 2. Aquest fitxer NO existeix al Template, però el creem ara mateix
      // perquè el teu codi (lib/site-config.ts) l'espera dins de src/config.
      'src/config/site-config.json': JSON.stringify({
        name: TEST_DATA.businessName,
        description: finalContent.hero.subtitle,
        sector: sectorConfig.key,
        features: sectorConfig.features,
        theme: {
          primary: TEST_DATA.primaryColor,
          layout: TEST_DATA.layoutVariant
        },
        contact: {
          email: TEST_DATA.publicEmail,
          phone: "600 000 000",
          address: "Port de Palamós, s/n"
        }
      }, null, 2)
    };

    await infra.commitFiles(slug, filesToInject);
    console.log("   ✅ Fitxers injectats correctament.");

    // 6. DEPLOY
    console.log(`\n🚀 [FINAL] Desplegant a Vercel...`);
    await infra.deployToVercel(slug, org.id, repoData.id);

    console.log("\n------------------------------------------------");
    console.log("🎉 TEST D'INTEGRACIÓ COMPLETAT AMB ÈXIT!");
    console.log(`🌍 Repo URL: ${repoData.html_url}`);
    console.log(`🌐 Vercel URL: https://${slug}.vercel.app`);
    console.log("------------------------------------------------\n");

  } catch (error: unknown) {
    // 🛠️ GESTIÓ D'ERRORS STRICT MODE (Sense 'any')
    console.error("\n❌ ERROR EN EL TEST:");

    // 1. Si és un error estàndard JS
    if (error instanceof Error) {
      console.error(`   Missatge: ${error.message}`);
    }

    // 2. Si és un error d'API (Octokit/Axios) amb resposta
    const apiError = error as ApiError;
    if (apiError.response?.data) {
      console.error("   Detalls API:", JSON.stringify(apiError.response.data, null, 2));
    } else if (!(error instanceof Error)) {
      // Fallback per errors estranys (strings, objectes sense tipar)
      console.error("   Detall desconegut:", String(error));
    }
  }
}

runIntegrationTest();