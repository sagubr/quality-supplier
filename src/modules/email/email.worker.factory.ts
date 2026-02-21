import { EmailWorker } from "./email.worker";
import { emailService } from "../../shared/email/email.factory";

export function createEmailWorker(workerId: string) {
	return new EmailWorker(workerId, emailService);
}
