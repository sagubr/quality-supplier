import { env } from "../config/env.config";
import { logger } from "../config/logger.config";
import { queueService } from "../modules/queue/queue.service";
import { createScheduler } from "./scheduler";

(async () => {
	logger.info(
		{ service: "queue-watchdog", env: env.NODE_ENV },
		"Starting Queue Watchdog...",
	);

	const inspectScheduler = createScheduler(() => queueService.watchdog(), {
		name: "queue-watchdog",
		interval: 60_000,
	});

	const cleanupScheduler = createScheduler(() => queueService.cleanup(30), {
		name: "queue-cleanup",
		interval: 24 * 60 * 60 * 1000,
	});

	inspectScheduler.start();
	cleanupScheduler.start();
})();
