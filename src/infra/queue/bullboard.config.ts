import { FastifyAdapter } from "@bull-board/fastify";
import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { QueueFactory } from "./queue.factory";
import { MAIN_QUEUE } from "@/const/queue";

const bullboardFastifyAdapter = new FastifyAdapter();
bullboardFastifyAdapter.setBasePath("/bull-board");

const mainQueue = QueueFactory.getQueue(MAIN_QUEUE);
const mainQueueAdapter = new BullMQAdapter(mainQueue);

createBullBoard({
	queues: [mainQueueAdapter],
	serverAdapter: bullboardFastifyAdapter,
});

export { bullboardFastifyAdapter as serverAdapter };
