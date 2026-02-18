import { CacheSchema } from "./cache.types";

export const CACHE_SCHEMA: CacheSchema = {
	SUPPLIERS: {
		LIST: "suppliers:list",
		SUMMARY: "suppliers:summary",
		DETAILS: (id: string) => `suppliers:details:${id}`,
	},
	REPORTS: {
		SUMMARY: "reports:summary",
		DETAILS: (id: string) => `reports:details:${id}`,
	},
};
