import { useTranslate } from "@tolgee/react";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { EnumCatalogStatus } from "../../../../domain/enums/catalog-status.enum";
import { EnumCatalogType } from "../../../../domain/enums/catalog-type.enum";
import { EnumMeasureUnit } from "../../../../domain/enums/measure-unit.enum";
import type { IProductInitialData } from "../../../../domain/interfaces/catalog-initial-data.interface";
import type { ICreateCatalogItemRequest } from "../../../../domain/interfaces/catalog.interface";

interface CreateProductFormData {
	name: string;
	description?: string;
	price: number;
	unit?: EnumMeasureUnit;
	quantity?: number;
	categoryId: string;
	brand: string;
}

interface UseCreateProductFormProps {
	isOpen: boolean;
	onSubmit: (data: ICreateCatalogItemRequest) => Promise<void>;
	initialData?: IProductInitialData | null;
}

export const useCreateProductForm = ({
	isOpen,
	onSubmit,
	initialData,
}: UseCreateProductFormProps) => {
	const { t } = useTranslate();

	const form = useForm<CreateProductFormData>({
		defaultValues: {
			name: "",
			description: "",
			price: 0,
			unit: EnumMeasureUnit.Unidad,
			quantity: 1,
			categoryId: "",
			brand: "",
		},
		mode: "onChange",
	});

	const { control, handleSubmit, reset, watch, setValue, formState, trigger } =
		form;

	const currentUnit = watch("unit");

	useEffect(() => {
		trigger("quantity");
	}, [currentUnit, trigger]);

	// Reset form when modal opens - use initialData if provided
	useEffect(() => {
		if (isOpen) {
			reset({
				name: initialData?.name || "",
				description: initialData?.description || "",
				price: initialData?.price || 0,
				unit: EnumMeasureUnit.Unidad,
				quantity: 1,
				categoryId: initialData?.categoryId || "",
				brand: "",
			});
		}
	}, [isOpen, reset, initialData]);

	// Form validation rules
	const validationRules = {
		name: {
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
		},
		description: {
			required: t(
				"validation_description_required",
				"La descripción es requerida"
			),
			validate: (value: string | undefined) => {
				if (!value || value.trim().length === 0) {
					return t(
						"validation_description_required",
						"La descripción es requerida"
					);
				}
				return true;
			},
			maxLength: {
				value: 500,
				message: t(
					"validation_description_max_length",
					"La descripción no puede exceder 500 caracteres"
				),
			},
		},
		price: {
			required: t("validation_price_required", "El precio es requerido"),
			min: {
				value: 0,
				message: t(
					"validation_price_min",
					"El precio debe ser mayor o igual a 0"
				),
			},
			max: {
				value: 999999999,
				message: t("validation_price_max", "El precio es demasiado alto"),
			},
		},
		unit: {
			maxLength: {
				value: 20,
				message: t(
					"validation_unit_max_length",
					"La unidad no puede exceder 20 caracteres"
				),
			},
		},
		quantity: {
			min: {
				value: 0,
				message: t(
					"validation_quantity_min",
					"La cantidad debe ser mayor o igual a 0"
				),
			},
			max: {
				value: 999999,
				message: t("validation_quantity_max", "La cantidad es demasiado alta"),
			},
			validate: (value: number | undefined, formValues: CreateProductFormData) => {
				const currentUnit = (formValues.unit || EnumMeasureUnit.Unidad) as string;
				const unitLower = String(currentUnit).toLowerCase();
				if (unitLower === "units" || unitLower === "unidad") {
					if (value !== undefined && value !== null && !Number.isInteger(value)) {
						return t(
							"validation_quantity_must_be_integer",
							"La cantidad debe ser un número entero cuando la unidad es 'unidades'"
						);
					}
				}
				return true;
			},
		},
		categoryId: {
			required: t("validation_category_required", "La categoría es requerida"),
		},
		// brand: {
		// 	required: t("validation_brand_required", "La marca es requerida"),
		// },
	};

	// Configure form validation
	useEffect(() => {
		form.register("name", validationRules.name);
		form.register("description", validationRules.description);
		form.register("price", validationRules.price);
		form.register("unit", validationRules.unit);
		form.register("quantity", validationRules.quantity);
		form.register("categoryId", validationRules.categoryId);
		// form.register("brand", validationRules.brand); // TODO: Uncomment when brand field is implemented (version 1.5)
	}, [form, validationRules]);

	const handleFormSubmit = useCallback(
		handleSubmit(async (data: CreateProductFormData) => {
			try {
				console.log("data", data);
				const productData: ICreateCatalogItemRequest = {
					name: data.name.trim(),
					description: data.description?.trim() || undefined,
					price: data.price,
					currency: "COP", // Default currency
					categoryId: data.categoryId,
					type: EnumCatalogType.Product,
					status: EnumCatalogStatus.Active, // Default status
					metadata: {
						measureUnit: data.unit || EnumMeasureUnit.Unidad,
						measureValue: data.quantity || 1,
						brand: data.brand?.trim() || undefined, // TODO: Add brand field when implemented (version 1.5)
					},
				};

				await onSubmit(productData);
			} catch (error) {
				console.error("Error creating product:", error);
				throw error;
			}
		}),
		[handleSubmit, onSubmit]
	);

	return {
		control,
		formState,
		handleSubmit: handleFormSubmit,
		reset,
		watch,
		setValue,
		trigger,
	};
};
