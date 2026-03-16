import { Button, Card, IconComponent, Phone } from "@beweco/aurora-ui";
import type { IPhoneContact } from "@settings/bussinesConfig/domain/interfaces/business-information.interface";
import type React from "react";
import { Controller } from "react-hook-form";
import { useWhatsAppBusinessForm } from "../hooks/use-whatsapp-business-form.hook";

export const WhatsAppBusinessForm: React.FC<{
	phones: IPhoneContact[];
}> = ({ phones }) => {
	const {
		t,
		control,
		handleSubmit,
		errors,
		isValid,
		isSubmitting,
		fields,
		append,
		remove,
		isDirty,
	} = useWhatsAppBusinessForm({ phones });

	return (
		<Card className="p-5 w-full gap-4">
			<div>
				<h2 className="font-medium text-lg">
					{t("settings_contact_whatsapp_business_title")}
				</h2>
				<p className="text-default-500 text-sm">
					{t("settings_contact_whatsapp_business_description")}
				</p>
			</div>
			<form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
				{fields.map((field, index) => (
					<div key={field.id} className="flex items-start gap-2">
						<Controller
							name={`whatsappNumbers.${index}`}
							control={control}
							render={({ field: controllerField }) => (
								<div className="w-full">
									<Phone
										id={`whatsapp-phone-${field.id}`}
										label={
											index === 0
												? t("settings_contact_whatsapp_business_account")
												: ""
										}
										translations={{
											placeholder: t("placeholder_enter_phone"),
											searchPlaceholder: t("placeholder_search_phone"),
											noCountriesFound: t("no_countries_found"),
										}}
										value={controllerField.value}
										onChange={controllerField.onChange}
										error={!!errors.whatsappNumbers?.[index]?.number}
										errorText={errors.whatsappNumbers?.[index]?.number?.message}
										required
									/>
									{index === 0 && (
										<p className="text-tiny text-default-500 pt-1">
											{t("settings_contact_whatsapp_business_caption")}
										</p>
									)}
								</div>
							)}
						/>
						<div className="flex flex-col gap-2 pt-8">
							{fields.length > 1 && (
								<IconComponent
									size={"md"}
									icon={"solar:trash-bin-minimalistic-outline"}
									className="cursor-pointer text-danger hover:text-danger-500"
									onClick={() => remove(index)}
								/>
							)}
							{index === fields.length - 1 && fields.length < 10 && (
								<IconComponent
									className="cursor-pointer text-primary"
									size={"md"}
									icon={"solar:add-circle-linear"}
									onClick={() =>
										append({
											number: "",
											code: "+57",
											country: "CO",
										})
									}
								/>
							)}
						</div>
					</div>
				))}

				<Button
					type="submit"
					className="w-36"
					isDisabled={!isValid || isSubmitting || !isDirty}
					isLoading={isSubmitting}
				>
					{isSubmitting ? t("button_saving") : t("button_save")}
				</Button>
			</form>
		</Card>
	);
};
