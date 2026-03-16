import type { IAssetResponse } from "../interfaces/asset-response.interface";

/**
 * Assets Query Port - Domain interface for querying assets
 * Generic port that can be used for any entity (products, services, clients, etc.)
 */
export interface IAssetsQueryPort {
	/**
	 * Get all assets for a specific entity
	 * @param resourceType - Type of resource (e.g., 'product', 'service', 'client', 'user')
	 * @param entityId - ID of the entity
	 * @returns Promise with array of assets
	 */
	getAssetsByEntity(
		resourceType: string,
		entityId: string
	): Promise<IAssetResponse[]>;

	/**
	 * Delete a specific asset
	 * @param assetId - ID of the asset to delete
	 * @returns Promise<void>
	 */
	deleteAsset(assetId: string): Promise<void>;
}
