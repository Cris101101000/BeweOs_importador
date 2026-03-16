import type { ISocialNetwork } from "@settings/bussinesConfig/domain/interfaces/business-information.interface";
import { createOptionalUrlValidation } from "@shared/utils";
import type { BaseSyntheticEvent } from "react";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { z } from "zod";

/**
 * Props for the social media form hook
 */
export interface UseSocialMediaFormProps {
	/** Initial social network data to populate the form */
	initialData: ISocialNetwork;
	/** Callback executed when the form is successfully submitted */
	onSuccess?: () => void;
	/** Callback executed when an error occurs during submission */
	onError?: (error: string) => void;
	/** Callback to refresh data after successful update */
	onDataUpdated?: () => void;
}

/**
 * Form schema for social media URLs
 */
export const formSchema = z.object({
	instagramUrl: createOptionalUrlValidation(),
	facebookUrl: createOptionalUrlValidation(),
	tiktokUrl: createOptionalUrlValidation(),
	twitterUrl: createOptionalUrlValidation(),
	linkedinUrl: createOptionalUrlValidation(),
});

/**
 * Type representing the form data structure
 */
export type ISocialMediaForm = z.infer<typeof formSchema>;

/**
 * Return type for the social media form hook
 */
export interface UseSocialMediaFormReturn {
	/** React Hook Form register function for form fields */
	register: UseFormRegister<ISocialMediaForm>;
	/** Form submission handler */
	handleSubmit: (e?: BaseSyntheticEvent) => Promise<void>;
	/** Form validation errors */
	errors: FieldErrors<ISocialMediaForm>;
	/** Whether the form is valid and has changes */
	isValid: boolean;
	/** Whether the form has been modified */
	isDirty: boolean;
	/** Whether the form is currently being submitted */
	isSubmitting: boolean;
	/** Whether the last submission was successful */
	isSuccess: boolean;
	/** Whether the last submission failed */
	isError: boolean;
	/** Error message from the last failed submission */
	errorMessage: string;
	/** Success message from the last successful submission */
	successMessage: string;
}
