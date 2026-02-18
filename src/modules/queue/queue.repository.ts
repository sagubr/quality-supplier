import { sql } from "drizzle-orm";
import { db } from "../../config/db.config";
import { queueJobs } from "./queue.schema";
import { QueueJobType, QueueJobStatus, QueueJob } from "./queue.types";

class QueueRepository {
	async createJob(
		type: QueueJobType,
		payload: unknown,
		maxAttempts = 5,
		availableAt?: Date,
	) {
		return await db.insert(queueJobs).values({
			type,
			payload,
			max_attempts: maxAttempts,
			available_at: availableAt ?? new Date(),
			status: QueueJobStatus.PENDING,
		});
	}

	async getNextPendingJob(): Promise<
		(Omit<QueueJob, "payload"> & { payload: unknown }) | null
	> {
		const [job] = await db
			.select()
			.from(queueJobs)
			.where(
				sql`
					${queueJobs.status} = ${QueueJobStatus.PENDING} AND
					${queueJobs.locked_at} IS NULL AND
					${queueJobs.available_at} <= ${new Date()}
				`,
			)
			.orderBy(queueJobs.available_at)
			.limit(1);

		if (!job) return null;

		return job;
	}

	async markJobAsLock(jobId: number, workerId: string) {
		await db
			.update(queueJobs)
			.set({
				locked_at: new Date(),
				locked_by: workerId,
				status: QueueJobStatus.PROCESSING,
				updated_at: new Date(),
			})
			.where(
				sql`${queueJobs.id} = ${jobId} AND ${queueJobs.locked_at} IS NULL`,
			);
	}

	async markJobAsDone(jobId: number) {
		await db
			.update(queueJobs)
			.set({
				status: QueueJobStatus.DONE,
				updated_at: new Date(),
				locked_at: null,
				locked_by: null,
			})
			.where(sql`${queueJobs.id} = ${jobId}`);
	}

	async markJobAsFailed(jobId: number, error: any) {
		await db
			.update(queueJobs)
			.set({
				attempts: sql`${queueJobs.attempts} + 1`,
				status: QueueJobStatus.FAILED,
				last_error: error,
				updated_at: new Date(),
				locked_at: null,
				locked_by: null,
			})
			.where(sql`${queueJobs.id} = ${jobId}`);
	}

	async getRetryableJobs(
		limit = 10,
	): Promise<(Omit<QueueJob, "payload"> & { payload: unknown })[]> {
		const jobs = await db
			.select()
			.from(queueJobs)
			.where(
				sql`
				${queueJobs.status} = ${QueueJobStatus.FAILED} AND
				${queueJobs.attempts} < ${queueJobs.max_attempts}
			`,
			)
			.orderBy(queueJobs.updated_at)
			.limit(limit);

		return jobs;
	}
}

export const queueRepository = new QueueRepository();
