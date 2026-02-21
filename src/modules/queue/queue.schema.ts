import {
	mysqlTable,
	serial,
	varchar,
	mysqlEnum,
	timestamp,
	int,
	json,
} from "drizzle-orm/mysql-core";
import { QueueJobStatus, QueueJobType } from "./queue.types";

export const queueJobs = mysqlTable("queue_jobs", {
	id: serial("id").primaryKey(),
	type: mysqlEnum("type", QueueJobType).notNull(),
	payload: json("payload").notNull(),
	status: mysqlEnum("status", QueueJobStatus)
		.default(QueueJobStatus.PENDING)
		.notNull(),
	attempts: int("attempts").default(0).notNull(),
	max_attempts: int("max_attempts").default(5).notNull(),
	next_run_at: timestamp("next_run_at").defaultNow(),
	locked_at: timestamp("locked_at"),
	locked_by: varchar("locked_by", { length: 100 }),
	last_error: json("last_error"),
	created_at: timestamp("created_at").defaultNow().notNull(),
	updated_at: timestamp("updated_at").defaultNow().notNull(),
});
