// Definim què esperem d'un escàner web
export type ScanResult = {
  seoScore: number;
  performanceScore: number;
  reportData: unknown; // El JSON complet o resumit
};

export interface IWebScanner {
  scanUrl(url: string): Promise<ScanResult>;
}