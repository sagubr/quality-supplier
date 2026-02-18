import { createPool } from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";
import { env } from "./env.config";

export const pool = createPool({
	host: env.DB_HOST,
	port: env.DB_PORT,
	user: env.DB_USER,
	password: env.DB_PASS,
	database: env.DB_NAME,
	waitForConnections: true,
	connectionLimit: 10,
});

export const db = drizzle(pool);
