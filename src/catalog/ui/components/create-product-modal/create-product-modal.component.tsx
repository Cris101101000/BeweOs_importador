import {
	Button,
	H2,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	P,
	Textarea,
} from "@beweco/aurora-ui";
import { useTranslate } from "@tolgee/react";
import type { FC } from "react";
import { useCallback } from "react"; //useMemo, useState
import { Controller } from "react-hook-form";
import { EnumCatalogType } from "../../../domain/enums/catalog-type.enum";
import type { EnumMeasureUnit } from "../../../domain/enums/measure-unit.enum";
import type { IProductInitialData } from "../../../domain/interfaces/catalog-initial-data.interface";
import type { ICreateCatalogItemRequest } from "../../../domain/interfaces/catalog.interface";
// catalogCategoriesMock - removed, not used for now
import {
	CategoryDropdownProvider,
	CategorySelector,
	useCategoryDropdownContext,
} from "../category-selector";
import { UnitQuantitySelector } from "../unit-quantity-selector";
import { useCreateProductForm } from "./hooks/use-create-product-form.hook";

export interface CreateProductModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSave: (data: ICreateCatalogItemRequest) => Promise<void>;
	isLoading?: boolean;
	initialData?: IProductInitialData | null;
}

const CreateProductModalContent: FC<CreateProductModalProps> = ({
	isOpen,
	onClose,
	onSave,
	isLoading = false,
	initialData,
}) => {
	const { isAnyDropdownOpen } = useCategoryDropdownContext();
	const { t } = useTranslate();

	const {
		control,
		formState: { errors, isValid },
		handleSubmit,
		reset,
		watch,
		setValue,
		trigger,
	} = useCreateProductForm({
		isOpen,
		onSubmit: onSave,
		initialData,
	});

	//TODO: Implement version 1.5 brands support CRUD
	//TODO: Implement category creation functionality
	// // Function to handle brand creation for CategorySelector
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

	// // State for brands
	// const [brands, setBrands] = useState(catalogBrandsMock);

	// // Create brands as categories for CategorySelector
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

	const handleSave = useCallback(() => {
		handleSubmit();
	}, [handleSubmit]);

	const handleClose = useCallback(() => {
		reset();
		onClose();
	}, [reset, onClose]);

	return (
		<Modal
			isOpen={isOpen}
			onClose={handleClose}
			size="2xl"
			placement="center"
			isDismissable={false}
			hideCloseButton={false}
			scrollBehavior="inside"
			classNames={{
				base: isAnyDropdownOpen ? "min-h-[600px] max-h-[80vh]" : "max-h-[80vh]",
				body: isAnyDropdownOpen
					? "overflow-visible py-8"
					: "overflow-auto py-0",
				footer: "pt-0 pb-4 px-6",
			}}
		>
			<ModalContent>
				{() => (
					<>
						<ModalHeader className="flex flex-col p-6 pb-0">
							<H2 className="text-xl font-semibold text-default-900">
								{t("create_product_modal_title", "Crear Nuevo Producto")}
							</H2>
							<P className="text-small text-default-500 font-normal mt-1">
								{t(
									"create_product_modal_description",
									"Complete la información del producto que desea agregar al catálogo."
								)}
							</P>
						</ModalHeader>
						<ModalBody
							className={isAnyDropdownOpen ? "p-6 pt-4" : "px-6 pt-4 pb-8"}
						>
							<form className="flex flex-col gap-4" noValidate>
								{/* Product Name */}
								<Controller
									name="name"
									control={control}
									render={({ field }) => (
										<Input
											{...field}
											label={t("product_name_label", "Nombre del Producto")}
											placeholder={t(
												"product_name_placeholder",
												"Ej: Shampoo Premium"
											)}
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

								{/* Description */}
								<Controller
									name="description"
									control={control}
									render={({ field }) => (
										<Textarea
											{...field}
											label={t("product_description_label", "Descripción")}
											placeholder={t(
												"product_description_placeholder",
												"Describe las características del producto..."
											)}
											minRows={3}
											maxRows={5}
											isRequired
											isInvalid={!!errors.description}
											errorMessage={errors.description?.message}
											onBlur={() => {
												field.onBlur();
												trigger("description");
											}}
										/>
									)}
								/>

								{/* Price */}
								<Controller
									name="price"
									control={control}
									render={({ field }) => (
										<div>
											<Input
												{...field}
												type="number"
												label={t("product_price_label", "Precio")}
												placeholder="0"
												startContent={
													<div className="pointer-events-none flex items-center">
														<span className="text-default-400 text-small">
															$
														</span>
													</div>
												}
												isRequired
												isInvalid={!!errors.price}
												errorMessage={errors.price?.message}
												onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
													const value = e.target.value;
													field.onChange(value ? Number(value) : "");
												}}
												onBlur={() => {
													field.onBlur();
													trigger("price");
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

								{/* Unit and Quantity */}
								<UnitQuantitySelector
									unitValue={watch("unit")}
									quantityValue={watch("quantity")}
									onUnitChange={(unit) => {
										setValue("unit", unit as EnumMeasureUnit, {
											shouldDirty: true,
										});
										trigger("unit");
										trigger("quantity");
									}}
									onQuantityChange={(quantity) => {
										setValue("quantity", quantity, { shouldDirty: true });
										trigger("quantity");
									}}
									label={t("product_unit_quantity_label", "Medida y unidad")}
									description={t(
										"product_unit_quantity_description",
										"Escribe el número y selecciona la unidad correspondiente"
									)}
									isInvalid={!!(errors.unit || errors.quantity)}
									errorMessage={
										errors.unit?.message || errors.quantity?.message
									}
								/>

								{/* Category */}
								<Controller
									name="categoryId"
									control={control}
									render={({ field }) => (
										<CategorySelector
											value={field.value}
											onChange={(categoryId) => {
												field.onChange(categoryId);
												trigger("categoryId");
											}}
											type={EnumCatalogType.Product}
											label={t("product_category_label", "Categoría")}
											placeholder={t(
												"select_category",
												"Seleccionar categoría"
											)}
											isRequired
											isInvalid={!!errors.categoryId}
											errorMessage={errors.categoryId?.message}
										/>
									)}
								/>

								{/* Brand TODO: Implement version 1.5*/}
								{/* <Controller
									name="brand"
									control={control}
									render={({ field }) => (
										<CategorySelector
											value={field.value}
											onChange={(brand) => {
												field.onChange(brand);
												trigger("brand");
											}}
											onCreateCategory={handleCreateBrandCategory}
											type={EnumCatalogType.Product}
											categories={brandCategories}
											label={t("product_brand_label", "Marca")}
											placeholder={t(
												"product_brand_placeholder",
												"Selecciona una marca"
											)}
											isRequired
											isInvalid={!!errors.brand}
											errorMessage={errors.brand?.message}
										/>
									)}
								/> */}
							</form>
						</ModalBody>
						<ModalFooter className="flex px-6 pb-4 pt-0 gap-3">
							<Button
								color="default"
								variant="flat"
								onPress={handleClose}
								className="flex-1"
								isDisabled={isLoading}
							>
								{t("button_cancel", "Cancelar")}
							</Button>
							<Button
								color="primary"
								onPress={handleSave}
								isDisabled={!isValid || isLoading}
								className="flex-1"
								isLoading={isLoading}
							>
								{t("button_create_product", "Crear Producto")}
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	);
};

export const CreateProductModal: FC<CreateProductModalProps> = (props) => {
	return (
		<CategoryDropdownProvider>
			<CreateProductModalContent {...props} />
		</CategoryDropdownProvider>
	);
};

export default CreateProductModal;
