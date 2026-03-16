export interface AssetInfoDto {
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

export interface AssetStorageDto {
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

export interface AssetMetadataDto {
	scrapedFrom: string | null;
	scrapedDomain: string | null;
	tags: string[];
	isPublic: boolean;
	isProcessed: boolean;
	isScraped: boolean;
}

export interface AssetDto {
	id: string;
	companyId: string;
	agencyId: string;
	contexts: string[];
	info: AssetInfoDto;
	storage: AssetStorageDto;
	metadata: AssetMetadataDto;
	isActive: boolean;
	ownerType: string;
	ownerId: string;
	belongsToAgency: boolean;
	belongsToCompany: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface AssetsResponseDto {
	message: string;
	assets: AssetDto[];
}
