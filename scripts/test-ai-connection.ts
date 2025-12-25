// FITXER: scripts/test-ai-connection.ts
// EXECUCIÓ: npx tsx scripts/test-ai-connection.ts

import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config({ path: '.env.local' });

// Definim una interfície per al possible format d'error de Google
interface GoogleError {
  message?: string;
  body?: unknown;
  status?: number;
}

async function testGeminiSimple() {
  console.log("🔍 DIAGNÒSTIC GEMINI (MODO AÏLLAT)...\n");

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("❌ NO API KEY: Revisa .env.local");
    return;
  }

  // Usem el nou SDK @google/genai
  const ai = new GoogleGenAI({ apiKey: apiKey });

  // Utilitzem el model estàndard flash (el més probable que funcioni)
  const modelName = "gemini-2.5-flash"; 

  console.log(`👉 Intentant connectar amb: ${modelName}`);

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: [{ role: "user", parts: [{ text: "Si funciones, digues: OPERATIU" }] }],
    });

    // En el nou SDK, .text és un getter (sense parèntesis)
    const text = response.text; 

    if (text) {
        console.log("\n✅ ÈXIT TOTAL!");
        console.log(`🤖 Resposta: ${text}`);
    } else {
        console.log("\n⚠️ La crida ha funcionat, però la resposta està buida.");
        // Casting segur a string per loguejar
        console.log("Debug Response:", JSON.stringify(response, null, 2));
    }

  } catch (error: unknown) {
    console.error("\n❌ ERROR FATAL:");
    
    // TYPE GUARDING: Convertim 'unknown' a un objecte que puguem llegir
    const err = error as GoogleError;

    if (err && typeof err === 'object') {
        if ('body' in err && err.body) {
            console.error("🔍 Detall del servidor (BODY):", JSON.stringify(err.body, null, 2));
        } else if ('message' in err && typeof err.message === 'string') {
            console.error("🔍 Missatge:", err.message);
        } else {
            console.error("🔍 Error cru:", JSON.stringify(err, null, 2));
        }
    } else {
        console.error("🔍 Error desconegut (No és un objecte):", String(error));
    }

    console.log("\n💡 PISTES POSSIBLES:");
    console.log("1. Si veus '429' o 'QUOTA_EXCEEDED':");
    console.log("   - Pot ser que el teu compte gratuït tingui un límit baix.");
    console.log("   - Pot ser que aquest model concret no estigui inclòs al teu pla.");
    console.log("2. Si veus '404': El model no existeix o la clau no hi té accés.");
    console.log("3. Si veus 'User location not supported': Google requereix 'Billing Account' (encara que sigui gratis) a Europa.");
  }
}

testGeminiSimple();