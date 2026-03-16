import {
	Button,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Select,
	SelectItem,
	Switch,
	Textarea,
} from "@beweco/aurora-ui";
import type React from "react";
import { useEffect, useState } from "react";
import type { BehaviorRulePriorityLabel } from "../../../../../domain/behavior-rules";
import type { ICreateRuleModalProps } from "../../types";

export const CreateRuleModal: React.FC<ICreateRuleModalProps> = ({
	isOpen,
	onClose,
	onSave,
	isLoading = false,
	initialValues,
}) => {
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [priority, setPriority] = useState<BehaviorRulePriorityLabel>("media");
	const [isActive, setIsActive] = useState(true);

	// Initialize form with initial values when provided
	useEffect(() => {
		if (initialValues) {
			setName(initialValues.name);
			setDescription(initialValues.description);
			setPriority(initialValues.priority);
			setIsActive(initialValues.isActive);
		} else if (isOpen && !initialValues) {
			// Reset form only when opening without initial values
			setName("");
			setDescription("");
			setPriority("media");
			setIsActive(true);
		}
	}, [initialValues, isOpen]);

	const handleSave = () => {
		if (!name.trim() || !description.trim()) {
			return;
		}

		onSave({
			name: name.trim(),
			description: description.trim(),
			priority,
			isActive,
		});

		// Only reset form after successful save (when onSave completes successfully)
		// The parent component will handle closing the modal on success
	};

	const handleClose = () => {
		// Reset form when closing
		setName("");
		setDescription("");
		setPriority("media");
		setIsActive(true);
		onClose();
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={handleClose}
			size="lg"
			placement="center"
			hideCloseButton
			isDismissable={false}
			scrollBehavior="inside"
		>
			<ModalContent>
				{() => (
					<>
						<ModalHeader className="flex flex-col gap-1">
							Crear nueva norma de comportamiento
						</ModalHeader>
						<ModalBody>
							<form
								className="flex flex-col gap-4"
								onSubmit={(e) => e.preventDefault()}
								noValidate
							>
								{/* Name Field */}
								<Input
									label="Nombre de la norma"
									placeholder="Ej: Respuesta sobre precios"
									value={name}
									onValueChange={setName}
									isRequired
								/>

								{/* Description Field */}
								<Textarea
									label="Descripción de la norma"
									placeholder="Describe en detalle cómo debe comportarse Linda en esta situación..."
									minRows={4}
									value={description}
									onValueChange={setDescription}
									isRequired
								/>

								{/* Priority Field */}
								<Select
									label="Prioridad de la norma"
									placeholder="Seleccionar prioridad"
									selectedKeys={[priority]}
									onSelectionChange={(keys) =>
										setPriority(
											Array.from(keys)[0] as BehaviorRulePriorityLabel
										)
									}
									isRequired
								>
									<SelectItem key="alta">Alta</SelectItem>
									<SelectItem key="media">Media</SelectItem>
									<SelectItem key="baja">Baja</SelectItem>
								</Select>

								{/* Active/Inactive Toggle */}
								<div className="flex items-center justify-between p-3 bg-default-50 rounded-lg">
									<div className="flex flex-col">
										<label className="text-small font-medium text-foreground">
											Estado de la norma
										</label>
										<p className="text-xs text-default-500">
											{isActive
												? "La norma estará activa y se aplicará"
												: "La norma estará inactiva y no se aplicará"}
										</p>
									</div>
									<Switch isSelected={isActive} onValueChange={setIsActive} />
								</div>
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
								isDisabled={isLoading || !name.trim() || !description.trim()}
								isLoading={isLoading}
								className="flex-1"
							>
								Crear norma
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	);
};
