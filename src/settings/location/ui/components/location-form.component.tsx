import { Button, Card, Input, Select, SelectItem } from "@beweco/aurora-ui";
import type { IAddress } from "@settings/bussinesConfig/domain/interfaces/business-information.interface";
import type React from "react";
import { Controller } from "react-hook-form";
import { useLocationForm } from "../hooks/use-location-form.hook";

/**
 * Renders the unified location form (physical address + Google Maps URL).
 *
 * @returns The form component.
 */
export const LocationForm: React.FC<{
	location: IAddress | undefined;
	onDataUpdated?: () => void;
}> = ({ location, onDataUpdated }) => {
	const {
		register,
		control,
		handleSubmit,
		setValue,
		errors,
		isSubmitting,
		isValid,
		countries,
		cities,
		isLoadingLocationData,
		t,
	} = useLocationForm({ location, onDataUpdated });

	return (
		<Card className="p-5 w-full gap-4">
			<div>
				<h2 className="font-medium text-lg">
					{t("settings_location_title")}
				</h2>
				<p className="text-default-500 text-sm">
					{t("settings_location_description")}
				</p>
			</div>
			<form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
				<Input
					label={t("settings_location_address")}
					placeholder={t("settings_location_address_placeholder")}
					{...register("address")}
					isInvalid={!!errors.address}
					errorMessage={errors.address?.message}
					isRequired
				/>
				<Controller
					name="country"
					control={control}
					render={({ field }) => (
						<Select
							label={t("settings_location_country")}
							placeholder={t("settings_location_country_placeholder")}
							selectedKeys={field.value ? [field.value] : []}
							onSelectionChange={(keys) => {
								const selectedKey = Array.from(keys)[0] || "";
								field.onChange(selectedKey);
								setValue("city", "");
							}}
							isInvalid={!!errors.country}
							errorMessage={errors.country?.message}
							isRequired
							isLoading={isLoadingLocationData}
						>
							{countries.map((country) => (
								<SelectItem key={country.key}>{country.label}</SelectItem>
							))}
						</Select>
					)}
				/>
				<Controller
					name="city"
					control={control}
					render={({ field }) => (
						<Select
							label={t("settings_location_city")}
							placeholder={t("settings_location_city_placeholder")}
							selectedKeys={field.value ? [field.value] : []}
							onSelectionChange={(keys) => {
								field.onChange(Array.from(keys)[0] || "");
							}}
							isInvalid={!!errors.city}
							errorMessage={errors.city?.message}
							isRequired
							isDisabled={cities.length === 0}
							isLoading={isLoadingLocationData}
						>
							{cities.map((city) => (
								<SelectItem key={city.key}>{city.label}</SelectItem>
							))}
						</Select>
					)}
				/>
				<Input
					label={t("settings_location_postal_code")}
					placeholder={t("settings_location_postal_code_placeholder")}
					{...register("postalCode")}
				/>
				<Input
					label={t("settings_location_google_maps_url")}
					placeholder="https://maps.google.com/..."
					{...register("googleMapsUrl")}
					isInvalid={!!errors.googleMapsUrl}
					isRequired
					errorMessage={errors.googleMapsUrl?.message}
				/>
				<Button
					type="submit"
					className="w-36"
					isDisabled={!isValid || isSubmitting}
					isLoading={isSubmitting}
				>
					{isSubmitting ? t("button_saving") : t("button_save")}
				</Button>
			</form>
		</Card>
	);
};
