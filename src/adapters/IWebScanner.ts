export type AuditIssue = {
  title: string;
  description: string;
  score: number; // 0 a 1 (on 0 és molt malament)
  displayValue?: string; // "Estalviaries 2.5s"
};

export type ScanResult = {
  seoScore: number;
  performanceScore: number;
  screenshot?: string; // Base64 de la imatge
  issues: AuditIssue[]; // Llista de problemes detectats
  reportData: unknown; // El JSON complet per si de cas
};

export interface IWebScanner {
  scanUrl(url: string): Promise<ScanResult>;
}