import { env } from "./env.config";

export const authConfig = {
	jwtSecret: env.JWT_SECRET,
	jwtExpiresIn: env.JWT_EXPIRES_IN,
};
