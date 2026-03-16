import {
	Button,
	IconComponent,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from "@beweco/aurora-ui";
export interface SuccessModalProps {
	isOpen: boolean;
	onClose: () => void;
	title?: string;
	message?: string;
	instructions?: string;
	buttonText?: string;
	hideCloseButton?: boolean;
}

/**
 * Modal de éxito reutilizable
 * @param isOpen - Estado de visibilidad del modal
 * @param onClose - Función para cerrar el modal
 * @param title - Título personalizado (opcional, usa traducción por defecto)
 * @param message - Mensaje personalizado (opcional, usa traducción por defecto)
 * @param instructions - Instrucciones personalizadas (opcional, usa traducción por defecto)
 * @param buttonText - Texto del botón personalizado (opcional, usa traducción por defecto)
 */
export const SuccessModal = ({
	isOpen,
	onClose,
	title,
	message,
	instructions,
	buttonText,
	hideCloseButton = false,
}: SuccessModalProps) => {
	return (
		<Modal
			isOpen={isOpen}
			isDismissable={false}
			onClose={onClose}
			size="md"
			hideCloseButton={hideCloseButton}
		>
			<ModalContent>
				<ModalHeader className="flex flex-col gap-1 text-center pb-2">
					<div className="flex items-center justify-center mb-4">
						<div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
							<IconComponent
								icon="solar:check-circle-bold-duotone"
								className="w-6 h-6 text-green-600"
							/>
						</div>
					</div>
					<h3 className="text-lg font-semibold text-gray-900">{title}</h3>
				</ModalHeader>
				<ModalBody className="text-center px-6">
					<p className="text-gray-600 mb-4">{message}</p>
					<p className="text-sm text-gray-500">{instructions}</p>
				</ModalBody>
				<ModalFooter className="flex justify-center pt-6">
					<Button color="primary" onPress={onClose} className="px-8">
						{buttonText}
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};
