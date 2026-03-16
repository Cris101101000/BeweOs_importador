import type { ICatalogAsset } from "../../domain/interfaces/catalog-asset.interface";
import type { GetCatalogAssetResponseDto } from "../dtos/get-catalog-assets.dto";

/**
 * Maps API response DTO to domain ICatalogAsset
 */
export function toCatalogAssetFromResponse(
	asset: GetCatalogAssetResponseDto
): ICatalogAsset {
	// Use signedUrl or accessUrl as the main URL, fallback to publicUrl
	const url =
		asset.storage.signedUrl ||
		asset.storage.accessUrl ||
		asset.storage.publicUrl ||
		"";

	// Use originalName or fileName from info
	const name = asset.info.originalName || asset.info.fileName;

	// Use mimeType from info
	const mimeType = asset.info.mimeType;

	// Use fileSize from info
	const size = asset.info.fileSize;

	// Determine type from info.fileType or mimeType
	const type = asset.info.fileType || mimeType?.split("/")[1] || undefined;

	return {
		id: asset.id,
		url: url,
		name: name,
		type: type,
		mimeType: mimeType,
		size: size,
		createdAt: new Date(asset.createdAt),
		updatedAt: new Date(asset.updatedAt),

		// New structured fields
		contexts: asset.contexts,
		info: asset.info,
		storage: asset.storage,
		isActive: asset.isActive,
		ownerType: asset.ownerType,
		entityType: asset.entityType,
		entityId: asset.entityId,

		metadata: {
			companyId: asset.companyId,
			agencyId: asset.agencyId,
			contexts: asset.contexts,
			entityId: asset.entityId,
			entityType: asset.entityType,
			isActive: asset.isActive,
			ownerType: asset.ownerType,
			ownerId: asset.ownerId,
			belongsToAgency: asset.belongsToAgency,
			belongsToCompany: asset.belongsToCompany,
			storage: asset.storage,
			info: asset.info,
			metadata: asset.metadata,
		},
	};
}

/**
 * Maps array of API response DTOs to array of domain ICatalogAssets
 */
export function toCatalogAssetsFromResponse(
	assets: GetCatalogAssetResponseDto[]
): ICatalogAsset[] {
	return assets.map(toCatalogAssetFromResponse);
}
