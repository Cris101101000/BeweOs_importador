import {
	Button,
	Card,
	CardBody,
	CardHeader,
	Divider,
	H2,
	IconComponent,
	Input,
	P,
	Switch,
	Textarea,
	useAuraToast
} from "@beweco/aurora-ui";
import {
	DURATION_MAX_VALUES,
	EnumDurationType,
} from "@catalog/domain/enums/duration-type.enum";
import { convertToMinutes } from "@catalog/domain/validations/duration.validation";
import {
	formatDuration,
	parseDurationString,
} from "@catalog/infrastructure/utils/duration-ui.util";
import { DurationSelector } from "@catalog/ui/components/duration-selector";
import { EnumErrorType } from "@shared/domain/enums/enum-error-type.enum";
import {
	configureErrorToastWithTranslation,
	configureSuccessToast,
} from "@shared/utils";
import { useTranslate } from "@tolgee/react";
import type { FC } from "react";
import { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { ConfirmDeleteModal } from "@shared/ui/components/confirm-delete-modal/confirm-delete-modal";
import type { IAsset } from "../../../shared/domain/interfaces/asset.interface";
import { ImagesManager, PageHeader } from "../../../shared/ui/components";
import { useSession } from "../../../shared/ui/contexts/session-context/session-context";
import { useAssetUpload } from "../../../shared/ui/hooks/use-asset-upload.hook";
import { useAssetsQuery } from "../../../shared/ui/hooks/use-assets-query.hook";
import { GetCatalogItemByIdUseCase } from "../../application/get-catalog-item-by-id.usecase";
import { UploadCatalogFileUseCase } from "../../application/upload-catalog-file.usecase";
import { EnumCatalogStatus } from "../../domain/enums/catalog-status.enum";
import { EnumCatalogType } from "../../domain/enums/catalog-type.enum";
import type { ICatalogItem } from "../../domain/interfaces/catalog.interface";
import { CatalogAdapter } from "../../infrastructure/adapters/catalog.adapter";
import { ViewSkeleton } from "@shared/ui/components/view-skeleton";
import {
	CategoryDropdownProvider,
	CategorySelector,
} from "../components/category-selector";
import { CatalogNotFoundError } from "../components/catalog-not-found-error";
import { PdfUploadEnhanced } from "../components/pdf-upload-enhanced";
import { useServiceActions } from "../hooks/use-service-actions.hook";
import { ResponsiveButton } from "@shared/ui/components/responsive-button";

interface ServiceFormData {
	name: string;
	categoryId: string;
	description: string;
	price: number;
	durationValue: number;
	durationType: EnumDurationType;
	status: EnumCatalogStatus;
	externalUrl: string;
}

const ServiceDetailPageContent: FC = () => {
	const { t } = useTranslate();
	const { showToast } = useAuraToast();
	const navigate = useNavigate();
	const { serviceId } = useParams<{ serviceId: string }>();
	const { agency } = useSession();
	const [service, setService] = useState<ICatalogItem | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [isServiceEnabled, setIsServiceEnabled] = useState(true);
	const [pdfUrl, setPdfUrl] = useState<string | null>(null);
	const [pdfName, setPdfName] = useState<string | null>(null);
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);

	// Image management states
	const [existingImages, setExistingImages] = useState<string[]>([]);
	const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
	const [imageMode, setImageMode] = useState<"add" | "replace">("add");
	const [isUploadingImages, setIsUploadingImages] = useState(false);

	// Initialize use cases
	const catalogAdapter = new CatalogAdapter();
	const getCatalogItemByIdUseCase = new GetCatalogItemByIdUseCase(catalogAdapter);
	const uploadCatalogFileUseCase = new UploadCatalogFileUseCase(catalogAdapter);

	// Use service actions hook for CRUD operations with toast notifications
	const { updateService, deleteService } = useServiceActions();

	// Use asset upload hook for uploading images with backend registration
	const { uploadAssets } = useAssetUpload({
		onSuccess: (result: any) => {
			console.log("✅ Asset upload result:", result);

			let successfulAssets: IAsset[] = [];
			// Check for new and legacy responses
			if (Array.isArray(result)) {
				// legacy array return
				successfulAssets = result;
			} else if (Array.isArray(result.successfulAssets)) {
				successfulAssets = result.successfulAssets;
			}

			// Extract public URLs from successful assets
			const newUrls = successfulAssets
				.filter((asset) => asset?.storage && asset.storage.publicUrl)
				.map((asset) => asset.storage.publicUrl);

			// Update existing images based on mode
			if (imageMode === "replace") {
				setExistingImages(newUrls);
			} else {
				setExistingImages((prev) => [...prev, ...newUrls]);
			}

			// Clear new files since they're now uploaded and registered
			setNewImageFiles([]);
		},
		onError: (error: Error) => {
			console.error("❌ Asset upload error:", error);
			setError(error.message);
		},
	});

	// Form setup
	const {
		control,
		handleSubmit,
		reset,
		trigger,
		formState: { errors, isDirty },
		watch,
	} = useForm<ServiceFormData>({
		defaultValues: {
			name: "",
			categoryId: "",
			description: "",
			price: 0,
			durationValue: 0,
			durationType: EnumDurationType.MINUTES,
			status: EnumCatalogStatus.Active,
			externalUrl: "",
		},
		mode: "onChange",
	});

	// Watch durationType for dynamic validation
	const durationType = watch("durationType");

	// Re-validate durationValue when durationType changes
	useEffect(() => {
		trigger("durationValue");
	}, [durationType, trigger]);

	// Use generic assets query hook
	const {
		assets: serviceAssets,
		refetch: refetchAssets,
		deleteAsset: deleteServiceAsset,
	} = useAssetsQuery({
		resourceType: "service",
		entityId: serviceId || "",
		autoLoad: false, // Load manually after service is loaded
	});

	// Load service data and assets
	useEffect(() => {
		const loadService = async () => {
			if (!serviceId) {
				setError(t("service_not_found", "Servicio no encontrado"));
				setIsLoading(false);
				return;
			}

			try {
				setIsLoading(true);
				setError(null);

				// Get service directly by ID
				const foundService = await getCatalogItemByIdUseCase.execute(serviceId);

				if (foundService) {
					setService(foundService);
					setIsServiceEnabled(foundService.status === EnumCatalogStatus.Active);

					// Set PDF data if exists (backward compatibility)
					if (foundService.pdfUrl && foundService.pdfName) {
						setPdfUrl(foundService.pdfUrl);
						setPdfName(foundService.pdfName);
					}

					// Load assets from generic endpoint
					await refetchAssets();

					// Parse duration from metadata
					const parsedDuration = parseDurationString(
						foundService.metadata?.formattedDuration as string
					);

					// Populate form with service data
					reset({
						name: foundService.name,
						categoryId: foundService.categoryId,
						description: foundService.description || "",
						price: foundService.price,
						durationValue: parsedDuration.value,
						durationType: parsedDuration.type,
						status: foundService.status,
						externalUrl: foundService.externalUrl || "",
					});
				} else {
					setError(t("service_not_found", "Servicio no encontrado"));
				}
			} catch (err) {
				setError(
					err instanceof Error ? err.message : "Error cargando servicio"
				);
			} finally {
				setIsLoading(false);
			}
		};

		loadService();
	}, [serviceId, t, reset, refetchAssets]);

	// Update existingImages when serviceAssets change
	useEffect(() => {
		if (serviceAssets.length > 0) {
			// Filter only images (isImage: true)
			const imageAssets = serviceAssets.filter(
				(asset: any) => asset.info?.isImage === true
			);
			const imageUrls = imageAssets
				.map((asset: any) => asset.storage?.publicUrl)
				.filter(Boolean);

			if (imageUrls.length > 0) {
				setExistingImages(imageUrls as string[]);
			}
		}
	}, [serviceAssets]);

	const handleBack = useCallback(() => {
		navigate("/catalog/services");
	}, [navigate]);

	const handlePdfUpload = useCallback(
		async (file: File) => {
			try {
				setIsSaving(true);
				setError(null);

				// Upload the file with entityId (service ID)
				const entityId = service?.id || "";
				if (!entityId) {
					throw new Error("Service ID is required for file upload");
				}
				const fileUrl = await uploadCatalogFileUseCase.execute(file, entityId);

				setPdfName(file.name);
				setPdfUrl(fileUrl);

				// Show success toast
				showToast(
					configureSuccessToast(
						t("service_pdf_uploaded_success", "Documento cargado con éxito"),
						t(
							"service_pdf_uploaded_description",
							`El archivo ${file.name} se ha cargado correctamente`
						)
					)
				);
			} catch (err) {
				console.error("Error uploading PDF:", err);
				const errorMessage =
					err instanceof Error ? err.message : "Error al subir el archivo PDF";
				setError(errorMessage);

				// Show error toast
				showToast(
					configureErrorToastWithTranslation(
						EnumErrorType.Critical,
						t,
						"service_pdf_uploaded_error",
						"try_again"
					)
				);
			} finally {
				setIsSaving(false);
			}
		},
		[service, uploadCatalogFileUseCase, showToast, t]
	);

	const handlePdfRemove = useCallback(() => {
		const removedFileName = pdfName;
		setPdfName(null);
		if (pdfUrl) {
			URL.revokeObjectURL(pdfUrl);
			setPdfUrl(null);
		}

		// Show success toast
		showToast(
			configureSuccessToast(
				t("service_pdf_removed_success", "Documento eliminado con éxito"),
				removedFileName
					? t(
							"service_pdf_removed_description",
							`El archivo ${removedFileName} se ha eliminado correctamente`
						)
					: undefined
			)
		);
	}, [pdfUrl, pdfName, showToast, t]);

	const handlePdfDeleteSuccess = useCallback(() => {
		// Show success toast when an asset is deleted from the related files list
		showToast(
			configureSuccessToast(
				t("service_pdf_deleted_success", "Documento eliminado con éxito"),
				t(
					"service_pdf_deleted_description",
					"El archivo se ha eliminado correctamente"
				)
			)
		);
	}, [showToast, t]);

	const handleImageUpload = useCallback(
		(files: File[]) => {
			// Check if adding these files would exceed the limit
			const currentTotal = imageMode === "replace" ? 0 : existingImages.length;
			const totalAfterUpload =
				currentTotal + newImageFiles.length + files.length;

			if (totalAfterUpload > 5) {
				const available = 5 - (currentTotal + newImageFiles.length);
				setError(
					t(
						"product_images_max_exceeded",
						`Solo puedes agregar ${available} imagen(es) más. Máximo 5 imágenes.`
					)
				);
				return;
			}

			// Add files to the new images array
			setNewImageFiles((prev) => [...prev, ...files]);
			setError(null);
		},
		[existingImages.length, newImageFiles.length, imageMode, t]
	);

	/**
	 * Generic handler for image removal - handles both new files and existing assets
	 * @param imageId - Local UI identifier
	 * @param assetId - Backend asset ID (if it's an existing asset)
	 */
	const handleImageRemove = useCallback(
		async (imageId: string, assetId?: string) => {
			// If it's an existing asset, delete from backend first
			if (assetId) {
				try {
					await deleteServiceAsset(assetId);

					// Show success toast
					showToast(
						configureSuccessToast(
							t("service_image_deleted_success", "Imagen eliminada"),
							t(
								"service_image_deleted_description",
								"La imagen se ha eliminado correctamente"
							)
						)
					);

					// Refetch assets to update the list
					await refetchAssets();
				} catch (error) {
					console.error("Error deleting service image:", error);

					// Determine error type based on error message
					let errorType = EnumErrorType.Critical;
					let errorMessage = "service_image_delete_error";
					let errorDescription = "service_image_delete_error_description";

					if (error instanceof Error) {
						const errorMsg = error.message.toLowerCase();

						// Check if it's a permission error
						if (
							errorMsg.includes("permission") ||
							errorMsg.includes("access") ||
							errorMsg.includes("storage.objects.delete")
						) {
							errorType = EnumErrorType.Permission;
							errorMessage = "service_image_delete_permission_error";
							errorDescription =
								"service_image_delete_permission_error_description";
						}
						// Check if it's a network error
						else if (
							errorMsg.includes("network") ||
							errorMsg.includes("failed to fetch")
						) {
							errorType = EnumErrorType.Network;
							errorMessage = "service_image_delete_network_error";
							errorDescription =
								"service_image_delete_network_error_description";
						}
					}

					// Show error toast
					showToast(
						configureErrorToastWithTranslation(
							errorType,
							t,
							errorMessage,
							errorDescription
						)
					);

					throw error; // Re-throw to prevent UI update
				}
			} else {
				// It's a new file (not uploaded yet), just remove from local state
				if (imageId.startsWith("new-")) {
					// Extract file info from ID: "new-{index}-{name}-{lastModified}"
					const parts = imageId.split("-");
					const lastModified = Number(parts[parts.length - 1]);
					const fileName = parts.slice(2, -1).join("-");

					setNewImageFiles((prev) =>
						prev.filter(
							(file) =>
								!(file.name === fileName && file.lastModified === lastModified)
						)
					);
				}
			}
		},
		[deleteServiceAsset, refetchAssets, showToast, t]
	);

	// Handler to upload images to Filestack and register as assets in backend
	const handleUploadToFilestack = useCallback(async () => {
		if (newImageFiles.length === 0 || !service || !agency?.id) return;

		try {
			setIsUploadingImages(true);
			setError(null);

			// Upload to Filestack AND register in backend using createAssets
			await uploadAssets(newImageFiles, {
				agencyId: agency.id,
				path: `services/${service.id}/`,
				contexts: ["image"],
				ownerType: "company",
				isPublic: true,
				entityType: EnumCatalogType.Service,
				entityId: service.id,
				onProgress: (progress: number, fileIndex: number) => {
					console.log(
						`📤 Uploading file ${fileIndex + 1}: ${Math.round(progress)}%`
					);
				},
			});

			// Success handling is done in the hook's onSuccess callback

			// Refetch assets to update the list
			await refetchAssets();
		} catch (uploadError) {
			// Error handling is done in the hook's onError callback
			console.error("Error in upload handler:", uploadError);
		} finally {
			setIsUploadingImages(false);
		}
	}, [newImageFiles, service, agency, uploadAssets, imageMode, refetchAssets]);

	//TODO: Uncomment this when the category creation is implemented
	// Function to handle category creation 
	// const handleCreateCategory = useCallback(
	// 	async (categoryName: string, type: EnumCatalogType): Promise<string> => {
	// 		// Simulate API call to create category
	// 		const newCategory = {
	// 			id: categoryName.toLowerCase().replace(/\s+/g, "_"),
	// 			name: categoryName,
	// 			description: `Categoría creada automáticamente: ${categoryName}`,
	// 			color: "#6B7280",
	// 			type,
	// 			createdAt: new Date(),
	// 			updatedAt: new Date(),
	// 		};

	// 		// Add to mock data (in a real app, this would be an API call)
	// 		catalogCategoriesMock.push(newCategory);

	// 		// Return the new category ID
	// 		return newCategory.id;
	// 	},
	// 	[]
	// );

	const onSubmit = async (data: ServiceFormData) => {
		if (!service) return;

		try {
			setIsSaving(true);
			setError(null);

			// Convert duration to minutes for API
			const durationInMinutes = convertToMinutes(
				data.durationValue,
				data.durationType
			);

			// Use existing images (already uploaded to Filestack)
			const finalImageUrls = existingImages;

			const updatedService = {
				id: service.id,
				name: data.name.trim(),
				description: data.description.trim() || undefined,
				price: data.price,
				currency: service.currency,
				categoryId: data.categoryId,
				type: EnumCatalogType.Service,
				status: isServiceEnabled
					? EnumCatalogStatus.Active
					: EnumCatalogStatus.Inactive,
				pdfUrl: pdfUrl || undefined,
				pdfName: pdfName || undefined,
				images: finalImageUrls.length > 0 ? finalImageUrls : undefined,
				duration: durationInMinutes > 0 ? durationInMinutes : undefined,
				externalUrl: data.externalUrl.trim(),
				metadata: {
					...service.metadata,
					measureValue: data.durationValue,
					measureUnit:
						data.durationType === EnumDurationType.HOURS ? "hora" : "minuto",
					formattedDuration: formatDuration(
						data.durationValue,
						data.durationType
					),
				},
			};

			await updateService(updatedService);

			// Navigate back after successful update (toast is shown by the hook)
			navigate("/catalog/services");
		} catch (err) {
			console.error("Error updating service:", err);
		} finally {
			setIsSaving(false);
		}
	};

	const handleToggleServiceStatus = async (isActive: boolean) => {
		if (!service) return;

		try {
			// Solo enviar el campo que se está actualizando
			const updateData = {
				id: service.id,
				status: isActive
					? EnumCatalogStatus.Active
					: EnumCatalogStatus.Inactive,
			};

			const updatedService = await updateService(updateData);
			setService(updatedService);
			setIsServiceEnabled(isActive);
		} catch (err) {
			setError(
				err instanceof Error
					? err.message
					: "Error actualizando estado del servicio"
			);
			// Don't revert isServiceEnabled here, let the user try again
		}
	};

	const handleToggleAIExclusion = async (excludeFromAI: boolean) => {
		if (!service) return;

		try {
			// Solo enviar el campo que se está actualizando
			const updateData = {
				id: service.id,
				isAiExcluded: excludeFromAI,
			};

			const updatedService = await updateService(updateData);
			setService(updatedService);
		} catch (err) {
			setError(
				err instanceof Error
					? err.message
					: "Error actualizando exclusión de IA"
			);
		}
	};

	const handleDeleteService = async () => {
		// Use serviceId from URL as fallback if service state is null
		const serviceIdToDelete = service?.id || serviceId;

		if (!serviceIdToDelete) {
			setError("No se pudo encontrar el ID del servicio para eliminar");
			return;
		}

		try {
			await deleteService(serviceIdToDelete);
			// Navigate back to services list after successful deletion (toast is shown by the hook)
			navigate("/catalog/services");
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Error eliminando servicio"
			);
		}
	};

	const handleConfirmDelete = useCallback(async () => {
		try {
			setIsDeleting(true);
			await handleDeleteService();
			setShowDeleteConfirm(false);
		} catch (error) {
			// Handle error if needed
		} finally {
			setIsDeleting(false);
		}
	}, []);

	const handleCancelDelete = useCallback(() => {
		setShowDeleteConfirm(false);
	}, []);

	if (isLoading) {
		return <ViewSkeleton variant="split" className="p-6" />;
	}

	if (error || !service) {
		return (
			<div className="flex flex-col gap-6 p-6">
				<PageHeader
					onBack={handleBack}
					title={t("service_not_found", "Servicio no encontrado")}
				/>

				<CatalogNotFoundError
					title={t("service_not_found", "Servicio no encontrado")}
					description={
						error ||
						t(
							"service_not_found_description",
							"El servicio que buscas no existe o ha sido eliminado."
						)
					}
					buttonText={t("button_back_to_services", "Volver a Servicios")}
					onBack={handleBack}
				/>
			</div>
		);
	}

	return (
		<div className="w-full flex flex-col gap-4">
			{/* Header */}
			<PageHeader
				onBack={handleBack}
				title={service?.name ?? ""}
				metadata={[
					{
						key: "category",
						label:
							service?.category?.name ||
							t("catalog_no_category", "Sin categoría"),
						color: "default",
						variant: "flat",
					},
				]}
				actions={
					<ResponsiveButton
								color="danger"
								variant="light"
								size="sm"
								onPress={() => setShowDeleteConfirm(true)}
								icon="solar:trash-bin-trash-bold"
								text={t("button_delete", "Eliminar")}
							/>
				}
			/>

			<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					{/* Left Column - Basic Information and Price */}
					<div className="space-y-6">
						{/* Basic Information */}
						<Card>
							<CardHeader>
								<div>
									<H2 className="text-lg font-semibold text-default-900">
										{t("service_basic_info", "Información básica")}
									</H2>
									<P className="text-sm text-default-500 mt-1">
										{t(
											"service_basic_info_description",
											"Gestiona y actualiza la información principal de tu servicio"
										)}
									</P>
								</div>
							</CardHeader>
							<CardBody className="space-y-4">
								{/* Service Name */}
								<Controller
									name="name"
									control={control}
									rules={{
										required: t(
											"validation_name_required",
											"El nombre del servicio es requerido"
										),
										validate: (value: string) => {
											const trimmedValue = value.trim();
											if (trimmedValue.length < 2) {
												return t(
													"validation_name_min_length",
													"El nombre debe tener al menos 2 caracteres"
												);
											}
											if (trimmedValue.length > 100) {
												return t(
													"validation_name_max_length",
													"El nombre no puede exceder 100 caracteres"
												);
											}
											return true;
										},
									}}
									render={({ field }) => (
										<Input
											{...field}
											label={t("catalog_name", "Nombre")}
											placeholder={t("service_name_placeholder", "Ej: Corte de cabello")}
											isRequired
											isInvalid={!!errors.name}
											errorMessage={errors.name?.message}
											onBlur={() => {
												field.onBlur();
												trigger("name");
											}}
										/>
									)}
								/>

								{/* Service Category */}
								<Controller
									name="categoryId"
									control={control}
									rules={{
										required: t(
											"validation_category_required",
											"La categoría es requerida"
										),
									}}
									render={({ field }) => (
										<CategorySelector
											value={field.value}
											onChange={field.onChange}
											// onCreateCategory={handleCreateCategory}
											type={EnumCatalogType.Service}
											label={t("catalog_category", "Categoría")}
											placeholder={t(
												"service_category_placeholder",
												"Selecciona una categoría"
											)}
											isRequired={true}
											isInvalid={!!errors.categoryId}
											errorMessage={errors.categoryId?.message}
										/>
									)}
								/>

								{/* Notes */}
								<Controller
									name="description"
									control={control}
									rules={{
										required: t(
											"validation_description_required",
											"La descripción es requerida"
										),
										validate: (value) => {
											if (!value || value.trim().length === 0) {
												return t(
													"validation_description_not_empty",
													"La descripción no puede estar vacía"
												);
											}
											return true;
										},
									}}
									render={({ field }) => (
										<div>
											<Textarea
												{...field}
												label={t("service_description_label", "Descripción")}
												placeholder={t("service_description_placeholder", "Describe las características del servicio...")}
												isRequired
												minRows={4}
												maxRows={8}
												isInvalid={!!errors.description}
												errorMessage={errors.description?.message}
												onBlur={() => {
													field.onBlur();
													trigger("description");
												}}
											/>
											<P className="text-xs text-default-500 mt-1">
												{t(
													"service_notes_help",
													"Esta descripción ayuda a Linda a dar mejores respuestas"
												)}
											</P>
										</div>
									)}
								/>

								{/* Reservation Link */}
								<div className="mt-2">
									<Controller
										name="externalUrl"
										control={control}
										render={({ field }) => (
											<Input
												{...field}
												label={t("service_reservation_link_label", "Link de reserva")}
												placeholder="https://..."
												startContent={
													<IconComponent icon="solar:link-outline" size="sm" />
												}
											/>
										)}
									/>
								</div>

								{/* Service Price */}
								<div>
									<Controller
										name="price"
										control={control}
										rules={{
											required: t(
												"validation_price_required",
												"El precio es requerido"
											),
											min: {
												value: 0,
												message: t(
													"validation_price_min",
													"El precio debe ser mayor o igual a 0"
												),
											},
										}}
										render={({ field }) => (
											<div>
												<Input
													{...field}
													value={field.value?.toString() || ""}
													type="number"
													label={t("catalog_price", "Precio")}
													placeholder="COP"
													isRequired
													isInvalid={!!errors.price}
													errorMessage={errors.price?.message}
													onChange={(
														e: React.ChangeEvent<HTMLInputElement>
													) => {
														const value = e.target.value;
														field.onChange(value ? Number(value) : "");
													}}
												/>
												<P className="text-xs text-default-500 mt-1">
													{t(
														"price_includes_taxes",
														"Incluye todos los impuestos"
													)}
												</P>
											</div>
										)}
									/>
								</div>

								{/* Service Duration with Type Selector */}
								<Controller
									name="durationValue"
									control={control}
									rules={{
										min: {
											value: 0,
											message: t(
												"validation_duration_min",
												"La duración debe ser mayor o igual a 0"
											),
										},
										max: {
											value: DURATION_MAX_VALUES[durationType],
											message: t(
												"validation_duration_max",
												`La duración no puede exceder ${DURATION_MAX_VALUES[durationType]} ${durationType === EnumDurationType.HOURS ? "horas" : "minutos"}`
											),
										},
										validate: (value: number) => {
											const maxValue = DURATION_MAX_VALUES[durationType];
											if (value > maxValue) {
												return t(
													"validation_duration_max",
													`La duración no puede exceder ${maxValue} ${durationType === EnumDurationType.HOURS ? "horas" : "minutos"}`
												);
											}
											return true;
										},
									}}
									render={({ field: valueField }) => (
										<Controller
											name="durationType"
											control={control}
											render={({ field: typeField }) => (
												<DurationSelector
													durationValue={valueField.value}
													durationType={
														typeField.value || EnumDurationType.MINUTES
													}
													onDurationValueChange={valueField.onChange}
													onDurationTypeChange={typeField.onChange}
													label={t("catalog_duration", "Duración")}
													isInvalid={!!errors.durationValue}
													errorMessage={errors.durationValue?.message}
												/>
											)}
										/>
									)}
								/>
								{/* Save Button */}
								<div className="pt-6">
									<Button
										type="submit"
										color="primary"
										className="w-full"
									isLoading={isSaving}
									isDisabled={!isDirty || Object.keys(errors).length > 0}
									>
										{t("button_save", "Guardar")}
									</Button>
								</div>
							</CardBody>
						</Card>

						{/* Service Actions */}
						<Card>
							<CardHeader>
								<div>
									<H2 className="text-lg font-semibold text-default-900">
										{t("service_actions_title", "Opciones de servicio")}
									</H2>
									<P className="text-sm text-default-500 mt-1">
										{t(
											"service_actions_description",
											"Gestiona la configuración avanzada de tu servicio"
										)}
									</P>
								</div>
							</CardHeader>
							<CardBody className="space-y-6">
								{/* Status Toggle */}
								<div className="flex items-center justify-between p-4 rounded-lg border border-default-200">
									<div className="flex-1 pr-4">
										<P className="font-medium">
											{t(
												"service_toggle_status",
												"Activar/Desactivar servicio"
											)}
										</P>
										<P className="text-sm text-default-500">
											{t(
												"service_toggle_status_description",
												"Controla la visibilidad del servicio en tu catálogo."
											)}
										</P>
									</div>
									<div className="flex items-center gap-2 flex-shrink-0">
										<Switch
											isSelected={isServiceEnabled}
											onValueChange={handleToggleServiceStatus}
											color="success"
										/>
									</div>
								</div>

								<Divider />

								{/* AI Exclusion Toggle */}
								<div className="flex items-center justify-between p-4 rounded-lg border border-default-200">
									<div className="flex-1 pr-4">
										<P className="font-medium">
											{t("service_exclude_ai", "Excluir de IA")}
										</P>
										<P className="text-sm text-default-500">
											{t(
												"service_exclude_ai_description",
												"Evita que este servicio sea considerado en recomendaciones o análisis de IA."
											)}
										</P>
									</div>
									<div className="flex items-center gap-2 flex-shrink-0">
										<Switch
											isSelected={
												(service?.metadata?.excludeFromAI as boolean) ?? false
											}
											onValueChange={handleToggleAIExclusion}
											color="secondary"
										/>
									</div>
								</div>

								</CardBody>
						</Card>
					</div>

					{/* Right Column - Photos and PDF */}
					<div className="space-y-6">
						{/* Service Photos */}
						<Card className="h-fit">
							<CardHeader>
								<div>
									<H2 className="text-lg font-semibold text-default-900">
										{t("service_photos", "Fotos de servicio")}
									</H2>
									<P className="text-sm text-default-500 mt-1">
										{t(
											"service_photos_description",
											"Selecciona las imágenes de tu servicio"
										)}
									</P>
								</div>
							</CardHeader>
							<CardBody>
								<ImagesManager
									existingAssets={serviceAssets.filter(
										(asset: any) => asset.info?.isImage === true
									)}
									newImages={newImageFiles}
									onImagesUpload={handleImageUpload}
									onImageRemove={handleImageRemove}
									size="small"
									imageMode={imageMode}
									onImageModeChange={setImageMode}
									maxImages={5}
									isLoading={isUploadingImages}
									onUploadToFilestack={handleUploadToFilestack}
									hasNewImages={newImageFiles.length > 0}
								/>
							</CardBody>
						</Card>

						{/* Service PDF */}
						<Card className="h-fit">
							<CardHeader>
								<div>
									<H2 className="text-lg font-semibold text-default-900">
										{t("service_pdf_documents", "Documentos PDF")}
									</H2>
									<P className="text-sm text-default-500 mt-1">
										{t(
											"service_pdf_description",
											"Sube documentos relacionados al servicio (catálogos, manuales, etc.)"
										)}
									</P>
								</div>
							</CardHeader>
							<CardBody>
								<PdfUploadEnhanced
									onFileUpload={handlePdfUpload}
									onFileRemove={handlePdfRemove}
									onDeleteSuccess={handlePdfDeleteSuccess}
									currentPdfUrl={pdfUrl || undefined}
									currentPdfName={pdfName || undefined}
									maxFileSize={10}
									isLoading={isSaving}
									entityId={serviceId}
									resourceType="service"
								/>
							</CardBody>
						</Card>
					</div>
				</div>
			</form>

			{error && (
				<div className="p-4 bg-danger-50 border border-danger-200 rounded-lg">
					<P className="text-danger-700">{error}</P>
				</div>
			)}

			{/* Delete Confirmation Modal */}
			{service && (
				<ConfirmDeleteModal
					isOpen={showDeleteConfirm}
					onClose={() => {
						handleCancelDelete();
					}}
					onConfirm={() => {
						if (!service) {
							setError("Error: El servicio no está disponible");
							return;
						}
						handleConfirmDelete();
					}}
					title={t("service_delete_confirm_title", "¿Eliminar servicio?")}
					description={t(
						"service_delete_confirm_description",
						"Esta acción no se puede deshacer. ¿Estás seguro de que deseas eliminar este servicio?"
					)}
					itemName={`${service.name} - ${service.category?.name || t("catalog_no_category", "Sin categoría")}`}
					isLoading={isDeleting}
				/>
			)}
		</div>
	);
};

const ServiceDetailPage: FC = () => {
	return (
		<CategoryDropdownProvider>
			<ServiceDetailPageContent />
		</CategoryDropdownProvider>
	);
};

export default ServiceDetailPage;
