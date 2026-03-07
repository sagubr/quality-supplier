import { cacheService } from "@/infra/cache/cache.factory";
import { ibgeGateway } from "./ibge.gateway";
import { IbgeCity } from "./ibge.types";

class IbgeService {
	constructor(private gateway = ibgeGateway) {}

	async getCities() {
		const mapToSimpleCity = (rawCity: any): IbgeCity => ({
			id: rawCity.id,
			nome: rawCity.nome,
			estado: rawCity.microrregiao?.mesorregiao?.UF?.sigla || "N/A",
			nomeEstado: rawCity.microrregiao?.mesorregiao?.UF?.nome || "N/A",
		});

		const cached = await cacheService.get<IbgeCity[]>("ibge:cities");
		if (cached) return cached;

		const rawCities = await this.gateway.getCities();
		const cities = rawCities.map((city) => mapToSimpleCity(city));
		await cacheService.set("ibge:cities", cities, 3600);
		return cities;
	}
}

export const ibgeService = new IbgeService();
