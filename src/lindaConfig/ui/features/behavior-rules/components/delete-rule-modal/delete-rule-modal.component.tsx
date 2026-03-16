import {
	Button,
	IconComponent,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	P,
} from "@beweco/aurora-ui";
import type React from "react";
import type { IDeleteRuleModalProps } from "../../types";

export const DeleteRuleModal: React.FC<IDeleteRuleModalProps> = ({
	isOpen,
	onClose,
	onConfirm,
	rule,
	isLoading = false,
}) => {
	const handleConfirm = () => {
		if (!rule) return;
		onConfirm(rule.id);
	};

	if (!rule) return null;

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			size="md"
			placement="center"
			hideCloseButton
		>
			<ModalContent>
				{() => (
					<>
						<ModalHeader className="flex flex-col gap-1">
							<div className="flex items-center gap-3">
								<div className="flex items-center justify-center w-10 h-10 bg-danger-100 rounded-full">
									<IconComponent
										icon="solar:trash-bin-minimalistic-bold"
										size="sm"
										className="text-danger-600"
									/>
								</div>
								<span className="text-danger-900 font-semibold">
									Eliminar norma de comportamiento
								</span>
							</div>
						</ModalHeader>
						<ModalBody>
							<div className="space-y-4">
								<P className="text-default-600">
									¿Estás seguro de que quieres eliminar esta norma de
									comportamiento? Esta acción no se puede deshacer.
								</P>

								<div className="bg-default-50 border border-default-200 rounded-lg p-4">
									<P className="font-medium text-default-900 mb-2">
										Norma a eliminar:
									</P>
									<P className="text-sm text-default-700 font-semibold mb-1">
										"{rule.name}"
									</P>
									{rule.description && (
										<P className="text-xs text-default-500 italic mt-2">
											{rule.description.length > 150
												? `${rule.description.substring(0, 150)}...`
												: rule.description}
										</P>
									)}
								</div>

								<div className="bg-warning-50 border border-warning-200 rounded-lg p-3">
									<div className="flex items-start gap-2">
										<IconComponent
											icon="solar:danger-triangle-bold"
											size="sm"
											className="text-warning-600 mt-0.5 flex-shrink-0"
										/>
										<div>
											<P className="text-sm font-medium text-warning-800">
												Advertencia
											</P>
											<P className="text-xs text-warning-700 mt-1">
												Al eliminar esta norma, Linda dejará de aplicar este
												comportamiento en las conversaciones. Los clientes
												podrían recibir respuestas diferentes a las
												configuradas.
											</P>
										</div>
									</div>
								</div>
							</div>
						</ModalBody>
						<ModalFooter>
							<Button
								color="default"
								variant="flat"
								onPress={onClose}
								isDisabled={isLoading}
								className="flex-1"
							>
								Cancelar
							</Button>
							<Button
								color="danger"
								onPress={handleConfirm}
								isDisabled={isLoading}
								isLoading={isLoading}
								className="flex-1"
								startContent={
									!isLoading ? (
										<IconComponent
											icon="solar:trash-bin-minimalistic-bold"
											size="sm"
										/>
									) : undefined
								}
							>
								Eliminar norma
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	);
};
