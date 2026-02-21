import { IEmailService } from "../../shared/email/email.interface";
import { queueService } from "../queue/queue.service";
import { QueueJobType } from "../queue/queue.types";

export class EmailWorker {
	constructor(
		private workerId: string,
		private emailService: IEmailService,
	) {}

	async runOnce() {
		const job = await queueService.dispatch(
			this.workerId,
			QueueJobType.EMAIL,
		);

		if (!job) return;

		try {
			await this.emailService.send(
				job.payload.to,
				job.payload.subject,
				job.payload.body,
			);

			await queueService.complete(job.id);
		} catch (err) {
			await queueService.fail(job, err);
		}
	}
}
