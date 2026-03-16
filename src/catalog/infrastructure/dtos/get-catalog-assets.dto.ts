export interface GetCatalogAssetInfoDto {
	originalName: string;
	fileName: string;
	fileSize: number;
	formattedSize: string;
	mimeType: string;
	fileType: string;
	isImage: boolean;
	isDocument: boolean;
	isVideo: boolean;
	isAudio: boolean;
}

export interface GetCatalogAssetStorageDto {
	provider: string;
	bucketName: string;
	filePath: string;
	isPublic: boolean;
	publicUrl: string | null;
	signedUrl: string;
	accessUrl: string;
	isCloudStorage: boolean;
	isExternalStorage: boolean;
}

export interface GetCatalogAssetMetadataDto {
	scrapedFrom: string | null;
	tags: string[];
	isPublic: boolean;
	isProcessed: boolean;
	isScraped: boolean;
}

export interface GetCatalogAssetResponseDto {
	id: string;
	companyId: string;
	agencyId: string;
	contexts: string[];
	info: GetCatalogAssetInfoDto;
	storage: GetCatalogAssetStorageDto;
	metadata: GetCatalogAssetMetadataDto;
	entityId: string;
	entityType: string;
	isActive: boolean;
	ownerType: string;
	ownerId: string;
	belongsToAgency: boolean;
	belongsToCompany: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface GetCatalogAssetsResponseDto {
	assets: GetCatalogAssetResponseDto[];
}
