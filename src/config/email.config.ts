import { env } from "./env.config";

export const emailConfig = {
	provider: env.EMAIL_PROVIDER,
	sendgridApiKey: env.SENDGRID_API_KEY,
	smtp: {
		host: env.SMTP_HOST,
		port: env.SMTP_PORT,
		user: env.SMTP_USER,
		pass: env.SMTP_PASS,
	},
	from: {
		name: env.EMAIL_FROM_NAME,
		email: env.EMAIL_FROM_ADDRESS,
	},
};
