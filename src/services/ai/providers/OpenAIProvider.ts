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
    if (!apiKey) throw new Error("Manca OPENAI_API_KEY");
    this.client = new OpenAI({ apiKey });
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
      response_format: { type: "json_object" }, // Forcem mode JSON
      temperature: 0.7,
    });

    const content = completion.choices[0].message.content;
    if (!content) throw new Error("OpenAI ha retornat una resposta buida");

    return JSON.parse(content) as I18nSchema;
  }
  // 👇 2. NOU MÈTODE D'ANÀLISI
  async analyzeBusiness(url: string, pageText: string): Promise<BusinessSuggestion[]> {
    const prompt = WebsitePrompt.buildBusinessAnalysis(url, pageText);

    const completion = await this.client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Retorna només JSON vàlid." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.5,
    });

    const content = completion.choices[0].message.content;
    if (!content) throw new Error("OpenAI empty response");

    // OpenAI sol tornar { "suggestions": [...] } o directament l'array segons com li doni.
    // Com que el prompt demana array, a vegades el posa dins d'una clau arrel.
    const parsed = JSON.parse(content);
    return Array.isArray(parsed) ? parsed : (parsed.suggestions || []);
  }

}