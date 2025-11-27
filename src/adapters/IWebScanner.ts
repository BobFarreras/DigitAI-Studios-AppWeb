import { AuditMetric } from '@/features/audit/ui/components/CoreVitalsGrid';

export type AuditIssue = {
  title: string;       // ✅ ABANS NO HI ERA O ES DEIA 'text' AL MAPATGE
  description: string;
  score: number;       
  displayValue?: string;
  
  // ✨ AFEGIM AQUESTS CAMPS PER A LA UI
  impact?: string;     // Ex: "Crític", "Millorable"
  type?: 'error' | 'warning' | 'success';
};

export type ScanResult = {
  seoScore: number;
  performanceScore: number;
  screenshot?: string; 
  issues: AuditIssue[]; 
  reportData: unknown; 
  metrics?: {
    fcp?: AuditMetric;
    lcp?: AuditMetric;
    cls?: AuditMetric;
    tbt?: AuditMetric;
    si?: AuditMetric;
  };
};

export interface IWebScanner {
  scanUrl(url: string): Promise<ScanResult>;
}