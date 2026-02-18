import { EmailWorker } from "./email.worker";
import { emailService } from "../shared/email/email.factory";

export function createEmailWorker(workerId: string, interval = 15000) {
	return new EmailWorker(workerId, interval, emailService);
}
