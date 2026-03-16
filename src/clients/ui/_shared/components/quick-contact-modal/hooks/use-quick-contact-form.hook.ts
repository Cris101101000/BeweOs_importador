import type { IFastClient } from "@clients/domain/interfaces/client.interface";
import {
	getValidationErrorMessage,
	validateEmail,
	validateName,
	validatePhone,
} from "@clients/domain/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import type { IPhone } from "@shared/domain/interfaces/phone.interface";
import { DEFAULT_VALUES } from "@shared/utils/constants/default.constants";
import { useTranslate } from "@tolgee/react";
import { useCallback, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

/**
 * Translation function type compatible with Tolgee and validation helpers
 */
type TranslateFn = {
	(key: string, fallback?: string): string;
	(key: string, params?: Record<string, string | number>): string;
};

/**
 * Creates validation schema for quick contact form using domain validations
 */
const createValidationSchema = (t: TranslateFn) => {
	return z.object({
		firstName: z
			.string()
			.min(
				2,
				t(
					"validation_min_length_2",
					"Este campo debe tener al menos 2 caracteres"
				)
			)
			.superRefine((value, ctx) => {
				const result = validateName(value);
				if (!result.isValid) {
					const errorMessage = getValidationErrorMessage(result, t);
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: errorMessage || "Error de validación del nombre",
					});
				}
			}),
		lastName: z
			.string()
			.min(
				2,
				t(
					"validation_min_length_2",
					"Este campo debe tener al menos 2 caracteres"
				)
			)
			.superRefine((value, ctx) => {
				const result = validateName(value);
				if (!result.isValid) {
					const errorMessage = getValidationErrorMessage(result, t);
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: errorMessage || "Error de validación del apellido",
					});
				}
			}),
		phone: z
			.object({
				code: z.string(),
				country: z.string(),
				number: z.string(),
			})
			.superRefine((phoneData, ctx) => {
				const phone: IPhone = {
					code: phoneData.code,
					country: phoneData.country,
					number: phoneData.number,
				};
				const result = validatePhone(phone);
				if (!result.isValid) {
					const errorMessage = getValidationErrorMessage(result, t);
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: errorMessage || "Error de validación del teléfono",
					});
				}
			}),
		email: z.string().superRefine((value, ctx) => {
			const result = validateEmail(value);
			if (!result.isValid) {
				const errorMessage = getValidationErrorMessage(result, t);
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: errorMessage || "Error de validación del email",
				});
			}
		}),
	});
};

interface UseQuickContactFormProps {
	isOpen: boolean;
	onSubmit: (data: IFastClient) => void;
}

/**
 * Custom hook for managing quick contact form state and validation
 */
export const useQuickContactForm = ({
	isOpen,
	onSubmit,
}: UseQuickContactFormProps) => {
	const { t } = useTranslate();

	const validationSchema = useMemo(
		() => createValidationSchema(t as TranslateFn),
		[t]
	);
	type FormData = z.infer<typeof validationSchema>;

	const form = useForm<FormData>({
		resolver: zodResolver(validationSchema),
		defaultValues: DEFAULT_VALUES,
		mode: "onChange",
	});

	const { reset, handleSubmit, trigger } = form;

	// Helpers to map between domain phone and UI phone value
	const toPhoneValue = useCallback(
		(phone?: IPhone | null) => ({
			code: phone?.code || "",
			number: phone?.number || "",
		}),
		[]
	);

	const toDomainPhone = useCallback(
		(
			value: { code?: string; number?: string },
			currentPhone?: IPhone | null
		): IPhone => ({
			// Use nullish coalescing to avoid falling back when empty strings are intended
			code: value.code ?? currentPhone?.code ?? "",
			country: currentPhone?.country ?? "CO",
			number: value.number ?? currentPhone?.number ?? "",
		}),
		[]
	);

	// Reset form when modal opens
	useEffect(() => {
		if (isOpen) {
			reset(DEFAULT_VALUES);
		}
	}, [isOpen, reset]);

	const handleFormSubmit = handleSubmit((data) => {
		onSubmit(data);
	});

	return {
		...form,
		toPhoneValue,
		toDomainPhone,
		handleFormSubmit,
		trigger,
		t,
	};
};
