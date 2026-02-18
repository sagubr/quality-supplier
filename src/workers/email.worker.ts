import { IEmailService } from "../shared/email/email.interface";
import { logger } from "../config/logger.config";
import { queueService } from "../modules/queue/queue.service";
import { QueueJob, QueueJobPayloadSchema } from "../modules/queue/queue.types";

export class EmailWorker {
	constructor(
		private workerId: string,
		private pollingInterval: number,
		private emailService: IEmailService,
	) {}

	async start() {
		logger.info({ workerId: this.workerId }, "Email worker started...");

		while (true) {
			try {
				const getJobRetry = async (): Promise<
					(Omit<QueueJob, "payload"> & { payload: unknown }) | null
				> => {
					const retryJobs = await queueService.getRetryableJobs(10);

					if (retryJobs.length > 0) {
						const retryJob = retryJobs[0];
						logger.info({ jobId: retryJob.id }, "Retry Jobs...");
						return retryJob;
					}
					return null;
				};

				const pendingJob = await queueService.getNextPendingJob();

				const job = pendingJob ?? (await getJobRetry());

				if (!job) {
					await this.sleep(this.pollingInterval);
					continue;
				}

				try {
					const jobRaw = {
						...job,
						payload: QueueJobPayloadSchema.parse(job.payload),
					};
					await queueService.markJobAsLock(jobRaw.id, this.workerId);
					await this.emailService.send(
						jobRaw.payload.to,
						jobRaw.payload.subject,
						jobRaw.payload.body,
					);
					await queueService.markJobAsDone(jobRaw.id);
					logger.info({ jobId: jobRaw.id }, "Job concluído com sucesso");
				} catch (err) {
					await queueService.markJobAsFailed(job.id, err);
					logger.error(
						{ err, jobId: job.id },
						"Erro processando job",
					);
				}
			} catch (err) {
				logger.error({ err }, "Erro inesperado no loop do worker");
			}

			await this.sleep(this.pollingInterval);
		}
	}

	private sleep(ms: number) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}
}
