import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export class ResendEmailService {
  async sendAuditResult(to: string, data: { url: string, seo: number, perf: number, id: string }) {
    try {
      await resend.emails.send({
        from: 'DigitAI Studios <info@digitaistudios.com>', // ⚠️ Canviarem això després a Hostinger
        to: [to],
        subject: `Resultats de l'Auditoria: ${data.url}`,
        html: `
          <div style="font-family: sans-serif; color: #333;">
            <h1>L'informe de ${data.url} està llest</h1>
            <p>Hem analitzat la teva web i aquests són els resultats preliminars:</p>
            <ul>
              <li><strong>SEO:</strong> ${data.seo}/100</li>
              <li><strong>Rendiment:</strong> ${data.perf}/100</li>
            </ul>
            <p>
              <a href="https://digitaistudios.com/dashboard/audits/${data.id}" style="background: #6366f1; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                Veure Informe Complet
              </a>
            </p>
          </div>
        `
      });
    } catch (error) {
      console.error("Resend Error:", error);
    }
  }
}