import { GoogleGenerativeAI } from "@google/generative-ai";
// 👇 IMPORTEM ELS TIPUS OFICIALS (Single Source of Truth)
import { AboutConfigInput, ServicesIntroConfigInput, HeroConfigInput } from "@/types/config";

// Definim la interfície de resultat utilitzant els tipus del Config
export interface AIContentResult {
  hero: HeroConfigInput;
  about: AboutConfigInput; 
  services_intro: ServicesIntroConfigInput; 
}

export class AIService {
  private genAI: GoogleGenerativeAI;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("⚠️ GEMINI_API_KEY no trobada. La IA no funcionarà (Mode Fallback).");
    }
    this.genAI = new GoogleGenerativeAI(apiKey || "dummy");
  }

  async generateSiteContent(businessName: string, description: string, sector: string): Promise<AIContentResult> {
    // Mode Fallback si no hi ha API Key
    if (!process.env.GEMINI_API_KEY) {
      return this.getFallbackContent(businessName, description);
    }

    try {
      const model = this.genAI.getGenerativeModel({ model: "gemini-pro" });

      const prompt = `
        Ets un expert en màrqueting digital i copywriting web.
        Genera el contingut per a una Landing Page d'un negoci amb aquestes dades:
        
        NOM: "${businessName}"
        DESCRIPCIÓ: "${description}"
        SECTOR: "${sector}"

        Retorna EXCLUSIVAMENT un objecte JSON (sense markdown) amb aquesta estructura exacta i en Català:

        {
          "hero": {
            "title": "Títol curt i impactant (màx 6 paraules)",
            "subtitle": "Subtítol persuasiu (màx 20 paraules)",
            "cta": "Text del botó (ex: Reservar)"
          },
          "about": {
            "title": "Títol creatiu per 'Nosaltres'",
            "description": "Història breu (màx 40 paraules)",
            "stats": [
              { "label": "Dada 1 (ex: Anys)", "value": "Valor 1" },
              { "label": "Dada 2 (ex: Clients)", "value": "Valor 2" }
            ]
          },
          "services_intro": {
            "title": "Títol per Serveis",
            "subtitle": "Subtítol introductori",
            "items": [
              { "title": "Servei 1", "description": "Breu descripció" },
              { "title": "Servei 2", "description": "Breu descripció" },
              { "title": "Servei 3", "description": "Breu descripció" }
            ]
          }
        }
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      let text = response.text();

      // Neteja per si Gemini retorna blocs de codi
      text = text.replace(/```json/g, '').replace(/```/g, '').trim();

      const json = JSON.parse(text) as AIContentResult;
      return json;

    } catch (error) {
      console.error("❌ Error generant contingut IA:", error);
      return this.getFallbackContent(businessName, description);
    }
  }

  private getFallbackContent(name: string, desc: string): AIContentResult {
    return {
      hero: { title: name, subtitle: desc, cta: "Saber-ne més" },
      about: { 
          title: "Sobre Nosaltres", 
          description: desc,
          stats: [{ label: "Experiència", value: "100%" }] 
      },
      services_intro: { 
          title: "Els nostres serveis", 
          subtitle: "Descobreix el que podem fer per tu.",
          items: [] // Array buit per complir amb el tipus
      }
    };
  }
}