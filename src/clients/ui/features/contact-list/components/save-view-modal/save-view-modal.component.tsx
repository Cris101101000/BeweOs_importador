import {
	Button,
	H2,
	H4,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	P,
	useAuraToast,
} from "@beweco/aurora-ui";
import { useTranslate } from "@tolgee/react";
import { type FC, useCallback, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { EnumErrorType } from "@shared/domain/enums/enum-error-type.enum";
import {
	TRANSLATION_KEYS,
	VALIDATION_CONSTANTS,
} from "@shared/ui/constants/basic-info-form.constants";
import {
	configureErrorToastWithTranslation,
	configureSuccessToast,
} from "@shared/utils/toast-config.utils";
import { useViewsContext } from "@clients/ui/_shared/contexts/views.context";
import { tableFiltersToClientFilter } from "@clients/ui/_shared/mappers/table-filters-to-client-filter.mapper";
import { useFilterSummary } from "./hooks/use-filter-summary.hook";
import type { SaveViewModalProps } from "./save-view-modal.types";

/**
 * SaveViewModal Component
 *
 * Modal para guardar una vista personalizada con resumen de filtros aplicados
 */
export const SaveViewModal: FC<SaveViewModalProps> = ({
	isOpen,
	onClose,
	appliedFilters,
	isLoading = false,
	onViewCreated,
}) => {
	const { t } = useTranslate();
	const { showToast } = useAuraToast();

	// Hook para manejar vistas
	const { createView, isLoading: isCreatingView } = useViewsContext();

	const filterSummary = useFilterSummary(appliedFilters);

	// react-hook-form
	const {
		control,
		handleSubmit,
		reset,
		formState: { errors, isValid, isDirty },
	} = useForm<{ viewName: string }>({
		mode: "onChange",
		defaultValues: { viewName: "" },
	});

	// Resetear formulario cuando se abre el modal
	useEffect(() => {
		if (isOpen) {
			reset({ viewName: "" });
		}
	}, [isOpen, reset]);

	// Manejar guardar vista (submit)
	const onSubmit = useCallback(
		async (data: { viewName: string }) => {
			try {
				// Convertir filtros de UI a dominio
				const domainFilters = tableFiltersToClientFilter(appliedFilters);
				// Crear la vista usando el caso de uso
				await createView({
					name: data.viewName.trim(),
					filters: domainFilters,
				});

				// Toast de éxito con interpolación correcta
				const viewName = data.viewName.trim();
				showToast(
					configureSuccessToast(
						t("save_view_success", `Vista ${viewName} creada exitosamente`)
					)
				);

				// Notificar al componente padre si es necesario
				onViewCreated?.();

				onClose();
			} catch (error) {
				showToast(
					configureErrorToastWithTranslation(
						EnumErrorType.Critical,
						t,
						"saved_views_error_saving_view",
						error instanceof Error ? error.message : "Error al crear la vista"
					)
				);
			}
		},
		[createView, appliedFilters, onClose, t, showToast, onViewCreated]
	);

	// Manejar cancelar
	const handleCancel = useCallback(() => {
		onClose();
	}, [onClose]);

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			isDismissable={!isLoading && !isCreatingView}
			hideCloseButton={isLoading || isCreatingView}
		>
			<ModalContent>
				<form onSubmit={handleSubmit(onSubmit)}>
					<ModalHeader className="flex flex-col p-0">
						<H2>{t("save_view_modal_title")}</H2>
						<P>{t("save_view_modal_description")}</P>
					</ModalHeader>

					<ModalBody className="px-0 py-4">
						{/* Campo de nombre con react-hook-form (Controller) */}
						<div>
							<Controller
								name="viewName"
								control={control}
								rules={{
									required: {
										value: true,
										message: t(
											TRANSLATION_KEYS.requiredField,
											"Este campo es requerido"
										),
									},
									minLength: {
										value: 2,
										message: t("validation_min_length", {
											count: 2,
											defaultValue: "Mínimo 2 caracteres",
										}),
									},
									maxLength: {
										value: VALIDATION_CONSTANTS.name.maxLength,
										message: t(
											TRANSLATION_KEYS.nameMaxLength,
											"El nombre no puede exceder 50 caracteres"
										),
									},
								}}
								render={({ field }) => (
									<Input
										{...field}
										label={t("save_view_name_label", "Nombre de la vista")}
										placeholder={t(
											"save_view_name_placeholder",
											"Mi vista personalizada"
										)}
										isInvalid={!!errors.viewName}
										errorMessage={errors.viewName?.message}
										isRequired
										variant="bordered"
										isDisabled={isLoading || isCreatingView}
										maxLength={50}
									/>
								)}
							/>
						</div>

						{/* Resumen de columnas/filtros */}
						<>
							<H4>{t("save_view_summary_title", "Resumen de columnas")}</H4>
							<div className="rounded-xl bg-default-100 p-4">
								{filterSummary.length > 0 ? (
									<div className="flex flex-col gap-1">
										{filterSummary.map((filter) => (
											<div key={filter.filterName} className=" flex  gap-2">
												{/* Nombre del filtro */}
												<P className="font-medium text-foreground">
													{filter.filterName}:
												</P>

												{/* Valores del filtro */}
												<div className="flex gap-1">
													<P>{filter.values.join(", ")}</P>
												</div>
											</div>
										))}
									</div>
								) : (
									<div className="text-center py-8 text-default-500">
										<P className="text-sm">
											{t("save_view_no_filters", "No hay filtros aplicados")}
										</P>
									</div>
								)}
							</div>
						</>
					</ModalBody>

					<ModalFooter className="gap-3 p-0">
						<Button
							color="default"
							variant="flat"
							onPress={handleCancel}
							isDisabled={isLoading || isCreatingView}
							className="flex-1"
							type="button"
						>
							{t("button_cancel", "Cancelar")}
						</Button>
						<Button
							color="primary"
							isLoading={isLoading || isCreatingView}
							isDisabled={!isValid || !isDirty || isLoading || isCreatingView}
							className="flex-1"
							type="submit"
						>
							{t("save_view_save_button", "Guardar")}
						</Button>
					</ModalFooter>
				</form>
			</ModalContent>
		</Modal>
	);
};
