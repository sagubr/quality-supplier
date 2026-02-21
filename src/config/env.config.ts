import dotenv from "dotenv";
import { z } from "zod";

const envFile = `.env.${process.env.NODE_ENV || "development"}`;

dotenv.config({ path: envFile });

const envSchema = z.object({
	PORT: z.coerce.number().default(3000),
	NODE_ENV: z
		.enum(["development", "production", "staging"])
		.default("development"),
	SERVICE_NAME: z.string().optional(),
	LOG_LEVEL: z.string().default("info"),
	DB_HOST: z.string().default("localhost"),
	DB_PORT: z.coerce.number().default(3306),
	DB_USER: z.string().default("root"),
	DB_PASS: z.string().default(""),
	DB_NAME: z.string().default("quality-supplier"),
	JWT_SECRET: z.string().min(10),
	JWT_EXPIRES_IN: z.enum(["15m", "30m", "1h", "6h", "12h", "1d", "7d"]),
	EMAIL_PROVIDER: z.enum(["sendgrid", "smtp"]).default("sendgrid"),
	SENDGRID_API_KEY: z.string().optional(),
	SMTP_HOST: z.string().optional(),
	SMTP_PORT: z.coerce.number().optional(),
	SMTP_USER: z.string().optional(),
	SMTP_PASS: z.string().optional(),
	EMAIL_FROM_NAME: z.string(),
	EMAIL_FROM_ADDRESS: z.email(),
	EMAIL_MAX_ATTEMPTS: z.coerce.number().default(3),
	EMAIL_BATCH_SIZE: z.coerce.number().default(10),
	SENTRY_DSN: z.url().optional(),
});

export const env = envSchema.parse(process.env);
