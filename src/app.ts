import { router } from "./routes";
import { Sentry } from "@/infra/observability/sentry";
import Fastify from "fastify";
import { env } from "@/config/env.config";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import {
	jsonSchemaTransform,
	serializerCompiler,
	validatorCompiler,
} from "fastify-type-provider-zod";
import { errorHandler } from "@/middlewares/error.middleware";
import { serverAdapter } from "@/infra/queue/bullboard.config";

export const buildApp = async () => {
	const app = Fastify();

	await app.register(import("@fastify/helmet"));
	await app.register(import("@fastify/cors"));
	await app.register(import("@fastify/compress"));
	await app.register(import("@fastify/sensible"));
	await app.register(import("@fastify/rate-limit"), {
		global: true,
		max: env.RATE_LIMIT_MAX,
		timeWindow: env.RATE_LIMIT_TIME_WINDOW,
	});

	app.setValidatorCompiler(validatorCompiler);
	app.setSerializerCompiler(serializerCompiler);

	app.register(fastifySwagger, {
		openapi: {
			info: {
				title: "Quality API",
				version: "1.0.0",
				description:
					"API para gerenciamento de notificações, fila de jobs e monitoramento de serviços internos.",
				termsOfService: "https://example.com/terms",
				contact: {
					name: "Equipe de Desenvolvimento",
					url: "https://example.com",
					email: "dev@example.com",
				},
				license: {
					name: "MIT",
					url: "https://opensource.org/licenses/MIT",
				},
			},
			servers: [
				{
					url: "https://api.example.com",
					description: "Servidor de produção",
				},
				{
					url: "http://localhost:3005",
					description: "Servidor local para desenvolvimento",
				},
			],
		},
		transform: jsonSchemaTransform,
	});

	app.register(fastifySwaggerUi, {
		routePrefix: "/docs",
	});

	app.register(serverAdapter.registerPlugin(), { prefix: "/bull-board" });

	await app.register(router);
	Sentry.setupFastifyErrorHandler(app);

	app.setErrorHandler(errorHandler);

	return app;
};

//TODO: Implementar Caddy ao invés de Greenlock
