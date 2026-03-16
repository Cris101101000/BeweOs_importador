import { useTranslate } from "@tolgee/react";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { EnumCatalogStatus } from "../../../../domain/enums/catalog-status.enum";
import { EnumCatalogType } from "../../../../domain/enums/catalog-type.enum";
import {
	DURATION_MAX_VALUES,
	EnumDurationType,
} from "../../../../domain/enums/duration-type.enum";
import type { IServiceInitialData } from "../../../../domain/interfaces/catalog-initial-data.interface";
import type { ICreateCatalogItemRequest } from "../../../../domain/interfaces/catalog.interface";
import { convertToMinutes } from "../../../../domain/validations/duration.validation";
import {
	formatDuration,
	parseDurationString,
} from "../../../../infrastructure/utils/duration-ui.util";

interface CreateServiceFormData {
	name: string;
	description?: string;
	price: number;
	durationValue: number;
	durationType: EnumDurationType;
	categoryId: string;
}

interface UseCreateServiceFormProps {
	isOpen: boolean;
	onSubmit: (data: ICreateCatalogItemRequest) => Promise<void>;
	initialData?: IServiceInitialData | null;
}

export const useCreateServiceForm = ({
	isOpen,
	onSubmit,
	initialData,
}: UseCreateServiceFormProps) => {
	const { t } = useTranslate();

	const form = useForm<CreateServiceFormData>({
		defaultValues: {
			name: "",
			description: "",
			price: 0,
			durationValue: 0,
			durationType: EnumDurationType.MINUTES,
			categoryId: "",
		},
		mode: "onChange",
	});

	const { control, handleSubmit, reset, formState, trigger, watch } = form;

	// Watch durationType to update validation dynamically
	const durationType = watch("durationType");

	// Reset form when modal opens - use initialData if provided
	useEffect(() => {
		if (isOpen) {
			const parsedDuration = parseDurationString(initialData?.duration);

			reset({
				name: initialData?.name || "",
				description: initialData?.description || "",
				price: initialData?.price || 0,
				durationValue: parsedDuration.value,
				durationType: parsedDuration.type,
				categoryId: initialData?.categoryId || "",
			});
		}
	}, [isOpen, reset, initialData]);

	// Form validation rules (messages are UI concern - use translations)
	const validationRules = {
		name: {
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
		durationValue: {
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
		},
		categoryId: {
			required: t("validation_category_required", "La categoría es requerida"),
		},
	};

	// Configure form validation
	useEffect(() => {
		form.register("name", validationRules.name);
		form.register("description", validationRules.description);
		form.register("price", validationRules.price);
		form.register("durationValue", validationRules.durationValue);
		form.register("categoryId", validationRules.categoryId);
	}, [form, durationType]);

	// Re-validate durationValue when durationType changes
	useEffect(() => {
		trigger("durationValue");
	}, [durationType, trigger]);

	const handleFormSubmit = useCallback(
		handleSubmit(async (data: CreateServiceFormData) => {
			try {
				// Convert duration to minutes for API (business rule)
				const durationInMinutes = convertToMinutes(
					data.durationValue,
					data.durationType
				);

				const serviceData: ICreateCatalogItemRequest = {
					name: data.name.trim(),
					description: data.description?.trim() || undefined,
					price: data.price,
					currency: "COP", // Default currency
					categoryId: data.categoryId,
					type: EnumCatalogType.Service,
					status: EnumCatalogStatus.Active, // Default status
					// Store duration in minutes
					duration: durationInMinutes > 0 ? durationInMinutes : undefined,
					metadata: {
						measureValue: data.durationValue,
						measureUnit:
							data.durationType === EnumDurationType.HOURS ? "hora" : "minuto",
						formattedDuration: formatDuration(
							data.durationValue,
							data.durationType
						),
					},
				};

				await onSubmit(serviceData);
			} catch (error) {
				console.error("Error creating service:", error);
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
		trigger,
		watch,
	};
};
