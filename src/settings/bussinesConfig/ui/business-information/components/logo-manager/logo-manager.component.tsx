/**
 * LogoManager Component
 *
 * This component is responsible for displaying and managing the business logo.
 * It allows users to upload a new logo to Filestack (auto-saved to backend), preview the current logo,
 * and remove the existing logo. The upload and save process is automatic and does not require
 * a separate save button.
 *
 * Props:
 * - logo: string | null
 *   The current logo URL to display. Can be a URL string or null if no logo is set.
 * - isUploading: boolean
 *   Flag indicating if a logo is currently being uploaded to Filestack and saved to backend.
 * - onLogoUpload: (files: File[]) => void
 *   Callback function triggered when a new logo file is uploaded. The logo is automatically
 *   saved to backend after successful upload.
 * - onLogoRemove: () => void
 *   Callback function triggered when the user removes the current logo. The removal is
 *   automatically synced with backend.
 *
 * Usage:
 * <LogoManager
 *   logo={logo}
 *   isUploading={isUploading}
 *   onLogoUpload={handleLogoUpload}
 *   onLogoRemove={handleLogoRemove}
 * />
 */

import { Card, Spinner } from "@beweco/aurora-ui";
import {
	ImagePreviewComponent,
	UploadFileComponent,
} from "@shared/ui/components";
import { useTranslate } from "@tolgee/react";
import type React from "react";
import type { LogoManagerProps } from "./logo-manager.type";

/**
 * LogoManager functional component.
 * Handles logo preview, automatic upload to Filestack with backend save, and removal.
 */
export const LogoManager: React.FC<LogoManagerProps> = ({
	logo,
	isUploading = false,
	onLogoUpload,
	onLogoRemove,
}) => {
	const { t } = useTranslate();

	return (
		<Card className="p-5 w-full gap-4">
			{/* Header with title and description */}
			<div>
				<h2 className="font-medium text-lg">
					{t("settings_business_logo_title")}
				</h2>
				<p className="text-default-500 text-sm">
					{t("settings_business_logo_description")}
				</p>
			</div>

			{isUploading ? (
				// Loading State
				<div className="flex flex-col items-center justify-center py-8 gap-4">
					<Spinner size="lg" color="primary" />
					<p className="text-sm text-default-500">
						{t("logo_uploading_message", "Subiendo logo a la nube...")}
					</p>
				</div>
			) : logo ? (
				// Logo Preview Section
				<div className="space-y-4">
					<ImagePreviewComponent
						images={logo}
						size="small"
						onRemove={onLogoRemove}
					/>
					{/* Recommended logo size info */}
					<p className="text-tiny text-default-500 text-left">
						{t("settings_business_logo_recommended_size_with_weight")}
					</p>
				</div>
			) : (
				// Logo Upload Section
				<div className="flex flex-col gap-2">
					<UploadFileComponent
						translations={{
							uploadText: t("uploader_click_or_drag_text"),
							dragText: t("uploader_drop_text"),
							multipleFilesError: t("uploader_multiple_files_error"),
							maxFilesError: t("uploader_max_files_error", {
								maxFiles: 1,
							}),
							invalidFileTypeError: t("uploader_invalid_file_type_error"),
							removeFileAriaLabel: t("uploader_remove_file_aria_label"),
							uploadAreaAriaLabel: t("uploader_upload_area_aria_label"),
							cropModalTitle: t("uploader_crop_modal_title"),
							cropSaveButton: t("uploader_crop_save_button"),
							cropCancelButton: t("uploader_crop_cancel_button"),
							cropZoomLabel: t("uploader_crop_zoom_label"),
							cropInstructions: t("uploader_crop_instructions"),
							cropBackgroundLabel: t("uploader_crop_background_label"),
							cropBackgroundWhite: t("uploader_crop_background_white"),
							cropBackgroundBlack: t("uploader_crop_background_black"),
							cropBackgroundTransparent: t(
								"uploader_crop_background_transparent"
							),
						}}
						size="small"
						acceptedFiles={["image/png", "image/jpeg"]}
						cropConfig={{
							targetWidth: 300,
							targetHeight: 300,
						}}
						maxFiles={1}
						multiple={false}
						maxFileSize={1024 * 1024}
						onError={(error: string) => console.log(error)}
						onUpload={onLogoUpload}
						width="100%"
						height="auto"
						icon="solar:cloud-upload-bold"
					/>
					{/* Recommended logo size and weight info */}
					<p className="text-tiny text-default-500">
						{t("settings_business_logo_recommended_size_with_weight")}
					</p>
				</div>
			)}
		</Card>
	);
};
