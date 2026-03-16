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
import { SmartTagStatus } from "../../../domain/enums/smart-tag-status.enum.ts";
import { SmartTagType } from "../../../domain/enums/smart-tag-type.enum.ts";
import type { ISmartTag } from "../../../domain/interfaces/smart-tags-interface.ts";
import { getApplicableEntityValues } from "../../../infrastructure/utils/applicable-entity.util.ts";

export interface EditSmartTagFormData {
	name: string;
	description: string;
	keywords: string;
	color: string;
	type: SmartTagType;
	applicableEntities: string[];
	status: SmartTagStatus;
	isTemporary: boolean;
	temporaryDuration: string;
}

export interface EditSmartTagFormErrors {
	name: string;
	description: string;
	keywords: string;
}

interface EditSmartTagModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (formData: EditSmartTagFormData) => Promise<void>;
	tag: ISmartTag | null;
	isLoading?: boolean;
}

export const EditSmartTagModal = ({
	isOpen,
	onClose,
	onSubmit,
	tag,
	isLoading = false,
}: EditSmartTagModalProps) => {
	const { t } = useTranslate();

	const [formData, setFormData] = useState<EditSmartTagFormData>({
		name: "",
		description: "",
		keywords: "",
		color: "#EC4899",
		type: SmartTagType.INTEREST,
		applicableEntities: [],
		status: SmartTagStatus.ACTIVE,
		isTemporary: false,
		temporaryDuration: "",
	});

	const [formErrors, setFormErrors] = useState<EditSmartTagFormErrors>({
		name: "",
		description: "",
		keywords: "",
	});

	const [isStatusSelectOpen, setIsStatusSelectOpen] = useState(false);
	const [isTypeSelectOpen, setIsTypeSelectOpen] = useState(false);
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

	// Load tag data when modal opens
	useEffect(() => {
		if (tag && isOpen) {
			setFormData({
				name: tag.name,
				description: tag.description,
				keywords: tag.keywords.join(", "),
				color: tag.color,
				type: tag.type,
				// Use applicableEntities array directly from tag
				applicableEntities: [...tag.applicableEntities],
				status: tag.status,
				isTemporary: tag.isTemporary,
				temporaryDuration: tag.temporaryDuration?.toString() || "",
			});
			setFormErrors({
				name: "",
				description: "",
				keywords: "",
			});
		}
	}, [tag, isOpen]);

	const handleFormChange = (
		field: keyof EditSmartTagFormData,
		value: string | boolean | SmartTagType | SmartTagStatus | string[]
	) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		// Clear error when user types
		if (formErrors[field as keyof EditSmartTagFormErrors]) {
			setFormErrors((prev) => ({ ...prev, [field]: "" }));
		}
	};

	const validateForm = (): boolean => {
		const errors: EditSmartTagFormErrors = {
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
		if (!validateForm() || !tag) {
			return;
		}

		try {
			await onSubmit(formData);
		} catch (error) {
			// Error is already handled by parent component
			// Just prevent modal close on error
		}
	};

	const handleClose = () => {
		setIsStatusSelectOpen(false);
		setIsTypeSelectOpen(false);
		setIsApplicableSelectOpen(false);
		if (tag) {
			setFormData({
				name: tag.name,
				description: tag.description,
				keywords: tag.keywords.join(", "),
				color: tag.color,
				type: tag.type,
				// Use applicableEntities array directly from tag
				applicableEntities: [...tag.applicableEntities],
				status: tag.status,
				isTemporary: tag.isTemporary,
				temporaryDuration: tag.temporaryDuration?.toString() || "",
			});
		}
		setFormErrors({
			name: "",
			description: "",
			keywords: "",
		});
		onClose();
	};

	if (!tag) {
		return null;
	}

	return (
		<Modal
			isOpen={isOpen}
			onClose={handleClose}
			size="md"
			placement="center"
			hideCloseButton
			isDismissable={
				!isLoading &&
				!isStatusSelectOpen &&
				!isTypeSelectOpen &&
				!isApplicableSelectOpen
			}
		>
			<ModalContent>
				{() => (
					<>
						<ModalHeader className="flex flex-col p-0 gap-0.5">
							{t("smart_tags_edit_modal_title", "Editar etiqueta")}
							<p className="text-small text-default-500 font-normal">
								{t(
									"smart_tags_edit_modal_subtitle",
									"Actualiza las características de esta etiqueta"
								)}
							</p>
						</ModalHeader>
						<ModalBody className="p-0 mt-4">
							<form
								className="flex flex-col gap-3"
								onSubmit={(e) => e.preventDefault()}
								noValidate
							>
								{/* Name and Status Row */}
								<div className="grid grid-cols-2 gap-3">
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
										isDisabled={!tag.isCustom}
									/>
									<Select
										label={t("smart_tags_form_status_label", "Estado")}
										placeholder={t(
											"smart_tags_form_status_placeholder",
											"Selecciona"
										)}
										selectedKeys={formData.status ? [formData.status] : []}
										onSelectionChange={(keys) => {
											const selectedKey = Array.from(keys)[0] as string;
											if (selectedKey) {
												handleFormChange(
													"status",
													selectedKey as SmartTagStatus
												);
											}
										}}
										onOpenChange={(open: boolean) => {
											setIsStatusSelectOpen(open);
										}}
										isRequired
										classNames={{
											trigger: "z-10",
											popoverContent: "z-[9999]",
										}}
									>
										<SelectItem key={SmartTagStatus.ACTIVE}>
											{t("smart_tags_status_active", "Activa")}
										</SelectItem>
										<SelectItem key={SmartTagStatus.INACTIVE}>
											{t("smart_tags_status_inactive", "Inactiva")}
										</SelectItem>
										<SelectItem key={SmartTagStatus.DRAFT}>
											{t("smart_tags_status_draft", "Deprecada")}
										</SelectItem>
									</Select>
								</div>

								{/* Description Field */}
								<Textarea
									label="Descripción"
									placeholder="Describe el tipo de cliente que tendrá esta etiqueta..."
									minRows={2}
									value={formData.description}
									onValueChange={(value) =>
										handleFormChange("description", value)
									}
									isInvalid={!!formErrors.description}
									errorMessage={formErrors.description}
									isRequired
									description={`${formData.description.length}/60 caracteres`}
									isDisabled={!tag.isCustom}
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
									isDisabled={!tag.isCustom}
								/>

								{/* Type Selection */}
								<Select
									label={t("smart_tags_form_type_label", "Tipo de etiqueta")}
									placeholder={t(
										"smart_tags_form_type_placeholder",
										"Selecciona un tipo"
									)}
									selectedKeys={formData.type ? [formData.type] : []}
									onSelectionChange={(keys) => {
										const selectedKey = Array.from(keys)[0] as SmartTagType;
										if (selectedKey) {
											handleFormChange("type", selectedKey);
										}
									}}
									onOpenChange={(open: boolean) => {
										setIsTypeSelectOpen(open);
									}}
									isRequired
									isDisabled={!tag.isCustom}
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
										isDisabled={!tag.isCustom}
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
											isDisabled={!tag.isCustom}
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
											isDisabled={!tag.isCustom}
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
								{t("button_save_changes", "Guardar cambios")}
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	);
};
