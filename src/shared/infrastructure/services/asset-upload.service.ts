import type {
	IAsset,
	ICreateAssetRequest,
	ICreateAssetsRequest,
	IFilestackUploadResult,
} from "@shared/domain/interfaces/asset.interface";
import { AssetAdapter } from "../adapters/asset.adapter";
import { filestackService } from "./filestack.service";

/**
 * Options for uploading assets
 */
export interface IUploadAssetsOptions {
	agencyId: string;
	path?: string;
	contexts: string[];
	ownerType?: "company" | "user" | "system";
	entityType?: "product" | "service";
	entityId?: string;
	isPublic?: boolean;
	onProgress?: (progress: number, fileIndex: number) => void;
}

/**
 * Asset Upload Service
 * Orchestrates the complete flow: Filestack upload + createAssets backend call
 */
class AssetUploadService {
	private assetAdapter: AssetAdapter;

	constructor() {
		this.assetAdapter = new AssetAdapter();
	}

	/**
	 * Format file size to human readable format
	 */
	private formatFileSize(bytes: number): string {
		if (bytes === 0) return "0 Bytes";
		const k = 1024;
		const sizes = ["Bytes", "KB", "MB", "GB"];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
	}

	/**
	 * Transform Filestack upload result to CreateAsset request
	 */
	private transformToCreateAssetRequest(
		filestackResult: IFilestackUploadResult,
		contexts: string[],
		ownerType: "company" | "user" | "system" = "company",
		isPublic = true,
		entityType?: string,
		entityId?: string
	): ICreateAssetRequest {
		// Extract file extension
		const fileExtension =
			filestackResult.filename.split(".").pop()?.toLowerCase() || "unknown";

		// Determine file type categories
		const imageExtensions = [
			"jpg",
			"jpeg",
			"png",
			"gif",
			"webp",
			"svg",
			"bmp",
			"ico",
		];
		const documentExtensions = [
			"pdf",
			"doc",
			"docx",
			"xls",
			"xlsx",
			"ppt",
			"pptx",
			"txt",
			"csv",
		];
		const videoExtensions = ["mp4", "avi", "mov", "wmv", "flv", "mkv", "webm"];
		const audioExtensions = ["mp3", "wav", "ogg", "flac", "aac", "m4a"];

		const isImage = imageExtensions.includes(fileExtension);
		const isDocument = documentExtensions.includes(fileExtension);
		const isVideo = videoExtensions.includes(fileExtension);
		const isAudio = audioExtensions.includes(fileExtension);

		const assetRequest: ICreateAssetRequest = {
			contexts,
			info: {
				originalName: filestackResult.filename,
				fileName: filestackResult.filename,
				fileSize: filestackResult.size,
				formattedSize: this.formatFileSize(filestackResult.size),
				mimeType: filestackResult.mimetype || "application/octet-stream",
				fileType: fileExtension,
				isImage,
				isDocument,
				isVideo,
				isAudio,
			},
			storage: {
				provider: "gcp",
				bucketName: filestackResult.container,
				filePath: filestackResult.key,
				isPublic,
				publicUrl: filestackResult.url,
			},
			metadata: {
				isPublic,
			},
			isActive: true,
			ownerType,
		};

		// Add entityType and entityId if provided
		if (entityType) {
			assetRequest.entityType = entityType;
		}
		if (entityId) {
			assetRequest.entityId = entityId;
		}

		return assetRequest;
	}

	/**
	 * Upload files to Filestack and register them as assets in the backend
	 * @param files - Array of File objects to upload
	 * @param options - Upload options including contexts, paths, etc.
	 * @returns Promise with array of created assets
	 */
	async uploadAndCreateAssets(
		files: File[],
		options: IUploadAssetsOptions
	): Promise<IAsset[]> {
		if (!files || files.length === 0) {
			throw new Error("No files provided for upload");
		}

		try {
			// Step 1: Upload files to Filestack
			console.log("Uploading files to Filestack...");
			const filestackResults = await filestackService.uploadFilesWithMetadata(
				files,
				{
					agencyId: options.agencyId,
					path: options.path,
					onProgress: options.onProgress,
				}
			);

			console.log("Filestack upload results:", filestackResults);

			// Step 2: Transform results to createAssets request
			const assetsRequest: ICreateAssetsRequest = {
				assets: filestackResults.map((result) =>
					this.transformToCreateAssetRequest(
						result,
						options.contexts,
						options.ownerType || "company",
						options.isPublic !== false,
						options.entityType,
						options.entityId
					)
				),
			};

			console.log("Creating assets in backend:", assetsRequest);

			// Step 3: Call createAssets endpoint
			const response = await this.assetAdapter.createAssets(assetsRequest);

			console.log("Assets created successfully:", response);

			return response.assets;
		} catch (error) {
			console.error("Error in uploadAndCreateAssets:", error);
			throw new Error(
				error instanceof Error
					? `Asset upload failed: ${error.message}`
					: "Failed to upload and create assets"
			);
		}
	}

	/**
	 * Upload files to Filestack only (without backend registration)
	 * Use this for backward compatibility
	 */
	async uploadFilesOnly(
		files: File[],
		options: {
			agencyId: string;
			path?: string;
			onProgress?: (progress: number, fileIndex: number) => void;
		}
	): Promise<string[]> {
		const results = await filestackService.uploadFilesWithMetadata(
			files,
			options
		);
		return results.map((result) => result.url);
	}
}

// Export singleton instance
export const assetUploadService = new AssetUploadService();
