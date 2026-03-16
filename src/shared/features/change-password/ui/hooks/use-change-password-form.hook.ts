import { useAuraToast } from "@beweco/aurora-ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslate } from "@tolgee/react";
import { useCallback, useMemo, useState, type BaseSyntheticEvent } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { passwordCriteria } from "../../domain/validation/password-validation";
import { ChangePassword } from "../DependencyInjection";

const createValidationSchema = (
	t: (key: string, fallback?: string) => string
) => {
	return z
		.object({
			password: z
				.string()
				.min(
					8,
					t(
						"validation_password_min_length",
						"La contraseña debe tener al menos 8 caracteres"
					)
				)
				.regex(
					/[A-Z]/,
					t(
						"validation_password_uppercase",
						"La contraseña debe contener al menos una mayúscula"
					)
				)
				.regex(
					/[a-z]/,
					t(
						"validation_password_lowercase",
						"La contraseña debe contener al menos una minúscula"
					)
				)
				.regex(
					/[0-9]/,
					t(
						"validation_password_number",
						"La contraseña debe contener al menos un número"
					)
				),
			confirmPassword: z.string(),
		})
		.refine((data) => data.password === data.confirmPassword, {
			message: t(
				"validation_password_mismatch",
				"Las contraseñas no coinciden"
			),
			path: ["confirmPassword"],
		});
};

type ChangePasswordFormData = z.infer<
	ReturnType<typeof createValidationSchema>
>;

export const useChangePasswordForm = (
	onSuccess: () => void | Promise<void>
) => {
	const { t } = useTranslate();
	const { showToast } = useAuraToast();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitError, setSubmitError] = useState<string | null>(null);

	const validationSchema = useMemo(
		() =>
			createValidationSchema(t as (key: string, fallback?: string) => string),
		[t]
	);

	const form = useForm<ChangePasswordFormData>({
		resolver: zodResolver(validationSchema),
		defaultValues: {
			password: "",
			confirmPassword: "",
		},
		mode: "onChange",
	});

	const passwordValue = form.watch("password");

	const criteriaMet = useMemo(
		() =>
			passwordCriteria.map((c) => ({
				label: c.label,
				passed: c.test(passwordValue),
			})),
		[passwordValue]
	);

	const handleSubmit = useCallback(
		(e?: BaseSyntheticEvent) =>
			form.handleSubmit(async (data) => {
				setIsSubmitting(true);
				setSubmitError(null);

				const result = await ChangePassword({
					password: data.password,
				});

				if (result.isSuccess) {
					showToast({
						color: "success",
						title: t("change_password_success_title", "Contraseña actualizada"),
						description: t(
							"change_password_success_description",
							"Tu contraseña ha sido configurada correctamente"
						),
					});
					await onSuccess();
				} else {
					setSubmitError(
						result.error?.message ||
							t("change_password_error", "Error al cambiar la contraseña")
					);
				}

				setIsSubmitting(false);
			})(e),
		[form, onSuccess, showToast, t]
	);

	return {
		...form,
		isSubmitting,
		submitError,
		handleSubmit,
		t,
		criteriaMet,
	};
};
