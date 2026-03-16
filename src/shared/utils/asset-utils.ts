import type { IAsset } from "@shared/domain/interfaces/asset.interface";

/**
 * Filter assets to get only images (where isImage = true)
 * @param assets - Array of assets or URLs
 * @returns Array of image URLs
 */
export const filterImageAssets = (assets?: IAsset[] | string[]): string[] => {
	if (!assets || assets.length === 0) {
		return [];
	}

	// If it's already an array of strings (URLs), return as is
	if (typeof assets[0] === "string") {
		return assets as string[];
	}

	// If it's an array of IAsset objects, filter and extract URLs
	return (assets as IAsset[])
		.filter((asset) => asset?.info?.isImage === true)
		.map((asset) => asset.storage.publicUrl);
};

/**
 * Filter assets to get only documents (where isDocument = true)
 * @param assets - Array of assets
 * @returns Array of document assets
 */
export const filterDocumentAssets = (assets?: IAsset[]): IAsset[] => {
	if (!assets || assets.length === 0) {
		return [];
	}

	return assets.filter((asset) => asset?.info?.isDocument === true);
};

/**
 * Filter assets by context
 * @param assets - Array of assets
 * @param context - Context to filter by (e.g., 'image', 'document')
 * @returns Array of filtered assets
 */
export const filterAssetsByContext = (
	assets?: IAsset[],
	context?: string
): IAsset[] => {
	if (!assets || assets.length === 0 || !context) {
		return [];
	}

	return assets.filter((asset) => asset?.contexts?.includes(context));
};

/**
 * Get first image URL from assets
 * @param assets - Array of assets or URLs
 * @returns First image URL or undefined
 */
export const getFirstImageUrl = (
	assets?: IAsset[] | string[]
): string | undefined => {
	const imageUrls = filterImageAssets(assets);
	return imageUrls.length > 0 ? imageUrls[0] : undefined;
};
