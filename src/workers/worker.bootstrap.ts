// src/workers/worker.bootstrap.ts
import { createEmailWorker } from "./email.worker.factory";
import { logger } from "../config/logger.config";
import { env } from "../config/env.config";

(async () => {
	logger.info(
		{ service: "quality-worker", env: env.NODE_ENV },
		"Bootstrapping worker...",
	);

	const emailWorker1 = createEmailWorker("email-worker-1", 15000);
	await emailWorker1.start();
})();
