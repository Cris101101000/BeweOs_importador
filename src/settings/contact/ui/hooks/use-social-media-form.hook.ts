import { useAuraToast } from "@beweco/aurora-ui";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ISocialNetwork } from "@settings/bussinesConfig/domain/interfaces/business-information.interface";
import { BusinessInformationAdapter } from "@settings/bussinesConfig/infrastructure/adapters/business-information.adapter";
import { UpdateSocialNetworkUseCase } from "@settings/contact/application/update-social-network.usecase";
import { EnumErrorType } from "@shared/domain/enums/enum-error-type.enum";
import {
	configureErrorToastWithTranslation,
	createFormSubmissionHandler,
	useFormSubmissionState,
} from "@shared/utils";
import { transformSuffixedFormData } from "@shared/utils/form-mapping.utils";
import { useTranslate } from "@tolgee/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type {
	ISocialMediaForm,
	UseSocialMediaFormProps,
	UseSocialMediaFormReturn,
} from "./use-social-media-form.types";
import { formSchema } from "./use-social-media-form.types";

/**
 * Custom hook for managing social media form state, validation, and submission
 *
 * @param props - Configuration options for the form
 * @returns Object containing form controls, state, and handlers
 */
export const useSocialMediaForm = ({
	initialData,
	onDataUpdated,
}: UseSocialMediaFormProps): UseSocialMediaFormReturn => {
	const { t } = useTranslate();
	const { state, actions } = useFormSubmissionState();
	const { showToast } = useAuraToast();

	const {
		register,
		handleSubmit,
		formState: { errors, isDirty, isValid: isFormValid },
		reset,
	} = useForm<ISocialMediaForm>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			instagramUrl: initialData?.instagram || "",
			facebookUrl: initialData?.facebook || "",
			tiktokUrl: initialData?.tiktok || "",
			twitterUrl: initialData?.twitter || "",
			linkedinUrl: initialData?.linkedin || "",
		},
		mode: "onChange",
	});

	// Reset form when initial data changes
	useEffect(() => {
		reset({
			instagramUrl: initialData?.instagram || "",
			facebookUrl: initialData?.facebook || "",
			tiktokUrl: initialData?.tiktok || "",
			twitterUrl: initialData?.twitter || "",
			linkedinUrl: initialData?.linkedin || "",
		});
	}, [initialData, reset]);

	/**
	 * Handles form submission by mapping form data to domain model and executing the use case
	 */
	const onSubmit = async (data: ISocialMediaForm) => {
		const adapter = new BusinessInformationAdapter();
		const useCase = new UpdateSocialNetworkUseCase(adapter);

		const socialNetworkData = transformSuffixedFormData(data);

		await useCase.execute(socialNetworkData as ISocialNetwork);
	};

	const submissionHandler = createFormSubmissionHandler(onSubmit, actions, {
		onSuccess: () => {
			showToast({
				title: t("social_media_updated_success"),
				description: t("social_media_updated_success_description"),
				color: "success",
			});
			// Refresh data after successful update
			onDataUpdated?.();
		},
		onError: (errorMessage) => {
			showToast(
				configureErrorToastWithTranslation(
					EnumErrorType.Unexpected,
					t,
					"social_media_updated_error",
					errorMessage || "social_media_updated_error_description"
				)
			);
		},
	});

	return {
		register,
		handleSubmit: handleSubmit(submissionHandler),
		errors,
		isValid: isDirty && isFormValid,
		isDirty,
		...state,
	};
};
