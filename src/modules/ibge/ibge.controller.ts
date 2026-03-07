import { FastifyReply, FastifyRequest } from "fastify";
import { ibgeService } from "./ibge.service";
import { success } from "@/shared/http/response";

class IbgeController {
	constructor(private service = ibgeService) {}

	async getCities(request: FastifyRequest, reply: FastifyReply) {
		const cities = await this.service.getCities();
		return reply.send(success(cities));
	}
}

export const ibgeController = new IbgeController();
