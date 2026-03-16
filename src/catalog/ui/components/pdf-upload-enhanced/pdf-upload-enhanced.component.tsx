import { Button, IconComponent, P, Tooltip } from "@beweco/aurora-ui";
import { useTranslate } from "@tolgee/react";
import type { FC } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { UploadFileComponent } from "../../../../shared/ui/components";
import { useAssetsQuery } from "../../../../shared/ui/hooks/use-assets-query.hook";

interface PdfUploadEnhancedProps {
	onFileUpload?: (file: File) => void;
	onFileRemove?: () => void;
	onUploadSuccess?: () => void; // Callback cuando se carga exitosamente
	onDeleteSuccess?: () => void; // Callback cuando se elimina exitosamente
	currentPdfUrl?: string;
	currentPdfName?: string;
	isLoading?: boolean;
	maxFileSize?: number; // in MB
	className?: string;
	disabled?: boolean;
	entityId?: string; // ID del producto o servicio
	resourceType?: string; // "product" o "service"
}

const PdfUploadEnhanced: FC<PdfUploadEnhancedProps> = ({
	onFileUpload,
	onFileRemove,
	onUploadSuccess,
	onDeleteSuccess,
	currentPdfUrl,
	currentPdfName,
	isLoading = false,
	maxFileSize = 10, // 10MB default
	className = "",
	disabled = false,
	entityId,
	resourceType,
}) => {
	const { t } = useTranslate();
	const [hasCurrentFile, setHasCurrentFile] = useState(false);
	const [deletingAssetId, setDeletingAssetId] = useState<string | null>(null);
	const [uploadKey, setUploadKey] = useState(0); // Key para resetear el componente de carga

	// Use generic assets query hook
	const {
		assets,
		isLoading: isLoadingAssets,
		error: assetsError,
		refetch: refetchAssets,
		deleteAsset: deleteAssetFromBackend,
	} = useAssetsQuery({
		resourceType: resourceType || "",
		entityId: entityId || "",
		autoLoad: Boolean(entityId && resourceType),
	});

	// Update state when current file changes
	useEffect(() => {
		setHasCurrentFile(Boolean(currentPdfUrl && currentPdfName));
	}, [currentPdfUrl, currentPdfName]);

	// Filter document assets from loaded assets (using isDocument flag)
	const pdfAssets = useMemo(() => {
		return assets.filter((asset) => asset?.info?.isDocument === true);
	}, [assets]);

	const handleFileUpload = useCallback(
		async (files: File[]) => {
			if (files.length > 0) {
				try {
					await onFileUpload?.(files[0]);
					// Recargar assets después de una carga exitosa
					await refetchAssets();
					// Resetear el componente de carga para que vuelva a mostrar su contenido inicial
					setUploadKey((prev) => prev + 1);
					// Llamar callback de éxito
					onUploadSuccess?.();
				} catch (error) {
					// El error ya se maneja en el componente padre
					console.error("Error uploading file:", error);
				}
			}
		},
		[onFileUpload, onUploadSuccess, refetchAssets]
	);

	const handleFileError = useCallback((error: string) => {
		console.error("PDF Upload Error:", error);
	}, []);

	// TODO: support viewing the file
	// const handleViewFile = useCallback(() => {
	// 	if (currentPdfUrl) {
	// 		window.open(currentPdfUrl, "_blank");
	// 	}
	// }, [currentPdfUrl]);

	// const handleViewAsset = useCallback((asset: ICatalogAsset) => {
	// 	const accessUrl = (asset.metadata?.storage as { accessUrl?: string })?.accessUrl;
	// 	if (accessUrl) {
	// 		window.open(accessUrl, "_blank");
	// 	}
	// }, []);

	const handleDeleteAsset = useCallback(
		async (asset: any) => {
			if (!asset.id) {
				console.error("Asset ID is required for deletion");
				return;
			}

			try {
				setDeletingAssetId(asset.id);
				// Use the generic delete method from the hook
				await deleteAssetFromBackend(asset.id);
				// Llamar callback de éxito
				onDeleteSuccess?.();
			} catch (error) {
				console.error("Error deleting asset:", error);
			} finally {
				setDeletingAssetId(null);
			}
		},
		[deleteAssetFromBackend, onDeleteSuccess]
	);

	// Si hay un archivo actual, no mostrar el componente de información
	// Solo mostrar el área de carga y la lista de documentos relacionados
	if (true) {
		return (
			<div className={`pdf-upload-enhanced ${className}`}>
				{/* Option to replace file */}
				<div className="mt-4">
					<UploadFileComponent
						key={uploadKey}
						size="large"
						acceptedFiles="application/pdf"
						maxFiles={1}
						multiple={false}
						onUpload={handleFileUpload}
						onError={handleFileError}
						disabled={disabled || isLoading}
						maxFileSize={maxFileSize * 1024 * 1024} // Convert MB to bytes
						translations={{
							uploadText: t("pdf_upload_replace", "Reemplazar archivo PDF"),
							subText: t("pdf_upload_requirements", `Máximo ${maxFileSize}MB`),
						}}
						height={120}
						icon="solar:document-add-bold"
					/>
				</div>

				{/* Related PDF Assets */}
				{pdfAssets.length > 0 && (
					<div className="mt-4">
						<div className="mb-2">
							<P className="text-sm font-medium text-default-700">
								{t("pdf_upload_related_files", "Archivos PDF relacionados")}
							</P>
							<P className="text-xs text-default-500">
								{t(
									"pdf_upload_related_count",
									`${pdfAssets.length} archivo(s)`
								)}
							</P>
						</div>
						<div className="space-y-2">
							{pdfAssets.map((asset) => (
								<div
									key={asset.id}
									className="p-3 border border-default-200 rounded-lg bg-default-50 hover:bg-default-100 transition-colors"
								>
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-3 flex-1 min-w-0">
											<div className="w-8 h-8 bg-danger-100 rounded-lg flex items-center justify-center flex-shrink-0">
												<IconComponent icon="solar:file-outline" size="sm" className="text-danger-600"/>
											</div>
											<div className="flex-1 min-w-0">
												<P className="text-sm font-medium text-default-900 truncate">
													{asset.name ||
														asset.info?.originalName ||
														asset.storage?.publicUrl?.split("/").pop() ||
														asset.url?.split("/").pop() ||
														"Sin nombre"}
												</P>
												{asset.size && (
													<P className="text-xs text-default-500">
														{(asset.size / 1024 / 1024).toFixed(2)} MB
													</P>
												)}
											</div>
										</div>
										<div className="flex items-center gap-2">
											{/* TODO: support viewing the file */}
											{/* <Tooltip content={t("pdf_upload_view", "Ver")}>
												<Button
													size="sm"
													variant="light"
													isIconOnly
													onPress={() => handleViewAsset(asset)}
													isDisabled={disabled || deletingAssetId === asset.id}
													className="min-w-9 w-9 h-9"
													startContent={
														<IconComponent
															color="primary"
															icon="solar:eye-outline"
															size="sm"
														/>
													}
												/>
											</Tooltip> */}
											<Tooltip content={t("pdf_upload_remove", "Eliminar")}>
												<Button
													size="sm"
													variant="light"
													color="danger"
													isIconOnly
													onPress={() => handleDeleteAsset(asset)}
													isDisabled={disabled || deletingAssetId === asset.id}
													isLoading={deletingAssetId === asset.id}
													className="min-w-9 w-9 h-9"
													startContent={
														!deletingAssetId && (
															<IconComponent
																icon="solar:trash-bin-minimalistic-outline"
																size="sm"
															/>
														)
													}
												/>
											</Tooltip>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				)}

				{/* Loading state */}
				{isLoadingAssets && (
					<div className="mt-4 text-center text-sm text-default-500">
						{t("pdf_upload_loading_assets", "Cargando archivos...")}
					</div>
				)}

				{/* Error state */}
				{assetsError && (
					<div className="mt-4 text-center text-sm text-danger-500">
						{assetsError}
					</div>
				)}
			</div>
		);
	}

	// If no current file, show the upload area
	return (
		<div className={`pdf-upload-enhanced ${className}`}>
			<UploadFileComponent
				key={uploadKey}
				acceptedFiles="application/pdf"
				maxFiles={1}
				size="large"
				multiple={false}
				onUpload={handleFileUpload}
				onError={handleFileError}
				disabled={disabled || isLoading}
				maxFileSize={maxFileSize * 1024 * 1024} // Convert MB to bytes
				translations={{
					uploadText: t(
						"pdf_upload_instruction",
						"Haz clic o arrastra y suelta un archivo PDF"
					),
					subText: t("pdf_upload_requirements", `Máximo ${maxFileSize}MB`),
					dragText: t("pdf_upload_drop_here", "Suelta el archivo PDF aquí"),
				}}
				height={200}
				icon="solar:document-add-bold"
			/>

			{/* Related PDF Assets */}
			{pdfAssets.length > 0 && (
				<div className="mt-4">
					<div className="mb-2">
						<P className="text-sm font-medium text-default-700">
							{t("pdf_upload_related_files", "Archivos PDF relacionados")}
						</P>
						<P className="text-xs text-default-500">
							{t("pdf_upload_related_count", `${pdfAssets.length} archivo(s)`)}
						</P>
					</div>
					<div className="space-y-2">
						{pdfAssets.map((asset) => (
							<div
								key={asset.id}
								className="p-3 border border-default-200 rounded-lg bg-default-50 hover:bg-default-100 transition-colors"
							>
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-3 flex-1 min-w-0">
										<div className="w-8 h-8 bg-danger-100 rounded-lg flex items-center justify-center flex-shrink-0">
											<IconComponent icon="solar:file-outline" size="sm" className="text-danger-600"/>
										</div>
										<div className="flex-1 min-w-0">
											<P className="text-sm font-medium text-default-900 truncate">
												{asset.name ||
													asset.info?.originalName ||
													asset.storage?.publicUrl?.split("/").pop() ||
													asset.url?.split("/").pop() ||
													"Sin nombre"}
											</P>
											{(asset.size || asset.info?.fileSize) && (
												<P className="text-xs text-default-500">
													{asset.info?.formattedSize ||
														(
															(asset.size || asset.info?.fileSize || 0) /
															1024 /
															1024
														).toFixed(2) + " MB"}
												</P>
											)}
										</div>
									</div>
									<div className="flex items-center gap-2">
										{/* TODO: support viewing the file */}
										{/* <Tooltip content={t("pdf_upload_view", "Ver")}>
											<Button
												size="sm"
												variant="light"
												isIconOnly
												onPress={() => handleViewAsset(asset)}
												isDisabled={disabled || deletingAssetId === asset.id}
												className="min-w-9 w-9 h-9"
												startContent={
													<IconComponent
														color="primary"
														icon="solar:eye-outline"
														size="sm"
													/>
												}
											/>
										</Tooltip> */}
										<Tooltip content={t("pdf_upload_remove", "Eliminar")}>
											<Button
												size="sm"
												variant="light"
												color="danger"
												isIconOnly
												onPress={() => handleDeleteAsset(asset)}
												isDisabled={disabled || deletingAssetId === asset.id}
												isLoading={deletingAssetId === asset.id}
												className="min-w-9 w-9 h-9"
												startContent={
													deletingAssetId !== asset.id && (
														<IconComponent
															icon="solar:trash-bin-minimalistic-outline"
															size="sm"
														/>
													)
												}
											/>
										</Tooltip>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			)}

			{/* Loading state */}
			{isLoadingAssets && (
				<div className="mt-4 text-center text-sm text-default-500">
					{t("pdf_upload_loading_assets", "Cargando archivos...")}
				</div>
			)}

			{/* Error state */}
			{assetsError && (
				<div className="mt-4 text-center text-sm text-danger-500">
					{assetsError}
				</div>
			)}
		</div>
	);
};

export default PdfUploadEnhanced;
