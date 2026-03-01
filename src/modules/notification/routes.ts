import { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { notificationController as controller } from "./notification.controller";
import { createNotificationSchema } from "./schema";

export default async function notificationRouter(fastify: FastifyInstance) {
	const app = fastify.withTypeProvider<ZodTypeProvider>();

	app.post(
		"/send-success",
		{
			schema: {
				body: createNotificationSchema,
			},
		},
		controller.sendTestEmailSuccess.bind(controller),
	);

	app.post(
		"/send-error",
		{
			schema: {
				body: createNotificationSchema,
			},
		},
		controller.sendTestEmailError.bind(controller),
	);
}
