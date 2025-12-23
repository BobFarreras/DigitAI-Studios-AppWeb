import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";

// Interfície exportada perquè la pugui fer servir actions.ts
export interface AIContentResult {
  hero: { title: string; subtitle: string; cta: string };
  about: { title: string; description: string };
  services_intro: { title: string; subtitle: string };
}

export class AIService {
  private geminiClient: GoogleGenerativeAI;
  private openAIClient: OpenAI | null = null;

  constructor() {
    const googleKey = process.env.GEMINI_API_KEY;
    if (!googleKey) console.warn("⚠️ [AIService] Manca GEMINI_API_KEY");
    this.geminiClient = new GoogleGenerativeAI(googleKey || "");

    const openAIKey = process.env.OPENAI_API_KEY;
    if (openAIKey) {
      this.openAIClient = new OpenAI({ apiKey: openAIKey });
    } else {
      console.warn("⚠️ [AIService] Manca OPENAI_API_KEY. El fallback no funcionarà.");
    }
  }

  async generateSiteContent(businessName: string, description: string, language: string = 'ca'): Promise<AIContentResult> {
    console.log(`🤖 [AIService] Generant contingut per: ${businessName}...`);

    try {
      // INTENT 1: Gemini
      return await this.generateWithGemini(businessName, description, language);
    } catch (error: unknown) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.error(`⚠️ [AIService] Gemini ha fallat (${errorMsg}). Commutant a OpenAI...`);

      if (this.openAIClient) {
        try {
          // INTENT 2: OpenAI
          return await this.generateWithOpenAI(businessName, description, language);
        } catch (openaiError: unknown) {
          const openaiMsg = openaiError instanceof Error ? openaiError.message : String(openaiError);
          console.error(`⚠️ [AIService] OpenAI també ha fallat (${openaiMsg}).`);
        }
      }
    }

    // INTENT 3: Fallback Estàtic
    console.error("🚨 [AIService] TOTS els serveis d'IA han fallat. Usant dades estàtiques.");
    return {
      hero: { title: businessName, subtitle: description || "Benvinguts al nostre web", cta: "Contactar" },
      about: { title: "Sobre Nosaltres", description: "Som una empresa dedicada a oferir el millor servei." },
      services_intro: { title: "Serveis", subtitle: "Descobreix què podem fer per tu." }
    };
  }

  private async generateWithGemini(name: string, desc: string, lang: string): Promise<AIContentResult> {
    const model = this.geminiClient.getGenerativeModel({ model: "gemini-2.0-flash" });
    const prompt = this.buildPrompt(name, desc, lang);
    
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return this.parseJSON(text);
  }

  private async generateWithOpenAI(name: string, desc: string, lang: string): Promise<AIContentResult> {
    if (!this.openAIClient) throw new Error("OpenAI no configurat");

    const completion = await this.openAIClient.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: "Ets un expert en copywriting i JSON." },
        { role: "user", content: this.buildPrompt(name, desc, lang) }
      ],
    });

    const content = completion.choices[0].message.content;
    if (!content) throw new Error("Resposta buida d'OpenAI");
    return JSON.parse(content);
  }

  private buildPrompt(name: string, desc: string, lang: string): string {
    return `
      Genera contingut per a una Landing Page.
      Negoci: "${name}". Descripció: "${desc}". Idioma: "${lang}".
      Retorna EXCLUSIVAMENT un objecte JSON amb aquesta estructura exacta:
      {
        "hero": { "title": "...", "subtitle": "...", "cta": "..." },
        "about": { "title": "...", "description": "..." },
        "services_intro": { "title": "...", "subtitle": "..." }
      }
    `;
  }

  private parseJSON(text: string): AIContentResult {
    const cleanJson = text.replace(/```json|```/g, '').trim();
    return JSON.parse(cleanJson);
  }
}

export const aiService = new AIService();