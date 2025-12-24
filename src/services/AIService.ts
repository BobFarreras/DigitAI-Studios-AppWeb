import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";
import { MasterConfig } from "@/types/config"; 

// Tipus definitiu
export type AIContentResult = NonNullable<MasterConfig['content']>;

export class AIService {
  private genAI: GoogleGenerativeAI;
  private openai: OpenAI;

  constructor() {
    // Inicialitzem Gemini
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "dummy");
    
    // Inicialitzem OpenAI
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || "dummy",
    });
  }

  // 🎛️ ORQUESTRADOR PRINCIPAL
  async generateSiteContent(businessName: string, description: string, sector: string): Promise<AIContentResult> {
    console.log(`🤖 [AI] Iniciant generació per: ${businessName}...`);

    // 1. INTENT PRINCIPAL: GEMINI
    try {
      if (!process.env.GEMINI_API_KEY) throw new Error("No Gemini Key");
      console.log("🔵 [AI] Provant amb Google Gemini...");
      return await this.tryGemini(businessName, description, sector);
    } catch (error) {
      console.warn("⚠️ [AI] Gemini ha fallat. Canviant a OpenAI...", error);
    }

    // 2. INTENT SECUNDARI: OPENAI (FAILOVER)
    try {
      if (!process.env.OPENAI_API_KEY) throw new Error("No OpenAI Key");
      console.log("🟢 [AI] Provant amb OpenAI (GPT)...");
      return await this.tryOpenAI(businessName, description, sector);
    } catch (error) {
      console.error("❌ [AI] OpenAI també ha fallat.", error);
    }

    // 3. EMERGÈNCIA: FALLBACK
    console.error("🔥 [AI] TOTS ELS MODELS HAN FALLAT. Usant dades per defecte.");
    return this.getFallbackContent(businessName, description);
  }

  // ---------------------------------------------------------
  // 🧠 MOTOR 1: GEMINI
  // ---------------------------------------------------------
  private async tryGemini(name: string, desc: string, sector: string): Promise<AIContentResult> {
    const model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = this.getPrompt(name, desc, sector);

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    // Neteja del JSON (Gemini a vegades posa ```json ... ```)
    const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    return JSON.parse(cleanJson) as AIContentResult;
  }

  // ---------------------------------------------------------
  // 🧠 MOTOR 2: OPENAI
  // ---------------------------------------------------------
  private async tryOpenAI(name: string, desc: string, sector: string): Promise<AIContentResult> {
    const completion = await this.openai.chat.completions.create({
      model: "gpt-4o-mini", // Model ràpid, econòmic i molt intel·ligent
      messages: [
        { role: "system", content: "Ets un expert en generar JSONs estructurats per a webs." },
        { role: "user", content: this.getPrompt(name, desc, sector) }
      ],
      response_format: { type: "json_object" }, // 👈 CLAU: Força JSON estricte
    });

    const content = completion.choices[0].message.content;
    if (!content) throw new Error("OpenAI ha retornat buit");

    return JSON.parse(content) as AIContentResult;
  }

  // ---------------------------------------------------------
  // 📝 EL PROMPT (Compartit per coherència)
  // ---------------------------------------------------------
  private getPrompt(name: string, desc: string, sector: string): string {
    return `
      Genera el contingut per a una Landing Page professional.
      
      DADES:
      - Nom: "${name}"
      - Descripció Usuari: "${desc}"
      - Sector: "${sector}"

      INSTRUCCIONS:
      1. Inventa't 3 Serveis específics del sector.
      2. Inventa't 3 Testimonis creïbles (noms locals).
      3. Millora la descripció "About".
      
      Retorna NOMÉS un JSON amb aquesta estructura:
      {
        "hero": { 
            "title": "Títol màrqueting curt (màx 6 paraules)", 
            "subtitle": "Subtítol valor (màx 15 paraules)", 
            "cta": "Text botó" 
        },
        "about": { 
            "title": "Sobre Nosaltres", 
            "description": "Text professional millorat (màx 40 paraules)", 
            "stats": [
                { "label": "Dada 1 (ex: Anys)", "value": "Valor 1" },
                { "label": "Dada 2", "value": "Valor 2" }
            ]
        },
        "services_intro": {
            "title": "Serveis", 
            "subtitle": "Solucions a mida", 
            "items": [
                { "title": "Servei 1", "description": "Descripció 1" }, 
                { "title": "Servei 2", "description": "Descripció 2" }, 
                { "title": "Servei 3", "description": "Descripció 3" }
            ]
        },
        "testimonials": {
            "title": "Opinions", 
            "subtitle": "Clients reals",
            "items": [
                { "text": "Opinió 1", "author": "Nom 1", "role": "Rol 1", "rating": 5 },
                { "text": "Opinió 2", "author": "Nom 2", "role": "Rol 2", "rating": 5 },
                { "text": "Opinió 3", "author": "Nom 3", "role": "Rol 3", "rating": 4 }
            ]
        }
      }
    `;
  }

  // ---------------------------------------------------------
  // 🛡️ FALLBACK (Últim recurs)
  // ---------------------------------------------------------
  private getFallbackContent(name: string, desc: string): AIContentResult {
    return {
      hero: { title: name, subtitle: desc, cta: "Contactar" },
      about: { 
          title: "Sobre Nosaltres", 
          description: desc, 
          stats: [{ label: "Experiència", value: "+10 Anys" }] 
      },
      services_intro: { 
          title: "Serveis", 
          subtitle: "Descobreix els nostres serveis", 
          items: [] 
      },
      testimonials: {
          title: "Opinions",
          subtitle: "Què diuen els clients",
          items: []
      }
    };
  }
}