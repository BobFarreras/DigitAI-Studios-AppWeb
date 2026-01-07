export interface AuditMetrics {
  performance: number;   // 0 a 1
  seo: number;          // 0 a 1
  accessibility: number; // 0 a 1
  bestPractices?: number;
}