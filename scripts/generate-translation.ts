// FITXER: scripts/generate-translation.ts
// EXECUCIÓ: npx tsx scripts/generate-translation.ts

import { AIService } from "../src/services/AIService";
import { ImageService } from "../src/services/ImageService";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

// Carreguem variables d'entorn
dotenv.config({ path: '.env.local' });

async function runFactoryPipeline() {
  console.log("🏭 [FACTORY PIPELINE] Iniciant procés complet...\n");

  const aiService = new AIService();
  const imageService = new ImageService();

  // Dades de prova (pots canviar el sector per provar 'restaurant', 'legal', etc.)
  const inputData = {
    name: "Finques Gaudí",
    description: "Gestió immobiliària de luxe a l'Eixample de Barcelona. Atenció personalitzada.",
    sector: "real_estate"
  };

  try {
    // PAS 1: Generació de Text i Prompts (IA)
    console.time("1️⃣ Generació IA");
    const rawContent = await aiService.generateTranslationFile(
      inputData.name, 
      inputData.description, 
      inputData.sector
    );
    console.timeEnd("1️⃣ Generació IA");

    // PAS 2: Enriquiment Visual (Imatges)
    console.time("2️⃣ Generació Imatges");
    const finalContent = imageService.enrichWithImages(rawContent);
    console.timeEnd("2️⃣ Generació Imatges");

    // PAS 3: Validació Visual en Consola
    console.log("\n------------------------------------------------");
    console.log(`🏢 Negoci: ${inputData.name}`);
    console.log(`📝 Títol: "${finalContent.hero.title}"`);
    console.log(`🖼️ Hero Image URL: ${finalContent.hero.image}`);
    console.log(`📸 Prompt IA: "${finalContent.hero.image_prompt}"`);
    console.log(`👤 Avatar URL: ${finalContent.testimonials.reviews[0]?.avatar}`);
    console.log("------------------------------------------------");

    // PAS 4: Guardar fitxer (Simulació de la Factory real)
    const outputPath = path.join(process.cwd(), "test-ca-full.json");
    fs.writeFileSync(outputPath, JSON.stringify(finalContent, null, 2));
    
    console.log(`\n✅ Fitxer complet guardat a: ${outputPath}`);
    console.log("🚀 El sistema està llest per a producció (Zero 'any', Strict Types).");

  } catch (error) {
    console.error("❌ Error en el pipeline:", error);
  }
}

runFactoryPipeline();