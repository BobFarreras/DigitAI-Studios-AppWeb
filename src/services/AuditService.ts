import { IAuditRepository } from '@/repositories/interfaces/IAuditRepository';
import { IWebScanner } from '@/adapters/IWebScanner';

export class AuditService {
  constructor(
    private auditRepo: IAuditRepository,
    private scanner: IWebScanner
  ) {}

  /**
   * Flux complet: Crea a DB -> Escaneja -> Actualitza DB
   */
  async performFullAudit(url: string, email: string) {
    // 1. Crear l'auditoria en estat "Processing"
    // (Això ja ho feies, però ara ho centralitzem aquí)
    const newAudit = await this.auditRepo.createAudit(url, email);

    // 2. Executar l'escàner (això pot trigar uns segons)
    // NOTA: En una app molt gran, això s'enviaria a una cua (Background Job).
    // Per ara, ho fem "await" aquí mateix.
    try {
      const scanResult = await this.scanner.scanUrl(url);

      // 3. Actualitzar amb els resultats reals
      await this.auditRepo.updateStatus(newAudit.id, 'completed', {
        seoScore: scanResult.seoScore,
        performanceScore: scanResult.performanceScore,
        reportData: scanResult.reportData
      });

      return newAudit.id; // Retornem ID per redirigir

    } catch (error) {
      // Si falla l'escàner, marquem com fallida a la DB
      await this.auditRepo.updateStatus(newAudit.id, 'failed');
      throw error;
    }
  }
}