import { FastifyInstance, FastifyPluginOptions } from "fastify";
import authRouter from "@/modules/auth/auth.routes";
import notificationRouter from "@/modules/notification/notification.routes";
import ibgeRouter from "@/modules/ibge/ibge.routes";

export async function router(
	fastify: FastifyInstance,
	opts: FastifyPluginOptions,
) {
	await fastify.register(authRouter, { prefix: "/auth" });
	await fastify.register(notificationRouter, { prefix: "/notifications" });
	await fastify.register(ibgeRouter, { prefix: "/ibge" });
}
