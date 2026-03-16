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
	Textarea,
} from "@beweco/aurora-ui";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import type { BehaviorRulePriorityLabel } from "../../../../../domain/behavior-rules";
import type { IEditRuleModalProps } from "../../types";

export const EditRuleModal: React.FC<IEditRuleModalProps> = ({
	isOpen,
	onClose,
	onSave,
	onDelete,
	rule,
	isLoading = false,
	initialValues,
}) => {
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [priority, setPriority] = useState<BehaviorRulePriorityLabel>("media");
	const [isActive, setIsActive] = useState(true);
	const previousRuleIdRef = useRef<string | null>(null);
	const previousIsOpenRef = useRef<boolean>(false);
	const previousInitialValuesDescriptionRef = useRef<string | null>(null);

	useEffect(() => {
		if (rule && isOpen && !isLoading) {
			const isModalJustOpened = !previousIsOpenRef.current && isOpen;
			const isDifferentRule = previousRuleIdRef.current !== rule.id;
			
			// Check if initialValues changed (track by description)
			const hasInitialValues = !!initialValues;
			const initialValuesChanged = hasInitialValues && 
				previousInitialValuesDescriptionRef.current !== initialValues.description;

			// Priority: use initialValues if provided (e.g., from problem modal with suggestions)
			// Otherwise use rule values
			const valuesToUse = initialValues || rule;

			const shouldReset = isModalJustOpened || isDifferentRule || 
				(hasInitialValues && (initialValuesChanged || !previousInitialValuesDescriptionRef.current));

			if (shouldReset) {
				setName(valuesToUse.name);
				setDescription(valuesToUse.description);
				setPriority(valuesToUse.priority);
				setIsActive(valuesToUse.isActive ?? true);
				previousRuleIdRef.current = rule.id;
				if (initialValues) {
					previousInitialValuesDescriptionRef.current = initialValues.description;
				} else {
					previousInitialValuesDescriptionRef.current = null;
				}
			}
		}

		// Always update isOpen ref to track modal state
		previousIsOpenRef.current = isOpen;
		
		// Only update rule.id ref when not loading to avoid interfering with updates
		if (rule && !isLoading) {
			previousRuleIdRef.current = rule.id;
		}
	}, [rule, isOpen, isLoading, initialValues]);

	const handleSave = () => {
		if (!rule || !name.trim() || !description.trim()) {
			return;
		}

		onSave({
			id: rule.id,
			name: name.trim(),
			description: description.trim(),
			priority,
			isActive,
		});
	};

	const handleDelete = () => {
		if (!rule || !onDelete) return;

		if (
			confirm(
				"¿Estás seguro de que quieres eliminar esta norma de comportamiento? Esta acción no se puede deshacer."
			)
		) {
			onDelete(rule.id);
		}
	};

	const handleClose = () => {
		onClose();
	};

	if (!rule) return null;

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
							Editar norma de comportamiento
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
									description="Describe claramente qué debe hacer Linda y cómo debe actuar"
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
									description="Las normas con mayor prioridad se aplican primero"
								>
									<SelectItem key="alta">Alta</SelectItem>
									<SelectItem key="media">Media</SelectItem>
									<SelectItem key="baja">Baja</SelectItem>
								</Select>
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
								Actualizar norma
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	);
};
