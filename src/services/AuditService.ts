import { IAuditRepository } from '@/repositories/interfaces/IAuditRepository';
import { IWebScanner } from '@/adapters/IWebScanner';
// Importem el tipus del servei d'email (encara que no tinguem interfície estricta per simplificar ara)
import { ResendEmailService } from '@/services/email/ResendEmailService';

export class AuditService {
  constructor(
    private auditRepo: IAuditRepository,
    private scanner: IWebScanner,
    private emailService: ResendEmailService // 👈 INJECCIÓ NOVA
  ) { }

  async performFullAudit(url: string, email: string) {
    // 1. Crear DB (Processing)
    const newAudit = await this.auditRepo.createAudit(url, email);

    try {
      // 2. Escanejar (Google)
      const scanResult = await this.scanner.scanUrl(url);
      
      await this.auditRepo.updateStatus(newAudit.id, 'completed', {
        seoScore: scanResult.seoScore,
        performanceScore: scanResult.performanceScore,
        // Guardem tot l'objecte scanResult (amb issues i screenshot) dins de reportData
        // Així el frontend ho tindrà tot disponible
        reportData: scanResult
      });


      // 4. ✨ ENVIAR EMAIL MÀGIC ✨
      // Ho fem sense 'await' (fire and forget) o amb await si volem assegurar?
      // Millor amb await dins del try per loguejar, però ràpid.
      await this.emailService.sendAuditResult(email, {
        url: url,
        seo: scanResult.seoScore,
        perf: scanResult.performanceScore,
        id: newAudit.id
      });


      return newAudit.id;

    } catch (error) {
      await this.auditRepo.updateStatus(newAudit.id, 'failed');
      throw error;
    }
  }
}