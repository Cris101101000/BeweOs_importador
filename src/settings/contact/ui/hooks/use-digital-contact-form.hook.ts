import { useAuraToast } from "@beweco/aurora-ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { ContactType } from "@settings/bussinesConfig/domain/enums/contact-type.enum";
import type { IEmailContact } from "@settings/bussinesConfig/domain/interfaces/business-information.interface";
import { BusinessInformationAdapter } from "@settings/bussinesConfig/infrastructure/adapters/business-information.adapter";
import { UpdateDigitalContactUseCase } from "@settings/contact/application/update-digital-contact.usecase";
import { EnumErrorType } from "@shared/domain/enums/enum-error-type.enum";
import {
	configureErrorToastWithTranslation,
	createFormSubmissionHandler,
	useFormSubmissionState,
} from "@shared/utils";
import { useTranslate } from "@tolgee/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

/**
 * Custom hook for managing the digital contact form.
 * Encapsulates form logic, validation, and submission handling.
 * Handles a single main email contact.
 *
 * @returns An object containing form control, state, and submission handlers.
 */
export const useDigitalContactForm = ({
	emails: defaultEmails,
	webDomain: defaultWebDomain,
	onDataUpdated,
}: {
	emails: IEmailContact[];
	webDomain: string | undefined;
	onDataUpdated?: () => void;
}) => {
	const { t } = useTranslate();
	const { state, actions } = useFormSubmissionState();
	const { showToast } = useAuraToast();

	const formSchema = z.object({
		email: z
			.string()
			.refine(
				(val) => val === "" || z.string().email().safeParse(val).success,
				{
					message: t("form_error_invalid_email"),
				}
			),
		website: z
			.string()
			.refine((val) => val === "" || z.string().url().safeParse(val).success, {
				message: t("form_error_invalid_url"),
			}),
	});

	type IDigitalContactForm = z.infer<typeof formSchema>;

	// Get the main email (first email or empty string)
	const mainEmail =
		defaultEmails && defaultEmails.length > 0
			? defaultEmails.find((email) => email.type === ContactType.Main)?.email ||
				defaultEmails[0].email
			: "";

	const {
		register,
		handleSubmit,
		formState: { errors, isDirty, isValid: isFormValid },
		reset,
	} = useForm<IDigitalContactForm>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: mainEmail,
			website: defaultWebDomain || "",
		},
		mode: "onChange",
	});

	// Reset form when initial data changes
	useEffect(() => {
		const currentMainEmail =
			defaultEmails && defaultEmails.length > 0
				? defaultEmails.find((email) => email.type === ContactType.Main)
						?.email || defaultEmails[0].email
				: "";

		reset({
			email: currentMainEmail,
			website: defaultWebDomain || "",
		});
	}, [defaultEmails, defaultWebDomain, reset]);

	const onSubmit = async (data: IDigitalContactForm) => {
		const adapter = new BusinessInformationAdapter();
		const useCase = new UpdateDigitalContactUseCase(adapter);

		const digitalContact = {
			emails:
				data.email.trim() !== ""
					? [
							{
								email: data.email.trim(),
								isVisible: true,
								type: ContactType.Main,
								createdBy: "user",
							},
						]
					: [],
			website: data.website?.trim() || undefined,
		};

		console.log(
			"🚀 Submitting digital contact:",
			JSON.stringify(digitalContact, null, 2)
		);

		await useCase.execute(digitalContact);
	};

	const submissionHandler = createFormSubmissionHandler(onSubmit, actions, {
		onSuccess: () => {
			showToast({
				title: t("digital_contact_updated_success"),
				description: t("digital_contact_updated_success_description"),
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
					"digital_contact_updated_error",
					errorMessage || "digital_contact_updated_error_description"
				)
			);
		},
	});

	return {
		register,
		handleSubmit: handleSubmit(submissionHandler),
		errors,
		isSubmitting: state.isSubmitting,
		isValid: isDirty && isFormValid,
		t,
	};
};
