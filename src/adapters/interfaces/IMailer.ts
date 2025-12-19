export interface MailOptions {
  to: string;
  subject: string;
  html: string;
}

export interface IMailer {
  sendMail(options: MailOptions): Promise<void>;
}