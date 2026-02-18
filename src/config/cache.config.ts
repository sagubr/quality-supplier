import NodeCache from "node-cache";

const defaultTtl = 60 * 5; // 5 minutos padrão
const checkPeriod = 60; // 1 minuto para limpar chaves expiradas

export const nodeCache = new NodeCache({
	stdTTL: defaultTtl,
	checkperiod: checkPeriod,
	useClones: false,
});
