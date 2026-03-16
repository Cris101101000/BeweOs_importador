import {
	Button,
	Modal,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from "@beweco/aurora-ui";
import type { FC } from "react";

interface WhatsAppSetupIntroModalProps {
	isOpen: boolean;
	onClose: () => void;
	onStartSetup: () => void;
}

const WhatsAppSetupIntroModal: FC<WhatsAppSetupIntroModalProps> = ({
	isOpen,
	onClose,
	onStartSetup,
}) => {
	return (
		<Modal isOpen={isOpen} onClose={onClose} size="md" placement="center">
			<ModalContent>
				<ModalHeader className="flex flex-col gap-1 pb-4">
					<h2 className="text-xl font-semibold text-gray-900">
						¡Conectemos la línea de WhatsApp!
					</h2>
					<p className="text-sm font-normal text-gray-500 mt-1">
						Te enseñamos cómo en pocos pasos podrás vincular tu cuenta de
						Facebook para poder enviar notificaciones por WhatsApp a tus
						clientes. ¡Es fácil y rápido!
					</p>
				</ModalHeader>

				<ModalFooter className="gap-2 pt-0">
					<Button
						variant="flat"
						color="default"
						onPress={onClose}
						className="flex-1"
					>
						Cancelar
					</Button>
					<Button color="primary" onPress={onStartSetup} className="flex-1">
						Empezar vinculación
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default WhatsAppSetupIntroModal;
