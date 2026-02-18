import { emailConfig } from "../../config/email.config";
import { IEmailService } from "./email.interface";
import { SendgridEmailService } from "./sendgrid-email.service";
import { SmtpEmailService } from "./smtp-email.service";

const strategies = {
	sendgrid: SendgridEmailService,
	smtp: SmtpEmailService,
};

function createEmailService(): IEmailService {
	const Strategy = strategies[emailConfig.provider];

	if (!Strategy) {
		throw new Error("Invalid email provider");
	}

	return new Strategy();
}

export const emailService = createEmailService();
