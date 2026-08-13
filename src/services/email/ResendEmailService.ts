import { Resend } from 'resend';
import { render } from '@react-email/render';
import AuditReadyEmail from '@/features/email/templates/AuditReadyEmail'; // Assegura't que la ruta és correcta
import { BusinessSuggestion } from '@/types/ai';

const resend = new Resend(process.env.RESEND_API_KEY);

export class ResendEmailService {

  async sendAuditResult(
    to: string,
    data: {
      url: string,
      seo: number,
      perf: number,
      id: string,
      suggestions?: BusinessSuggestion[] // ✅ Això ja ho tenies bé
    },
    locale: string
  ) {
    try {
      const lang = locale || 'ca';
      const domain = process.env.NEXT_PUBLIC_APP_URL || 'https://digitaistudios.com';
      
      // ✅ CORRECCIÓ 1: Usem 'lang' per crear la URL base. 
      // Així el botó "Veure Informe" anirà a /ca/dashboard o /es/dashboard
      const baseUrlWithLang = `${domain}/${lang}`;

      // 1. GENEREM L'HTML
      const emailHtml = await render(
        AuditReadyEmail({
          businessName: "El teu Negoci", // Podries passar el nom real si el tens a 'data'
          url: data.url,
          seoScore: data.seo,
          perfScore: data.perf,
          auditId: data.id,
          baseUrl: baseUrlWithLang, // 👈 Passem la URL amb idioma
          suggestions: data.suggestions // ✅ CORRECCIÓ 2: Passem els suggeriments al template!
        })
      );

      // 2. ENVIEM EL CORREU
      await resend.emails.send({
        from: 'DigitAI Studios <noreply@digitaistudios.com>',
        to: [to],
        subject: `🚀 Resultats de l'Auditoria: ${data.url}`,
        html: emailHtml,
      });

      console.log(`📧 Email enviat a ${to}`);

    } catch (error) {
      console.error("❌ Resend Error:", error);
    }
  }
}