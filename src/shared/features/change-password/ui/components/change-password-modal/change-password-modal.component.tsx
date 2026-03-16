import {
	Button,
	InputPassword,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from "@beweco/aurora-ui";
import { Controller } from "react-hook-form";
import { useChangePasswordForm } from "../../hooks/use-change-password-form.hook";

interface ChangePasswordModalProps {
	isOpen: boolean;
	onSuccess: () => void;
}

export const ChangePasswordModal = ({
	isOpen,
	onSuccess,
}: ChangePasswordModalProps) => {
	const {
		control,
		handleSubmit,
		isSubmitting,
		submitError,
		t,
		criteriaMet,
		formState: { errors, isValid, dirtyFields },
	} = useChangePasswordForm(onSuccess);

	return (
		<Modal
			isOpen={isOpen}
			isDismissable={false}
			hideCloseButton={true}
			isKeyboardDismissDisabled={true}
			placement="center"
			backdrop="opaque"
			classNames={{
				backdrop: "bg-black/50",
			}}
		>
			<ModalContent>
				<form onSubmit={handleSubmit}>
					<ModalHeader className="flex flex-col gap-1 text-center pt-6">
						<h3 className="text-2xl font-serif italic px-4 font-normal">
							{t(
								"change_password_title",
								"Configura tu contraseña"
							)}
						</h3>
					</ModalHeader>
					<ModalBody className="px-8 pb-4">
						<p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed text-center mb-4">
							{t(
								"change_password_description",
								"Para acceder a BeweOS, necesitas configurar una contraseña segura."
							)}
						</p>

						<div className="flex flex-col gap-4">
							<Controller
								name="password"
								control={control}
								render={({ field }) => (
									<InputPassword
										{...field}
										isRequired
										label={t(
											"field_password",
											"Contraseña"
										)}
										placeholder={t(
											"placeholder_password",
											"Ingresa tu contraseña"
										)}
										isInvalid={!!errors.password}
										errorMessage={
											errors.password?.message
										}
										showCriteria
										criteria={criteriaMet}
										isPristine={!dirtyFields.password}
										renderCriterionLabel={(label) =>
											t(label)
										}
									/>
								)}
							/>
							<Controller
								name="confirmPassword"
								control={control}
								render={({ field }) => (
									<InputPassword
										{...field}
										isRequired
										label={t(
											"field_confirm_password",
											"Confirmar contraseña"
										)}
										placeholder={t(
											"placeholder_confirm_password",
											"Repite tu contraseña"
										)}
										isInvalid={!!errors.confirmPassword}
										errorMessage={
											errors.confirmPassword?.message
										}
									/>
								)}
							/>

							{submitError ? (
								<p className="text-danger text-sm text-center">
									{submitError}
								</p>
							) : null}
						</div>
					</ModalBody>
					<ModalFooter className="pb-6 px-8">
						<Button
							color="primary"
							type="submit"
							isDisabled={!isValid}
							isLoading={isSubmitting}
							className="w-full rounded-full font-bold"
							size="lg"
						>
							{t(
								"button_save_password",
								"Guardar contraseña"
							)}
						</Button>
					</ModalFooter>
				</form>
			</ModalContent>
		</Modal>
	);
};
