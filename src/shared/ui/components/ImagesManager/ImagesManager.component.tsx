/**
 * ImagesManager Component
 *
 * Generic component for managing multiple images upload, preview, and removal.
 * Can be used for products, services, or any other entity that needs image management.
 *
 * Features:
 * - Adaptive design: Full-width uploader when empty, compact grid when has images
 * - Upload to Filestack with dedicated button
 * - Image preview with individual removal
 * - Mode selector (add/replace) for existing images
 * - Maximum images limit (default: 5)
 * - Loading states and progress indicators
 *
 * Props:
 * - existingImages: string[] - Array of existing image URLs from server
 * - newImages: File[] - Array of new files selected but not yet uploaded
 * - onImagesUpload: (files: File[]) => void - Callback when new files are selected
 * - onImageRemove: (imageId: string) => void - Callback when an image is removed
 * - imageMode: 'add' | 'replace' - Mode for handling new images
 * - onImageModeChange: (mode: 'add' | 'replace') => void - Callback when mode changes
 * - maxImages: number - Maximum number of images allowed (default: 5)
 * - isLoading: boolean - Whether images are being uploaded
 * - onUploadToFilestack: () => void - Callback to upload images to Filestack
 * - hasNewImages: boolean - Whether there are new images pending upload
 */

import {
	Button,
	IconComponent,
	Radio,
	RadioGroup,
	useAuraToast,
} from "@beweco/aurora-ui";
import { useTranslate } from "@tolgee/react";
import type { FC } from "react";
import { useCallback, useMemo, useState } from "react";
import type { IAssetResponse } from "../../../domain/interfaces/asset-response.interface";
import { UploadFileComponent } from "../UploadFile/UploadFile";

interface ImageItem {
	id: string;
	url?: string;
	file?: File;
	isLocal: boolean;
	assetId?: string; // Backend asset ID for deletion
}

interface ImagesManagerProps {
	size?: "micro" | "small" | "medium" | "large";
	existingImages?: string[];
	existingAssets?: IAssetResponse[]; // Full assets with IDs for deletion
	newImages?: File[];
	onImagesUpload: (files: File[]) => void;
	/**
	 * Generic callback when an image needs to be removed
	 * @param imageId - Local UI identifier (for new files)
	 * @param assetId - Backend asset ID (for existing assets)
	 * The parent decides whether to delete from backend or just update local state
	 */
	onImageRemove: (imageId: string, assetId?: string) => Promise<void>;
	imageMode?: "add" | "replace";
	onImageModeChange?: (mode: "add" | "replace") => void;
	maxImages?: number;
	isLoading?: boolean;
	onUploadToFilestack?: () => void;
	hasNewImages?: boolean;
	maxFileSize?: number;
	acceptedFileTypes?: string;
}

export const ImagesManager: FC<ImagesManagerProps> = ({
	existingImages = [],
	existingAssets = [],
	newImages = [],
	size = "small",
	onImagesUpload,
	onImageRemove,
	imageMode = "add",
	onImageModeChange,
	maxImages = 5,
	isLoading = false,
	onUploadToFilestack,
	hasNewImages = false,
	maxFileSize = 1024 * 1024, // 1MB default
	acceptedFileTypes = "image/*",
}) => {
	const { t } = useTranslate();
	const { showToast } = useAuraToast();
	const [uploadKey, setUploadKey] = useState(0);
	const [deletingImageId, setDeletingImageId] = useState<string | null>(null);

	const handleUploadError = useCallback(
		(error: string) => {
			showToast({
				color: "danger",
				title: t("images_manager_upload_error_title", "Error al subir imagen"),
				description: error,
			});
		},
		[showToast, t],
	);

	// Combine existing images and new files into a single array
	const allImages = useMemo<ImageItem[]>(() => {
		const items: ImageItem[] = [];

		// Add existing images from server (hide if in replace mode and there are new images)
		if (!(imageMode === "replace" && newImages.length > 0)) {
			// Prefer existingAssets if available (has IDs), otherwise use existingImages (URLs only)
			if (existingAssets.length > 0) {
				existingAssets.forEach((asset, index) => {
					const url = asset.storage?.publicUrl || asset.url || "";
					if (url) {
						items.push({
							id: `existing-${index}-${url}`,
							url,
							assetId: asset.id, // Store backend asset ID for deletion
							isLocal: false,
						});
					}
				});
			} else {
				existingImages.forEach((url, index) => {
					items.push({
						id: `existing-${index}-${url}`,
						url,
						isLocal: false,
					});
				});
			}
		}

		// Add new files
		newImages.forEach((file, index) => {
			items.push({
				id: `new-${index}-${file.name}-${file.lastModified}`,
				file,
				isLocal: true,
			});
		});

		return items;
	}, [existingImages, existingAssets, newImages, imageMode]);

	const totalImages = allImages.length;
	const canUploadMore = totalImages < maxImages;

	// Get preview URL for an image
	const getImageSrc = (item: ImageItem): string => {
		if (item.url) {
			return item.url;
		}
		if (item.file) {
			return URL.createObjectURL(item.file);
		}
		return "";
	};

	// Wrapper to reset upload component after adding images
	const handleUpload = useCallback(
		(files: File[]) => {
			onImagesUpload(files);
			// Reset the upload component by changing its key
			setUploadKey((prev) => prev + 1);
		},
		[onImagesUpload]
	);

	// Generic handler for image removal - delegates to parent
	const handleImageRemoveClick = useCallback(
		async (imageItem: ImageItem) => {
			try {
				setDeletingImageId(imageItem.id);
				// Call parent handler with both IDs - parent decides what to do
				await onImageRemove(imageItem.id, imageItem.assetId);
			} catch (error) {
				console.error("Error removing image:", error);
				// Error is handled by parent - don't update UI on error
			} finally {
				setDeletingImageId(null);
			}
		},
		[onImageRemove]
	);

	// When there are no images, show full-width uploader
	if (allImages.length === 0) {
		return (
			<div className="space-y-4">
				<UploadFileComponent
					key={`upload-full-${uploadKey}`}
					size={size}
					acceptedFiles={acceptedFileTypes}
					maxFiles={maxImages}
					multiple={true}
					onUpload={handleUpload}
					onError={handleUploadError}
					translations={{
						uploadText: t(
							"images_manager_upload_text",
							"Haz clic o arrastra y suelta las imágenes aquí"
						),
						subText: t(
							"images_manager_upload_subtext",
							"PNG, JPG hasta 1MB - Máximo 5 imágenes"
						),
					}}
					maxFileSize={maxFileSize}
					disabled={isLoading}
					width="100%"
					height="auto"
				/>

				{/* Recommended size info */}
				<p className="text-tiny text-default-500">
					{t(
						"images_manager_recommended_size",
						"Tamaño recomendado: 1024x1024px, hasta 1MB."
					)}
				</p>

				{/* Upload status indicator */}
				{isLoading && (
					<div className="flex items-center gap-2 text-sm text-primary-600">
						<div className="w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
						<span>{t("images_manager_uploading", "Subiendo imágenes...")}</span>
					</div>
				)}
			</div>
		);
	}

	// When there are images, show compact grid with small uploader and upload button
	return (
		<div className="space-y-4">
			{/* Mode selector - only show if there are existing images */}
			{existingImages.length > 0 && (
				<div className="pb-2">
					<p className="text-sm font-medium text-default-700 mb-2">
						{t("images_manager_mode_title", "Al agregar nuevas imágenes:")}
					</p>
					<RadioGroup
						value={imageMode}
						onValueChange={(value: string) =>
							onImageModeChange?.(value as "add" | "replace")
						}
						orientation="horizontal"
						size="sm"
					>
						<Radio value="add">
							{t("images_manager_mode_add", "Agregar a las existentes")}
						</Radio>
						<Radio value="replace">
							{t("images_manager_mode_replace", "Reemplazar todas")}
						</Radio>
					</RadioGroup>
				</div>
			)}

			{/* Images counter */}
			<p className="text-sm text-default-600">
				{t("images_manager_count", "Imágenes seleccionadas")}: {totalImages} /{" "}
				{maxImages}
			</p>

			{/* Images Preview Grid with Upload Component */}
			<div className="flex flex-wrap gap-3">
				{/* Existing and new images */}
				{allImages.map((item) => (
					<div key={item.id} className="relative">
						<div className="relative w-[100px]">
							{/* Image preview */}
							<img
								src={getImageSrc(item)}
								alt={item.file?.name || "Image preview"}
								className="w-[100px] h-[100px] object-cover rounded-lg bg-white shadow-sm border"
							/>

							{/* New badge for local files */}
							{item.isLocal && (
								<div className="absolute bottom-1 left-1 bg-primary-500 text-white text-[10px] px-1.5 py-0.5 rounded">
									{t("images_manager_image_new", "Nueva")}
								</div>
							)}

							{/* Remove button */}
							<IconComponent
								size="lg"
								icon="solar:trash-bin-minimalistic-outline"
								className="absolute -top-2 -right-2 p-1 rounded-full bg-danger-500 text-white cursor-pointer hover:bg-danger-600 transition-colors"
								onClick={() =>
									!(isLoading || deletingImageId) &&
									handleImageRemoveClick(item)
								}
							/>

							{/* Loading overlay - show when uploading or deleting this specific image */}
							{(isLoading || deletingImageId === item.id) && (
								<div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
									<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
								</div>
							)}
						</div>

						{/* File name for local files */}
						{item.isLocal && item.file && (
							<p
								className="text-[10px] text-default-500 mt-1 w-[100px] truncate text-center"
								title={item.file.name}
							>
								{item.file.name}
							</p>
						)}
					</div>
				))}

				{/* Upload Component - show as another item in the grid if can upload more */}
				{canUploadMore && (
					<div className="relative w-[100px]">
						<UploadFileComponent
							key={`upload-grid-${uploadKey}`}
							size={size}
							acceptedFiles={acceptedFileTypes}
							maxFiles={maxImages}
							multiple={true}
							onUpload={handleUpload}
							onError={handleUploadError}
							translations={{
								uploadText: t(
									"images_manager_upload_text",
									"Haz clic o arrastra y suelta las imágenes aquí"
								),
								subText: t(
									"images_manager_upload_subtext",
									"PNG, JPG hasta 1MB - Máximo 5 imágenes"
								),
							}}
							maxFileSize={maxFileSize}
							disabled={isLoading}
							width="100px"
							height="100px"
						/>
					</div>
				)}
			</div>

			{/* Recommended size info */}
			<p className="text-tiny text-default-500">
				{t(
					"images_manager_recommended_size",
					"Tamaño recomendado: 1024x1024px, hasta 1MB."
				)}
			</p>

			{/* Upload to Filestack button - only show if there are new images */}
			{hasNewImages && onUploadToFilestack && (
				<Button
					color="primary"
					className="w-full"
					onPress={onUploadToFilestack}
					isLoading={isLoading}
					isDisabled={isLoading}
				>
					{isLoading
						? t("images_manager_uploading", "Subiendo imágenes...")
						: t("images_manager_upload_button", "Actualizar fotos")}
				</Button>
			)}

			{/* Max limit reached message */}
			{!canUploadMore && allImages.length >= maxImages && (
				<div className="text-sm text-warning-600 bg-warning-50 border border-warning-200 rounded-lg p-3">
					{t("images_manager_limit_reached", "Máximo de imágenes alcanzado")} (
					{maxImages})
				</div>
			)}
		</div>
	);
};
