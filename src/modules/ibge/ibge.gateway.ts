import { HttpClient } from "@/infra/http/http.client";
import { IbgeCityRaw } from "./ibge.types";

class IbgeGateway {
	private url: string = "https://servicodados.ibge.gov.br/api";
	private version: string = "v1";

	constructor(private readonly http: HttpClient = new HttpClient()) {}

	async getCities() {
		const url = `${this.url}/${this.version}/localidades/municipios?orderBy=nome`;
		return this.http.get<IbgeCityRaw[]>(url);
	}
}

export const ibgeGateway = new IbgeGateway();
