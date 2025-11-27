import { IAuditRepository } from '@/repositories/interfaces/IAuditRepository';
import { IWebScanner } from '@/adapters/IWebScanner';
import { ResendEmailService } from '@/services/email/ResendEmailService';

export class AuditService {
  constructor(
    private auditRepo: IAuditRepository,
    private scanner: IWebScanner,
    private emailService: ResendEmailService
  ) { }

  // 1. Mètode Landing (Públic) - Afegim locale
  async performPublicAudit(url: string, email: string, locale: string) {
    return this.performFullAudit(url, { email }, locale);
  }

  // 2. Mètode Dashboard (Privat) - Afegim locale
  async performUserAudit(url: string, userId: string, userEmail: string, locale: string) {
    return this.performFullAudit(url, { userId, email: userEmail }, locale);
  }

  // Lògica Central - Afegim locale
  private async performFullAudit(url: string, user: { userId?: string, email: string }, locale: string) {
    console.log(`🚀 [AuditService] Iniciant auditoria per: ${url}`);

    let newAudit;
    if (user.userId) {
       newAudit = await this.auditRepo.createAuditForUser(url, user.userId, user.email);
    } else {
       newAudit = await this.auditRepo.createPublicAudit(url, user.email);
    }

    try {
      const scanResult = await this.scanner.scanUrl(url);
      
      await this.auditRepo.updateStatus(newAudit.id, 'completed', {
        seoScore: scanResult.seoScore,
        performanceScore: scanResult.performanceScore,
        reportData: {
            screenshot: scanResult.screenshot,
            issues: scanResult.issues,
            metrics: scanResult.metrics,
            raw: scanResult.reportData
        }
      });

      // ENVIAR EMAIL AMB LOCALE
      try {
          await this.emailService.sendAuditResult(user.email, {
            url: url,
            seo: scanResult.seoScore,
            perf: scanResult.performanceScore,
            id: newAudit.id
          }, locale); // 👈 Passem l'idioma aquí
      } catch (emailErr) {
          console.error("Error enviant email:", emailErr);
      }

      return newAudit.id;

    } catch (error) {
      console.error("Error audit service:", error);
      await this.auditRepo.updateStatus(newAudit.id, 'failed');
      throw error;
    }
  }
}