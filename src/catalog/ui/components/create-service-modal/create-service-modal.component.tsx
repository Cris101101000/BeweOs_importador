import {
	Button,
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
import { useCallback } from "react";
import { Controller } from "react-hook-form";
import { EnumCatalogType } from "../../../domain/enums/catalog-type.enum";
import { EnumDurationType } from "../../../domain/enums/duration-type.enum";
import type { IServiceInitialData } from "../../../domain/interfaces/catalog-initial-data.interface";
import type { ICreateCatalogItemRequest } from "../../../domain/interfaces/catalog.interface";
import { catalogCategoriesMock } from "../../../infrastructure/mocks/catalog-response.mock";
import {
	CategoryDropdownProvider,
	CategorySelector,
	useCategoryDropdownContext,
} from "../category-selector";
import { DurationSelector } from "../duration-selector";
import { useCreateServiceForm } from "./hooks/use-create-service-form.hook";

export interface CreateServiceModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSave: (data: ICreateCatalogItemRequest) => Promise<void>;
	isLoading?: boolean;
	initialData?: IServiceInitialData | null;
}

const CreateServiceModalContent: FC<CreateServiceModalProps> = ({
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
		trigger,
		watch,
	} = useCreateServiceForm({
		isOpen,
		onSubmit: onSave,
		initialData,
	});

	// Watch durationType to pass to DurationSelector
	const durationType = watch("durationType");

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
							<h2 className="text-xl font-semibold text-default-900">
								{t("create_service_modal_title", "Crear Nuevo Servicio")}
							</h2>
							<P className="text-small text-default-500 font-normal mt-1">
								{t(
									"create_service_modal_description",
									"Complete la información del servicio que desea agregar al catálogo."
								)}
							</P>
						</ModalHeader>
						<ModalBody
							className={isAnyDropdownOpen ? "p-6 pt-4" : "px-6 pt-4 pb-8"}
						>
							<form className="flex flex-col gap-4" noValidate>
								{/* Service Name */}
								<Controller
									name="name"
									control={control}
									render={({ field }) => (
										<Input
											{...field}
											label={t("service_name_label", "Nombre del Servicio")}
											placeholder={t(
												"service_name_placeholder",
												"Ej: Corte masculino clásico"
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
											label={t("service_description_label", "Descripción")}
											placeholder={t(
												"service_description_placeholder",
												"Describe los detalles del servicio..."
											)}
											isRequired
											minRows={3}
											maxRows={5}
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
												label={t("service_price_label", "Precio")}
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
											<p className="text-xs text-default-500 mt-1">
												{t(
													"price_includes_taxes",
													"Incluye todos los impuestos"
												)}
											</p>
										</div>
									)}
								/>

								{/* Duration with Type Selector */}
								<Controller
									name="durationValue"
									control={control}
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
													onDurationValueChange={(value) => {
														valueField.onChange(value);
														trigger("durationValue");
													}}
													onDurationTypeChange={(type) => {
														typeField.onChange(type);
														trigger("durationValue");
													}}
													label={t("service_duration_label", "Duración")}
													isInvalid={!!errors.durationValue}
													errorMessage={errors.durationValue?.message}
												/>
											)}
										/>
									)}
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
											onCreateCategory={handleCreateCategory}
											type={EnumCatalogType.Service}
											label={t("service_category_label", "Categoría")}
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
								{t("button_create_service", "Crear Servicio")}
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	);
};

export const CreateServiceModal: FC<CreateServiceModalProps> = (props) => {
	return (
		<CategoryDropdownProvider>
			<CreateServiceModalContent {...props} />
		</CategoryDropdownProvider>
	);
};

export default CreateServiceModal;
