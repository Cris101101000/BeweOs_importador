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
import type { IBasicInfo } from "../../../client-creation-wizard.types";

/**
 * Translation function type compatible with Tolgee and validation helpers
 */
type TranslateFn = {
	(key: string, fallback?: string): string;
	(key: string, params?: Record<string, string | number>): string;
};

/**
 * Creates validation schema for basic info form using domain validations
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

interface UseBasicInfoFormProps {
	data?: IBasicInfo;
	onUpdate: (data: IBasicInfo) => void;
	stepIndex: number;
	updateStepValidity: (stepIndex: number, isValid: boolean) => void;
}

/**
 * Custom hook for managing basic info form state and validation
 */
export const useBasicInfoForm = ({
	data,
	onUpdate,
	stepIndex,
	updateStepValidity,
}: UseBasicInfoFormProps) => {
	const { t } = useTranslate();

	const validationSchema = useMemo(
		() => createValidationSchema(t as TranslateFn),
		[t]
	);
	type FormData = z.infer<typeof validationSchema>;

	const form = useForm<FormData>({
		resolver: zodResolver(validationSchema),
		defaultValues: (data as Partial<FormData>) || DEFAULT_VALUES,
		mode: "onChange",
	});

	const {
		watch,
		trigger,
		formState: { errors, isValid, isDirty },
	} = form;

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
			code: value.code || currentPhone?.code || "",
			country: currentPhone?.country || "CO",
			number: value.number || "",
		}),
		[]
	);

	// Keep form in sync with incoming data (store)
	useEffect(() => {
		if (data) {
			form.reset(data as FormData);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Sync changes upwards
	useEffect(() => {
		const subscription = watch((value) => {
			onUpdate(value as IBasicInfo);
		});
		return () => subscription.unsubscribe();
	}, [watch, onUpdate]);

	// Update step validity in context
	useEffect(() => {
		updateStepValidity(stepIndex, isValid);
	}, [isValid, isDirty, stepIndex, updateStepValidity]);

	return {
		...form,
		toPhoneValue,
		toDomainPhone,
		trigger,
		errors,
		isValid,
		isDirty,
	};
};
