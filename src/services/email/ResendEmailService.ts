import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export class ResendEmailService {
  // Afegim 'locale' als arguments
  async sendAuditResult(to: string, data: { url: string, seo: number, perf: number, id: string }, locale: string) {
    try {
      // Assegurem-nos que locale té valor (per defecte 'ca')
      const lang = locale || 'ca';
      
      await resend.emails.send({
        from: 'DigitAI Studios <info@digitaistudios.com>',
        to: [to],
        subject: `Resultats de l'Auditoria: ${data.url}`,
        html: `
          <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #6366f1;">L'informe de ${data.url} està llest</h1>
            <p>Hem analitzat la teva web i aquests són els resultats preliminars:</p>
            <ul style="background: #f3f4f6; padding: 20px; border-radius: 10px;">
              <li style="margin-bottom: 10px;"><strong>SEO:</strong> ${data.seo}/100</li>
              <li><strong>Rendiment:</strong> ${data.perf}/100</li>
            </ul>
            <p style="margin-top: 30px;">
              <a href="https://digitaistudios.com/${lang}/dashboard/audits/${data.id}" style="background: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Veure Informe Complet
              </a>
            </p>
            <p style="font-size: 12px; color: #666; margin-top: 40px;">
              © DigitAI Studios. Si no has demanat això, ignora aquest correu.
            </p>
          </div>
        `
      });
    } catch (error) {
      console.error("Resend Error:", error);
    }
  }
}