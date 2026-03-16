import { useAuraToast } from "@beweco/aurora-ui";
import { UpdateLogoUseCase } from "@settings/bussinesConfig/application/update-logo.usecase";
import { BusinessInformationAdapter } from "@settings/bussinesConfig/infrastructure/adapters/business-information.adapter";
import { filestackService } from "@shared/infrastructure/services/filestack.service";
import { useSession } from "@shared/ui/contexts/session-context/session-context";
import { useTranslate } from "@tolgee/react";
import { useCallback, useEffect, useState } from "react";

export const useLogoManagement = (
	initialLogoUrl?: string | null,
	onDataUpdated?: () => void
) => {
	const [displayLogo, setDisplayLogo] = useState<string | null>(null);
	const [isUploading, setIsUploading] = useState(false);
	const { agency } = useSession();
	const { showToast } = useAuraToast();
	const { t } = useTranslate();

	useEffect(() => {
		if (initialLogoUrl) {
			setDisplayLogo(initialLogoUrl);
		}
	}, [initialLogoUrl]);

	/**
	 * Upload logo to Filestack and automatically save to backend
	 */
	const handleLogoUpload = useCallback(
		async (files: File[]) => {
			if (!files[0] || !agency?.id) return;

			try {
				setIsUploading(true);

				// Step 1: Upload file to Filestack
				const uploadedResults = await filestackService.uploadFilesWithMetadata(
					files,
					{
						path: "logos/",
						agencyId: agency.id,
					}
				);

				if (uploadedResults[0]?.url) {
					const logoUrl = uploadedResults[0].url;
					setDisplayLogo(logoUrl);

					// Step 2: Automatically save logo URL to backend
					const adapter = new BusinessInformationAdapter();
					const useCase = new UpdateLogoUseCase(adapter);
					await useCase.execute(logoUrl);

					showToast({
						color: "success",
						title: t("logo_upload_success_title", "Logo guardado"),
						description: t(
							"logo_upload_success_message",
							"El logo se subió y guardó correctamente"
						),
					});

					// Refresh business information after successful update
					if (onDataUpdated) {
						onDataUpdated();
					}
				}
			} catch (error) {
				console.error("Failed to upload and save logo:", error);
				const description =
					error instanceof Error
						? error.message
						: t(
								"logo_upload_error_message",
								"No se pudo subir o guardar el logo. Intenta nuevamente."
							);
				showToast({
					color: "danger",
					title: t("logo_upload_error_title", "Error al procesar logo"),
					description,
				});
			} finally {
				setIsUploading(false);
			}
		},
		[agency?.id, showToast, t, onDataUpdated]
	);

	/**
	 * Remove logo from display and backend
	 */
	const handleRemoveLogo = useCallback(async () => {
		try {
			// Remove logo from backend
			const adapter = new BusinessInformationAdapter();
			const useCase = new UpdateLogoUseCase(adapter);
			await useCase.execute("");

			// Clear display
			setDisplayLogo(null);

			showToast({
				color: "success",
				title: t("logo_remove_success_title", "Logo eliminado"),
				description: t(
					"logo_remove_success_message",
					"El logo se eliminó correctamente"
				),
			});

			// Refresh business information after successful update
			if (onDataUpdated) {
				onDataUpdated();
			}
		} catch (error) {
			console.error("Failed to remove logo:", error);
			const description =
				error instanceof Error
					? error.message
					: t(
							"logo_remove_error_message",
							"No se pudo eliminar el logo. Intenta nuevamente."
						);
			showToast({
				color: "danger",
				title: t("logo_remove_error_title", "Error al eliminar logo"),
				description,
			});
		}
	}, [showToast, t, onDataUpdated]);

	return {
		displayLogo,
		isUploading,
		handleLogoUpload,
		handleRemoveLogo,
	};
};
