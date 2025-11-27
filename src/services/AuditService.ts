import { IAuditRepository } from '@/repositories/interfaces/IAuditRepository';
import { IWebScanner } from '@/adapters/IWebScanner';
import { ResendEmailService } from '@/services/email/ResendEmailService';

export class AuditService {
  constructor(
    private auditRepo: IAuditRepository,
    private scanner: IWebScanner,
    private emailService: ResendEmailService
  ) { }

  // 1. Mètode per a Landing Page (Usuari públic o nou)
  async performPublicAudit(url: string, email: string) {
    // Aquest cas és quan encara no sabem si té ID, guardem amb l'email
    return this.performFullAudit(url, { email });
  }

  // 2. Mètode per a Dashboard (Usuari loguejat)
  async performUserAudit(url: string, userId: string, userEmail: string) {
    // Aquí passem l'ID perquè quedi lligat al seu compte directament
    return this.performFullAudit(url, { userId, email: userEmail });
  }

  // Lògica compartida (PRIVATE)
  private async performFullAudit(url: string, user: { userId?: string, email: string }) {
    console.log(`🚀 [AuditService] Iniciant auditoria per: ${url}`);

    // A. Crear registre DB (Processing)
    // El repo ha de ser capaç d'acceptar userId O email
    // Si ve del Dashboard tenim userId. Si ve de Landing, tenim email.
    let newAudit;
    if (user.userId) {
       newAudit = await this.auditRepo.createAuditForUser(url, user.userId, user.email);
    } else {
       newAudit = await this.auditRepo.createPublicAudit(url, user.email);
    }

    try {
      // B. Escanejar (Google PageSpeed Real)
      const scanResult = await this.scanner.scanUrl(url);
      
      // C. Actualitzar DB amb resultats REALS
      await this.auditRepo.updateStatus(newAudit.id, 'completed', {
        seoScore: scanResult.seoScore,
        performanceScore: scanResult.performanceScore,
        reportData: {
            screenshot: scanResult.screenshot, // La foto real
            issues: scanResult.issues,         // Els errors reals
            raw: scanResult.reportData         // JSON complet
        }
      });

      // D. Enviar Email (Opcional segons el cas, però està bé tenir-ho)
      // Si ve del Dashboard potser no cal enviar email, però deixem-ho per ara
      try {
          await this.emailService.sendAuditResult(user.email, {
            url: url,
            seo: scanResult.seoScore,
            perf: scanResult.performanceScore,
            id: newAudit.id
          });
      } catch (emailErr) {
          console.error("Error enviant email:", emailErr);
          // No fallem tot el procés si l'email falla
      }

      return newAudit.id;

    } catch (error) {
      console.error("Error audit service:", error);
      await this.auditRepo.updateStatus(newAudit.id, 'failed');
      throw error;
    }
  }
}