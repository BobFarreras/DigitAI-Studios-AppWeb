// src/services/AuditService.ts

import { IAuditRepository } from '@/repositories/interfaces/IAuditRepository';
import { IWebScanner } from '@/adapters/IWebScanner';
import { ResendEmailService } from '@/services/email/ResendEmailService';
// 👇 1. IMPORTS NOUS
import { AIService, BusinessSuggestion } from '@/services/ai/AIService';

export class AuditService {
  constructor(
    private auditRepo: IAuditRepository,
    private scanner: IWebScanner,
    private emailService: ResendEmailService,
    private aiService: AIService // 👈 2. INJECTEM EL SERVEI AL CONSTRUCTOR
  ) { }

  // ... (performPublicAudit, performUserAudit, getDashboardAudits, getAuditDetails es queden igual) ...
  // Només assegura't que criden a this.performFullAudit

  async performPublicAudit(url: string, email: string, locale: string) {
    return this.performFullAudit(url, { email }, locale);
  }

  async performUserAudit(url: string, userId: string, userEmail: string, locale: string) {
    return this.performFullAudit(url, { userId, email: userEmail }, locale);
  }

  async getDashboardAudits() {
    return await this.auditRepo.getAllLight();
  }

  async getAuditDetails(id: string) {
    return await this.auditRepo.getAuditById(id);
  }

  // 👇 3. LÒGICA CENTRAL ACTUALITZADA
  private async performFullAudit(url: string, user: { userId?: string, email: string }, locale: string) {
    console.log(`🚀 [AuditService] Iniciant auditoria PREMIUM per: ${url}`);

    let newAudit;
    // Creem l'auditoria a la DB (Estat: processing)
    if (user.userId) {
      newAudit = await this.auditRepo.createAuditForUser(url, user.userId, user.email);
    } else {
      newAudit = await this.auditRepo.createPublicAudit(url, user.email);
    }

    try {
      // ---------------------------------------------------------
      // FASE 1: ESCANEIG TÈCNIC (Google Lighthouse)
      // ---------------------------------------------------------
      const scanResult = await this.scanner.scanUrl(url);

      // ---------------------------------------------------------
      // FASE 2: ANÀLISI COMERCIAL (IA / Gemini) 🧠
      // ---------------------------------------------------------
      let suggestions: BusinessSuggestion[] = [];
      try {
        // A. Necessitem el text de la web per a la IA. 
        // Fem un fetch ràpid (timeout 5s) per no bloquejar massa.
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);
        
        const html = await response.text();
        // B. Neteja bàsica (treure etiquetes HTML per estalviar tokens)
        const textOnly = html.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, "")
                             .replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, "")
                             .replace(/<[^>]+>/g, ' ')
                             .replace(/\s+/g, ' ')
                             .trim();

        // C. Cridem al nostre nou AIService
        suggestions = await this.aiService.analyzeBusinessOpportunity(url, textOnly);
        
      } catch (err) {
        console.warn("⚠️ No s'ha pogut fer l'anàlisi IA (continuem igualment):", err);
        // No fem throw, perquè volem que l'auditoria tècnica es guardi igualment.
      }

      // ---------------------------------------------------------
      // FASE 3: GUARDAR A LA DB
      // ---------------------------------------------------------
      await this.auditRepo.updateStatus(newAudit.id, 'completed', {
        seoScore: scanResult.seoScore,
        performanceScore: scanResult.performanceScore,
        reportData: {
          screenshot: scanResult.screenshot,
          issues: scanResult.issues,
          metrics: scanResult.metrics,
          raw: scanResult.reportData,
          suggestions: suggestions // 👈 GUARDEM ELS SUGGERIMENTS A JSON
        }
      });

      // ---------------------------------------------------------
      // FASE 4: ENVIAR EMAIL (AMB LA NOVA PLANTILLA)
      // ---------------------------------------------------------
      try {
        await this.emailService.sendAuditResult(user.email, {
          url: url,
          seo: scanResult.seoScore,
          perf: scanResult.performanceScore,
          id: newAudit.id,
          suggestions: suggestions // 👈 PASSEM ELS SUGGERIMENTS AL EMAIL
        }, locale);
      } catch (emailErr) {
        console.error("Error enviant email:", emailErr);
      }

      return newAudit.id;

    } catch (error) {
      console.error("❌ Error audit service:", error);
      await this.auditRepo.updateStatus(newAudit.id, 'failed');
      throw new Error("No s'ha pogut completar l'auditoria.");
    }
  }
}