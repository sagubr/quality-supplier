import { CacheSchema, CacheKey } from "./cache.types";

class CacheService {
	private cache = nodeCache;

	constructor(private schema: CacheSchema) {}

	private resolveKey(key: CacheKey, params: any[] = []): string {
		return typeof key === "function" ? key(...params) : key;
	}

	set<T>(
		group: keyof CacheSchema,
		key: CacheKey,
		value: T,
		ttl?: number,
		...params: any[]
	) {
		const resolvedKey = this.resolveKey(key, params);
		if (ttl) {
			this.cache.set(resolvedKey, value, ttl);
			return;
		}
		this.cache.set(resolvedKey, value);
	}

	get<T>(
		group: keyof CacheSchema,
		key: CacheKey,
		...params: any[]
	): T | undefined {
		const resolvedKey = this.resolveKey(key, params);
		return this.cache.get<T>(resolvedKey);
	}

	del(group: keyof CacheSchema, key: CacheKey, ...params: any[]) {
		const resolvedKey = this.resolveKey(key, params);
		this.cache.del(resolvedKey);
	}

	delGroup(group: keyof CacheSchema) {
		const groupDef = this.schema[group];
		if (!groupDef) return;

		const keysToDelete = Object.values(groupDef).filter(
			(v) => typeof v === "string",
		) as string[];
		this.cache.del(keysToDelete);
	}

	flush() {
		this.cache.flushAll();
	}
}

import { CACHE_SCHEMA } from "./cache.keys";
import { nodeCache } from "../../config/cache.config";
export const cacheService = new CacheService(CACHE_SCHEMA);
