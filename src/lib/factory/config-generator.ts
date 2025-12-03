import { MasterConfig } from '@/types/config';

export function generateConfigFileContent(config: MasterConfig): string {
  // Convertim l'objecte a JSON bonic amb indentació de 2 espais
  const jsonString = JSON.stringify(config, null, 2);

  // Retornem el contingut exacte del fitxer .ts
  return `
import { MasterConfig } from "@/types/config";

export const CONFIG: MasterConfig = ${jsonString};
`;
}