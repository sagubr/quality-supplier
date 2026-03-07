import { FastifyRequest, FastifyReply } from "fastify";
import { success } from "@/shared/http/response";
import { createNotificationSchema } from "./notification.types";
import { notificationService } from "./notification.service";

export class NotificationController {
	constructor(private service = notificationService) {}

	async sendTestEmailSuccess(request: FastifyRequest, reply: FastifyReply) {
		const body = createNotificationSchema.parse(request.body);
		await this.service.sendTestEmailSuccess(body);
		return reply.send(success(null, "Notification scheduled"));
	}

	async sendTestEmailError(request: FastifyRequest, reply: FastifyReply) {
		await this.service.sendTestEmailError();
		return reply.send(success());
	}
}

export const notificationController = new NotificationController();
