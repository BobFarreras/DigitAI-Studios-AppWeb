// src/services/AuditService.ts

import { IAuditRepository } from '@/repositories/interfaces/IAuditRepository';
import { IWebScanner } from '@/adapters/IWebScanner';
import { ResendEmailService } from '@/services/email/ResendEmailService';
import { AIService } from '@/services/ai/AIService';
import { BusinessSuggestion } from "@/types/ai";
import { PRESTIGE_CONFIG } from '@/config/prestige-urls'; // Assegura't que tens aquest fitxer creat al PAS 1

export class AuditService {
  constructor(
    private auditRepo: IAuditRepository,
    private scanner: IWebScanner,
    private emailService: ResendEmailService,
    private aiService: AIService
  ) { }

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

  // --- LÒGICA PRINCIPAL ---
  private async performFullAudit(url: string, user: { userId?: string, email: string }, locale: string) {
    console.log(`🚀 [AuditService] Iniciant auditoria per: ${url}`);

    // 1. Creem registre inicial (Processing)
    let newAudit;
    if (user.userId) {
      newAudit = await this.auditRepo.createAuditForUser(url, user.userId, user.email);
    } else {
      newAudit = await this.auditRepo.createPublicAudit(url, user.email);
    }

    try {
      // 2. ESCANEIG TÈCNIC (Lighthouse)
      const scanResult = await this.scanner.scanUrl(url);

      // --- 🌟 APLICACIÓ DEL PRESTIGE BOOST (INTEGRAT AQUÍ) ---
      let finalSeoScore = scanResult.seoScore;
      let finalPerfScore = scanResult.performanceScore;

      const cleanUrl = url.toLowerCase();
      // Verifiquem si és VIP
      const isPrestige = PRESTIGE_CONFIG.URLS.some(domain => cleanUrl.includes(domain));

      if (isPrestige) {
        console.log(`✨ [AuditService] Prestige Boost activat per: ${url}`);
        // Assegurem que la nota mínima sigui la definida (ex: 88)
        // Convertim a escala 0-100 si cal, o 0-1 segons com ho guardis. 
        // Assumim que scanResult ve en 0-100.
        finalSeoScore = Math.max(finalSeoScore, PRESTIGE_CONFIG.BOOST.MIN_SCORE);
        finalPerfScore = Math.max(finalPerfScore, PRESTIGE_CONFIG.BOOST.MIN_SCORE);
      }
      // -------------------------------------------------------

      // 3. ANÀLISI IA (Oportunitats de Negoci)
      let suggestions: BusinessSuggestion[] = [];
      try {
        // Fetch del text de la web per a la IA
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout

        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);

        const html = await response.text();
        // Neteja simple de HTML per estalviar tokens
        const textOnly = html.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, "")
          .replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, "")
          .replace(/<[^>]+>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim()
          .substring(0, 15000); // Limitem caràcters per seguretat

        // Cridem al AIService (que ja sap gestionar VIPs internament)
        suggestions = await this.aiService.analyzeBusinessOpportunity(url, textOnly);

      } catch (err) {
        console.warn("⚠️ Error en anàlisi IA (saltant pas):", err);
      }

      // 4. GUARDAR RESULTATS (Completed)
      await this.auditRepo.updateStatus(newAudit.id, 'completed', {
        seoScore: finalSeoScore,      // Guardem la nota trucada (si és VIP)
        performanceScore: finalPerfScore,
        reportData: {
          screenshot: scanResult.screenshot,
          issues: scanResult.issues,
          metrics: scanResult.metrics,
          raw: scanResult.reportData,
          suggestions: suggestions // Guardem suggeriments IA
        }
      });

      // 5. ENVIAR EMAIL
      try {
        await this.emailService.sendAuditResult(user.email, {
          url: url,
          seo: finalSeoScore,
          perf: finalPerfScore,
          id: newAudit.id,
          suggestions: suggestions
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
  // ✅ NOU MÈTODE PER A L'ADMIN
  async getAdminAuditDetails(id: string) {
    return await this.auditRepo.getAuditByIdAdmin(id);
  }
  async deleteAuditAsAdmin(id: string) {
    console.log(`🗑️ [AuditService] Eliminant auditoria: ${id}`);
    return await this.auditRepo.deleteAudit(id);
  }
}