/**
 * Asset Information
 */
export interface IAssetInfo {
	originalName: string;
	fileName: string;
	fileSize: number; // in bytes
	formattedSize?: string; // e.g., "44.14 KB"
	mimeType: string;
	fileType: string;
	isImage: boolean;
	isDocument: boolean;
	isVideo: boolean;
	isAudio: boolean;
}

/**
 * Asset Storage Information
 */
export interface IAssetStorage {
	provider: string;
	bucketName: string;
	filePath: string;
	isPublic: boolean;
	publicUrl: string;
}

/**
 * Asset Metadata
 */
export interface IAssetMetadata {
	isPublic: boolean;
	[key: string]: unknown; // Allow additional metadata fields
}

/**
 * Asset Owner Type
 */
export type AssetOwnerType = "company" | "user" | "system";

/**
 * Create Asset Request
 */
export interface ICreateAssetRequest {
	contexts: string[];
	info: IAssetInfo;
	storage: IAssetStorage;
	metadata: IAssetMetadata;
	isActive: boolean;
	ownerType: AssetOwnerType;
	entityType?: string; // e.g., 'product', 'service'
	entityId?: string; // ID of the related entity
}

/**
 * Create Assets Request (bulk)
 */
export interface ICreateAssetsRequest {
	assets: ICreateAssetRequest[];
}

/**
 * Asset Response
 */
export interface IAsset extends ICreateAssetRequest {
	id: string;
	createdAt: string;
	updatedAt: string;
}

/**
 * Create Assets Response
 */
export interface ICreateAssetsResponse {
	assets: IAsset[];
}

/**
 * Filestack Upload Result with full metadata
 */
export interface IFilestackUploadResult {
	url: string;
	handle: string;
	filename: string;
	size: number;
	mimetype: string;
	originalPath: string;
	container: string;
	key: string;
	status?: string;
}
