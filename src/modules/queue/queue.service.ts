import { logger } from "../../config/logger.config";
import { queueRepository } from "./queue.repository";
import {
	QueueJobPayloadSchema,
	QueueJob,
	QueueJobType,
	QueueJobPayload,
} from "./queue.types";

class QueueService {
	async createJob(
		type: QueueJobType,
		payload: QueueJobPayload,
		maxAttempts = 5,
		availableAt?: Date,
	) {
		return await queueRepository.createJob(
			type,
			payload,
			maxAttempts,
			availableAt,
		);
	}

	async getNextPendingJob(): Promise<QueueJob | null> {
		const job = await queueRepository.getNextPendingJob();
		if (!job) return null;
		try {
			const payload = QueueJobPayloadSchema.parse(job.payload);
			return { ...job, payload };
		} catch (err) {
			logger.error(
				{ err, jobId: job.id },
				"Payload inválido, marcando job como FAILED",
			);

			await queueRepository.markJobAsFailed(job.id, err);
			return null;
		}
	}

	async markJobAsLock(jobId: number, workerId: string) {
		return await queueRepository.markJobAsLock(jobId, workerId);
	}

	async markJobAsDone(jobId: number) {
		return await queueRepository.markJobAsDone(jobId);
	}

	async markJobAsFailed(jobId: number, error: any) {
		return await queueRepository.markJobAsFailed(jobId, error);
	}

	async getRetryableJobs(limit = 10) {
		return await queueRepository.getRetryableJobs(limit);
	}
}

export const queueService = new QueueService();
