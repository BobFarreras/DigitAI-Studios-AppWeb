import OpenAI from "openai";
import { IAIProvider } from "../interfaces/IAIProvider";
import { WebsitePrompt } from "../prompts/WebsitePrompt";
import { I18nSchema } from "@/types/i18n";
import { SectorConfig } from "@/types/sectors";
import { BusinessSuggestion } from "@/types/ai";

export class OpenAIProvider implements IAIProvider {
  public providerName = "OpenAI GPT-4o Mini";
  private client: OpenAI;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    // És bona pràctica no llançar error al constructor si vols que l'app arrenqui igualment
    // però si és un requisit fort, deixa-ho així.
    if (!apiKey) console.warn("⚠️ Manca OPENAI_API_KEY. El fallback no funcionarà.");
    this.client = new OpenAI({ apiKey: apiKey || 'dummy-key' });
  }

  async generateContent(name: string, desc: string, config: SectorConfig): Promise<I18nSchema> {
    const prompt = WebsitePrompt.build(name, desc, config);

    const completion = await this.client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { 
          role: "system", 
          content: "Ets un expert Copywriter i desenvolupador JSON. Retorna SEMPRE un JSON vàlid que compleixi estrictament l'estructura demanada." 
        },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const content = completion.choices[0].message.content;
    if (!content) throw new Error("OpenAI ha retornat una resposta buida");

    return JSON.parse(content) as I18nSchema;
  }

  // 👇 CORRECCIÓ AQUI: Afegim 'isVip'
  // ✅ CORRECCIÓ: Ara rep el 'finalPrompt' directament
  async analyzeBusiness(url: string, finalPrompt: string): Promise<BusinessSuggestion[]> {
    
    // JA NO CRIDEM A WebsitePrompt AQUÍ
    
    const completion = await this.client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Retorna només JSON vàlid amb un array d'oportunitats." },
        { role: "user", content: finalPrompt } // Usem el prompt que ve de l'AIService
      ],
      response_format: { type: "json_object" },
      temperature: 0.5,
    });

    const content = completion.choices[0].message.content;
    if (!content) throw new Error("OpenAI empty response");

    try {
      const parsed = JSON.parse(content);
      return Array.isArray(parsed) ? parsed : (parsed.suggestions || []);
    } catch (e) {
      console.error("Error parsejant JSON de OpenAI:", e);
      return [];
    }
  }
}