import { AuditDTO } from '@/types/models';

export interface IAuditRepository {
  getAuditsByUserEmail(email: string): Promise<AuditDTO[]>;
  getAuditById(id: string): Promise<AuditDTO | null>;
  createAudit(url: string, email: string): Promise<AuditDTO>;
  updateStatus(id: string, status: AuditDTO['status'], data?: Record<string, unknown>): Promise<void>;
}