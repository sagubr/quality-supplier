import z from "zod";

export enum QueueJobType {
	EMAIL = "EMAIL",
}

export enum QueueJobStatus {
	PENDING = "PENDING",
	PROCESSING = "PROCESSING",
	DONE = "DONE",
	FAILED = "FAILED",
}

export const QueueJobPayloadSchema = z
	.object({
		to: z.email(),
		subject: z.string(),
		body: z.string(),
	})
	.strict();

export type QueueJobPayload = z.infer<typeof QueueJobPayloadSchema>;

export interface QueueJob {
	id: number;
	type: QueueJobType;
	payload: QueueJobPayload;
	status: QueueJobStatus;
	attempts: number;
	max_attempts: number;
	available_at: Date;
	locked_at: Date | null;
	locked_by: string | null;
	last_error: any;
	created_at: Date;
	updated_at: Date;
}
