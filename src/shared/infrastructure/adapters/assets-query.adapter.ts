import type {
	IAssetResponse,
	IAssetsResponse,
} from "@shared/domain/interfaces/asset-response.interface";
import type { IAssetsQueryPort } from "@shared/domain/ports/assets-query.port";
import type { IHttpClient } from "@shared/infrastructure/services/api-http.service";
import { httpService } from "@shared/infrastructure/services/api-http.service";

/**
 * Generic Assets Query Adapter
 * Can be used to fetch assets for any entity type (products, services, clients, users, etc.)
 */
export class AssetsQueryAdapter implements IAssetsQueryPort {
	private readonly httpClient: IHttpClient = httpService;

	/**
	 * Get all assets for a specific entity
	 * @param resourceType - Type of resource (e.g., 'product', 'service', 'client', 'user')
	 * @param entityId - ID of the entity
	 * @returns Promise with array of assets
	 */
	async getAssetsByEntity(
		resourceType: string,
		entityId: string
	): Promise<IAssetResponse[]> {
		try {
			const url = `assets/${resourceType}/entity/${entityId}`;

			console.log(`📦 Fetching assets for ${resourceType} entity ${entityId}`, {
				url,
			});

			const response = await this.httpClient.get<IAssetsResponse>(url);

			console.log(`📦 Assets response received:`, { response, url });

			if (response.success && response.data) {
				// Map assets and add backward compatibility fields
				return response.data.assets.map((asset) => ({
					...asset,
					// Backward compatibility shortcuts
					url:
						asset.storage?.publicUrl ||
						asset.storage?.signedUrl ||
						asset.storage?.accessUrl ||
						"",
					name: asset.info?.originalName || asset.info?.fileName,
					type: asset.info?.fileType,
					mimeType: asset.info?.mimeType,
					size: asset.info?.fileSize,
				}));
			}

			throw new Error(
				response.error?.code || `Failed to get assets for ${resourceType}`
			);
		} catch (error) {
			console.error(`Error fetching assets for ${resourceType}:`, error);
			throw new Error(
				error instanceof Error
					? `Failed to get assets: ${error.message}`
					: `Failed to get assets for ${resourceType}`
			);
		}
	}

	/**
	 * Delete a specific asset
	 * @param assetId - ID of the asset to delete
	 * @returns Promise<void>
	 */
	async deleteAsset(assetId: string): Promise<void> {
		try {
			const url = `assets/${assetId}`;

			console.log(`🗑️ Deleting asset ${assetId}`, { url });

			const response = await this.httpClient.delete(url);

			if (response.success) {
				console.log(`✅ Asset ${assetId} deleted successfully`);
				return;
			}

			throw new Error(response.error?.code || "Failed to delete asset");
		} catch (error) {
			console.error(`Error deleting asset ${assetId}:`, error);
			throw new Error(
				error instanceof Error
					? `Failed to delete asset: ${error.message}`
					: "Failed to delete asset"
			);
		}
	}
}

// Export singleton instance for convenience
export const assetsQueryAdapter = new AssetsQueryAdapter();
