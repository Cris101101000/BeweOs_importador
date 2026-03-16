import { useAuraToast } from "@beweco/aurora-ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateBusinessInformationUseCase } from "@settings/bussinesConfig/application/update-business-information.usecase";
import type { IBusinessInformation } from "@settings/bussinesConfig/domain/interfaces/business-information.interface";
import { BusinessInformationAdapter } from "@settings/bussinesConfig/infrastructure/adapters/business-information.adapter";
import { EnumErrorType } from "@shared/domain/enums/enum-error-type.enum";
import { useSession } from "@shared/ui/contexts/session-context/session-context";
import {
	configureErrorToastWithTranslation,
	configureSuccessToast,
	createFormSubmissionHandler,
	useFormSubmissionState,
} from "@shared/utils";
import { useTranslate } from "@tolgee/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const getFormSchema = (t: (key: string) => string) =>
	z.object({
		name: z.string().min(1, t("form_error_required_field")),
		taxId: z.string().min(1, t("form_error_required_field")),
		sector: z.string().min(1, t("form_error_required_field")),
	});

type IBusinessInformationForm = z.infer<ReturnType<typeof getFormSchema>>;

/**
 * Custom hook for managing the business information form.
 *
 * @param initialData - The initial business information to populate the form.
 * @param onDataUpdated - Callback to refresh data after successful update.
 * @returns Form management utilities and state.
 */
export const useBusinessInformationForm = ({
	initialData,
	onDataUpdated,
}: {
	initialData?: IBusinessInformation;
	onDataUpdated?: () => void;
}) => {
	const { t } = useTranslate();
	const { agency } = useSession();
	const { state, actions } = useFormSubmissionState();
	const { showToast } = useAuraToast();
	const formSchema = getFormSchema(t);

	const {
		control,
		handleSubmit,
		formState: { errors, isDirty, isValid: isFormValid },
		reset,
	} = useForm<IBusinessInformationForm>({
		resolver: zodResolver(formSchema),
		mode: "onChange",
		defaultValues: {
			name: initialData?.basicInfo?.name || "",
			taxId: initialData?.businessInfo?.taxInfo?.nit || "",
			sector: initialData?.businessInfo?.vertical || "",
		},
	});

	useEffect(() => {
		if (initialData) {
			reset({
				name: initialData.basicInfo.name,
				taxId: initialData.businessInfo.taxInfo?.nit || "",
				sector: initialData.businessInfo.vertical || "",
			});
		}
	}, [initialData, reset]);

	const onSubmit = async (data: IBusinessInformationForm) => {
		const adapter = new BusinessInformationAdapter();
		const useCase = new UpdateBusinessInformationUseCase(adapter);
		await useCase.execute({ ...data, idCompany: agency?.id || "" });
	};

	const submissionHandler = createFormSubmissionHandler(onSubmit, actions, {
		onSuccess: () => {
			showToast(
				configureSuccessToast(
					t("business_information_updated_success"),
					t("business_information_updated_success_description")
				)
			);
			// Refresh business information after successful update
			if (onDataUpdated) {
				onDataUpdated();
			}
		},
		onError: (errorMessage) => {
			showToast(
				configureErrorToastWithTranslation(
					EnumErrorType.Unexpected,
					t,
					"business_information_updated_error",
					errorMessage || "business_information_updated_error_description"
				)
			);
		},
	});

	return {
		control,
		handleSubmit: handleSubmit(submissionHandler),
		errors,
		isSubmitting: state.isSubmitting,
		isValid: isDirty && isFormValid,
		isDirty,
	};
};
