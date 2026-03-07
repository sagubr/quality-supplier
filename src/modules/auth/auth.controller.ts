import { success } from "@/shared/http/response";
import { FastifyReply, FastifyRequest } from "fastify";
import { authService } from "./auth.service";
import type {
	LoginInput,
	RefreshTokenInput,
	RegisterInput,
} from "./auth.types";
import { jwtService } from "./jwt/jwt.service";

class AuthController {
	constructor(private service = authService) {}

	async login(
		request: FastifyRequest<{ Body: LoginInput }>,
		reply: FastifyReply,
	) {
		const { emailOrUsername, password } = request.body;

		const result = await this.service.login({
			emailOrUsername,
			password,
			userAgent: request.headers["user-agent"],
			ipAddress: request.ip,
		});

		return reply.send(success(result, "Login successful"));
	}

	async register(
		request: FastifyRequest<{ Body: RegisterInput }>,
		reply: FastifyReply,
	) {
		const { email, name, password, loginMethod, username } = request.body;

		const user = await this.service.register({ email, name, password, loginMethod, username });

		return reply
			.status(201)
			.send(success(user, "User registered successfully"));
	}

	async refresh(
		request: FastifyRequest<{ Body: RefreshTokenInput }>,
		reply: FastifyReply,
	) {
		const { refreshToken } = request.body;

		const tokens = await this.service.refreshToken(refreshToken);

		return reply.send(success(tokens, "Token refreshed successfully"));
	}

	async logout(request: FastifyRequest, reply: FastifyReply) {
		const authHeader = request.headers.authorization;
		if (!authHeader?.startsWith("Bearer ")) {
			return reply.status(401).send({
				success: false,
				message: "No token provided",
			});
		}

		const token = authHeader.substring(7);
		const payload = jwtService.verifyAccessToken(token);

		await this.service.logout(payload.sessionId);

		return reply.send(success(null, "Logout successful"));
	}


	async me(request: FastifyRequest, reply: FastifyReply) {
		const authHeader = request.headers.authorization;
		if (!authHeader?.startsWith("Bearer ")) {
			return reply.status(401).send({
				success: false,
				message: "No token provided",
			});
		}

		const token = authHeader.substring(7);
		const payload = jwtService.verifyAccessToken(token);

		const user = await this.service.getUserById(payload.userId);

		if (!user) {
			return reply.status(404).send({
				success: false,
				message: "User not found",
			});
		}

		return reply.send(success(user, "User retrieved successfully"));
	}
}

export const authController = new AuthController();
