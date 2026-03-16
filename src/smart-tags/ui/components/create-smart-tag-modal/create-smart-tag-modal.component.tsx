import {
	Button,
	IconComponent,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Select,
	SelectItem,
	type Selection,
	Switch,
	Textarea,
	Tooltip,
} from "@beweco/aurora-ui";
import { useTranslate } from "@tolgee/react";
import { useEffect, useMemo, useState } from "react";
import { APPLICABLE_ENTITY_CONFIG } from "../../../domain/constants/applicable-entity.config.ts";
import { SMART_TAG_TYPES_CONFIG } from "../../../domain/constants/smart-tag-types.config.ts";
import { ApplicableEntity } from "../../../domain/enums/applicable-entity.enum.ts";
import { SmartTagType } from "../../../domain/enums/smart-tag-type.enum.ts";
import { getApplicableEntityValues } from "../../../infrastructure/utils/applicable-entity.util.ts";

export interface CreateSmartTagFormData {
	name: string;
	description: string;
	keywords: string;
	color: string;
	types: SmartTagType[];
	applicableEntities: string[];
	isTemporary: boolean;
	temporaryDuration: string;
}

export interface CreateSmartTagFormErrors {
	name: string;
	description: string;
	keywords: string;
}

interface CreateSmartTagModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (formData: CreateSmartTagFormData) => Promise<void>;
	isLoading?: boolean;
	initialName?: string;
	defaultApplicableEntities?: string[];
	onTagCreated?: (formData: CreateSmartTagFormData) => void;
}

export const CreateSmartTagModal = ({
	isOpen,
	onClose,
	onSubmit,
	isLoading = false,
	initialName = "",
	defaultApplicableEntities,
	onTagCreated,
}: CreateSmartTagModalProps) => {
	const { t } = useTranslate();

	// Determine the default applicable entities
	const getDefaultApplicableEntities = () => {
		if (defaultApplicableEntities && defaultApplicableEntities.length > 0) {
			return defaultApplicableEntities;
		}
		return [ApplicableEntity.COMMUNICATION, ApplicableEntity.CLIENT];
	};

	const [formData, setFormData] = useState<CreateSmartTagFormData>({
		name: initialName,
		description: "",
		keywords: "",
		color: "#EC4899",
		types: [SmartTagType.INTEREST],
		applicableEntities: getDefaultApplicableEntities(),
		isTemporary: false,
		temporaryDuration: "",
	});

	// Update form when initialName or defaultApplicableEntities change
	useEffect(() => {
		if (isOpen) {
			setFormData((prev) => ({
				...prev,
				name: initialName,
				applicableEntities: getDefaultApplicableEntities(),
			}));
		}
	}, [isOpen, initialName, defaultApplicableEntities]);

	const [formErrors, setFormErrors] = useState<CreateSmartTagFormErrors>({
		name: "",
		description: "",
		keywords: "",
	});

	const [isSelectOpen, setIsSelectOpen] = useState(false);
	const [isApplicableSelectOpen, setIsApplicableSelectOpen] = useState(false);

	// Generate applicable entities options dynamically from enum
	const applicableEntityOptions = useMemo(() => {
		return getApplicableEntityValues().map((entity) => {
			// Capitalize fallback: first letter uppercase, rest lowercase
			const capitalizedFallback =
				entity.charAt(0).toUpperCase() + entity.slice(1).toLowerCase();
			return {
				value: entity,
				label: t(
					APPLICABLE_ENTITY_CONFIG[entity].translationKey,
					capitalizedFallback
				),
			};
		});
	}, [t]);

	const handleFormChange = (
		field: keyof CreateSmartTagFormData,
		value: string | boolean | SmartTagType[] | string[]
	) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		// Clear error when user types
		if (formErrors[field as keyof CreateSmartTagFormErrors]) {
			setFormErrors((prev) => ({ ...prev, [field]: "" }));
		}
	};

	const validateForm = (): boolean => {
		const errors: CreateSmartTagFormErrors = {
			name: "",
			description: "",
			keywords: "",
		};

		if (!formData.name.trim()) {
			errors.name = t(
				"smart_tags_validation_name_required",
				"El nombre es requerido"
			);
		}

		if (formData.description.length < 40) {
			errors.description = t("smart_tags_validation_description_min", {
				count: formData.description.length,
			});
		}

		setFormErrors(errors);
		return !errors.name && !errors.description;
	};

	const handleSubmit = async () => {
		if (!validateForm()) {
			return;
		}

		if (formData.types.length === 0) {
			setFormErrors((prev) => ({
				...prev,
				name: t(
					"smart_tags_validation_type_required",
					"Debes seleccionar al menos un tipo de etiqueta"
				),
			}));
			return;
		}

		try {
			await onSubmit(formData);

			// Call the onTagCreated callback if provided
			if (onTagCreated) {
				onTagCreated(formData);
			}

			// Reset form after successful submission
			setFormData({
				name: "",
				description: "",
				keywords: "",
				color: "#EC4899",
				types: [SmartTagType.INTEREST],
				applicableEntities: getDefaultApplicableEntities(),
				isTemporary: false,
				temporaryDuration: "",
			});
			setFormErrors({
				name: "",
				description: "",
				keywords: "",
			});
		} catch (error) {
			// Error is already handled by parent component
			// Just prevent form reset on error
		}
	};

	const handleClose = () => {
		setIsSelectOpen(false);
		setIsApplicableSelectOpen(false);
		setFormData({
			name: "",
			description: "",
			keywords: "",
			color: "#EC4899",
			types: [SmartTagType.INTEREST],
			applicableEntities: getDefaultApplicableEntities(),
			isTemporary: false,
			temporaryDuration: "",
		});
		setFormErrors({
			name: "",
			description: "",
			keywords: "",
		});
		onClose();
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={handleClose}
			size="md"
			placement="center"
			hideCloseButton
			isDismissable={!isLoading && !isSelectOpen && !isApplicableSelectOpen}
		>
			<ModalContent>
				{() => (
					<>
						<ModalHeader className="flex flex-col p-0 gap-0.5">
							{t("smart_tags_create_modal_title", "Crear etiqueta")}
							<p className="text-small text-default-500 font-normal">
								{t(
									"smart_tags_create_modal_subtitle",
									"Define las características de esta etiqueta"
								)}
							</p>
						</ModalHeader>
						<ModalBody className="p-0 mt-4">
							<form
								className="flex flex-col gap-3"
								onSubmit={(e) => e.preventDefault()}
								noValidate
							>
								{/* Name Field */}
								<Input
									label={t(
										"smart_tags_form_name_label",
										"Nombre de la etiqueta"
									)}
									placeholder={t(
										"smart_tags_form_name_placeholder",
										"Ej: Cliente Premium"
									)}
									value={formData.name}
									onValueChange={(value) => handleFormChange("name", value)}
									isRequired
									isInvalid={!!formErrors.name}
									errorMessage={formErrors.name}
								/>

								{/* Description Field */}
								<Textarea
									label={t("smart_tags_form_description_label", "Descripción")}
									placeholder={t(
										"smart_tags_form_description_placeholder",
										"Describe el tipo de cliente que tendrá esta etiqueta..."
									)}
									minRows={2}
									value={formData.description}
									onValueChange={(value) =>
										handleFormChange("description", value)
									}
									isInvalid={!!formErrors.description}
									errorMessage={formErrors.description}
									isRequired
									description={t("smart_tags_form_description_count", {
										count: formData.description.length,
									})}
								/>

								{/* Keywords Field */}
								<Input
									label={t("smart_tags_form_keywords_label", "Palabras clave")}
									placeholder={t(
										"smart_tags_form_keywords_placeholder",
										"running, maratón, fitness"
									)}
									value={formData.keywords}
									onValueChange={(value) => handleFormChange("keywords", value)}
									isInvalid={!!formErrors.keywords}
									errorMessage={formErrors.keywords}
								/>

								{/* Type Selection */}
								<div onClick={(e) => e.stopPropagation()}>
									<Select
										label={t("smart_tags_form_type_label", "Tipo de etiqueta")}
										placeholder={t(
											"smart_tags_form_type_placeholder",
											"Selecciona uno o más tipos"
										)}
										selectedKeys={new Set(formData.types)}
										onSelectionChange={(keys: Selection) => {
											if (keys === "all") return;
											const selectedTypes = Array.from(keys) as SmartTagType[];
											handleFormChange("types", selectedTypes);
										}}
										onOpenChange={(open: boolean) => {
											setIsSelectOpen(open);
										}}
										isRequired
										description={t(
											"smart_tags_form_type_description",
											"Clasifica el propósito de esta etiqueta"
										)}
										classNames={{
											trigger: "z-10",
											popoverContent: "z-[9999]",
										}}
									>
										{SMART_TAG_TYPES_CONFIG.map((tagType) => (
											<SelectItem
												key={tagType.type}
												startContent={
													<div
														className={`w-3 h-3 rounded-full ${tagType.color}`}
													/>
												}
											>
												{tagType.label}
											</SelectItem>
										))}
									</Select>
								</div>

								{/* Applicable Entities Selection */}
								<div onClick={(e) => e.stopPropagation()}>
									<Select
										label={t("smart_tags_form_applicable_label", "Aplicable")}
										placeholder={t(
											"smart_tags_form_applicable_placeholder",
											"Selecciona dónde aplicar esta etiqueta"
										)}
										selectedKeys={new Set(formData.applicableEntities)}
										onSelectionChange={(keys: Selection) => {
											if (keys === "all") return;
											const selectedEntities = Array.from(keys) as string[];
											handleFormChange("applicableEntities", selectedEntities);
										}}
										onOpenChange={(open: boolean) => {
											setIsApplicableSelectOpen(open);
										}}
										selectionMode="multiple"
										isRequired
										description={t(
											"smart_tags_form_applicable_description",
											"Selecciona dónde se aplicará esta etiqueta"
										)}
										classNames={{
											trigger: "z-10",
											popoverContent: "z-[9999]",
										}}
									>
										{applicableEntityOptions.map((option) => (
											<SelectItem key={option.value}>{option.label}</SelectItem>
										))}
									</Select>
								</div>

								{/* Temporary Tag Option */}
								<div className="flex flex-col gap-2">
									<div className="flex items-center gap-3">
										<p className="text-sm font-medium">
											{t(
												"smart_tags_form_temporary_label",
												"Etiqueta temporal"
											)}
										</p>
										<Tooltip
											content={t(
												"smart_tags_form_temporary_tooltip",
												"La etiqueta se eliminará automáticamente después del período especificado"
											)}
											placement="top"
											className="max-w-xs"
										>
											<IconComponent
												icon="solar:info-circle-line-duotone"
												className="text-default-400 cursor-help"
												size="sm"
											/>
										</Tooltip>
										<Switch
											isSelected={formData.isTemporary}
											onValueChange={(value) =>
												handleFormChange("isTemporary", value)
											}
											size="sm"
										/>
									</div>

									{formData.isTemporary && (
										<Input
											type="number"
											label={t(
												"smart_tags_form_duration_label",
												"Duración (días)"
											)}
											placeholder={t(
												"smart_tags_form_duration_placeholder",
												"30"
											)}
											value={formData.temporaryDuration}
											onValueChange={(value) =>
												handleFormChange("temporaryDuration", value)
											}
											min="1"
											size="sm"
										/>
									)}
								</div>
							</form>
						</ModalBody>
						<ModalFooter className="flex p-0 mt-4">
							<Button
								color="default"
								variant="flat"
								onPress={handleClose}
								className="flex-1"
								isDisabled={isLoading}
							>
								{t("button_cancel", "Cancelar")}
							</Button>
							<Button
								color="primary"
								onPress={handleSubmit}
								className="flex-1"
								isLoading={isLoading}
							>
								{t("smart_tags_create_modal_title", "Crear etiqueta")}
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	);
};
