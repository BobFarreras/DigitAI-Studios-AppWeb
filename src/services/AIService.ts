import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai";
import { I18nSchema } from "@/types/i18n";
import { getSectorConfig, SectorConfig } from "@/types/sectors";

export class AIService {
  private ai: GoogleGenAI;
  private openai: OpenAI;
  private geminiModelName = "gemini-2.5-flash";

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "dummy" });
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "dummy" });
  }

  async generateTranslationFile(
    businessName: string,
    description: string,
    sectorInput: string
  ): Promise<I18nSchema> {

    const sectorConfig: SectorConfig = getSectorConfig(sectorInput);
    console.log(`🤖 [AIService] Generant per: "${businessName}" (Sector: ${sectorConfig.key})...`);

    if (process.env.GEMINI_API_KEY) {
      try {
        console.log(`🔵 [AIService] Usant Google Gemini (${this.geminiModelName})...`);
        return await this.tryGemini(businessName, description, sectorConfig);
      } catch (error: unknown) {
        console.warn(`⚠️ [AIService] Gemini ha fallat. Canviant a OpenAI...`, error);
      }
    }

    if (process.env.OPENAI_API_KEY) {
      try {
        console.log("🟢 [AIService] Usant OpenAI...");
        return await this.tryOpenAI(businessName, description, sectorConfig);
      } catch (error: unknown) {
        console.error("❌ [AIService] OpenAI també ha fallat.", error);
      }
    }

    console.error("🔥 [AIService] TOTS ELS MODELS HAN FALLAT. Usant fallback.");
    return this.getFallbackContent(businessName, description, sectorConfig);
  }

  // 🧠 MOTOR GEMINI (AMB ESQUEMA AMPLIAT)
  private async tryGemini(name: string, desc: string, config: SectorConfig): Promise<I18nSchema> {

    const googleSchema = {
      type: "OBJECT",
      properties: {
        hero: {
          type: "OBJECT",
          properties: {
            title: { type: "STRING" }, subtitle: { type: "STRING" }, cta: { type: "STRING" },
            image_prompt: { type: "STRING" }
          },
          required: ["title", "subtitle", "cta", "image_prompt"]
        },
        about: {
          type: "OBJECT",
          properties: {
            badge: { type: "STRING" }, title: { type: "STRING" }, description: { type: "STRING" },
            image_prompt: { type: "STRING" },
            // Stats flexibles (objecte pla)
            stats: {
              type: "OBJECT", properties: {
                label1: { type: "STRING" }, value1: { type: "STRING" },
                label2: { type: "STRING" }, value2: { type: "STRING" },
                label3: { type: "STRING" }, value3: { type: "STRING" }
              }
            }
          },
          required: ["title", "description", "stats"]
        },
        services: {
          type: "OBJECT",
          properties: {
            badge: { type: "STRING" }, title: { type: "STRING" }, subtitle: { type: "STRING" },
            items: {
              type: "ARRAY", items: {
                type: "OBJECT", properties: {
                  title: { type: "STRING" }, description: { type: "STRING" }, icon_name: { type: "STRING" }
                }
              }
            }
          },
          required: ["items"]
        },
        testimonials: {
          type: "OBJECT",
          properties: {
            badge: { type: "STRING" }, title: { type: "STRING" }, subtitle: { type: "STRING" },
            reviews: {
              type: "ARRAY", items: {
                type: "OBJECT", properties: {
                  author: { type: "STRING" }, role: { type: "STRING" }, text: { type: "STRING" }, avatar_gender: { type: "STRING" }
                }
              }
            }
          },
          required: ["reviews"]
        },
        // 👇 NOVES SECCIONS PER OMPLIR TOTA LA WEB
        cta_banner: {
          type: "OBJECT",
          properties: {
            heading: { type: "STRING" }, subheading: { type: "STRING" }, buttonText: { type: "STRING" }
          },
          required: ["heading", "buttonText"]
        },
        faq: {
          type: "OBJECT",
          properties: {
            title: { type: "STRING" }, subtitle: { type: "STRING" },
            items: {
              type: "ARRAY", items: {
                type: "OBJECT", properties: {
                  question: { type: "STRING" }, answer: { type: "STRING" }
                }
              }
            }
          },
          required: ["title", "items"]
        },
        contact: {
          type: "OBJECT",
          properties: {
            title: { type: "STRING" }, description: { type: "STRING" }, button: { type: "STRING" }
          },
          required: ["title", "button"]
        }
      },
      required: ["hero", "about", "services", "testimonials", "cta_banner", "faq", "contact"]
    };

    const prompt = this.getPrompt(name, desc, config);

    const response = await this.ai.models.generateContent({
      model: this.geminiModelName,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: googleSchema,
        temperature: 0.7
      }
    });

    const text = response.text;
    if (!text) throw new Error("Resposta buida de Gemini");
    return JSON.parse(text) as I18nSchema;
  }

  // 🧠 MOTOR OPENAI
  private async tryOpenAI(name: string, desc: string, config: SectorConfig): Promise<I18nSchema> {
    const prompt = this.getPrompt(name, desc, config);
    const completion = await this.openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Retorna JSON vàlid seguint l'esquema demanat, incloent faq i cta_banner." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });
    const content = completion.choices[0].message.content;
    if (!content) throw new Error("Resposta buida d'OpenAI");
    return JSON.parse(content) as I18nSchema;
  }

  // 📝 PROMPT ACTUALITZAT
  private getPrompt(name: string, desc: string, config: SectorConfig): string {
    return `
      Genera contingut web i18n en CATALÀ per a un negoci real.
      NEGOCI: "${name}" (${desc})
      SECTOR: ${config.key}
      ESTIL: ${config.aiPersona}

      INSTRUCCIONS CLAU:
      - 'image_prompt': En ANGLÈS. Ex: "modern restaurant interior".
      - 'avatar_gender': "male" o "female".
      - 'cta_banner': Un text persuasiu final per captar clients.
      - 'faq': 4 preguntes freqüents rellevants per a un negoci de tipus ${config.key}.
      
      OUTPUT: JSON complet amb totes les seccions (hero, about, services, testimonials, cta_banner, faq, contact).
    `;
  }

  // ===========================================================================
  // 🧱 FALLBACK (Dades d'emergència si l'AI falla)
  // ===========================================================================

  // FIX: Posem '_config' amb guió baix per dir-li a TypeScript que sabem que no s'usa
  // i que no ens doni l'error "unused variable".
  private getFallbackContent(name: string, desc: string, _config: SectorConfig): I18nSchema {
    return {
      hero: {
        title: name,
        subtitle: desc,
        cta: "Contactar",
        image_prompt: "business minimalist background"
      },
      about: {
        badge: "Sobre Nosaltres", // ✅ FIX: Afegit badge que faltava
        title: "La nostra essència",
        description: desc,
        image_prompt: "team working together",
        stats: {
          label1: "Experiència", value1: "+5 anys",
          label2: "Clients", value2: "100%",
          label3: "Projectes", value3: "+50"
        }
      },
      services: {
        badge: "Serveis",
        title: "Què oferim",
        subtitle: "Solucions a mida",
        items: []
      },
      testimonials: {
        badge: "Testimonis",
        title: "Clients Feliços",
        subtitle: "El que diuen de nosaltres",
        reviews: []
      },
      cta_banner: {
        heading: "Preparat per començar?",
        subheading: "Contacta amb nosaltres avui mateix.",
        buttonText: "Demanar Cita"
      },
      faq: {
        title: "Preguntes Freqüents",
        subtitle: "Dubtes habituals",
        items: []
      },
      contact: {
        title: "Contacte",
        description: "Estem aquí per ajudar-te en el que necessitis.", // ✅ FIX: description en lloc de subtitle
        button: "Enviar Missatge"
      }
    };
  }
}