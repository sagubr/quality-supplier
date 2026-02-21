import { env } from "../config/env.config";
import { logger } from "../config/logger.config";
import { createEmailWorker } from "../modules/email/email.worker.factory";
import { createScheduler } from "./scheduler";

(async () => {
	logger.info(
		{ service: "quality-worker", env: env.NODE_ENV },
		"Bootstrapping worker...",
	);

	const emailWorker = createEmailWorker("email-worker-1");

	const scheduler = createScheduler(() => emailWorker.runOnce(), {
		name: "email-worker",
		interval: 15000,
	});

	scheduler.start();
})();
