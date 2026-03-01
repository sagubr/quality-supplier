import { FastifyInstance, FastifyPluginOptions } from "fastify";
import notificationRouter from "@/modules/notification/routes";

export async function router(
	fastify: FastifyInstance,
	opts: FastifyPluginOptions,
) {
	await fastify.register(notificationRouter, { prefix: "/notifications" });
}
