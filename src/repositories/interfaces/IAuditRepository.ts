import { AuditDTO } from '@/types/models';

export interface IAuditRepository {
  getAuditsByUserEmail(email: string): Promise<AuditDTO[]>;
  getAuditById(id: string): Promise<AuditDTO | null>;
  createAudit(url: string, email: string): Promise<AuditDTO>;
  updateStatus(id: string, status: AuditDTO['status'], data?: Record<string, unknown>): Promise<void>;
  // Canvia la signatura de updateStatus per ser més flexible o específica
  updateStatus(
    id: string,
    status: AuditDTO['status'],
    results?: { seoScore?: number; performanceScore?: number; reportData?: unknown }
  ): Promise<void>;
  getAuditsByUserEmail(email: string): Promise<AuditDTO[]>; // Aquest ja el tenies, assegura't d'usar-lo!
  getAuditsByUserId(userId: string): Promise<AuditDTO[]>; // 👈 Mètode nou
}