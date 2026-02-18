export type CacheKey = string | ((...args: any[]) => string);

export interface CacheGroup {
	[key: string]: CacheKey;
}

export interface CacheSchema {
	[group: string]: CacheGroup;
}
