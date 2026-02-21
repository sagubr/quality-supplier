import { logger } from "../config/logger.config";

interface SchedulerOptions {
	name: string;
	interval: number;
}

export function createScheduler(
	task: () => Promise<void>,
	options: SchedulerOptions,
) {
	const controller = new AbortController();

	const run = async () => {
		if (controller.signal.aborted) return;

		try {
			await task();
		} catch (err) {
			logger.error({ err, task: options.name }, "Scheduler error");
		}

		if (!controller.signal.aborted) {
			setTimeout(run, options.interval);
		}
	};

	return {
		start() {
			logger.info({ task: options.name }, "Scheduler started");
			run();
		},
		stop() {
			controller.abort();
			logger.info({ task: options.name }, "Scheduler stopped");
		},
	};
}
