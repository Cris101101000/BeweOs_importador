import type {
	ICreateAssetsRequest,
	ICreateAssetsResponse,
} from "@shared/domain/interfaces/asset.interface";
import type { IAssetPort } from "@shared/domain/ports/asset.port";
import type { IHttpClient } from "@shared/infrastructure/services/api-http.service";
import { httpService } from "@shared/infrastructure/services/api-http.service";

/**
 * Asset Adapter - Infrastructure implementation for asset operations
 */
export class AssetAdapter implements IAssetPort {
	private readonly httpClient: IHttpClient = httpService;

	/**
	 * Create multiple assets using the createAssets endpoint
	 * @param request - The create assets request
	 * @returns Promise with created assets response
	 */
	async createAssets(
		request: ICreateAssetsRequest
	): Promise<ICreateAssetsResponse> {
		try {
			console.log("Creating assets with request:", request);

			// Make API call to createAssets endpoint
			const response = await this.httpClient.post<ICreateAssetsResponse>(
				"/assets/",
				request
			);

			console.log("Create assets response:", response);

			// Handle response
			if (response.success && response.data) {
				return response.data;
			}

			throw new Error(response.error?.code || "Failed to create assets");
		} catch (error) {
			console.error("Error creating assets:", error);
			throw new Error(
				error instanceof Error
					? `Failed to create assets: ${error.message}`
					: "Failed to create assets"
			);
		}
	}
}
