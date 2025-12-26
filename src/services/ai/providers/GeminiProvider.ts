import { GoogleGenAI, Schema } from "@google/genai";
import { IAIProvider } from "../interfaces/IAIProvider";
import { WebsitePrompt } from "../prompts/WebsitePrompt";
import { I18nSchema } from "@/types/i18n";
import { SectorConfig } from "@/types/sectors";
import { BusinessSuggestion } from "@/types/ai";

export class GeminiProvider implements IAIProvider {
    public providerName = "Google Gemini (New SDK)";
    private client: GoogleGenAI;
    private modelName = "gemini-2.5-flash"; // O "gemini-1.5-flash"


    constructor() {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) throw new Error("Manca GEMINI_API_KEY");
        this.client = new GoogleGenAI({ apiKey });
    }

    // ===========================================================================
    // 1️⃣ GENERACIÓ DE CONTINGUT WEB
    // ===========================================================================
    async generateContent(name: string, desc: string, config: SectorConfig): Promise<I18nSchema> {
        console.log(`🤖 [Gemini] 1. Preparant prompt per a: ${name}`);
        const prompt = WebsitePrompt.build(name, desc, config);

        const schema = this.getResponseSchema();

        console.log(`🤖 [Gemini] 2. Enviant petició a Google (${this.modelName})...`);
        const startTime = Date.now();

        try {
            const response = await this.client.models.generateContent({
                model: this.modelName,
                contents: [{ role: "user", parts: [{ text: prompt }] }],
                config: {
                    responseMimeType: "application/json",
                    responseSchema: schema,
                    temperature: 0.7,
                },
            });

            const duration = Date.now() - startTime;
            console.log(`🤖 [Gemini] 3. Resposta rebuda en ${duration}ms`);

            const text = response.text;
            if (!text) throw new Error("Gemini ha retornat una resposta buida");

            // LOG CRÍTIC: Veure el JSON cru abans de parsejar
            console.log(`📜 [Gemini] JSON CRU (Primeres 200 lletres): ${text.substring(0, 200)}...`);

            const parsed = JSON.parse(text) as I18nSchema;

            // Verificació ràpida
            const hasMap = !!parsed.map;
            const hasProducts = !!parsed.featured_products;
            console.log(`✅ [Gemini] 4. JSON vàlid. Inclou Mapa? ${hasMap ? 'SI' : 'NO'}. Inclou Productes? ${hasProducts ? 'SI' : 'NO'}`);

            return parsed;

        } catch (error) {
            console.error("❌ [Gemini] Error greu generant contingut:", error);
            throw error;
        }
    }

    // ===========================================================================
    // 2️⃣ ANÀLISI D'OPORTUNITATS (BUSINESS ANALYSIS)
    // ===========================================================================
    async analyzeBusiness(url: string, pageText: string): Promise<BusinessSuggestion[]> {
        const prompt = `
        Analitza aquesta web: ${url}
        Text: ${pageText.substring(0, 3000)}
        Actua com a consultor digital i proposa 3 millores.
        Format JSON array.
    `;

        // Esquema per a l'Array de suggeriments (Strings + Cast final)
        const schema = {
            type: 'ARRAY',
            items: {
                type: 'OBJECT',
                properties: {
                    title: { type: 'STRING' },
                    description: { type: 'STRING' },
                    icon: { type: 'STRING' },
                    impact: { type: 'STRING' }
                },
                required: ["title", "description", "icon", "impact"]
            }
        } as unknown as Schema; // 👈 EL TRUC MÀGIC

        try {
            const response = await this.client.models.generateContent({
                model: this.modelName,
                contents: [{ role: "user", parts: [{ text: prompt }] }],
                config: {
                    responseMimeType: "application/json",
                    responseSchema: schema,
                    temperature: 0.5,
                },
            });

            const text = response.text;
            if (!text) return [];

            return JSON.parse(text) as BusinessSuggestion[];
        } catch (e) {
            console.warn("⚠️ Gemini analyzeBusiness error:", e);
            throw e;
        }
    }

    // ===========================================================================
    // 🔒 SCHEMA PRIVAT
    // ===========================================================================
    private getResponseSchema(): Schema {
        // Definim l'objecte amb strings normals per evitar problemes d'importació d'Enums
        const schemaObj = {
            type: 'OBJECT',
            properties: {
                hero: {
                    type: 'OBJECT',
                    properties: {
                        title: { type: 'STRING' }, subtitle: { type: 'STRING' }, cta: { type: 'STRING' }, image_prompt: { type: 'STRING' },
                    },
                    required: ["title", "subtitle", "cta", "image_prompt"],
                },
                about: {
                    type: 'OBJECT',
                    properties: {
                        badge: { type: 'STRING' }, title: { type: 'STRING' }, description: { type: 'STRING' }, image_prompt: { type: 'STRING' },
                        stats: {
                            type: 'OBJECT',
                            properties: {
                                label1: { type: 'STRING' }, value1: { type: 'STRING' },
                                label2: { type: 'STRING' }, value2: { type: 'STRING' },
                                label3: { type: 'STRING' }, value3: { type: 'STRING' },
                            },
                        },
                    },
                    required: ["title", "description", "stats"],
                },
                services: {
                    type: 'OBJECT',
                    properties: {
                        badge: { type: 'STRING' }, title: { type: 'STRING' }, subtitle: { type: 'STRING' },
                        items: {
                            type: 'ARRAY',
                            items: {
                                type: 'OBJECT',
                                properties: { title: { type: 'STRING' }, description: { type: 'STRING' }, icon_name: { type: 'STRING' } },
                            },
                        },
                    },
                    required: ["items"],
                },
                featured_products: {
                    type: 'OBJECT',
                    properties: {
                        title: { type: 'STRING' },
                        subtitle: { type: 'STRING' },
                        limit: { type: 'NUMBER' }
                    },
                    required: ["title", "subtitle"]
                },
                testimonials: {
                    type: 'OBJECT',
                    properties: {
                        badge: { type: 'STRING' }, title: { type: 'STRING' }, subtitle: { type: 'STRING' },
                        reviews: {
                            type: 'ARRAY',
                            items: {
                                type: 'OBJECT',
                                properties: { author: { type: 'STRING' }, role: { type: 'STRING' }, text: { type: 'STRING' }, avatar_gender: { type: 'STRING', nullable: true } },
                            },
                        },
                    },
                    required: ["reviews"],
                },
                map: {
                    type: 'OBJECT',
                    properties: {
                        title: { type: 'STRING' },
                        subtitle: { type: 'STRING' }
                    },
                    required: ["title", "subtitle"]
                },
                cta_banner: {
                    type: 'OBJECT',
                    properties: { heading: { type: 'STRING' }, subheading: { type: 'STRING' }, buttonText: { type: 'STRING' } },
                    required: ["heading", "buttonText"],
                },
                faq: {
                    type: 'OBJECT',
                    properties: {
                        title: { type: 'STRING' }, subtitle: { type: 'STRING' },
                        items: {
                            type: 'ARRAY',
                            items: {
                                type: 'OBJECT',
                                properties: { question: { type: 'STRING' }, answer: { type: 'STRING' } },
                            },
                        },
                    },
                    required: ["title", "items"],
                },
                contact: {
                    type: 'OBJECT',
                    properties: { title: { type: 'STRING' }, description: { type: 'STRING' }, button: { type: 'STRING' } },
                    required: ["title", "button"],
                },
            },
            required: ["hero", "about", "services", "featured_products", "testimonials", "map", "cta_banner", "faq", "contact"],
        };

        // 👈 AQUEST ÉS EL CASTEIG QUE ARREGLA TOTS ELS ERRORS
        return schemaObj as unknown as Schema;
    }
}