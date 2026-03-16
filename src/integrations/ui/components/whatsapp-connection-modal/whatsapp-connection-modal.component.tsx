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

interface WhatsAppConnectionModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConnect: () => void | Promise<void>;
	isLoading?: boolean;
}

const WhatsAppConnectionModal: FC<WhatsAppConnectionModalProps> = ({
	isOpen,
	onClose,
	onConnect,
	isLoading = false,
}) => {
	// Wrap async handler to avoid type errors with onPress
	const handleConnect = () => {
		void onConnect();
	};
	return (
		<Modal isOpen={isOpen} onClose={onClose} size="md" placement="center">
			<ModalContent>
				<ModalHeader className="flex flex-col gap-1">
					<div className="flex items-center gap-3">
						<div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg">
							<svg
								className="w-6 h-6 text-green-600"
								viewBox="0 0 24 24"
								fill="currentColor"
							>
								<title>WhatsApp Business</title>
								<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.063" />
							</svg>
						</div>
						<div>
							<h2 className="text-xl font-semibold">Conectar WhatsApp</h2>
							<p className="text-sm text-default-600">
								Autoriza la conexión con Meta
							</p>
						</div>
					</div>
				</ModalHeader>

				<ModalBody>
					<div className="space-y-4">
						{/* Beneficios */}
						<div>
							<h3 className="font-medium text-default-900 mb-2">
								Con esta integración podrás:
							</h3>
							<ul className="space-y-2 text-sm text-default-600">
								<li className="flex items-center gap-2">
									<svg
										className="w-4 h-4 text-success-500"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<title>Automático</title>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M5 13l4 4L19 7"
										/>
									</svg>
									Automatizar respuestas y gestionar conversaciones
								</li>
								<li className="flex items-center gap-2">
									<svg
										className="w-4 h-4 text-success-500"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<title>Gestión</title>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M5 13l4 4L19 7"
										/>
									</svg>
									Gestionar clientes desde un solo lugar
								</li>
								<li className="flex items-center gap-2">
									<svg
										className="w-4 h-4 text-success-500"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<title>Plantillas</title>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M5 13l4 4L19 7"
										/>
									</svg>
									Usar plantillas de mensajes aprobadas
								</li>
								<li className="flex items-center gap-2">
									<svg
										className="w-4 h-4 text-success-500"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<title>Métricas</title>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M5 13l4 4L19 7"
										/>
									</svg>
									Obtener métricas y análisis detallados
								</li>
							</ul>
						</div>

						{/* Advertencia */}
						<div className="p-3 bg-warning-50 border border-warning-200 rounded-lg">
							<div className="flex items-start gap-2">
								<svg
									className="w-5 h-5 text-warning-600 mt-0.5"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<title>Advertencia</title>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z"
									/>
								</svg>
								<div className="text-sm">
									<p className="font-medium text-warning-800">Importante</p>
									<p className="text-warning-700">
										Solo puedes conectar una línea de WhatsApp Business por
										agencia. Asegúrate de usar el número correcto para tu
										negocio.
									</p>
								</div>
							</div>
						</div>

						{/* Proceso */}
						<div>
							<h3 className="font-medium text-default-900 mb-2">
								Proceso de conexión:
							</h3>
							<ol className="space-y-1 text-sm text-default-600">
								<li>1. Serás redirigido a Meta para autorizar la conexión</li>
								<li>2. Selecciona tu cuenta de WhatsApp Business</li>
								<li>3. Autoriza los permisos necesarios</li>
								<li>4. Regresarás automáticamente a BeweOS</li>
							</ol>
						</div>
					</div>
				</ModalBody>

				<ModalFooter>
					<Button variant="light" onPress={onClose} isDisabled={isLoading}>
						Cancelar
					</Button>
					<Button
						color="success"
						onPress={handleConnect}
						isLoading={isLoading}
						className="bg-green-600 hover:bg-green-700"
					>
						{isLoading ? "Conectando..." : "Conectar vía Meta"}
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default WhatsAppConnectionModal;
