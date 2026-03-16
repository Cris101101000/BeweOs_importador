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
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

const phoneSchema = z.object({
	id: z.string().optional(),
	number: z.string().min(7, "form_error_phone_min_length"),
	code: z.string().optional(),
	country: z.string().optional(),
});

const formSchema = z.object({
	whatsappNumbers: z.array(phoneSchema).max(10, "form_error_max_phones"),
});

type IWhatsAppBusinessForm = z.infer<typeof formSchema>;

export const useWhatsAppBusinessForm = ({
	phones,
}: {
	phones: IPhoneContact[];
}) => {
	const { t } = useTranslate();
	const { agency } = useSession();
	const { state, actions } = useFormSubmissionState();
	const { showToast } = useAuraToast();

	const whatsappPhones = phones.filter((phone) =>
		phone.channels?.includes("whatsapp")
	);

	const {
		control,
		handleSubmit,
		formState: { errors, isDirty, isValid: isFormValid },
	} = useForm<IWhatsAppBusinessForm>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			whatsappNumbers:
				whatsappPhones.length > 0
					? whatsappPhones.map((phone) => ({
							id: phone.id,
							number: phone.number,
							code: phone.code,
							country: phone.country,
						}))
					: [{ number: "", code: "+57", country: "CO" }],
		},
		mode: "onChange",
	});

	const { fields, append, remove } = useFieldArray({
		control,
		name: "whatsappNumbers",
	});

	const onSubmit = async (data: IWhatsAppBusinessForm) => {
		const phonesAdapter = new PhonesAdapter();
		const updatePhonesUseCase = new UpdatePhonesUseCase(phonesAdapter);

		const nonWhatsAppPhones = phones.filter(
			(phone) => !phone.channels?.includes("whatsapp")
		);

		const updatedWhatsAppPhones: IPhoneContact[] = data.whatsappNumbers.map(
			(phone) => {
				const originalPhone = phones.find((p) => p.id === phone.id);
				const newChannels = new Set(originalPhone?.channels || []);
				newChannels.add("whatsapp");

				return {
					id: phone.id,
					number: phone.number,
					code: phone.code || "",
					country: phone.country || "",
					channels: Array.from(newChannels) as ("phone" | "whatsapp")[],
					type: ContactType.Other,
					isVisible: true,
				};
			}
		);

		await updatePhonesUseCase.execute(agency?.id || "", [
			...nonWhatsAppPhones,
			...updatedWhatsAppPhones,
		]);
	};

	const submissionHandler = createFormSubmissionHandler(onSubmit, actions, {
		onSuccess: () => {
			showToast({
				title: t("whatsapp_updated_success"),
				description: t("whatsapp_updated_success_description"),
				color: "success",
			});
		},
		onError: (errorMessage) => {
			showToast(
				configureErrorToastWithTranslation(
					EnumErrorType.Unexpected,
					t,
					"whatsapp_updated_error",
					errorMessage || "whatsapp_updated_error_description"
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
		fields,
		append,
		remove,
		t,
	};
};
