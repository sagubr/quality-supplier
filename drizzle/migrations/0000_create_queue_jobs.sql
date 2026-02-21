CREATE TABLE `queue_jobs` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`type` enum('EMAIL') NOT NULL,
	`payload` json NOT NULL,
	`status` enum('PENDING','PROCESSING','DONE','FAILED') NOT NULL DEFAULT 'PENDING',
	`attempts` int NOT NULL DEFAULT 0,
	`max_attempts` int NOT NULL DEFAULT 5,
	`next_run_at ` timestamp NOT NULL DEFAULT (now()),
	`locked_at` timestamp,
	`locked_by` varchar(100),
	`last_error` json,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `queue_jobs_id` PRIMARY KEY(`id`)
);
