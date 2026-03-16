import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from "@beweco/aurora-ui";
import { useTranslate } from "@tolgee/react";
import type { FC } from "react";

interface WhatsAppDeactivateModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	isLoading?: boolean;
	phoneNumber?: string;
}

const WhatsAppDeactivateModal: FC<WhatsAppDeactivateModalProps> = ({
	isOpen,
	onClose,
	onConfirm,
	isLoading = false,
	phoneNumber,
}) => {
	const { t } = useTranslate();

	return (
		<Modal isOpen={isOpen} onClose={onClose} size="md">
			<ModalContent>
				<ModalHeader className="flex flex-col gap-1">
					<h3 className="text-lg font-semibold text-zinc-900">
						Desactivar WhatsApp Business
					</h3>
					<p className="text-sm text-zinc-600 font-normal">
						¿Estás seguro de que deseas desactivar esta integración?
					</p>
				</ModalHeader>

				<ModalBody>
					<div className="space-y-4">
						<div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
							<div className="flex-shrink-0">
								<svg
									className="w-5 h-5 text-yellow-600 mt-0.5"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path
										fillRule="evenodd"
										d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
										clipRule="evenodd"
									/>
								</svg>
							</div>
							<div className="flex-1">
								<h4 className="text-sm font-medium text-yellow-800">
									Consecuencias de desactivar
								</h4>
								<ul className="mt-2 text-sm text-yellow-700 space-y-1">
									<li>• Los mensajes automáticos se pausarán</li>
									<li>• No recibirás nuevas conversaciones</li>
									<li>• Las plantillas de mensaje quedarán inactivas</li>
									<li>• Podrás reactivar en cualquier momento</li>
								</ul>
							</div>
						</div>

						{phoneNumber && (
							<div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
								<div className="flex items-center gap-2">
									<span className="text-sm text-gray-600">
										Número asociado:
									</span>
									<span className="text-sm font-medium text-gray-900">
										{phoneNumber}
									</span>
								</div>
							</div>
						)}
					</div>
				</ModalBody>

				<ModalFooter>
					<Button
						color="default"
						variant="light"
						onPress={onClose}
						isDisabled={isLoading}
					>
						Cancelar
					</Button>
					<Button
						color="danger"
						variant="solid"
						onPress={onConfirm}
						isLoading={isLoading}
					>
						{isLoading ? "Desactivando..." : "Sí, desactivar"}
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default WhatsAppDeactivateModal;
