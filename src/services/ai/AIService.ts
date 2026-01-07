import { GeminiProvider } from "./providers/GeminiProvider";
import { OpenAIProvider } from "./providers/OpenAIProvider";
import { I18nSchema } from "@/types/i18n";
import { getSectorConfig, SectorConfig } from "@/types/sectors";
// 👇 IMPORTANT: Importem el tipus del fitxer centralitzat, no el redefinim aquí
import { BusinessSuggestion } from "@/types/ai";
// ✅ NOU: Importem la lògica de prestigi
import { isPrestigeUrl } from "../audit/AuditLogic";
import { PRESTIGE_CONFIG } from "@/config/prestige-urls";

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
  async analyzeBusinessOpportunity(url: string, pageText: string): Promise<BusinessSuggestion[]> {
    console.log(`🕵️ [AIService] Analitzant oportunitats de negoci per: ${url}...`);

    // ✅ DETECCIÓ VIP
    const isVip = isPrestigeUrl(url);
    let contextInjection = "";

    if (isVip) {
      console.log("✨ [AIService] Mode VIP activat per a l'anàlisi.");
      contextInjection = PRESTIGE_CONFIG.AI_CONTEXT;
    }
    // Passem el context extra als proveïdors
    // (Nota: Caldrà actualitzar lleugerament els mètodes analyzeBusiness dels providers 
    // per acceptar aquest string extra, o concatenar-lo al pageText aquí mateix).

    // ESTRATÈGIA RÀPIDA: Injectar-ho al principi del text perquè la IA ho llegeix primer
    const enrichedText = isVip
      ? `[SYSTEM INSTRUCTION: ${contextInjection}]\n\nCONTINGUT WEB:\n${pageText}`
      : pageText;

    // Intent 1: Gemini
    try {
      return await this.gemini.analyzeBusiness(url, enrichedText);
    } catch (error) {
      console.warn("⚠️ Gemini Analysis failed. Trying OpenAI...", error);
    }

    // Intent 2: OpenAI
    try {
      return await this.openai.analyzeBusiness(url, enrichedText);
    } catch (error) {
      console.error("❌ OpenAI Analysis failed.", error);
    }

    // Fallback manual: Si tot falla, retornem aquests 3 suggeriments professionals
    console.log("🔥 Tots els models han fallat. Usant fallback manual.");
    return [
      {
        title: "Captació Automàtica de Clients",
        description: "Implementar formularis intel·ligents per convertir visites en clients potencials sense esforç manual.",
        icon: "user",
        impact: "high"
      },
      {
        title: "Sistema de Reserves / Cites",
        description: "Permet als teus clients reservar els teus serveis 24/7 directament des del mòbil.",
        icon: "calendar",
        impact: "high"
      },
      {
        title: "Analítica de Vendes",
        description: "Panell de control per saber exactament d'on venen els teus millors clients.",
        icon: "chart",
        impact: "medium"
      }
    ];
  }

  // ===========================================================================
  // 🧱 FALLBACK CONTENT (SCHEMA)
  // ===========================================================================
  private getFallbackContent(name: string, desc: string, _config: SectorConfig): I18nSchema {
    return {
      hero: { title: name, subtitle: desc, cta: "Contactar", image_prompt: "" },
      about: {
        badge: "Info", title: "Sobre nosaltres", description: desc, image_prompt: "",
        stats: { label1: "Experiència", value1: "+10", label2: "Clients", value2: "100%", label3: "Projectes", value3: "+50" }
      },
      services: { badge: "Serveis", title: "Serveis", subtitle: "", items: [] },
      featured_products: { title: "Productes", subtitle: "Selecció", limit: 4 }, // ✅ Afegit el que has posat
      testimonials: { badge: "Opinions", title: "Opinions", subtitle: "", reviews: [] },
      cta_banner: { heading: "T'interessa?", subheading: "Parlem avui", buttonText: "Contactar" },
      map: { title: "Ubicació", subtitle: "Vine a veure'ns" }, // ✅ Afegit el que has posat
      faq: { title: "Preguntes", subtitle: "", items: [] },
      contact: { title: "Contacte", description: "", button: "Enviar" }
    };
  }
}