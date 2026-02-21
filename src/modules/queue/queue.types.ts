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

const EmailPayloadSchema = z
	.object({
		type: z.literal(QueueJobType.EMAIL),
		to: z.email(),
		subject: z.string(),
		body: z.string(),
	})
	.strict();

export const QueueJobPayloadSchema = z.discriminatedUnion("type", [
	EmailPayloadSchema,
]);

export type QueueJobPayload = z.infer<typeof QueueJobPayloadSchema>;

export interface QueueJob {
	id: number;
	type: QueueJobType;
	payload: QueueJobPayload;
	status: QueueJobStatus;
	attempts: number;
	max_attempts: number;
	next_run_at: Date | null;
	locked_at: Date | null;
	locked_by: string | null;
	last_error: any;
	created_at: Date;
	updated_at: Date;
}
