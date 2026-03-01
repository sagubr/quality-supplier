import NodeCache from "node-cache";
import { ICacheProvider } from "../cache.interface";

const options = {
	stdTTL: 60 * 5,
	checkperiod: 60,
	useClones: false,
};

export class NodeCacheProvider implements ICacheProvider {
	private cache: NodeCache;

	constructor() {
		this.cache = new NodeCache(options);
	}

	async get<T>(key: string): Promise<T | undefined> {
		return this.cache.get<T>(key);
	}

	async set<T>(key: string, value: T, ttl?: number): Promise<void> {
		if (ttl) {
			this.cache.set(key, value, ttl);
			return;
		}
		this.cache.set(key, value);
	}

	async del(keys: string | string[]): Promise<void> {
		this.cache.del(keys);
	}

	async flush(): Promise<void> {
		this.cache.flushAll();
	}
}
