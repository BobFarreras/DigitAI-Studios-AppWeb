import { MasterConfig } from '@/types/config';

export function generateConfigFileContent(config: MasterConfig): string {
  // 1. Convertim l'objecte a JSON bonic
  // Això inclourà automàticament les noves seccions i el contingut 'about'
  const jsonString = JSON.stringify(config, null, 2);

  // 2. Retornem el codi font TypeScript
  // Important: Importem els tipus correctes (incloent ConfigLandingSection si calgués, 
  // però MasterConfig ja ho engloba)
  return `
import { MasterConfig, ConfigLandingSection } from "@/types/config";

export const CONFIG: MasterConfig = ${jsonString} as unknown as MasterConfig;
`;
}