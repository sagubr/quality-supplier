import { logger } from "../../config/logger.config";
import { queueRepository } from "./queue.repository";
import {
	QueueJob,
	QueueJobPayloadSchema,
	QueueJobStatus,
	QueueJobType,
} from "./queue.types";

class QueueService {
	async dispatch(
		workerId: string,
		type: QueueJobType,
	): Promise<QueueJob | null> {
		const job = await queueRepository.fetchAndLockNextJob(workerId, type);
		if (!job) return null;

		try {
			const payload = QueueJobPayloadSchema.parse(job.payload);
			return { ...job, payload };
		} catch (err) {
			logger.error({ err, jobId: job.id }, "Invalid payload");

			await queueRepository.updateJob(job.id, {
				status: QueueJobStatus.FAILED,
				last_error: String(err),
				locked_at: null,
				locked_by: null,
			});

			return null;
		}
	}

	async complete(jobId: number) {
		await queueRepository.updateJob(jobId, {
			status: QueueJobStatus.DONE,
			locked_at: null,
			locked_by: null,
		});
	}

	async fail(job: QueueJob, error: any) {
		const newAttempts = job.attempts + 1;
		const shouldFail = newAttempts >= job.max_attempts;
		const backoffMs = Math.pow(2, newAttempts) * 1000;

		await queueRepository.updateJob(job.id, {
			attempts: newAttempts,
			status: shouldFail ? QueueJobStatus.FAILED : QueueJobStatus.PENDING,
			next_run_at: shouldFail ? null : new Date(Date.now() + backoffMs),
			last_error: error?.message ?? String(error),
			locked_at: null,
			locked_by: null,
		});

		return shouldFail;
	}

	async cleanup(days = 30) {
		await queueRepository.deleteOldProcessedJobs(days);
	}

	async watchdog() {
		await queueRepository.resetStaleJobs(5);
	}
}

export const queueService = new QueueService();
