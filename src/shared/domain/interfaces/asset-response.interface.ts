import type { IAssetInfo, IAssetStorage } from "./asset.interface";

/**
 * Asset Metadata from Backend Response
 */
export interface IAssetMetadataResponse {
	scrapedFrom?: string | null;
	tags?: string[];
	isPublic: boolean;
	isProcessed?: boolean;
	isScraped?: boolean;
	[key: string]: unknown;
}

/**
 * Complete Asset from Backend Response
 */
export interface IAssetResponse {
	id: string;
	companyId: string;
	agencyId: string;
	contexts: string[];
	info: IAssetInfo;
	storage: IAssetStorage & {
		signedUrl?: string;
		accessUrl?: string;
		isCloudStorage?: boolean;
		isExternalStorage?: boolean;
	};
	metadata: IAssetMetadataResponse;
	entityId: string;
	entityType: string;
	isActive: boolean;
	ownerType: string;
	ownerId: string;
	belongsToAgency: boolean;
	belongsToCompany: boolean;
	createdAt: string;
	updatedAt: string;

	// Backward compatibility fields (derived from info and storage)
	url?: string; // Shortcut to storage.publicUrl
	name?: string; // Shortcut to info.originalName
	type?: string; // Shortcut to info.fileType
	mimeType?: string; // Shortcut to info.mimeType
	size?: number; // Shortcut to info.fileSize
}

/**
 * Assets Collection Response
 */
export interface IAssetsResponse {
	assets: IAssetResponse[];
}
