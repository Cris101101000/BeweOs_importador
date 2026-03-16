import { useCallback, useEffect, useState } from "react";

/**
 * Utility functions and hooks for form state management
 */

/**
 * Interface for form submission state
 */
export interface FormSubmissionState {
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

/**
 * Interface for form submission state actions
 */
export interface FormSubmissionActions {
	/** Set the submitting state */
	setIsSubmitting: (submitting: boolean) => void;
	/** Set success state with optional message */
	setSuccess: (message?: string) => void;
	/** Set error state with optional message */
	setError: (message?: string) => void;
	/** Clear all messages and reset state */
	clearMessages: () => void;
	/** Reset all state to initial values */
	resetState: () => void;
}

/**
 * Custom hook for managing form submission state (loading, success, error)
 *
 * @param autoCleanupTime - Time in milliseconds to auto-clear messages (default: 5000ms)
 * @returns Object containing state and actions for form submission management
 *
 * @example
 * ```typescript
 * const {
 *   state: { isSubmitting, isSuccess, isError, errorMessage },
 *   actions: { setIsSubmitting, setSuccess, setError, clearMessages }
 * } = useFormSubmissionState();
 *
 * // In form submission
 * setIsSubmitting(true);
 * try {
 *   await submitForm();
 *   setSuccess("Form submitted successfully!");
 * } catch (error) {
 *   setError("Failed to submit form");
 * } finally {
 *   setIsSubmitting(false);
 * }
 * ```
 */
export const useFormSubmissionState = (autoCleanupTime = 5000) => {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [isError, setIsError] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const [successMessage, setSuccessMessage] = useState("");

	// Auto-cleanup messages after specified time
	useEffect(() => {
		if (isSuccess || isError) {
			const timer = setTimeout(() => {
				setIsSuccess(false);
				setIsError(false);
				setErrorMessage("");
				setSuccessMessage("");
			}, autoCleanupTime);

			return () => clearTimeout(timer);
		}
	}, [isSuccess, isError, autoCleanupTime]);

	const setSuccess = useCallback((message = "") => {
		setIsSuccess(true);
		setIsError(false);
		setSuccessMessage(message);
		setErrorMessage("");
	}, []);

	const setError = useCallback((message = "") => {
		setIsError(true);
		setIsSuccess(false);
		setErrorMessage(message);
		setSuccessMessage("");
	}, []);

	const clearMessages = useCallback(() => {
		setIsSuccess(false);
		setIsError(false);
		setErrorMessage("");
		setSuccessMessage("");
	}, []);

	const resetState = useCallback(() => {
		setIsSubmitting(false);
		clearMessages();
	}, [clearMessages]);

	const state: FormSubmissionState = {
		isSubmitting,
		isSuccess,
		isError,
		errorMessage,
		successMessage,
	};

	const actions: FormSubmissionActions = {
		setIsSubmitting,
		setSuccess,
		setError,
		clearMessages,
		resetState,
	};

	return { state, actions };
};

/**
 * Determines if a form button should be enabled based on form state
 *
 * @param isDirty - Whether the form has been modified
 * @param isValid - Whether the form is valid (optional, defaults to true)
 * @param isSubmitting - Whether the form is currently being submitted (optional, defaults to false)
 * @returns True if the button should be enabled
 *
 * @example
 * ```typescript
 * const shouldEnableButton = getFormButtonState(
 *   formState.isDirty,
 *   formState.isValid,
 *   isSubmitting
 * );
 * ```
 */
export const getFormButtonState = (
	isDirty: boolean,
	isValid = true,
	isSubmitting = false
): boolean => {
	return isDirty && isValid && !isSubmitting;
};

/**
 * Creates a form submission handler with automatic state management
 *
 * @param submitFn - The async function to execute on form submission
 * @param actions - Form submission actions from useFormSubmissionState
 * @param options - Optional configuration
 * @returns Wrapped submission handler
 *
 * @example
 * ```typescript
 * const { state, actions } = useFormSubmissionState();
 *
 * const handleSubmit = createFormSubmissionHandler(
 *   async (data) => {
 *     await api.submitForm(data);
 *   },
 *   actions,
 *   {
 *     successMessage: "Form submitted successfully!",
 *     onSuccess: () => console.log("Success callback"),
 *     onError: (error) => console.error("Error callback", error)
 *   }
 * );
 * ```
 */
export const createFormSubmissionHandler = <T = any>(
	submitFn: (data: T) => Promise<void>,
	actions: FormSubmissionActions,
	options: {
		successMessage?: string;
		onSuccess?: () => void;
		onError?: (error: string) => void;
	} = {}
) => {
	return async (data: T) => {
		try {
			actions.setIsSubmitting(true);
			actions.clearMessages();

			await submitFn(data);

			actions.setSuccess(options.successMessage);
			options.onSuccess?.();
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : "An error occurred";
			actions.setError(errorMessage);
			options.onError?.(errorMessage);
			throw error;
		} finally {
			actions.setIsSubmitting(false);
		}
	};
};
