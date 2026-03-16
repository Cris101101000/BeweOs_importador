import {
	Button,
	IconComponent,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Textarea,
	Tooltip,
} from "@beweco/aurora-ui";
import type React from "react";
import { useEffect, useState } from "react";
import type { ICreateFAQModalProps } from "../../types";

export const CreateFAQModal: React.FC<ICreateFAQModalProps> = ({
	isOpen,
	onClose,
	onSave,
	isLoading = false,
	initialData = null,
}) => {
	const [question, setQuestion] = useState("");
	const [answer, setAnswer] = useState("");

	// Cargar datos iniciales cuando se abre en modo edición
	useEffect(() => {
		if (initialData) {
			setQuestion(initialData.question);
			setAnswer(initialData.answer);
		} else {
			setQuestion("");
			setAnswer("");
		}
	}, [initialData, isOpen]);

	const handleSave = () => {
		if (!question.trim() || !answer.trim()) {
			return;
		}

		onSave({
			question: question.trim(),
			answer: answer.trim(),
		});

		// Reset form
		setQuestion("");
		setAnswer("");
	};

	const handleClose = () => {
		// Reset form when closing
		setQuestion("");
		setAnswer("");
		onClose();
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={handleClose}
			size="lg"
			placement="center"
			hideCloseButton
			scrollBehavior="inside"
		>
			<ModalContent>
				{() => (
					<>
						<ModalHeader className="flex flex-row items-center gap-2">
							<span>
								{initialData
									? "Editar pregunta frecuente"
									: "Crear nueva pregunta frecuente"}
							</span>
							<Tooltip
								content="Las preguntas frecuentes ayudan a Linda a resolver dudas comunes automáticamente, ahorrando tiempo tanto a ti como a tus clientes."
								placement="top"
							>
								<IconComponent
									icon="solar:info-circle-bold"
									size="sm"
									className="text-default-400 cursor-help"
								/>
							</Tooltip>
						</ModalHeader>
						<ModalBody>
							<form
								className="flex flex-col gap-4"
								onSubmit={(e) => e.preventDefault()}
								noValidate
							>
								{/* Question Field */}
								<Textarea
									label="Pregunta del cliente"
									placeholder="¿Cómo puedo reservar una sesión?"
									rows={3}
									value={question}
									onValueChange={setQuestion}
									isRequired
									description="Escribe la pregunta que los clientes suelen hacer"
								/>

								{/* Answer Field */}
								<Textarea
									label="Respuesta de Linda"
									placeholder="Para reservar una sesión, puedes contactarnos a través de..."
									rows={4}
									value={answer}
									onValueChange={setAnswer}
									isRequired
									description="Proporciona una respuesta completa y útil para esta pregunta"
								/>
							</form>
						</ModalBody>
						<ModalFooter>
							<Button
								color="default"
								variant="flat"
								onPress={handleClose}
								className="flex-1"
								isDisabled={isLoading}
							>
								Cancelar
							</Button>
							<Button
								color="primary"
								onPress={handleSave}
								isDisabled={isLoading || !question.trim() || !answer.trim()}
								isLoading={isLoading}
								className="flex-1"
							>
								{initialData ? "Actualizar pregunta" : "Crear pregunta"}
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	);
};
