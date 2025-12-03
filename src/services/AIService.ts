import { GoogleGenerativeAI } from "@google/generative-ai";

export class AIService {
  private genAI: GoogleGenerativeAI;

  constructor() {
    const apiKey = process.env.GOOGLE_AI_API_KEY;
    if (!apiKey) throw new Error("❌ Manca GOOGLE_AI_API_KEY a .env.local");
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async generateSiteContent(businessName: string, description: string, language: string = 'ca') {
    const model = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
      Ets un expert en copywriting web. Genera contingut per a una Landing Page.
      Negoci: "${businessName}". Descripció: "${description}". Idioma: "${language}".

      Retorna EXCLUSIVAMENT un objecte JSON (sense markdown) amb aquesta estructura:
      {
        "hero": {
          "title": "Títol curt i impactant",
          "subtitle": "Subtítol persuasiu",
          "cta": "Text del botó"
        },
        "about": {
          "title": "Sobre Nosaltres",
          "description": "Descripció professional breu"
        },
        "services_intro": {
          "title": "Serveis",
          "subtitle": "Frase ganxo"
        }
      }
    `;

    try {
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      // Neteja per si la IA torna markdown ```json ... ```
      const cleanJson = text.replace(/```json|```/g, '').trim();
      return JSON.parse(cleanJson);
    } catch (error) {
      console.error("AI Error:", error);
      // Fallback per si falla
      return {
        hero: { title: businessName, subtitle: description, cta: "Contactar" },
        about: { title: "Sobre Nosaltres", description: "" },
        services_intro: { title: "Serveis", subtitle: "" }
      };
    }
  }
}