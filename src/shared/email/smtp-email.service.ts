import nodemailer from "nodemailer";
import { IEmailService } from "./email.interface";
import { emailConfig } from "../../config/email.config";

export class SmtpEmailService implements IEmailService {
  private transporter = nodemailer.createTransport({
    host: emailConfig.smtp.host,
    port: emailConfig.smtp.port,
    auth: {
      user: emailConfig.smtp.user,
      pass: emailConfig.smtp.pass,
    },
  });

  async send(to: string, subject: string, html: string) {
    await this.transporter.sendMail({
      from: `"${emailConfig.from.name}" <${emailConfig.from.email}>`,
      to,
      subject,
      html,
    });
  }
}
