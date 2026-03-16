import { MultiStepWizard } from "@beweco/aurora-ui";
import type { MultiStepWizardTranslations, Step } from "@beweco/aurora-ui";
import type { EnumClientStatus } from "@clients/domain/enums/client-status.enum";
import { useTranslate } from "@tolgee/react";
import { type FC, useCallback } from "react";
import { useClientCreation } from "./hooks/use-client-creation.hook";

import type {
	ClientCreationWizardProps,
	IBasicInfo,
	ISegmentInfo,
} from "./client-creation-wizard.types";
import {
	WizardValidationProvider,
	useWizardValidation,
} from "./contexts/wizard-validation.context";
import { BasicInfoStep } from "./steps/basic-info-step/basic-info-step.component";
import { ConfirmationStep } from "./steps/confirmation-step/confirmation-step.component";
import { SegmentationStep } from "./steps/segmentation-step/segmentation-step.component";
import { StatusStep } from "./steps/status-step/status-step.component";
import { useFormWizard } from "./store/useFormWizard";

/**
 * Inner wizard component that uses the validation context
 */
const ClientCreationWizardInner: FC<ClientCreationWizardProps> = ({
	isOpen,
	onClose,
	onSuccess,
}) => {
	const { t } = useTranslate();
	const { stepValidities, resetValidities } = useWizardValidation();
	const { createClient, clearError } = useClientCreation();

	// Store del wizard
	const { formData, updateBasicInfo, updateSegment, updateStatus, reset } =
		useFormWizard();

	const onUpdateBasicInfo = useCallback(
		(data: IBasicInfo) => {
			updateBasicInfo(data);
		},
		[updateBasicInfo]
	);

	const onUpdateSegment = useCallback(
		(data: ISegmentInfo) => {
			updateSegment(data);
		},
		[updateSegment]
	);

	const onUpdateStatus = useCallback(
		(data: EnumClientStatus) => {
			updateStatus(data);
		},
		[updateStatus]
	);

	const handleCancel = useCallback(() => {
		// Reset estado del store y cerrar
		reset();
		// Reset step validities
		resetValidities();
		onClose();
	}, [onClose, reset, resetValidities]);

	const handleSubmit = useCallback(async () => {
		// Clear any previous errors
		clearError();

		// Create the client using the use case
		await createClient(formData);

		// Call success callback with the form data
		onSuccess(formData);

		// Reset and close the wizard
		handleCancel();
	}, [formData, createClient, onSuccess, handleCancel, clearError]);
	const steps: Step[] = [
		{
			title: t("wizard_step_basic_info", "Información básica"),
			description: t(
				"wizard_step_basic_info_desc",
				"Ingresa los datos clave para identificar al contacto"
			),
			content: (
				<BasicInfoStep
					data={formData.basicInfo}
					onUpdate={onUpdateBasicInfo}
					stepIndex={0}
				/>
			),
			isStepValid: stepValidities[0],
			isCompleted: stepValidities[0],
		},
		{
			title: t("wizard_step_segment", "Segmentación"),
			description: t(
				"wizard_step_segment_desc",
				"Agrega datos adicionales como cumpleaños, fuente o etiquetas"
			),
			content: (
				<SegmentationStep
					data={formData.segment}
					onUpdate={onUpdateSegment}
					stepIndex={1}
				/>
			),
			isStepValid: stepValidities[1],
			isCompleted: stepValidities[1],
		},
		{
			title: t("wizard_step_preferences", "Estado"),
			description: t(
				"wizard_step_preferences_desc",
				"Indica en qué punto del proceso está este contacto"
			),
			content: (
				<StatusStep
					data={formData.status}
					onUpdate={onUpdateStatus}
					stepIndex={2}
				/>
			),
			isStepValid: stepValidities[2],
			isCompleted: stepValidities[2],
		},
		{
			title: t("wizard_step_review", "Revisión y confirmación"),
			description: t(
				"wizard_step_review_desc",
				"Revisa y confirma la información del cliente"
			),
			content: <ConfirmationStep data={formData} stepIndex={3} />,
			isStepValid: true,
			isCompleted: false,
		},
	];

	const translations: MultiStepWizardTranslations = {
		continue: t("button_next", "Siguiente"),
		goBack: t("button_previous", "Anterior"),
		cancel: t("button_cancel", "Cancelar"),
		next: t("button_next", "Siguiente"),
		complete: t("button_create_client", "Crear cliente"),
	};

	return (
		<MultiStepWizard
			isOpen={isOpen}
			steps={steps}
			translations={translations}
			onClose={handleCancel}
			onComplete={handleSubmit}
		/>
	);
};

/**
 * Multi-step wizard for creating new clients using Aurora UI's MultiStepWizard
 * Includes basic info, address, and preferences steps with validation context
 */
export const ClientCreationWizard: FC<ClientCreationWizardProps> = (props) => {
	return (
		<WizardValidationProvider>
			<ClientCreationWizardInner {...props} />
		</WizardValidationProvider>
	);
};
