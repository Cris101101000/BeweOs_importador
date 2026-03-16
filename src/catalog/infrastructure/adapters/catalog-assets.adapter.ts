import { httpService } from "@http";
import type { IHttpClient } from "@http";
import type { ICatalogAsset } from "../../domain/interfaces/catalog-asset.interface";
import type { ICatalogAssetsPort } from "../../domain/ports/catalog-assets.port";
import type {
	GetCatalogAssetResponseDto,
	GetCatalogAssetsResponseDto,
} from "../dtos/get-catalog-assets.dto";
import { toCatalogAssetsFromResponse } from "../mappers/catalog-assets.mapper";

export class CatalogAssetsAdapter implements ICatalogAssetsPort {
	private readonly httpClient: IHttpClient = httpService;

	async getCatalogAssets(
		resourceType: string,
		entityId: string
	): Promise<ICatalogAsset[]> {
		const url = `assets/${resourceType}/entity/${entityId}`;
		const response = await this.httpClient.get<
			GetCatalogAssetsResponseDto | GetCatalogAssetResponseDto[]
		>(url);

		if (response.success && response.data) {
			return toCatalogAssetsFromResponse(response.data.assets);
		}

		throw new Error(response.error?.code || "API call failed");
	}

	async deleteCatalogAsset(assetId: string): Promise<void> {
		const url = `assets/${assetId}`;
		const response = await this.httpClient.delete(url);
		if (response.success) {
			return;
		}
		throw new Error(response.error?.code || "API call failed");
	}
}
