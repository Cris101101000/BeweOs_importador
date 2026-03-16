import { Button, Card, Input } from "@beweco/aurora-ui";
import type { IEmailContact } from "@settings/bussinesConfig/domain/interfaces/business-information.interface";
import type React from "react";
import { useDigitalContactForm } from "../hooks/use-digital-contact-form.hook";

/**
 * A form component for managing digital contact information, including main email and website.
 * It uses the `useDigitalContactForm` hook to handle its state and logic.
 * Only supports a single main email contact.
 *
 * @returns {React.FC} The rendered form component.
 */
export const DigitalContactForm: React.FC<{
	emails: IEmailContact[];
	webDomain: string | undefined;
	onDataUpdated?: () => void;
}> = ({ emails, webDomain, onDataUpdated }) => {
	const { register, handleSubmit, errors, isSubmitting, isValid, t } =
		useDigitalContactForm({
			emails,
			webDomain,
			onDataUpdated,
		});

	return (
		<Card className="p-5 w-full gap-4">
			<div>
				<h2 className="font-medium text-lg">
					{t("settings_contact_digital_contact_title")}
				</h2>
				<p className="text-default-500 text-sm">
					{t("settings_contact_digital_contact_description")}
				</p>
			</div>
			<form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
				<div>
					<Input
						id="email"
						label={t("settings_contact_digital_contact_main_email")}
						placeholder="correo@tunegocio.com"
						{...register("email")}
						isInvalid={!!errors.email}
						errorMessage={t(errors.email?.message || "")}
					/>
					<p className="text-tiny text-default-500 pt-1">
						{t("settings_contact_digital_contact_email_caption")}
					</p>
				</div>

				<Input
					id="website"
					label={t("settings_contact_digital_contact_website")}
					placeholder="https://tunegocio.com"
					{...register("website")}
					isInvalid={!!errors.website}
					errorMessage={t(errors.website?.message || "")}
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
