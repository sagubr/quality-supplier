import { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { authController as controller } from "./auth.controller";
import {
	loginSchema,
	registerSchema,
	refreshTokenSchema,
	registerResponseSchema,
	refreshResponseSchema,
	meResponseSchema,
} from "./auth.types";
import z from "zod";

export default async function authRouter(fastify: FastifyInstance) {
	const app = fastify.withTypeProvider<ZodTypeProvider>();

	app.post(
		"/login",
		{
			schema: {
				description: "Login with email and password (local or SSO)",
				tags: ["Auth"],
				body: loginSchema,
			},
		},
		controller.login.bind(controller),
	);

	app.post(
		"/register",
		{
			schema: {
				description: "Register a new local user",
				tags: ["Auth"],
				body: registerSchema,
				response: {
					201: registerResponseSchema,
				},
			},
		},
		controller.register.bind(controller),
	);

	app.post(
		"/refresh",
		{
			schema: {
				description: "Refresh access token using refresh token",
				tags: ["Auth"],
				body: refreshTokenSchema,
				response: {
					200: refreshResponseSchema,
				},
			},
		},
		controller.refresh.bind(controller),
	);

	app.post(
		"/logout",
		{
			schema: {
				description: "Logout and revoke session",
				tags: ["Auth"],
				headers: z.object({
					authorization: z.string().describe("Bearer token"),
				}),
			},
		},
		controller.logout.bind(controller),
	);

	app.get(
		"/me",
		{
			schema: {
				description: "Get current authenticated user",
				tags: ["Auth"],
				headers: z.object({
					authorization: z.string().describe("Bearer token"),
				}),
				response: {
					200: meResponseSchema,
				},
			},
		},
		controller.me.bind(controller),
	);
}
