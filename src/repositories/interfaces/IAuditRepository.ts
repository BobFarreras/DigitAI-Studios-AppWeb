import { AuditDTO } from '@/types/models';
// 👇 Definim aquest tipus aquí perquè sigui clar
export type AuditSummary = {
  id: string;
  url: string;
  email: string | null;
  status: AuditDTO['status'];
  seoScore: number | null;
  performanceScore: number | null;
  createdAt: Date; // Important: L'app treballa amb Date, la DB amb string
};

export interface IAuditRepository {
  getAuditsByUserEmail(email: string): Promise<AuditDTO[]>;
  getAuditById(id: string): Promise<AuditDTO | null>;
  createAudit(url: string, email: string): Promise<AuditDTO>;
  
  updateStatus(
    id: string,
    status: AuditDTO['status'],
    results?: { seoScore?: number; performanceScore?: number; reportData?: unknown }
  ): Promise<void>;

  getAuditsByUserId(userId: string): Promise<AuditDTO[]>;
  createAuditForUser(url: string, userId: string, email: string): Promise<AuditDTO>;
  createPublicAudit(url: string, email: string): Promise<AuditDTO>;
  
// 👇 El mètode ha de retornar aquest tipus concret
  getAllLight(): Promise<AuditSummary[]>;
}