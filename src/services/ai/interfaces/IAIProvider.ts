import { I18nSchema } from "@/types/i18n";
import { SectorConfig } from "@/types/sectors";
import { BusinessSuggestion } from "@/types/ai"; // 👈 Importa el tipus nou

export interface IAIProvider {
  providerName: string;

  // 1. Generar Web (Factory)
  generateContent(
    businessName: string,
    description: string,
    sectorConfig: SectorConfig
  ): Promise<I18nSchema>;

  // 2. Analitzar Negoci (Auditoria Comercial) 👈 NOU MÈTODE
  analyzeBusiness(url: string, finalPrompt: string): Promise<BusinessSuggestion[]>;
}