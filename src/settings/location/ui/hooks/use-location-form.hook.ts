import { useAuraToast } from "@beweco/aurora-ui";
import { zodResolver } from "@hookform/resolvers/zod";
import type { IAddress } from "@settings/bussinesConfig/domain/interfaces/business-information.interface";
import { BusinessInformationAdapter } from "@settings/bussinesConfig/infrastructure/adapters/business-information.adapter";
import { UpdateAddressUseCase } from "@settings/location/application/update-address.usecase";
import { useSession } from "@shared/ui/contexts/session-context/session-context";
import { EnumErrorType } from "@shared/domain/enums/enum-error-type.enum";
import {
	configureErrorToastWithTranslation,
	createFormSubmissionHandler,
	useFormSubmissionState,
} from "@shared/utils";
import { useTranslate } from "@tolgee/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useLocationData } from "./use-location-data.hook";

/**
 * Defines the validation schema for the unified location form.
 * @param t - The translation function.
 * @returns The Zod validation schema.
 */
const getFormSchema = (t: (key: string) => string) =>
	z.object({
		address: z.string().min(1, t("form_error_required_field")),
		country: z.string().min(1, t("form_error_required_field")),
		city: z.string().min(1, t("form_error_required_field")),
		postalCode: z.string().optional(),
		googleMapsUrl: z
			.string()
			.min(1, t("form_error_required_field"))
			.url(t("form_error_invalid_url")),
	});

/**
 * Custom hook to manage the unified location form's state and logic
 * (physical address + Google Maps URL).
 *
 * @returns An object with form handling utilities.
 */
export const useLocationForm = ({
	location,
	onDataUpdated,
}: {
	location: IAddress | undefined;
	onDataUpdated?: () => void;
}) => {
	const { t } = useTranslate();
	const { agency } = useSession();
	const { state, actions } = useFormSubmissionState();
	const { showToast } = useAuraToast();

	const formSchema = getFormSchema(t);

	type ILocationForm = z.infer<typeof formSchema>;

	const {
		register,
		control,
		handleSubmit,
		watch,
		setValue,
		formState: { errors, isDirty, isValid },
	} = useForm<ILocationForm>({
		resolver: zodResolver(formSchema),
		mode: "onChange",
		defaultValues: {
			address: location?.address || "",
			country: location?.country?.toLowerCase() || "",
			city: location?.city || "",
			postalCode: location?.zip || "",
			googleMapsUrl: location?.urlGoogleMaps || "",
		},
	});

	// Watch country selection to filter cities
	const selectedCountry = watch("country");
	const selectedCountryCode = selectedCountry
		? selectedCountry.toUpperCase()
		: undefined;

	// Get countries and cities from the service
	const {
		countries,
		cities,
		isLoading: isLoadingLocationData,
	} = useLocationData(selectedCountryCode);

	const onSubmit = async (data: ILocationForm) => {
		const adapter = new BusinessInformationAdapter();
		const useCase = new UpdateAddressUseCase(adapter);

		const address: Partial<IAddress> = {
			address: data.address,
			country: data.country.toUpperCase(),
			city: data.city,
			zip: data.postalCode,
			urlGoogleMaps: data.googleMapsUrl || undefined,
		};

		await useCase.execute(agency?.id || "", address);
	};

	const submissionHandler = createFormSubmissionHandler(onSubmit, actions, {
		onSuccess: () => {
			showToast({
				title: t("physical_location_updated_success"),
				description: t("physical_location_updated_success_description"),
				color: "success",
			});
			if (onDataUpdated) {
				onDataUpdated();
			}
		},
		onError: (errorMessage) => {
			showToast(
				configureErrorToastWithTranslation(
					EnumErrorType.Unexpected,
					t,
					"physical_location_updated_error",
					errorMessage || "physical_location_updated_error_description"
				)
			);
		},
	});

	return {
		register,
		control,
		handleSubmit: handleSubmit(submissionHandler),
		setValue,
		errors,
		isSubmitting: state.isSubmitting,
		isSuccess: state.isSuccess,
		isError: state.isError,
		isValid: isDirty && isValid,
		countries,
		cities,
		isLoadingLocationData,
		t,
	};
};
