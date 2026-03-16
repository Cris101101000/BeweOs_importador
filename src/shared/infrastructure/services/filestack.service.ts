import type { IFilestackUploadResult } from "@shared/domain/interfaces/asset.interface";
import * as filestack from "filestack-js";
import type { StoreUploadOptions } from "filestack-js";

/**
 * Filestack upload service for handling file uploads to Filestack cloud storage
 */
class FilestackService {
	private client: filestack.Client | null = null;
	private readonly apiKey: string;

	constructor() {
		// Get API key from environment variables
		this.apiKey = process.env.REACT_APP_FILESTACK_API_KEY || "";

		if (!this.apiKey) {
			console.warn(
				"Filestack API key not found. Please set REACT_APP_FILESTACK_API_KEY environment variable."
			);
		}
	}

	/**
	 * Initialize the Filestack client if not already initialized
	 */
	private initClient(): filestack.Client {
		if (!this.client) {
			if (!this.apiKey) {
				throw new Error(
					"Filestack API key is not configured. Please set REACT_APP_FILESTACK_API_KEY environment variable."
				);
			}
			this.client = filestack.init(this.apiKey);
		}
		return this.client;
	}

	
	/**
	 * Upload multiple files to Filestack with detailed metadata
	 * @param files Array of File objects to upload
	 * @param options Optional upload options
	 * @returns Promise with array of uploaded file results containing full metadata
	 */
	async uploadFilesWithMetadata(
		files: File[],
		options?: {
			onProgress?: (progress: number, fileIndex: number) => void;
			path?: string;
			agencyId?: string;
		}
	): Promise<IFilestackUploadResult[]> {
		if (!files || files.length === 0) {
			throw new Error("No files provided for upload");
		}

		if (!options?.agencyId) {
			throw new Error("Agency ID is required for file upload");
		}

		const client = this.initClient();
		console.log("client", client);
		const uploadedResults: IFilestackUploadResult[] = [];

		try {
			// Upload each file sequentially
			for (let i = 0; i < files.length; i++) {
				const file = files[i];
				console.log("file", file);

				// Generate unique filename to avoid collisions
				const timestamp = Date.now();
				const filename = `${timestamp}_${file.name}`;

				// Build path with company prefix: company_{agencyId}/{path}{filename}
				const companyPrefix = `company_${options.agencyId}`;
				const relativePath = options?.path || "";
				const filePath = `${companyPrefix}/${relativePath}${filename}`;

				// Upload options (progress, etc.)
				const uploadOptions: filestack.UploadOptions = {
					onProgress: (evt: { totalPercent: number }) => {
						if (options?.onProgress) {
							options.onProgress(evt.totalPercent, i);
						}
					},
				};

				// Storage options for Google Cloud Storage
				const storeOptions: StoreUploadOptions = {
					location: "gcs",
					container: process.env.REACT_APP_FILESTACK_CONTAINER || "media-bewe-os-dev",
					path: filePath,
				};

				console.log("uploadOptions", uploadOptions);
				console.log("storeOptions", storeOptions);

				const response = await client.upload(file, uploadOptions, storeOptions);
				console.log("response", response);

				if (response && response.url) {
					// Build full metadata result
					const result: IFilestackUploadResult = {
						url: response.url,
						handle: response.handle || "",
						filename: response.filename || file.name,
						size: response.size || file.size,
						mimetype: response.mimetype || file.type,
						originalPath: filePath,
						container: storeOptions.container || "media-beweos-qa",
						key: response.key || filePath,
						status: response.status,
					};
					uploadedResults.push(result);
				} else {
					throw new Error(`Failed to upload file: ${file.name}`);
				}
			}

			return uploadedResults;
		} catch (error) {
			console.error("Error uploading files to Filestack:", error);
			throw new Error(
				error instanceof Error
					? `Upload failed: ${error.message}`
					: "Failed to upload files to Filestack"
			);
		}
	}

	/**
	 * Upload a single file to Filestack
	 * @param file File object to upload
	 * @param options Optional upload options
	 * @returns Promise with uploaded file URL
	 * @deprecated Use uploadFileWithMetadata for full asset information
	 */
	async uploadFile(
		file: File,
		options?: {
			onProgress?: (progress: number) => void;
			path?: string;
			agencyId?: string;
		}
	): Promise<string> {
		const urls = await this.uploadFiles([file], {
			onProgress: options?.onProgress
				? (progress, _) => options.onProgress?.(progress)
				: undefined,
			path: options?.path,
			agencyId: options?.agencyId,
		});
		return urls[0];
	}

	/**
	 * Check if Filestack is properly configured
	 */
	isConfigured(): boolean {
		return !!this.apiKey;
	}
}

// Export singleton instance
export const filestackService = new FilestackService();
