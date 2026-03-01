import IORedis from "ioredis";
import { redis as connection } from "@/config/redis.config";
import { ICacheProvider } from "../cache.interface";

export const redis = new IORedis(connection);

export class RedisCacheProvider implements ICacheProvider {
	async get<T>(key: string): Promise<T | undefined> {
		const value = await redis.get(key);
		return value ? (JSON.parse(value) as T) : undefined;
	}

	async set<T>(key: string, value: T, ttl?: number): Promise<void> {
		const data = JSON.stringify(value);
		if (ttl) {
			await redis.set(key, data, "EX", ttl);
			return;
		}
		await redis.set(key, data);
	}

	async del(keys: string | string[]): Promise<void> {
		if (Array.isArray(keys)) {
			await redis.del(...keys);
			return;
		}
		await redis.del(keys);
	}

	async flush(): Promise<void> {
		await redis.flushall();
	}
}
