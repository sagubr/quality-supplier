import sgMail from "@sendgrid/mail";
import { IEmailProvider, EmailPayload } from "../email.interface";
import { env } from "@/config/env.config";

export class SendgridProvider implements IEmailProvider {
	constructor() {
		if (!env.SENDGRID_API_KEY) {
			throw new Error("SENDGRID_API_KEY is required");
		}
		sgMail.setApiKey(env.SENDGRID_API_KEY);
	}

	async send(payload: EmailPayload): Promise<void> {
		if (!payload.body || !payload.to || !payload.subject) {
			throw new Error("Email payload incomplete: to, subject and html are required");
		}

		await sgMail.send({
			to: payload.to,
			from: env.EMAIL_FROM_NAME,
			subject: payload.subject,
			html: payload.body,
			cc: payload.cc,
			bcc: payload.bcc,
			replyTo: payload.replyTo,
		});
	}
}
