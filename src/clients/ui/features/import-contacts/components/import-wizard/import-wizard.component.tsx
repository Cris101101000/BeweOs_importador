import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Wizard,
	type WizardStep,
} from "@beweco/aurora-ui";
import {
	EnumImportStep,
	EnumProcessStatus,
} from "@clients/domain/enums/import-status.enum";
import { useTranslate } from "@tolgee/react";
import { type FC, useCallback, useEffect, useMemo, useState } from "react";
import { useImportStore } from "../../store/useImportStore";
import { AnalysisStep } from "../analysis-step/analysis-step.component";
import { ConfirmationStep } from "../confirmation-step/confirmation-step.component";
import { MappingStep } from "../mapping-step/mapping-step.component";
import { UploadStep } from "../upload-step/upload-step.component";

interface ImportWizardProps {
	isOpen: boolean;
	onClose: () => void;
}

const STEP_MAP: Record<string, number> = {
	[EnumImportStep.UPLOAD]: 1,
	[EnumImportStep.ANALYSIS]: 2,
	[EnumImportStep.MAPPING]: 3,
	[EnumImportStep.CONFIRMATION]: 4,
};

const NUMBER_TO_STEP: Record<number, string> = {
	1: EnumImportStep.UPLOAD,
	2: EnumImportStep.ANALYSIS,
	3: EnumImportStep.MAPPING,
	4: EnumImportStep.CONFIRMATION,
};

export const ImportWizard: FC<ImportWizardProps> = ({ isOpen, onClose }) => {
	const { t } = useTranslate();
	const [showExitConfirm, setShowExitConfirm] = useState(false);
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const check = () => setIsMobile(window.innerWidth < 640);
		check();
		window.addEventListener("resize", check);
		return () => window.removeEventListener("resize", check);
	}, []);

	const { currentStep, processStatus, result, reset, goToStep } =
		useImportStore();

	const currentStepNumber = STEP_MAP[currentStep] || 1;

	const steps: WizardStep[] = useMemo(
		() => [
			{
				number: 1,
				title: t("import_contacts_step_upload"),
				icon: "solar:upload-minimalistic-outline",
			},
			{
				number: 2,
				title: t("import_contacts_step_analysis"),
				icon: "solar:document-text-outline",
			},
			{
				number: 3,
				title: t("import_contacts_step_mapping"),
				icon: "solar:link-minimalistic-2-outline",
			},
			{
				number: 4,
				title: t("import_contacts_step_confirmation"),
				icon: "solar:check-circle-outline",
			},
		],
		[t]
	);

	const handleStepChange = useCallback(
		(stepNumber: number) => {
			const step = NUMBER_TO_STEP[stepNumber];
			if (step) {
				goToStep(step as typeof currentStep);
			}
		},
		[goToStep]
	);

	const handleClose = useCallback(() => {
		// Si está procesando, no permitir cerrar
		if (processStatus === EnumProcessStatus.PROCESSING) return;

		// Si ya terminó, cerrar directo
		if (processStatus === EnumProcessStatus.DONE) {
			reset();
			onClose();
			return;
		}

		// Si hay datos cargados, confirmar salida
		const hasData = currentStep !== EnumImportStep.UPLOAD;
		if (hasData) {
			setShowExitConfirm(true);
		} else {
			reset();
			onClose();
		}
	}, [processStatus, currentStep, reset, onClose]);

	const handleConfirmExit = useCallback(() => {
		setShowExitConfirm(false);
		reset();
		onClose();
	}, [reset, onClose]);

	const handleGoToContacts = useCallback(() => {
		reset();
		onClose();
	}, [reset, onClose]);

	const renderStep = useCallback((step: WizardStep) => {
		switch (step.number) {
			case 1:
				return <UploadStep />;
			case 2:
				return <AnalysisStep />;
			case 3:
				return <MappingStep />;
			case 4:
				return <ConfirmationStep />;
			default:
				return null;
		}
	}, []);

	return (
		<>
			<Modal
				isOpen={isOpen}
				onClose={handleClose}
				size={isMobile ? "full" : "5xl"}
				scrollBehavior="inside"
				isDismissable={false}
				hideCloseButton={processStatus === EnumProcessStatus.PROCESSING}
				aria-labelledby="import-wizard-title"
			>
				<ModalContent>
					<ModalHeader className="flex flex-col items-start gap-1">
						<h2 id="import-wizard-title" className="text-xl font-semibold">
							{t("import_contacts_title")}
						</h2>
						{currentStep === EnumImportStep.UPLOAD && (
							<p className="text-xs text-default-400 font-normal">
								{t("import_upload_formats_hint")}
							</p>
						)}
					</ModalHeader>
					<ModalBody className="p-0 overflow-x-hidden">
						<Wizard
							steps={steps}
							currentStep={currentStepNumber}
							onStepChange={handleStepChange}
							renderStep={renderStep}
							showSidebar={false}
							navigationConfig={{
								showNavigationButtons: false,
							}}
							minHeight="auto"
							className="import-wizard-content"
						/>
					</ModalBody>
					{processStatus === EnumProcessStatus.DONE && result && (
						<ModalFooter>
							<Button color="primary" onPress={handleGoToContacts}>
								{t("import_result_go_to_contacts")}
							</Button>
						</ModalFooter>
					)}
				</ModalContent>
			</Modal>

			{/* Modal de confirmación de salida */}
			<Modal
				isOpen={showExitConfirm}
				onClose={() => setShowExitConfirm(false)}
				size="sm"
			>
				<ModalContent>
					<ModalHeader>{t("import_exit_confirm_title")}</ModalHeader>
					<ModalBody>
						<p className="text-sm text-default-600">
							{t("import_exit_confirm_message")}
						</p>
					</ModalBody>
					<ModalFooter>
						<Button variant="light" onPress={() => setShowExitConfirm(false)}>
							{t("import_exit_confirm_stay")}
						</Button>
						<Button color="danger" onPress={handleConfirmExit}>
							{t("import_exit_confirm_leave")}
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};
