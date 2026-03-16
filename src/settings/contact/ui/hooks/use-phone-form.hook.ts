import { useAuraToast } from "@beweco/aurora-ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { ContactType } from "@settings/bussinesConfig/domain/enums/contact-type.enum";
import type { IPhoneContact } from "@settings/bussinesConfig/domain/interfaces/business-information.interface";
import { UpdatePhonesUseCase } from "@settings/contact/application/update-phones.usecase";
import { PhonesAdapter } from "@settings/contact/infrastructure/adapters/phones.adapter";
import { useSession } from "@shared/ui/contexts/session-context/session-context";
import { EnumErrorType } from "@shared/domain/enums/enum-error-type.enum";
import {
	configureErrorToastWithTranslation,
	createFormSubmissionHandler,
	useFormSubmissionState,
} from "@shared/utils";
import { useTranslate } from "@tolgee/react";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Schema for a single phone field (optional)
const phoneFieldSchema = z
	.object({
		code: z.string(),
		country: z.string().optional(),
		number: z.string(),
		channels: z.array(z.enum(["phone", "whatsapp"])),
	})
	.optional()
	.nullable();

// Schema for required main phone
const requiredPhoneSchema = z.object({
	code: z.string(),
	country: z.string().optional(),
	number: z.string().min(7, "form_error_phone_min_length"),
	channels: z
		.array(z.enum(["phone", "whatsapp"]))
		.min(1, "form_error_channel_required"),
});

const formSchema = z
	.object({
		mainPhone: requiredPhoneSchema, // ContactType.Main - Required
		supportPhone: phoneFieldSchema, // ContactType.Support - Optional
		salesPhone: phoneFieldSchema, // ContactType.Sales - Optional
		technicalPhone: phoneFieldSchema, // ContactType.Technical - Optional
		otherPhone: phoneFieldSchema, // ContactType.Other - Optional
	})
	.refine(
		(data) => {
			// Validate optional phones only if they have a number
			const optionalPhones = [
				data.supportPhone,
				data.salesPhone,
				data.technicalPhone,
				data.otherPhone,
			];
			return optionalPhones.every((phone) => {
				if (!phone || !phone.number) return true;
				return (
					phone.number.length >= 7 &&
					phone.channels &&
					phone.channels.length > 0
				);
			});
		},
		{
			message: "form_error_phone_validation",
		}
	);

type IPhoneForm = z.infer<typeof formSchema>;

export const usePhoneForm = ({
	phones,
	onDataUpdated,
}: {
	phones: IPhoneContact[];
	onDataUpdated?: () => void;
}) => {
	const { t } = useTranslate();
	const { agency } = useSession();
	const { state, actions } = useFormSubmissionState();
	const { showToast } = useAuraToast();

	// Helper to convert IPhoneContact to Phone component format
	const toPhoneValue = useCallback((phone?: IPhoneContact | null) => {
		if (!phone) return null;
		return {
			code: phone.code || "+57",
			country: phone.country || "CO",
			number: phone.number || "",
			channels:
				phone.channels || (["phone", "whatsapp"] as ("phone" | "whatsapp")[]),
		};
	}, []);

	// Get phone by specific type
	const getPhoneByType = useCallback(
		(phonesList: IPhoneContact[], type: ContactType) => {
			return phonesList.find((phone) => phone.type === type);
		},
		[]
	);

	// Get all phones by type
	const mainPhone = getPhoneByType(phones, ContactType.Main);
	const supportPhone = getPhoneByType(phones, ContactType.Support);
	const salesPhone = getPhoneByType(phones, ContactType.Sales);
	const technicalPhone = getPhoneByType(phones, ContactType.Technical);
	const otherPhone = getPhoneByType(phones, ContactType.Other);

	const {
		control,
		handleSubmit,
		formState: { errors, isDirty, isValid: isFormValid },
		reset,
		watch,
		setValue,
	} = useForm<IPhoneForm>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			mainPhone: toPhoneValue(mainPhone) || {
				code: "+57",
				country: "CO",
				number: "",
				channels: ["phone", "whatsapp"],
			},
			supportPhone: toPhoneValue(supportPhone),
			salesPhone: toPhoneValue(salesPhone),
			technicalPhone: toPhoneValue(technicalPhone),
			otherPhone: toPhoneValue(otherPhone),
		},
		mode: "onChange",
	});

	// Reset form when phones data changes
	useEffect(() => {
		if (phones && phones.length > 0) {
			reset({
				mainPhone: toPhoneValue(getPhoneByType(phones, ContactType.Main)) || {
					code: "+57",
					country: "CO",
					number: "",
					channels: ["phone", "whatsapp"],
				},
				supportPhone: toPhoneValue(getPhoneByType(phones, ContactType.Support)),
				salesPhone: toPhoneValue(getPhoneByType(phones, ContactType.Sales)),
				technicalPhone: toPhoneValue(
					getPhoneByType(phones, ContactType.Technical)
				),
				otherPhone: toPhoneValue(getPhoneByType(phones, ContactType.Other)),
			});
		}
	}, [phones, reset, toPhoneValue, getPhoneByType]);

	const onSubmit = async (data: IPhoneForm) => {
		const phonesAdapter = new PhonesAdapter();
		const updatePhonesUseCase = new UpdatePhonesUseCase(phonesAdapter);

		// Helper to create phone object
		const createPhone = (
			phoneData: typeof data.mainPhone | null | undefined,
			type: ContactType,
			originalPhone?: IPhoneContact
		): IPhoneContact | null => {
			if (!phoneData || !phoneData.number || phoneData.number.length < 7) {
				return null;
			}

			return {
				id: originalPhone?.id,
				code: phoneData.code,
				country: phoneData.country || originalPhone?.country || "CO",
				number: phoneData.number,
				type,
				isVisible: true,
				channels: phoneData.channels,
			};
		};

		// Build phones array with only valid phones
		const allPhones: IPhoneContact[] = [
			// Main phone is required
			createPhone(data.mainPhone, ContactType.Main, mainPhone),
			// Optional phones
			createPhone(data.supportPhone, ContactType.Support, supportPhone),
			createPhone(data.salesPhone, ContactType.Sales, salesPhone),
			createPhone(data.technicalPhone, ContactType.Technical, technicalPhone),
			createPhone(data.otherPhone, ContactType.Other, otherPhone),
		].filter((phone): phone is IPhoneContact => phone !== null);

		await updatePhonesUseCase.execute(agency?.id || "", allPhones);
	};

	const submissionHandler = createFormSubmissionHandler(onSubmit, actions, {
		onSuccess: () => {
			showToast({
				title: t("phones_updated_success"),
				description: t("phones_updated_success_description"),
				color: "success",
			});
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
					"phones_updated_error",
					errorMessage || "phones_updated_error_description"
				)
			);
		},
	});

	return {
		control,
		handleSubmit: handleSubmit(submissionHandler),
		errors,
		isSubmitting: state.isSubmitting,
		isSuccess: state.isSuccess,
		isError: state.isError,
		isValid: isDirty && isFormValid,
		isDirty,
		t,
		watch,
		setValue,
	};
};
