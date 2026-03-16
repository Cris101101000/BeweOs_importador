import type { ICatalogAsset } from "../interfaces/catalog-asset.interface";

export interface ICatalogAssetsPort {
	getCatalogAssets(
		resourceType: string,
		entityId: string
	): Promise<ICatalogAsset[]>;
	deleteCatalogAsset(assetId: string): Promise<void>;
}
