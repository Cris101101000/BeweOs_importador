import {
	Button,
	Card,
	CardBody,
	CardHeader,
	Divider,
	H2,
	IconComponent,
	Input,
	// Modal,
	// ModalBody,
	// ModalContent,
	// ModalFooter,
	// ModalHeader,
	IconComponent,
	P,
	Switch,
	Textarea
} from "@beweco/aurora-ui";
import { useAuraToast } from "@beweco/aurora-ui";
import { EnumErrorType } from "@shared/domain/enums/enum-error-type.enum";
import {
	configureErrorToastWithTranslation,
	configureSuccessToast,
} from "@shared/utils/toast-config.utils";
import { useTranslate } from "@tolgee/react";
import type { FC } from "react";
import { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { ConfirmDeleteModal } from "@shared/ui/components/confirm-delete-modal/confirm-delete-modal";
import { PageHeader } from "@shared/ui/components/page-header";
import { ResponsiveButton } from "@shared/ui/components/responsive-button";
import type { IAsset } from "../../../shared/domain/interfaces/asset.interface";
import { ImagesManager } from "../../../shared/ui/components";
import { useSession } from "../../../shared/ui/contexts/session-context/session-context";
import { useAssetUpload } from "../../../shared/ui/hooks/use-asset-upload.hook";
import { useAssetsQuery } from "../../../shared/ui/hooks/use-assets-query.hook";
import { GetCatalogItemByIdUseCase } from "../../application/get-catalog-item-by-id.usecase";
import { UploadCatalogFileUseCase } from "../../application/upload-catalog-file.usecase";
import { EnumCatalogStatus } from "../../domain/enums/catalog-status.enum";
import { EnumCatalogType } from "../../domain/enums/catalog-type.enum";
import type { ICatalogItem } from "../../domain/interfaces/catalog.interface";
// import { EnumProductType } from "../../domain/enums/product-type.enum";
import { CatalogAdapter } from "../../infrastructure/adapters/catalog.adapter";
import {
	// catalogBrandsMock,
	catalogCategoriesMock,
} from "../../infrastructure/mocks/catalog-response.mock";
import { ViewSkeleton } from "@shared/ui/components/view-skeleton";
import {
	CategoryDropdownProvider,
	CategorySelector,
} from "../components/category-selector";
import { CatalogNotFoundError } from "../components/catalog-not-found-error";
import { PdfUploadEnhanced } from "../components/pdf-upload-enhanced";
import { UnitQuantitySelector } from "../components/unit-quantity-selector";
import { useProductActions } from "../hooks/use-product-actions.hook";
interface ProductFormData {
	name: string;
	categoryId: string;
	brand: string;
	description: string;
	price: number;
	unit: string;
	quantity: number;
	status: EnumCatalogStatus;
	purchaseLink: string;
}

const ProductDetailPageContent: FC = () => {
	const { t } = useTranslate();
	const { showToast } = useAuraToast();
	const navigate = useNavigate();
	const { productId } = useParams<{ productId: string }>();
	const { agency } = useSession();
	const [product, setProduct] = useState<ICatalogItem | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [isProductEnabled, setIsProductEnabled] = useState(true);
	const [pdfUrl, setPdfUrl] = useState<string | null>(null);
	const [pdfName, setPdfName] = useState<string | null>(null);
	const [isCreateBrandModalOpen, setIsCreateBrandModalOpen] = useState(false);
	// const [brands, setBrands] = useState(catalogBrandsMock);
	const [newBrandName, setNewBrandName] = useState("");
	const [isCreatingBrand, setIsCreatingBrand] = useState(false);
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

	// Use product actions hook for CRUD operations with toast notifications
	const { updateProduct, deleteProduct } = useProductActions();

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
		watch,
		setValue,
		trigger,
		formState: { errors, isDirty },
	} = useForm<ProductFormData>({
		defaultValues: {
			name: "",
			categoryId: "",
			brand: "",
			description: "",
			price: 0,
			unit: "",
			quantity: 0,
			status: EnumCatalogStatus.Active,
			purchaseLink: "",
		},
	});

	const currentUnit = watch("unit");

	useEffect(() => {
		trigger("quantity");
	}, [currentUnit, trigger]);

	// Create brands as categories for CategorySelector
	// const brandCategories = useMemo(() => {
	// 	return brands
	// 		.filter((brand) => brand.isActive)
	// 		.map((brand) => ({
	// 			id: brand.name, // Use name as ID for brands
	// 			name: brand.name,
	// 			description: brand.description,
	// 			color: "#6B7280",
	// 			type: EnumCatalogType.Product, // Use Product type for brands
	// 			createdAt: brand.createdAt,
	// 			updatedAt: new Date(),
	// 		}));
	// }, [brands]);

	// Use generic assets query hook
	const {
		assets: productAssets,
		refetch: refetchAssets,
		deleteAsset: deleteProductAsset,
	} = useAssetsQuery({
		resourceType: "product",
		entityId: productId || "",
		autoLoad: false, // Load manually after product is loaded
	});

	// Load product data and assets
	useEffect(() => {
		const loadProduct = async () => {
			if (!productId) {
				setError(t("product_not_found", "Producto no encontrado"));
				setIsLoading(false);
				return;
			}

			try {
				setIsLoading(true);
				setError(null);

				// Get product directly by ID
				const foundProduct = await getCatalogItemByIdUseCase.execute(productId);
	
				if (foundProduct) {
					setProduct(foundProduct);
					setIsProductEnabled(foundProduct.status === EnumCatalogStatus.Active);

					// Set PDF data if exists (backward compatibility)
					if (foundProduct.pdfUrl && foundProduct.pdfName) {
						setPdfUrl(foundProduct.pdfUrl);
						setPdfName(foundProduct.pdfName);
					}

					// Load assets from generic endpoint
					await refetchAssets();

					// Populate form with product data
					reset({
						name: foundProduct.name,
						categoryId: foundProduct.categoryId,
						brand: foundProduct.metadata?.brand?.toString() || "",
						description: foundProduct.description || "",
						price: foundProduct.price,
						unit: foundProduct.metadata?.measureUnit?.toString() || "",
						quantity: foundProduct.metadata?.measureValue
							? Number(foundProduct.metadata.measureValue)
							: 0,
						status: foundProduct.status,
						purchaseLink: foundProduct.externalPurchaseUrl || "",
					});
				} else {
					setError(t("product_not_found", "Producto no encontrado"));
				}
			} catch (err) {
				setError(
					err instanceof Error ? err.message : "Error cargando producto"
				);
			} finally {
				setIsLoading(false);
			}
		};

		loadProduct();
	}, [productId, t, reset, refetchAssets]);

	// Update existingImages when productAssets change
	useEffect(() => {
		if (productAssets.length > 0) {
			// Filter only images (isImage: true)
			const imageAssets = productAssets.filter(
				(asset: any) => asset.info?.isImage === true
			);
			const imageUrls = imageAssets
				.map((asset: any) => asset.storage?.publicUrl)
				.filter(Boolean);

			if (imageUrls.length > 0) {
				setExistingImages(imageUrls as string[]);
			}
		}
	}, [productAssets]);

	const handleBack = useCallback(() => {
		navigate("/catalog/products");
	}, [navigate]);

	// Product Actions Modal Handlers
	const handleToggleStatus = useCallback(
		async (isActive: boolean) => {
			if (!product) return;

			try {
				// Solo enviar el campo que se está actualizando
				const updateData = {
					id: product.id,
					status: isActive
						? EnumCatalogStatus.Active
						: EnumCatalogStatus.Inactive,
				};

				const updatedProduct = await updateProduct(updateData);
				setProduct(updatedProduct);
				setIsProductEnabled(isActive);
			} catch (err) {
				setError(
					err instanceof Error
						? err.message
						: "Error actualizando estado del producto"
				);
			}
		},
		[product, updateProduct, isProductEnabled]
	);

	// const handleDuplicate = useCallback(async () => {
	// 	if (!product) return;

	// 	try {
	// 		const duplicatedProduct = {
	// 			...product,
	// 			id: `prd_${Date.now()}`, // Generate new ID
	// 			name: `${product.name} (Copia)`,
	// 			createdAt: new Date(),
	// 			updatedAt: new Date(),
	// 		};

	// 		// In a real app, this would be a create operation
	// 		console.log("Duplicating product:", duplicatedProduct);
	// 		// await createCatalogItemUseCase.execute(duplicatedProduct);

	// 		// Show success message
	// 		// Optionally navigate to the new product or show a success message
	// 	} catch (err) {
	// 		setError(
	// 			err instanceof Error ? err.message : "Error duplicando producto"
	// 		);
	// 	}
	// }, [product]);

	// const handleToggleProductType = useCallback(
	// 	async (productType: EnumProductType) => {
	// 		if (!product) return;

	// 		try {
	// 			// Solo enviar el campo que se está actualizando
	// 			const updateData = {
	// 				id: product.id,
	// 				metadata: {
	// 					...product.metadata,
	// 					productType,
	// 				},
	// 			};

	// 			const updatedProduct = await updateProduct(updateData);
	// 			setProduct(updatedProduct);
	// 		} catch (err) {
	// 			setError(
	// 				err instanceof Error
	// 					? err.message
	// 					: "Error actualizando tipo de producto"
	// 			);
	// 		}
	// 	},
	// 	[product, updateProduct]
	// );

	const handleToggleAIExclusion = useCallback(
		async (excludeFromAI: boolean) => {
			if (!product) return;

			try {
				// Solo enviar el campo que se está actualizando
				const updateData = {
					id: product.id,
					isAiExcluded: excludeFromAI,
				};

				const updatedProduct = await updateProduct(updateData);
				setProduct(updatedProduct);
			} catch (err) {
				setError(
					err instanceof Error
						? err.message
						: "Error actualizando exclusión de IA"
				);
			}
		},
		[product, updateProduct]
	);

	const handleDelete = useCallback(async () => {
		if (!product) return;

		try {
			await deleteProduct(product.id);
			// Navigate back to products list after successful deletion (toast is shown by the hook)
			navigate("/catalog/products");
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Error eliminando producto"
			);
		}
	}, [product, deleteProduct, navigate]);

	const handlePdfUpload = useCallback(
		async (file: File) => {
			try {
				setIsSaving(true);
				setError(null);

				// Upload the file with entityId (product ID)
				const entityId = product?.id || "";
				if (!entityId) {
					throw new Error("Product ID is required for file upload");
				}
				await uploadCatalogFileUseCase.execute(file, entityId);

				// No actualizar pdfUrl y pdfName para que no se muestre el componente
				// El documento aparecerá en la lista de documentos relacionados
			} catch (err) {
				console.error("Error uploading PDF:", err);
				setError(
					err instanceof Error ? err.message : "Error al subir el archivo PDF"
				);
				throw err; // Re-lanzar el error para que el componente lo maneje
			} finally {
				setIsSaving(false);
			}
		},
		[product, uploadCatalogFileUseCase]
	);

	const handlePdfUploadSuccess = useCallback(() => {
		showToast(
			configureSuccessToast(
				t("pdf_upload_success", "Documento cargado exitosamente")
			)
		);
	}, [showToast, t]);

	const handlePdfDeleteSuccess = useCallback(() => {
		showToast(
			configureSuccessToast(
				t("pdf_delete_success", "Documento eliminado exitosamente")
			)
		);
	}, [showToast, t]);

	const handlePdfRemove = useCallback(() => {
		setPdfName(null);
		if (pdfUrl) {
			URL.revokeObjectURL(pdfUrl);
			setPdfUrl(null);
		}
	}, [pdfUrl]);

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
					await deleteProductAsset(assetId);

					// Show success toast
					showToast(
						configureSuccessToast(
							t("product_image_deleted_success", "Imagen eliminada"),
							t(
								"product_image_deleted_description",
								"La imagen se ha eliminado correctamente"
							)
						)
					);

					// Refetch assets to update the list
					await refetchAssets();
				} catch (error) {
					console.error("Error deleting product image:", error);

					// Determine error type based on error message
					let errorType = EnumErrorType.Critical;
					let errorMessage = "product_image_delete_error";
					let errorDescription = "product_image_delete_error_description";

					if (error instanceof Error) {
						const errorMsg = error.message.toLowerCase();

						// Check if it's a permission error
						if (
							errorMsg.includes("permission") ||
							errorMsg.includes("access") ||
							errorMsg.includes("storage.objects.delete")
						) {
							errorType = EnumErrorType.Permission;
							errorMessage = "product_image_delete_permission_error";
							errorDescription =
								"product_image_delete_permission_error_description";
						}
						// Check if it's a network error
						else if (
							errorMsg.includes("network") ||
							errorMsg.includes("failed to fetch")
						) {
							errorType = EnumErrorType.Network;
							errorMessage = "product_image_delete_network_error";
							errorDescription =
								"product_image_delete_network_error_description";
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
		[deleteProductAsset, refetchAssets, showToast, t]
	);

	// Handler to upload images to Filestack and register as assets in backend
	const handleUploadToFilestack = useCallback(async () => {
		if (newImageFiles.length === 0 || !product || !agency?.id) return;

		try {
			setIsUploadingImages(true);
			setError(null);

			// Upload to Filestack AND register in backend using createAssets
			await uploadAssets(newImageFiles, {
				agencyId: agency.id,
				path: `product/${product.id}/`,
				contexts: ["image"],
				ownerType: "company",
				isPublic: true,
				entityType: EnumCatalogType.Product,
				entityId: product.id,
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
	}, [newImageFiles, product, agency, uploadAssets, imageMode, refetchAssets]);

	const handleCloseBrandModal = useCallback(() => {
		setIsCreateBrandModalOpen(false);
		setNewBrandName("");
		setIsCreatingBrand(false);
	}, []);

	const handleCreateBrandSubmit = useCallback(async () => {
		if (!newBrandName.trim()) return;

		try {
			setIsCreatingBrand(true);

			// Simulate API call delay
			await new Promise((resolve) => setTimeout(resolve, 500));

			// const newBrand = {
			// 	id: `brand_${Date.now()}`,
			// 	name: newBrandName.trim(),
			// 	description: `Marca ${newBrandName.trim()}`,
			// 	isActive: true,
			// 	createdAt: new Date(),
			// };

			// setBrands((prev) => [...prev, newBrand]);

			// Auto-select the new brand
			setValue("brand", newBrandName.trim(), { shouldDirty: true });

			handleCloseBrandModal();
		} catch (error) {
			setError(error instanceof Error ? error.message : "Error creando marca");
		} finally {
			setIsCreatingBrand(false);
		}
	}, [newBrandName, control, handleCloseBrandModal]);

	// Function to handle category creation
	const handleCreateCategory = useCallback(
		async (categoryName: string, type: EnumCatalogType): Promise<string> => {
			// Simulate API call to create category
			const newCategory = {
				id: categoryName.toLowerCase().replace(/\s+/g, "_"),
				name: categoryName,
				description: `Categoría creada automáticamente: ${categoryName}`,
				color: "#6B7280",
				type,
				createdAt: new Date(),
				updatedAt: new Date(),
			};

			// Add to mock data (in a real app, this would be an API call)
			catalogCategoriesMock.push(newCategory);

			// Return the new category ID
			return newCategory.id;
		},
		[]
	);

	// Function to handle brand creation for CategorySelector
	// const handleCreateBrandCategory = useCallback(
	// 	async (brandName: string): Promise<string> => {
	// 		// Simulate API call to create brand
	// 		const newBrand = {
	// 			id: `brand_${Date.now()}`,
	// 			name: brandName,
	// 			description: `Marca creada automáticamente: ${brandName}`,
	// 			isActive: true,
	// 			createdAt: new Date(),
	// 		};

	// 		// Add to mock data (in a real app, this would be an API call)
	// 		catalogBrandsMock.push(newBrand);
	// 		setBrands((prev) => [...prev, newBrand]);

	// 		// Return the new brand name (used as ID for brands)
	// 		return newBrand.name;
	// 	},
	// 	[]
	// );

	const onSubmit = async (data: ProductFormData) => {
		if (!product) return;

		try {
			setIsSaving(true);
			setError(null);

			const updatedProduct = {
				id: product.id,
				name: data.name.trim(),
				description: data.description.trim() || undefined,
				price: data.price,
				currency: product.currency,
				categoryId: data.categoryId,
				type: EnumCatalogType.Product,
				status: isProductEnabled
					? EnumCatalogStatus.Active
					: EnumCatalogStatus.Inactive,
				pdfUrl: pdfUrl || undefined,
				pdfName: pdfName || undefined,
				images: existingImages.length > 0 ? existingImages : undefined,
				externalPurchaseUrl: data.purchaseLink.trim(),
				metadata: {
					...product.metadata,
					brand: data.brand.trim() || undefined,
					measureUnit: data.unit.trim() || undefined,
					measureValue: data.quantity || 0,
				},
			};

			await updateProduct(updatedProduct);

			// Navigate back after successful update (toast is shown by the hook)
			navigate("/catalog/products");
		} catch (err) {
			console.error("Error updating product:", err);
		} finally {
			setIsSaving(false);
		}
	};

	const handleConfirmDelete = useCallback(async () => {
		try {
			setIsDeleting(true);
			await handleDelete();
			setShowDeleteConfirm(false);
		} catch (error) {
			// Handle error if needed
		} finally {
			setIsDeleting(false);
		}
	}, [handleDelete]);

	const handleCancelDelete = useCallback(() => {
		setShowDeleteConfirm(false);
	}, []);

	if (isLoading) {
		return <ViewSkeleton variant="split" className="p-6" />;
	}

	if (error || !product) {
		return (
			<div className="flex flex-col gap-6 p-6">
				<PageHeader
					onBack={handleBack}
					title={t("product_not_found", "Producto no encontrado")}
				/>

				<CatalogNotFoundError
					title={t("product_not_found", "Producto no encontrado")}
					description={
						error ||
						t(
							"product_not_found_description",
							"El producto que buscas no existe o ha sido eliminado."
						)
					}
					buttonText={t("button_back_to_products", "Volver a Productos")}
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
				title={product?.name ?? ""}
				metadata={[
					{
						key: "category",
						label:
							product?.category?.name ||
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
										{t("product_basic_info", "Información básica")}
									</H2>
									<P className="text-sm text-default-500 mt-1">
										{t(
											"product_basic_info_description",
											"Gestiona y actualiza la información principal de tu producto"
										)}
									</P>
								</div>
							</CardHeader>
							<CardBody className="space-y-4">
								{/* Product Name */}
								<div>
									<Controller
										name="name"
										control={control}
										rules={{
											required: t(
												"validation_name_required",
												"El nombre del producto es requerido"
											),
											validate: (value: string) => {
												const trimmedValue = value.trim();
												if (trimmedValue.length < 2) {
													return t("validation_name_min_length", {
														min: 2,
														defaultValue: "El nombre debe tener al menos 2 caracteres",
													});
												}
												if (trimmedValue.length > 100) {
													return t("validation_name_max_length", {
														max: 100,
														defaultValue: "El nombre no puede exceder 100 caracteres",
													});
												}
												return true;
											},
										}}
										render={({ field }) => (
											<Input
												{...field}
												label={t("catalog_name", "Nombre")}
												placeholder={t("product_name_placeholder", "Ej: Shampoo Premium")}
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
								</div>

								{/* Product Category */}
								<div>
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
												onCreateCategory={handleCreateCategory}
												type={EnumCatalogType.Product}
												label={t("catalog_category", "Categoría")}
												placeholder={t(
													"product_category_placeholder",
													"Selecciona una categoría"
												)}
												isRequired={true}
												isInvalid={!!errors.categoryId}
												errorMessage={errors.categoryId?.message}
											/>
										)}
									/>
								</div>

								{/* Brand TODO: Implement version 1.5*/}
								{/* <div>
									<Controller
										name="brand"
										control={control}
										rules={{
											required: t(
												"validation_brand_required",
												"La marca es requerida"
											),
										}}
										render={({ field }) => (
											<CategorySelector
												value={field.value}
												onChange={field.onChange}
												onCreateCategory={handleCreateBrandCategory}
												type={EnumCatalogType.Product}
												categories={brandCategories}
												label={t("product_brand_label", "Marca")}
												placeholder={t(
													"product_brand_placeholder",
													"Selecciona una marca"
												)}
												isRequired={true}
												isInvalid={!!errors.brand}
												errorMessage={errors.brand?.message}
											/>
										)}
									/>
								</div> */}

								{/* Description */}
								<div>
									<Controller
										name="description"
										control={control}
										render={({ field }) => (
											<div>
												<Textarea
													{...field}
													label={t(
														"product_description_label",
														"Descripción del producto"
													)}
													placeholder={t("product_description_placeholder", "Describe las características del producto...")}
													isRequired
													minRows={4}
													maxRows={8}
												/>
											</div>
										)}
									/>
								</div>

								{/* Purchase Link */}
								<div>
									<Controller
										name="purchaseLink"
										control={control}
										render={({ field }) => (
											<Input
												{...field}
												label={t("product_purchase_link_label", "Link de compra")}
												placeholder="https://www.mercadolibre.com/... o https://www.amazon.com/..."
												description={t(
													"product_purchase_link_description",
													"Link directo a Mercado Libre, Amazon u otra plataforma"
												)}
												startContent={
													<IconComponent icon="solar:link-outline" size="sm" />
												}
											/>
										)}
									/>
								</div>

								{/* Product Price */}
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

								{/* Unit and Quantity Combined */}
								<div>
									<Controller
										name="quantity"
										control={control}
										rules={{
											min: {
												value: 0,
												message: t(
													"validation_quantity_min",
													"La cantidad debe ser mayor o igual a 0"
												),
											},
											validate: (value: number | undefined) => {
												const unit = watch("unit");
												const unitLower = String(unit || "").toLowerCase();
												console.log("unitLower", unitLower);
												if (unitLower === "units") {
													if (
														value !== undefined &&
														value !== null &&
														!Number.isInteger(value)
													) {
														return t(
															"validation_quantity_must_be_integer",
															"La cantidad debe ser un número entero cuando la unidad es 'unidades'"
														);
													}
												}
												return true;
											},
										}}
										render={() => (
											<UnitQuantitySelector
												unitValue={watch("unit")}
												quantityValue={watch("quantity")}
												onUnitChange={(unit) => {
													setValue("unit", unit, { shouldDirty: true });
													trigger("quantity");
												}}
												onQuantityChange={(quantity) => {
													setValue("quantity", quantity, {
														shouldDirty: true,
													});
													trigger("quantity");
												}}
												label={t(
													"product_unit_quantity_label",
													"Medida y unidad"
												)}
												description={t(
													"product_unit_quantity_description",
													"Escribe el número y selecciona la unidad correspondiente"
												)}
												isInvalid={!!(errors.unit || errors.quantity)}
												errorMessage={
													errors.unit?.message || errors.quantity?.message
												}
											/>
										)}
									/>
								</div>

								{/* Save Button */}
								<div className="pt-4">
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

						{/* Product Actions */}
						<Card>
							<CardHeader>
								<div>
									<H2 className="text-lg font-semibold text-default-900">
										{t("product_actions_title", "Opciones de producto")}
									</H2>
									<P className="text-sm text-default-500 mt-1">
										{t(
											"product_actions_description",
											"Gestiona la configuración avanzada de tu producto"
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
												"product_toggle_status",
												"Activar/Desactivar producto"
											)}
										</P>
										<P className="text-sm text-default-500">
											{t(
												"product_toggle_status_description",
												"Controla la visibilidad del producto en tu catálogo."
											)}
										</P>
									</div>
									<div className="flex items-center gap-2 flex-shrink-0">
										<Switch
											isSelected={product?.status === EnumCatalogStatus.Active}
											onValueChange={handleToggleStatus}
											color="success"
										/>
									</div>
								</div>

								<Divider />

								{/* Product Type Radio Buttons */}
								{/* TODO: Implement version 2 support BACK and definition IA*/}
								{/* <div className="p-4 rounded-lg border border-default-200">
									<div className="mb-4">
										<p className="font-medium">
											{t("product_type", "Tipo de producto")}
										</p>
										<p className="text-sm text-default-500">
											{t(
												"product_type_description",
												"Define si es un producto para la venta o un insumo interno."
											)}
										</p>
									</div>
									<RadioGroup
										value={
											(product?.metadata?.productType as EnumProductType) ||
											EnumProductType.ForSale
										}
										onValueChange={(value) => handleToggleProductType(value as EnumProductType)}
										orientation="horizontal"
										className="gap-12"
									>
										<Radio value={EnumProductType.ForSale}>
											{t("product_type_for_sale", "Para venta")}
										</Radio>
										<Radio value={EnumProductType.Supply}>
											{t("product_type_supply", "Insumo")}
										</Radio>
									</RadioGroup>
								</div> */}

								{/* <Divider /> */}

								{/* AI Exclusion Toggle */}
								<div className="flex items-center justify-between p-4 rounded-lg border border-default-200">
									<div className="flex-1 pr-4">
										<P className="font-medium">
											{t("product_exclude_ai", "Excluir de IA")}
										</P>
										<P className="text-sm text-default-500">
											{t(
												"product_exclude_ai_description",
												"Evita que este producto sea considerado en recomendaciones o análisis de IA."
											)}
										</P>
									</div>
									<div className="flex items-center gap-2 flex-shrink-0">
										<Switch
											isSelected={
												(product?.metadata?.excludeFromAI as boolean) ?? false
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
						{/* Product Photos */}
						<Card className="h-fit">
							<CardHeader>
								<div>
									<H2 className="text-lg font-semibold text-default-900">
										{t("product_photos", "Fotos de producto")}
									</H2>
									<P className="text-sm text-default-500 mt-1">
										{t(
											"product_photos_description",
											"Selecciona las imágenes de tu producto"
										)}
									</P>
								</div>
							</CardHeader>
							<CardBody>
								<ImagesManager
									existingAssets={productAssets.filter(
										(asset: any) => asset.info?.isImage === true
									)}
									size="small"
									newImages={newImageFiles}
									onImagesUpload={handleImageUpload}
									onImageRemove={handleImageRemove}
									imageMode={imageMode}
									onImageModeChange={setImageMode}
									maxImages={5}
									isLoading={isUploadingImages}
									onUploadToFilestack={handleUploadToFilestack}
									hasNewImages={newImageFiles.length > 0}
								/>
							</CardBody>
						</Card>

						{/* Product PDF */}
						<Card className="h-fit">
							<CardHeader>
								<div>
									<H2 className="text-lg font-semibold text-default-900">
										{t("product_pdf_documents", "Documentos PDF")}
									</H2>
									<P className="text-sm text-default-500 mt-1">
										{t(
											"product_pdf_description",
											"Sube documentos relacionados al producto (catálogos, manuales, etc.)"
										)}
									</P>
								</div>
							</CardHeader>
							<CardBody>
								<PdfUploadEnhanced
									onFileUpload={handlePdfUpload}
									onFileRemove={handlePdfRemove}
									onUploadSuccess={handlePdfUploadSuccess}
									onDeleteSuccess={handlePdfDeleteSuccess}
									currentPdfUrl={pdfUrl || undefined}
									currentPdfName={pdfName || undefined}
									maxFileSize={10}
									isLoading={isSaving}
									entityId={productId}
									resourceType="product"
								/>
							</CardBody>
						</Card>
					</div>
				</div>
			</form>

			{/* Create Brand Modal */}
			{/* <Modal
				isOpen={isCreateBrandModalOpen}
				onClose={handleCloseBrandModal}
				size="md"
				isDismissable={false}
			>
				<ModalContent>
					<ModalHeader className="flex flex-col gap-1">
						<H2 className="text-xl font-semibold">
							{t("brand_create_title", "Crear nueva marca")}
						</H2>
						<P className="text-sm text-default-500">
							{t(
								"brand_create_description",
								"Agrega una nueva marca para tus productos"
							)}
						</P>
					</ModalHeader>
					<ModalBody>
						<Input
							label={t("brand_name_label", "Nombre de la marca")}
							placeholder={t(
								"brand_name_placeholder",
								"Ingresa el nombre de la marca"
							)}
							value={newBrandName}
							onValueChange={setNewBrandName}
							variant="bordered"
							isRequired
							autoFocus
							onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
								if (e.key === "Enter" && newBrandName.trim()) {
									handleCreateBrandSubmit();
								}
							}}
						/>
					</ModalBody>
					<ModalFooter>
						<Button
							variant="light"
							onPress={handleCloseBrandModal}
							isDisabled={isCreatingBrand}
						>
							{t("button_cancel", "Cancelar")}
						</Button>
						<Button
							color="primary"
							onPress={handleCreateBrandSubmit}
							isLoading={isCreatingBrand}
							isDisabled={!newBrandName.trim()}
						>
							{t("button_create", "Crear marca")}
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal> */}

			{error && (
				<div className="p-4 bg-danger-50 border border-danger-200 rounded-lg">
					<P className="text-danger-700">{error}</P>
				</div>
			)}

			{/* Delete Confirmation Modal */}
			{product && (
				<ConfirmDeleteModal
					isOpen={showDeleteConfirm}
					onClose={handleCancelDelete}
					onConfirm={handleConfirmDelete}
					title={t("product_delete_confirm_title", "¿Eliminar producto?")}
					description={t(
						"product_delete_confirm_description",
						"Esta acción no se puede deshacer. ¿Estás seguro de que deseas eliminar este producto?"
					)}
					itemName={`${product.name} - ${product.category?.name || t("catalog_no_category", "Sin categoría")}`}
					isLoading={isDeleting}
				/>
			)}
		</div>
	);
};

const ProductDetailPage: FC = () => {
	return (
		<CategoryDropdownProvider>
			<ProductDetailPageContent />
		</CategoryDropdownProvider>
	);
};

export default ProductDetailPage;
