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
    console.log(`🤖 [AIService] Generant Copywriting Premium per: "${businessName}"...`);

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

  // 🧠 MOTOR GEMINI
  private async tryGemini(name: string, desc: string, config: SectorConfig): Promise<I18nSchema> {
    
    // DEFINICIÓ DE L'ESQUEMA (CONTRACTE AMB EL TEMPLATE)
    const googleSchema = {
      type: "OBJECT",
      properties: {
        hero: { 
            type: "OBJECT", 
            properties: { 
                title: {type: "STRING"}, subtitle: {type: "STRING"}, cta: {type: "STRING"}, 
                image_prompt: {type: "STRING"} 
            }, 
            required: ["title", "subtitle", "cta", "image_prompt"] 
        },
        about: { 
            type: "OBJECT", 
            properties: { 
                badge: {type: "STRING"}, title: {type: "STRING"}, description: {type: "STRING"}, 
                image_prompt: {type: "STRING"},
                stats: { type: "OBJECT", properties: { 
                    label1: {type: "STRING"}, value1: {type: "STRING"}, 
                    label2: {type: "STRING"}, value2: {type: "STRING"}, 
                    label3: {type: "STRING"}, value3: {type: "STRING"} 
                }} 
            }, 
            required: ["title", "description", "stats"] 
        },
        services: { 
            type: "OBJECT", 
            properties: { 
                badge: {type: "STRING"}, title: {type: "STRING"}, subtitle: {type: "STRING"}, 
                items: { type: "ARRAY", items: { type: "OBJECT", properties: { 
                    title: {type: "STRING"}, description: {type: "STRING"}, icon_name: {type: "STRING"}
                }}} 
            }, 
            required: ["items"] 
        },
        testimonials: { 
            type: "OBJECT", 
            properties: { 
                badge: {type: "STRING"}, title: {type: "STRING"}, subtitle: {type: "STRING"}, 
                reviews: { type: "ARRAY", items: { type: "OBJECT", properties: { 
                    author: {type: "STRING"}, role: {type: "STRING"}, text: {type: "STRING"}, avatar_gender: {type: "STRING"}
                }}} 
            }, 
            required: ["reviews"] 
        },
        cta_banner: {
            type: "OBJECT",
            properties: {
                heading: {type: "STRING"}, subheading: {type: "STRING"}, buttonText: {type: "STRING"}
            },
            required: ["heading", "buttonText"]
        },
        faq: {
            type: "OBJECT",
            properties: {
                title: {type: "STRING"}, subtitle: {type: "STRING"},
                items: { type: "ARRAY", items: { type: "OBJECT", properties: {
                    question: {type: "STRING"}, answer: {type: "STRING"}
                }}}
            },
            required: ["title", "items"]
        },
        contact: { 
            type: "OBJECT", 
            properties: { 
                title: {type: "STRING"}, description: {type: "STRING"}, button: {type: "STRING"} 
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
        temperature: 0.75 // Una mica més creatiu (0.7 -> 0.75)
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
        { role: "system", content: "Ets un expert Copywriter. Retorna JSON vàlid i textos molt persuasius." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" } 
    });
    const content = completion.choices[0].message.content;
    if (!content) throw new Error("Resposta buida d'OpenAI");
    return JSON.parse(content) as I18nSchema;
  }

  // ===========================================================================
  // 📝 PROMPT ENGINYERITZAT (LA MÀGIA)
  // ===========================================================================
  private getPrompt(name: string, desc: string, config: SectorConfig): string {
    return `
      ACTUA COM: Un Copywriter sènior especialitzat en Branding i Vendes.
      OBJECTIU: Crear els textos per a la nova web del negoci "${name}".
      IDIOMA: CATALÀ Natiu (persuasiu, natural, sense faltes).

      CONTEXT DEL NEGOCI:
      - Nom: "${name}"
      - Descripció Original: "${desc}"
      - Sector: ${config.key}
      - Personalitat de Marca: ${config.aiPersona}

      🛑 REGLES D'OR (STRICT MODE):
      1. PROHIBIT fer servir clixés buits com: "Qualitat garantida", "Equip professional", "Servei integral", "Solucions a mida", "Líders del sector".
      2. SIGUES ESPECÍFIC: Si la descripció és curta, INVENTA DETALLS PLAUSIBLES basats en el sector.
         - Si és un restaurant: Parla de sabors, ingredients (ex: "gamba de Palamós"), olors i l'ambient.
         - Si és un gimnàs: Parla de suor, superació i equipament concret.
         - Si és un advocat: Parla de tranquil·litat, defensa ferma i èxit.
      3. BENEFICIS > CARACTERÍSTIQUES: No diguis "Tenim bons preus", digues "Gaudeix del luxe sense patir per la factura".

      INSTRUCCIONS PER SECCIÓ:

      1. HERO: 
         - Title: Un ganxo fort i curt (Màxim 6 paraules). Que prometi una transformació.
         - Subtitle: Explica què fem i per què som únics en 2 frases.
         - Image Prompt (English): Descripció fotogràfica, cinemàtica, sense text.

      2. ABOUT (La Història):
         - Badge: Una frase curta (Ex: "Des de 1990" o "Passió Local").
         - Title: No posis "Sobre Nosaltres". Posa alguna cosa com "Cuinant amb el cor" o "La nostra missió".
         - Description: Storytelling. Com vam començar? Què ens mou? (Inventa una història coherent amb el sector).
         - STATS (MOLT IMPORTANT): NO posis "Anys d'experiència" ni "Clients". Posa mètriques creatives del sector.
           - Ex Restaurant: "Arrossos servits", "Vins a la carta", "Somriures".
           - Ex Advocat: "Sentències guanyades", "Euros recuperats".
           - Valors numèrics impactants (Ex: "+15.000").

      3. SERVICES:
         - Genera 3 o 4 serveis clau basats en el negoci.
         - Títols atractius (No "Menú", millor "Gastronomia de Mercat").
         - Descriptions: 2 línies explicant el benefici pel client.
         - icon_name (English): Ex: "utensils", "briefcase", "dumbbell", "heart".

      4. TESTIMONIALS:
         - Crea 3 ressenyes realistes. Que mencionin detalls específics (un plat concret, un tracte especial).
         - Roles variats (Client habitual, Turista, Expert...).

      5. FAQ:
         - 4 preguntes reals que tindria un client d'aquest sector. (Ex: "Teniu opcions sense gluten?", "Cal cita prèvia?").

      OUTPUT: Retorna el JSON complet seguint l'esquema estrictament.
    `;
  }

  // ===========================================================================
  // 🧱 FALLBACK
  // ===========================================================================
  private getFallbackContent(name: string, desc: string, _config: SectorConfig): I18nSchema {
    return {
      hero: { title: name, subtitle: desc, cta: "Contactar", image_prompt: "" },
      about: { 
          badge: "Info", title: "Sobre nosaltres", description: desc, image_prompt: "", 
          stats: { label1: "Experiència", value1: "+10", label2: "Clients", value2: "100%", label3: "Projectes", value3: "+50" } 
      },
      services: { badge: "Serveis", title: "Serveis", subtitle: "", items: [] },
      testimonials: { badge: "Opinions", title: "Opinions", subtitle: "", reviews: [] },
      cta_banner: { heading: "T'interessa?", subheading: "Parlem avui", buttonText: "Contactar" },
      faq: { title: "Preguntes", subtitle: "", items: [] },
      contact: { title: "Contacte", description: "", button: "Enviar" }
    };
  }
}