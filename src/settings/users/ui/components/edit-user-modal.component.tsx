import {
	Avatar,
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
import { getFullName } from "@shared/utils/user-name.utils";
import { useTranslate } from "@tolgee/react";
import type React from "react";
import { useEffect } from "react";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import type { IRole, IUser } from "../../domain/interfaces/user.interface";

export interface EditUserFormData {
	firstname: string;
	lastname?: string;
	email: string;
	role: string;
}

interface EditUserModalProps {
	isOpen: boolean;
	onClose: () => void;
	onEdit: (data: EditUserFormData) => void;
	user: IUser | null;
}

/**
 * Renders a modal for editing an existing user.
 */
export const EditUserModal: React.FC<EditUserModalProps> = ({
	isOpen,
	onClose,
	onEdit,
	user,
}) => {
	const { t } = useTranslate();
	const {
		control,
		handleSubmit,
		reset,
		formState: { errors, isValid },
	} = useForm<EditUserFormData>({
		mode: "onChange", // Para validar en cada cambio
		defaultValues: {
			firstname: user?.firstname ?? "",
			lastname: user?.lastname ?? "",
			email: user?.email ?? "",
			role: user?.roles[0]?.value ?? "admin", // Usar el primer rol o 'admin'
		},
	});

	useEffect(() => {
		if (user) {
			reset({
				firstname: user.firstname,
				lastname: user.lastname,
				email: user.email,
				role: user.roles[0]?.value ?? "admin", // Usar el primer rol o 'admin'
			});
		}
	}, [user, reset]);

	const roles: IRole[] = [
		{ value: "admin", label: t("role_admin") },
		{ value: "user", label: t("role_user") },
	];

	const onSubmit: SubmitHandler<EditUserFormData> = (data) => {
		onEdit(data);
		onClose();
	};

	return (
		<Modal isOpen={isOpen} onOpenChange={onClose}>
			<ModalContent>
				<form onSubmit={handleSubmit(onSubmit)}>
					<ModalHeader className="flex flex-col pt-0">
						<h2 className="text-lg font-semibold">
							{t("settings_users_edit_title")}
						</h2>
						<p className="text-sm text-default-500 font-normal">
							{t("settings_users_edit_description")}
						</p>
					</ModalHeader>

					<ModalBody>
						{user && (
							<div className="flex items-center gap-3 bg-default-100 p-4 rounded-xl mb-4">
								<Avatar
									src={user.avatar}
									name={getFullName(user.firstname, user.lastname)}
									size="lg"
								/>
								<div className="flex flex-col">
									<p className="text-sm font-semibold text-default-600">
										{getFullName(user.firstname, user.lastname)}
									</p>
									<p className="text-xs text-default-500">
										{user.roles[0]?.label}
									</p>
									<p className="text-xs text-default-500">{user.email}</p>
								</div>
							</div>
						)}

						<div className="flex flex-col gap-4">
							<Controller
								name="firstname"
								control={control}
								rules={{
									required: t("field_required") as string,
									minLength: {
										value: 2,
										message: t("validation_min_length_2") as string,
									},
								}}
								render={({ field }) => (
									<Input
										isRequired
										{...field}
										label={t("field_firstname")}
										placeholder={t("placeholder_enter_firstname")}
										isInvalid={!!errors.firstname}
										errorMessage={errors.firstname?.message}
									/>
								)}
							/>
							<Controller
								name="lastname"
								control={control}
								render={({ field }) => (
									<Input
										{...field}
										label={t("field_lastname")}
										placeholder={t("placeholder_enter_lastname")}
										isInvalid={!!errors.lastname}
										errorMessage={errors.lastname?.message}
									/>
								)}
							/>
							<Controller
								name="role"
								control={control}
								rules={{ required: t("field_required") as string }}
								render={({ field }) => (
									<div>
										<Select
											label={t("field_role")}
											placeholder={t("placeholder_select_role")}
											selectedKeys={field.value ? [field.value] : []}
											onSelectionChange={(keys) =>
												field.onChange(Array.from(keys)[0])
											}
											isInvalid={!!errors.role}
											isDisabled={true}
											isRequired
										>
											{roles.map((role) => (
												<SelectItem key={role.value} textValue={t(role.label)}>
													{t(role.label)}
												</SelectItem>
											))}
										</Select>
										{errors.role && (
											<p className="text-tiny text-danger mt-1">
												{errors.role.message}
											</p>
										)}
									</div>
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
										isInvalid={!!errors.email}
										errorMessage={errors.email?.message}
									/>
								)}
							/>
						</div>
					</ModalBody>
					<ModalFooter className="flex flex-col gap-2">
						<Button color="primary" type="submit" isDisabled={!isValid}>
							{t("button_save_changes")}
						</Button>
						<Button color="default" variant="flat" onPress={onClose}>
							{t("button_cancel")}
						</Button>
					</ModalFooter>
				</form>
			</ModalContent>
		</Modal>
	);
};
