import {
	Button,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Select,
	SelectItem,
} from "@beweco/aurora-ui";
import { isValidEmail } from "@shared/utils/form-validations.utils";
import { useTranslate } from "@tolgee/react";
import type React from "react";
import { useMemo } from "react";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import type {
	InviteUserFormData,
	InviteUserModalProps,
} from "./invite-user-modal.types";

/**
 * A modal component that provides a form to invite a new user by email and role.
 * It handles its own form state and validation using `react-hook-form`.
 *
 * @param {InviteUserModalProps} props - The props for the component.
 */
export const InviteUserModal: React.FC<InviteUserModalProps> = ({
	isOpen,
	onClose,
	onInvite,
}) => {
	const { t } = useTranslate();
	const {
		control,
		handleSubmit,
		reset,
		formState: { errors, isValid },
	} = useForm<InviteUserFormData>({
		mode: "onChange",
		defaultValues: {
			email: "",
			role: "admin",
		},
	});

	/**
	 * Memoized list of roles for the select input.
	 * This prevents the array from being recreated on every render.
	 */
	const roles = useMemo(
		() => [
			{ value: "admin", label: t("role_admin") },
			{ value: "user", label: t("role_user") },
		],
		[t]
	);

	/**
	 * Handles the form submission.
	 * It calls the onInvite callback, resets the form to its default values,
	 * and closes the modal.
	 * @param {InviteUserFormData} data - The validated form data.
	 */
	const onSubmit: SubmitHandler<InviteUserFormData> = (data) => {
		onInvite(data);
		reset({ email: "", role: "admin" });
		onClose();
	};

	return (
		<Modal isOpen={isOpen} onOpenChange={onClose}>
			<ModalContent>
				<form onSubmit={handleSubmit(onSubmit)}>
					<ModalHeader className="flex flex-col pt-0">
						<h2 className="text-lg font-medium">
							{t("settings_users_invite_title")}
						</h2>
						<p className="text-sm text-default-500 font-normal">
							{t("settings_users_invite_description")}
						</p>
					</ModalHeader>
					<ModalBody className="py-0">
						<div className="flex flex-col gap-4">
							<Controller
								name="role"
								control={control}
								rules={{ required: t("field_required") as string }}
								render={({ field }) => (
									<Select
										isRequired
										label={t("field_role")}
										placeholder={t("placeholder_select_role")}
										isInvalid={!!errors.role}
										selectedKeys={field.value ? [field.value] : []}
										defaultSelectedKeys={["admin"]}
										onSelectionChange={(keys) =>
											field.onChange(Array.from(keys)[0])
										}
										isDisabled={true}
									>
										{roles.map((role) => (
											<SelectItem key={role.value} textValue={role.label}>
												{role.label}
											</SelectItem>
										))}
									</Select>
								)}
							/>
							<Controller
								name="email"
								control={control}
								rules={{
									required: t("field_required") as string,
									validate: (value) =>
										isValidEmail(value) ||
										(t("invalid_email_format") as string),
								}}
								render={({ field }) => (
									<Input
										isRequired
										{...field}
										type="email"
										label={t("field_email")}
										placeholder={t("placeholder_enter_email")}
										isInvalid={!!errors.email}
										errorMessage={errors.email?.message}
									/>
								)}
							/>
						</div>
					</ModalBody>
					<ModalFooter className="pb-0 !pt-5">
						<Button color="default" variant="flat" onPress={onClose}>
							{t("button_cancel")}
						</Button>
						<Button color="primary" type="submit" isDisabled={!isValid}>
							{t("button_send_invitation")}
						</Button>
					</ModalFooter>
				</form>
			</ModalContent>
		</Modal>
	);
};
