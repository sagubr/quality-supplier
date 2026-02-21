import { sql, eq } from "drizzle-orm";
import { RowDataPacket } from "mysql2";
import { db } from "../../config/db.config";
import { queueJobs } from "./queue.schema";
import { QueueJob, QueueJobStatus, QueueJobType } from "./queue.types";

type RawQueueJob = Omit<QueueJob, "payload"> & { payload: unknown };

class QueueRepository {
	async createJob(type: QueueJobType, payload: unknown, maxAttempts = 5) {
		await db.insert(queueJobs).values({
			type,
			payload,
			max_attempts: maxAttempts,
			attempts: 0,
			next_run_at: new Date(),
			status: QueueJobStatus.PENDING,
		});
	}

	async fetchAndLockNextJob(workerId: string, type: QueueJobType): Promise<RawQueueJob | null> {
		return await db.transaction(async (tx) => {
			const result = await tx.execute(sql`
				SELECT *
				FROM ${queueJobs}
				WHERE status = 'PENDING'
				 	AND type = ${type}
					AND attempts < max_attempts
					AND next_run_at <= NOW()
				ORDER BY created_at
				LIMIT 1
				FOR UPDATE SKIP LOCKED
			`);

			const rows = result[0];

			if (!Array.isArray(rows)) {
				return null;
			}

			const job = rows[0] as RawQueueJob | undefined;
			if (!job) return null;

			await tx
				.update(queueJobs)
				.set({
					status: QueueJobStatus.PROCESSING,
					locked_at: new Date(),
					locked_by: workerId,
					updated_at: new Date(),
				})
				.where(eq(queueJobs.id, job.id));

			return job;
		});
	}

	async updateJob(jobId: number, data: Partial<QueueJob>) {
		await db
			.update(queueJobs)
			.set({ ...data, updated_at: new Date() })
			.where(eq(queueJobs.id, jobId));
	}

	async deleteOldProcessedJobs(days = 30) {
		await db.execute(sql`
			DELETE FROM ${queueJobs}
			WHERE status IN (${QueueJobStatus.DONE})
			AND updated_at < NOW() - INTERVAL ${days} DAY
			AND (status = 'DONE' OR attempts >= max_attempts)
		`);
	}

	async resetStaleJobs(timeoutMinutes = 5) {
		await db.execute(sql`
			UPDATE ${queueJobs}
			SET status = 'PENDING',
				locked_at = NULL,
				locked_by = NULL
			WHERE status = 'PROCESSING'
				AND locked_at < NOW() - INTERVAL ${timeoutMinutes} MINUTE
		`);
	}
}

export const queueRepository = new QueueRepository();
