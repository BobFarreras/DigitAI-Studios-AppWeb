import { AuditMetric } from '@/features/audit/ui/components/CoreVitalsGrid';

export type AuditIssue = {
  id: string;          // 👈 AFEGIT: Necessari per traduir a la UI
  title: string;
  description: string;
  score: number;       
  displayValue?: string;
  impact?: string;     
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