// check-models.js
import fs from 'fs';
import path from 'path';

// Carreguem l'API Key manualment del .env.local
try {
  const envPath = path.resolve(process.cwd(), '.env.local');
  const envContent = fs.readFileSync(envPath, 'utf-8');
  const match = envContent.match(/GEMINI_API_KEY=(.*)/);
  
  if (!match) {
    console.error("❌ No he trobat GEMINI_API_KEY al fitxer .env.local");
    process.exit(1);
  }

  const apiKey = match[1].trim();
  console.log(`🔑 Clau trobada: ${apiKey.substring(0, 5)}...`);

  // Fem una petició directa a l'API REST de Google
  checkGoogleModels(apiKey);

} catch (e) {
  console.error("❌ Error llegint .env.local:", e.message);
}

async function checkGoogleModels(key) {
  console.log("📡 Connectant amb Google per llistar models disponibles...");
  
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
    const data = await response.json();

    if (data.error) {
      console.error("\n❌ ERROR DE GOOGLE:");
      console.error(`Codi: ${data.error.code}`);
      console.error(`Missatge: ${data.error.message}`);
      console.error(`Status: ${data.error.status}`);
      return;
    }

    if (!data.models) {
      console.log("⚠️ La petició ha funcionat però no ha tornat cap model. Molt estrany.");
      console.log(data);
      return;
    }

    console.log("\n✅ MODELS DISPONIBLES PER A LA TEVA CLAU:");
    console.log("------------------------------------------------");
    data.models.forEach(m => {
      // Filtrem només els que serveixen per generar text
      if (m.supportedGenerationMethods.includes("generateContent")) {
        console.log(`- ${m.name.replace('models/', '')}`);
      }
    });
    console.log("------------------------------------------------");
    console.log("Copia un d'aquests noms al teu array 'modelsToTry'!");

  } catch (error) {
    console.error("❌ Error de xarxa:", error);
  }
}