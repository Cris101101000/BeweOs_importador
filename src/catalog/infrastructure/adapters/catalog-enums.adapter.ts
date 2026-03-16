import { httpService } from "@http";
import type { IHttpClient } from "@http";
import type { ICatalogEnumsPort } from "../../domain/ports/catalog-enums.port";
import type { CatalogEnumsDto } from "../dtos/get-catalog-enums.dto";
import type { GetCatalogEnumsResponseDto } from "../dtos/get-catalog-enums.dto";

export class CatalogEnumsAdapter implements ICatalogEnumsPort {
	private readonly httpClient: IHttpClient = httpService;

	async getCatalogEnums(): Promise<CatalogEnumsDto> {
		const path = window.location.pathname;
		const resourceType = path.split("/")[2];
		const response = await this.httpClient.get<GetCatalogEnumsResponseDto>(
			`/${resourceType}/list/enums`
		);

		if (response.success && response.data) {
			return {
				categories: response.data.categories,
				units: response.data.units,
			};
		}

		throw new Error(response.error?.code || "API call failed");
	}
}
