import {
	IconComponent,
	Modal,
	ModalBody,
	ModalContent,
	P,
	Spinner,
} from "@beweco/aurora-ui";
import type React from "react";
import { useMemo } from "react";
import { TrainingStatus } from "src/shared/features/linda/ingestion/domain/enums/training-status.enum";

interface TrainingStatusModalProps {
	isOpen: boolean;
	status: TrainingStatus | null;
}

export const TrainingStatusModal: React.FC<TrainingStatusModalProps> = ({
	isOpen,
	status,
}) => {
	// Normalize status comparison to handle string/enum differences
	const normalizedStatus = useMemo(() => {
		if (status === null) return "in_progress";
		const statusStr = String(status);
		if (statusStr === "completed" || status === TrainingStatus.COMPLETED)
			return "completed";
		if (statusStr === "error" || status === TrainingStatus.ERROR)
			return "error";
		return "in_progress";
	}, [status]);

	return (
		<Modal isOpen={isOpen} isDismissable={false} hideCloseButton size="sm">
			<ModalContent>
				<ModalBody className="py-10">
					{normalizedStatus === "in_progress" && <InProgressState />}
					{normalizedStatus === "completed" && <CompletedState />}
					{normalizedStatus === "error" && <ErrorState />}
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};

// ============================================================================
// Sub-components
// ============================================================================

const InProgressState: React.FC = () => (
	<div className="flex flex-col items-center justify-center space-y-4">
		<div className="relative">
			<Spinner size="lg" color="primary" />
		</div>
		<div className="text-center">
			<P className="text-lg font-medium text-foreground mb-1">
				Entrenando a Linda...
			</P>
			<p className="text-sm text-default-500">
				Esto puede tomar unos minutos. Por favor, no cierres esta ventana.
			</p>
		</div>
	</div>
);

const CompletedState: React.FC = () => (
	<div className="flex flex-col items-center justify-center space-y-4">
		<div className="w-16 h-16 rounded-full bg-success-100 flex items-center justify-center">
			<IconComponent
				icon="solar:check-circle-bold"
				size="xl"
				className="text-success"
			/>
		</div>
		<div className="text-center">
			<P className="text-lg font-medium text-foreground mb-1">
				¡Entrenamiento completado!
			</P>
			<P className="text-sm text-default-500">
				Linda ha aprendido la nueva información correctamente.
			</P>
		</div>
	</div>
);

const ErrorState: React.FC = () => (
	<div className="flex flex-col items-center justify-center space-y-4">
		<div className="w-16 h-16 rounded-full bg-danger-100 flex items-center justify-center">
			<IconComponent
				icon="solar:danger-triangle-bold"
				size="xl"
				className="text-danger"
			/>
		</div>
		<div className="text-center">
			<P className="text-lg font-medium text-foreground mb-1">
				Error en el entrenamiento
			</P>
			<P className="text-sm text-default-500">
				Ocurrió un error durante el entrenamiento. Por favor, intenta de nuevo.
			</P>
		</div>
	</div>
);
