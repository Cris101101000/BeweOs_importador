import type { IAsset } from "@shared/domain/interfaces/asset.interface";
import { assetUploadService } from "@shared/infrastructure/services/asset-upload.service";
import type { IUploadAssetsOptions } from "@shared/infrastructure/services/asset-upload.service";
import { useTranslate } from "@tolgee/react";
import { useCallback, useState } from "react";

/**
 * Hook options for asset upload
 */
interface UseAssetUploadOptions {
	onSuccess?: (assets: IAsset[]) => void;
	onError?: (error: Error) => void;
}

/**
 * Hook return type
 */
interface UseAssetUploadReturn {
	uploadAssets: (
		files: File[],
		options: IUploadAssetsOptions
	) => Promise<IAsset[]>;
	isUploading: boolean;
	error: string | null;
	clearError: () => void;
}

/**
 * React hook for uploading assets with Filestack + backend registration
 */
export const useAssetUpload = (
	hookOptions?: UseAssetUploadOptions
): UseAssetUploadReturn => {
	const { t } = useTranslate();
	const [isUploading, setIsUploading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const uploadAssets = useCallback(
		async (files: File[], options: IUploadAssetsOptions): Promise<IAsset[]> => {
			try {
				setIsUploading(true);
				setError(null);

				const assets = await assetUploadService.uploadAndCreateAssets(
					files,
					options
				);

				if (hookOptions?.onSuccess) {
					hookOptions.onSuccess(assets);
				}

				return assets;
			} catch (err) {
				const errorMessage =
					err instanceof Error
						? err.message
						: t("asset_upload_error", "Error al subir archivos");

				setError(errorMessage);

				if (hookOptions?.onError) {
					hookOptions.onError(
						err instanceof Error ? err : new Error(errorMessage)
					);
				}

				throw err;
			} finally {
				setIsUploading(false);
			}
		},
		[t, hookOptions]
	);

	const clearError = useCallback(() => {
		setError(null);
	}, []);

	return {
		uploadAssets,
		isUploading,
		error,
		clearError,
	};
};
