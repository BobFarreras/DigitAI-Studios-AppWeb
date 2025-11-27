import { Resend } from 'resend';
import { AuditReadyEmail } from '../../features/email/templates/AuditReadyEmail';

export class ResendEmailService {
  private resend: Resend;
  private fromEmail = 'onboarding@resend.dev'; 
  // ⚠️ NOTA IMPORTANT: Si estàs en pla gratis de Resend, només pots enviar correus 
  // AL MATEIX EMAIL amb el que t'has registrat.
  // Quan verifiquis el teu domini (ex: info@digitai.com), podràs enviar a tothom.

  constructor(apiKey: string) {
    this.resend = new Resend(apiKey);
  }

  async sendAuditResult(to: string, data: { url: string; seo: number; perf: number; id: string }) {
    try {
      const { error } = await this.resend.emails.send({
        from: 'DigitAI Studios <onboarding@resend.dev>', // Canvia això quan tinguis domini
        to: [to],
        subject: `🚀 Auditoria completada: ${data.url}`,
        react: AuditReadyEmail({
            url: data.url,
            seoScore: data.seo,
            perfScore: data.perf,
            auditId: data.id
        }),
      });

      if (error) {
        console.error("Error enviant email:", error);
        throw new Error(error.message);
      }
      
      console.log(`📧 Email enviat correctament a ${to}`);

    } catch (err) {
      console.error("Fallada crítica al servei d'email:", err);
      // No fem 'throw' per no trencar el flux de l'usuari si falla l'email
    }
  }
}