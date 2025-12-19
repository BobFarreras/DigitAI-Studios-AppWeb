import nodemailer from 'nodemailer';
import { IMailer, MailOptions } from '@/adapters/interfaces/IMailer';

export class NodemailerAdapter implements IMailer {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST, // smtp.hostinger.com
      port: Number(process.env.SMTP_PORT), // 465
      secure: true, // true per port 465
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      // 👇 AFEGEIX AQUEST BLOC MÀGIC 👇
      tls: {
        rejectUnauthorized: false
      }
    });
  }

  async sendMail({ to, subject, html }: MailOptions): Promise<void> {
    try {
      console.log(`📧 [MAILER] Intentant enviar correu a: ${to}`); // Log per debug
      
      const info = await this.transporter.sendMail({
        from: `"DigitAI Studios Web" <${process.env.SMTP_USER}>`,
        to,
        subject,
        html,
      });
      
      console.log(`✅ [MAILER] Correu enviat! ID: ${info.messageId}`);
    } catch (error) {
      console.error('❌ [MAILER] Error enviant email SMTP:', error);
      // Opcional: Podríem guardar l'error a DB si fos crític
    }
  }
}