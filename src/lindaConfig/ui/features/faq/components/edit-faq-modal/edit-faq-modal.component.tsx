import {
	Button,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Switch,
	Textarea,
} from "@beweco/aurora-ui";
import type React from "react";
import { useEffect, useState } from "react";
import type { IEditFAQModalProps } from "../../types";

export const EditFAQModal: React.FC<IEditFAQModalProps> = ({
	isOpen,
	onClose,
	onSave,
	onDelete,
	faq,
	isLoading = false,
}) => {
	const [question, setQuestion] = useState("");
	const [answer, setAnswer] = useState("");
	const [isActive, setIsActive] = useState(true);

	// Reset form when faq changes or modal opens
	useEffect(() => {
		if (faq && isOpen) {
			setQuestion(faq.question);
			setAnswer(faq.answer || "");
			setIsActive(faq.isActive);
		}
	}, [faq, isOpen]);

	const handleSave = () => {
		if (!faq || !question.trim() || !answer.trim()) {
			return;
		}

		onSave({
			id: faq.id,
			question: question.trim(),
			answer: answer.trim(),
			isActive,
		});
	};

	const handleDelete = () => {
		if (!faq || !onDelete) return;

		if (
			confirm(
				"¿Estás seguro de que quieres eliminar esta pregunta frecuente? Esta acción no se puede deshacer."
			)
		) {
			onDelete(faq.id);
		}
	};

	const handleClose = () => {
		onClose();
	};

	if (!faq) return null;

	return (
		<Modal
			isOpen={isOpen}
			onClose={handleClose}
			size="2xl"
			placement="center"
			hideCloseButton
		>
			<ModalContent>
				{() => (
					<>
						<ModalHeader className="flex flex-col gap-1">
							Editar pregunta frecuente
						</ModalHeader>
						<ModalBody>
							<div className="space-y-4">
								{/* Active/Inactive Toggle */}
								<div className="flex items-center justify-between p-3 bg-default-50 rounded-lg">
									<div className="flex flex-col">
										<label className="text-small font-medium text-foreground">
											Estado de la pregunta
										</label>
										<p className="text-xs text-default-500">
											{isActive
												? "Activa - La pregunta está disponible"
												: "Borrador - La pregunta está en desarrollo"}
										</p>
									</div>
									<Switch
										isSelected={isActive}
										onValueChange={setIsActive}
										color={isActive ? "success" : "warning"}
									/>
								</div>

								{/* Question Field */}
								<Input
									label="Pregunta del cliente"
									placeholder="¿Cómo puedo reservar una sesión?"
									value={question}
									onValueChange={setQuestion}
									isRequired
									description="Escribe la pregunta que los clientes suelen hacer"
								/>

								{/* Answer Field */}
								<Textarea
									label="Respuesta de Linda"
									placeholder="Para reservar una sesión, puedes..."
									rows={4}
									value={answer}
									onValueChange={setAnswer}
									isRequired
									description="Proporciona una respuesta completa y útil para esta pregunta"
								/>
							</div>
						</ModalBody>
						<ModalFooter className="flex justify-between">
							<div>
								{onDelete && (
									<Button
										color="danger"
										variant="light"
										onPress={handleDelete}
										isDisabled={isLoading}
									>
										Eliminar Pregunta
									</Button>
								)}
							</div>
							<div className="flex gap-2">
								<Button
									variant="flat"
									color="default"
									onPress={handleClose}
									isDisabled={isLoading}
								>
									Cancelar
								</Button>
								<Button
									color="primary"
									onPress={handleSave}
									isDisabled={isLoading || !question.trim() || !answer.trim()}
									isLoading={isLoading}
								>
									Guardar Cambios
								</Button>
							</div>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	);
};
