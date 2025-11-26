// 1. DTO - Així és com la nostra UI vol veure una auditoria (Tipatge net)
export type AuditDTO = {
  id: string;
  url: string;
  status: 'processing' | 'completed' | 'failed';
  seoScore: number | null; // CamelCase per JS
  performanceScore: number | null;
  createdAt: Date; // Objecte Date real, no string
  reportData: unknown; // O un tipus més específic si en tenim
};

// 2. Interface del Repository - El contracte
// Això permetrà fer mocks per tests fàcilment
export interface IAuditRepository {
  getAuditsByUserEmail(email: string): Promise<AuditDTO[]>;
  getAuditById(id: string): Promise<AuditDTO | null>;
  createAudit(url: string, email: string): Promise<AuditDTO>;
  updateStatus(id: string, status: AuditDTO['status'], data?: unknown): Promise<void>;
}