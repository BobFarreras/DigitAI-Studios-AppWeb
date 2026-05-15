/**
 * @file src/types/nodemailer.d.ts
 * @updated 2026-05-15
 * @summary Declaracions locals mínimes per nodemailer 8.
 * @scope Tipar només la superfície usada pel NodemailerAdapter.
 */
declare module 'nodemailer' {
  type TransportOptions = {
    host?: string;
    port?: number;
    secure?: boolean;
    auth?: {
      user?: string;
      pass?: string;
    };
    tls?: {
      rejectUnauthorized?: boolean;
    };
  };

  type SendMailOptions = {
    from?: string;
    to: string;
    subject: string;
    html: string;
  };

  type SentMessageInfo = {
    messageId?: string;
  };

  type Transporter = {
    sendMail(options: SendMailOptions): Promise<SentMessageInfo>;
  };

  const nodemailer: {
    createTransport(options: TransportOptions): Transporter;
  };

  export default nodemailer;
}
