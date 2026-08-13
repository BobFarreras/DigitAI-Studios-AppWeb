import { Resend } from 'resend';
import { IMailer, MailOptions } from '@/adapters/interfaces/IMailer';

const resend = new Resend(process.env.RESEND_API_KEY);

export class NodemailerAdapter implements IMailer {

  async sendMail({ to, subject, html }: MailOptions): Promise<void> {
    try {
      console.log(`📧 [MAILER] Intentant enviar correu a: ${to}`);

      const { data, error } = await resend.emails.send({
        from: 'DigitAI Studios <noreply@digitaistudios.com>',
        to: [to],
        subject,
        html,
      });

      if (error) {
        console.error('❌ [MAILER] Resend Error:', error);
        return;
      }

      console.log(`✅ [MAILER] Correu enviat! ID: ${data?.id}`);
    } catch (error) {
      console.error('❌ [MAILER] Error enviant email:', error);
    }
  }
}
