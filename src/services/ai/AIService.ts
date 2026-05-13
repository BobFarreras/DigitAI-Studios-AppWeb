import { GeminiProvider } from "./providers/GeminiProvider";
import { OpenAIProvider } from "./providers/OpenAIProvider";
import { I18nSchema } from "@/types/i18n";
import { getSectorConfig, SectorConfig } from "@/types/sectors";
// 👇 IMPORTANT: Importem el tipus del fitxer centralitzat, no el redefinim aquí
import { BusinessSuggestion } from "@/types/ai";
// ✅ NOU: Importem la lògica de prestigi
import { isPrestigeUrl } from "../audit/AuditLogic";

import { WebsitePrompt } from "./prompts/WebsitePrompt"; // 👈 Importem la classe Prompt

export class AIService {
  private gemini: GeminiProvider;
  private openai: OpenAIProvider;

  constructor() {
    this.gemini = new GeminiProvider();
    this.openai = new OpenAIProvider();
  }

  // ===========================================================================
  // 1️⃣ GENERACIÓ DE CONTINGUT WEB (COPYWRITING) - ORQUESTRACIÓ
  // ===========================================================================
  async generateTranslationFile(
    businessName: string,
    description: string,
    sectorInput: string
  ): Promise<I18nSchema> {

    const sectorConfig: SectorConfig = getSectorConfig(sectorInput);
    console.log(`🤖 [AIService] Generant Copywriting Premium per: "${businessName}"...`);

    // --- INTENT 1: GOOGLE GEMINI (Prioritari) ---
    try {
      console.log(`🔵 [AIService] Provant ${this.gemini.providerName}...`);
      return await this.gemini.generateContent(businessName, description, sectorConfig);
    } catch (error) {
      console.warn(`⚠️ [AIService] Gemini ha fallat. Canviant a OpenAI...`, error);
    }

    // --- INTENT 2: OPENAI (Reserva) ---
    try {
      console.log(`🟢 [AIService] Provant ${this.openai.providerName}...`);
      return await this.openai.generateContent(businessName, description, sectorConfig);
    } catch (error) {
      console.error(`❌ [AIService] OpenAI també ha fallat.`, error);
    }

    // --- INTENT 3: FALLBACK (Seguretat total) ---
    console.error("🔥 [AIService] TOTS ELS MODELS HAN FALLAT. Usant fallback.");
    return this.getFallbackContent(businessName, description, sectorConfig);
  }

  // ===========================================================================
  // 2️⃣ ANÀLISI D'OPORTUNITATS DE NEGOCI (PER AL CORREU)
  // ===========================================================================
 // ===========================================================================
  // 2️⃣ ANÀLISI D'OPORTUNITATS DE NEGOCI
  // ===========================================================================
  async analyzeBusinessOpportunity(url: string, pageText: string): Promise<BusinessSuggestion[]> {
    console.log(`🕵️ [AIService] Analitzant oportunitats de negoci per: ${url}...`);

    // 1. Detectem si és VIP
    const isVip = isPrestigeUrl(url);

    // 2. CONSTRUIM EL PROMPT INTEL·LIGENT (Aquí rau la màgia)
    // Passem la URL, el text de la web i si és VIP. 
    // La classe WebsitePrompt s'encarregarà de posar les regles anti-repetició.
    const smartPrompt = WebsitePrompt.buildBusinessAnalysis(url, pageText, isVip);

    // Intent 1: Gemini
    try {
      // Ara passem 'smartPrompt' que és un text llarg amb instruccions, no només el text de la web.
      return await this.gemini.analyzeBusiness(url, smartPrompt);
    } catch (error) {
      console.warn("⚠️ Gemini Analysis failed. Trying OpenAI...", error);
    }

    // Intent 2: OpenAI
    try {
      return await this.openai.analyzeBusiness(url, smartPrompt);
    } catch (error) {
      console.error("❌ OpenAI Analysis failed.", error);
    }

    // Fallback manual
    console.log("🔥 Tots els models han fallat. Usant fallback manual.");
    return [
      {
        title: "Captació Automàtica de Clients",
        description: "Implementar formularis intel·ligents per convertir visites en clients potencials.",
        icon: "user",
        impact: "high"
      },
      {
        title: "Analítica de Vendes",
        description: "Panell de control per saber exactament d'on venen els teus millors clients.",
        icon: "chart",
        impact: "medium"
      },
      {
        title: "Xat d'Atenció al Client",
        description: "Respon dubtes freqüents automàticament per no perdre vendes.",
        icon: "message", // Canviat a message
        impact: "medium"
      }
    ];
  }

  // ===========================================================================
  // 🧱 FALLBACK CONTENT (SCHEMA)
  // ===========================================================================
  private getFallbackContent(name: string, desc: string, config: SectorConfig): I18nSchema {
    return {
      hero: { title: name, subtitle: desc, cta: "Contactar", image_prompt: "" },
      about: {
        badge: "Info", title: "Sobre nosaltres", description: desc, image_prompt: "",
        stats: { label1: "Experiència", value1: "+10", label2: "Clients", value2: "100%", label3: "Projectes", value3: "+50" }
      },
      services: { badge: "Serveis", title: "Serveis", subtitle: config.keywords.services, items: [] },
      featured_products: { title: "Productes", subtitle: "Selecció", limit: 4 }, // ✅ Afegit el que has posat
      testimonials: { badge: "Opinions", title: "Opinions", subtitle: "", reviews: [] },
      cta_banner: { heading: "T'interessa?", subheading: "Parlem avui", buttonText: "Contactar" },
      map: { title: "Ubicació", subtitle: "Vine a veure'ns" }, // ✅ Afegit el que has posat
      faq: { title: "Preguntes", subtitle: "", items: [] },
      contact: { title: "Contacte", description: "", button: "Enviar" }
    };
  }
}
