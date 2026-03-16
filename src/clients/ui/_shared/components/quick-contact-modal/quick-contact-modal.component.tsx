import {
	Button,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	P,
	Phone,
} from "@beweco/aurora-ui";

import type { IFastClient } from "@clients/domain/interfaces/client.interface";
import { useTranslate } from "@tolgee/react";
import { useCallback } from "react";
import type { FC } from "react";
import { Controller } from "react-hook-form";
import { useQuickContactForm } from "./hooks/use-quick-contact-form.hook";

interface QuickContactModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSave: (data: IFastClient) => void;
	isLoading?: boolean;
}

export const QuickContactModal: FC<QuickContactModalProps> = ({
	isOpen,
	onClose,
	onSave,
	isLoading = false,
}) => {
	const { t } = useTranslate();

	const {
		control,
		formState: { errors, isValid },
		trigger,
		toPhoneValue,
		toDomainPhone,
		handleFormSubmit,
		reset,
	} = useQuickContactForm({
		isOpen,
		onSubmit: onSave,
	});

	const handleSave = async () => {
		const isFormValid = await trigger();
		if (!isFormValid) return;
		await handleFormSubmit();
		handleClose();
	};

	const handleClose = useCallback(() => {
		reset();
		onClose();
	}, [reset, onClose]);

	return (
		<Modal
			isOpen={isOpen}
			onClose={handleClose}
			size="md"
			placement="center"
			isDismissable={false}
			hideCloseButton
		>
			<ModalContent>
				{() => (
					<>
						<ModalHeader className="flex flex-col p-0">
							{t("quick_contact_modal_title", "Creación rápida de contacto")}
							<P className="text-small text-default-500 font-normal">
								{t(
									"quick_contact_modal_description",
									"Ingresa los detalles básicos para crear un contacto."
								)}
							</P>
						</ModalHeader>
						<ModalBody className="p-0 mt-4">
							<form
								className="flex flex-col gap-4"
								onSubmit={(e) => {
									e.preventDefault();
									handleSave();
								}}
								noValidate
							>
								{/* First Name Field */}
								<Controller
									name="firstName"
									control={control}
									render={({ field }) => (
										<Input
											{...field}
											label={t("field_first_name", "Nombres")}
											placeholder={t(
												"placeholder_enter_first_name",
												"Ingresa los nombres"
											)}
											isRequired
											isInvalid={!!errors.firstName}
											errorMessage={errors.firstName?.message}
											onBlur={() => {
												field.onBlur();
												trigger("firstName");
											}}
										/>
									)}
								/>

								{/* Last Name Field */}
								<Controller
									name="lastName"
									control={control}
									render={({ field }) => (
										<Input
											{...field}
											label={t("field_last_name", "Apellidos")}
											placeholder={t(
												"placeholder_enter_last_name",
												"Ingresa los apellidos"
											)}
											isRequired
											isInvalid={!!errors.lastName}
											errorMessage={errors.lastName?.message}
											onBlur={() => {
												field.onBlur();
												trigger("lastName");
											}}
										/>
									)}
								/>

								{/* Phone Field */}
								<Controller
									name="phone"
									control={control}
									render={({ field }) => (
										<Phone
											label={t("quick_contact_phone_label", "Teléfono")}
											value={toPhoneValue(field.value)}
											onChange={(phoneValue) => {
												field.onChange(toDomainPhone(phoneValue, field.value));
											}}
											onBlur={() => {
												field.onBlur();
												trigger("phone");
											}}
											required
											error={!!errors.phone}
											errorText={
												errors.phone?.number?.message || errors.phone?.message
											}
										/>
									)}
								/>

								{/* Email Field */}
								<Controller
									name="email"
									control={control}
									render={({ field }) => (
										<Input
											{...field}
											label={t(
												"quick_contact_email_label",
												"Correo electrónico"
											)}
											placeholder={t(
												"placeholder_enter_email",
												"Ingresa el correo electrónico"
											)}
											type="email"
											isRequired
											isInvalid={!!errors.email}
											errorMessage={errors.email?.message}
											onBlur={() => {
												field.onBlur();
												trigger("email");
											}}
										/>
									)}
								/>
							</form>
						</ModalBody>
						<ModalFooter className="flex p-0 mt-4">
							<Button
								color="default"
								variant="flat"
								onPress={handleClose}
								className="flex-1"
								isDisabled={isLoading}
							>
								{t("button_cancel", "Cancelar")}
							</Button>
							<Button
								color="primary"
								onPress={handleSave}
								isDisabled={!isValid || isLoading}
								className="flex-1"
								isLoading={isLoading}
							>
								{t("button_save", "Guardar")}
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	);
};
