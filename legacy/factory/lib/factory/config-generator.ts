// src/services/factory/config-generator.ts

import { MasterConfig } from '@/types/config';
import { AiGeneratedConfig } from '@/types/ai-response';
import { mapAiJsonToMasterConfig } from './config-mapper';

export function generateConfigFileContent(aiRawData: unknown, organizationId: string): string {
  
  // 1. Cast segur: Assumim que l'objecte que ve compleix AiGeneratedConfig
  // (En un entorn més estricte utilitzariem Zod per validar-ho, però aquí el Cast és acceptable)
  const typedAiData = aiRawData as AiGeneratedConfig;

  // 2. Mapejar a MasterConfig (Aquí es produeix la màgia que arregla Navbar/Footer)
  const configObject: MasterConfig = mapAiJsonToMasterConfig(typedAiData, organizationId);

  // 3. Convertir a String JSON
  const jsonString = JSON.stringify(configObject, null, 2);

  // 4. Retornar el codi font TypeScript
  return `
import { MasterConfig, ConfigLandingSection } from "@/types/config";

export const CONFIG: MasterConfig = ${jsonString} as unknown as MasterConfig;
`;
}