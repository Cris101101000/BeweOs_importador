import {
	Button,
	Chip,
	IconComponent,
	Select,
	SelectItem,
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
} from "@beweco/aurora-ui";
import {
	ALL_IMPORT_FIELDS,
	REQUIRED_IMPORT_FIELDS,
} from "@clients/domain/constants/import-fields.constants";
import { EnumImportStep } from "@clients/domain/enums/import-status.enum";
import type { IFieldMapping } from "@clients/domain/interfaces/import-contact.interface";
import { EnumCustomPropertyType } from "@clients/domain/interfaces/import-contact.interface";
import { useTranslate } from "@tolgee/react";
import { type FC, useCallback, useMemo, useState } from "react";
import { useImportValidation } from "../../hooks/use-import-validation.hook";
import { useImportStore } from "../../store/useImportStore";

const CUSTOM_PROPERTY_PREFIX = "custom_";

const PROPERTY_TYPE_OPTIONS = [
	{ key: EnumCustomPropertyType.TEXT, label: "Texto", icon: "solar:text-outline" },
	{ key: EnumCustomPropertyType.NUMBER, label: "Número", icon: "solar:hashtag-outline" },
	{ key: EnumCustomPropertyType.DATE, label: "Fecha", icon: "solar:calendar-outline" },
	{ key: EnumCustomPropertyType.BOOLEAN, label: "Sí/No", icon: "solar:check-circle-outline" },
];

/** Detecta el tipo probable de una propiedad según muestras de datos */
function detectPropertyType(values: string[]): EnumCustomPropertyType {
	const nonEmpty = values.filter(Boolean);
	if (nonEmpty.length === 0) return EnumCustomPropertyType.TEXT;

	const allNumbers = nonEmpty.every((v) => /^-?\d+([.,]\d+)?$/.test(v.trim()));
	if (allNumbers) return EnumCustomPropertyType.NUMBER;

	const allBooleans = nonEmpty.every((v) =>
		["0", "1", "sí", "si", "no", "yes", "true", "false"].includes(v.trim().toLowerCase()),
	);
	if (allBooleans) return EnumCustomPropertyType.BOOLEAN;

	const datePattern = /^\d{1,4}[-/]\d{1,2}[-/]\d{1,4}$/;
	const allDates = nonEmpty.every((v) => datePattern.test(v.trim()));
	if (allDates) return EnumCustomPropertyType.DATE;

	return EnumCustomPropertyType.TEXT;
}

export const MappingStep: FC = () => {
	const { t } = useTranslate();
	const [isValidating, setIsValidating] = useState(false);
	const [showUnmapped, setShowUnmapped] = useState(false);
	const [creatingCustomFor, setCreatingCustomFor] = useState<number | null>(null);
	const [customTypeSelection, setCustomTypeSelection] = useState<EnumCustomPropertyType>(EnumCustomPropertyType.TEXT);
	const { validateAndSeparate } = useImportValidation();

	const {
		detectedHeaders,
		rawData,
		fieldMappings,
		customProperties,
		setFieldMappings,
		addCustomProperty,
		removeCustomProperty,
		setValidationResults,
		setDuplicateRecords,
		goToStep,
	} = useImportStore();

	// Contar campos obligatorios vinculados
	const requiredLinked = useMemo(() => {
		const requiredKeys = new Set(REQUIRED_IMPORT_FIELDS.map((f) => f.key));
		return fieldMappings.filter(
			(m) => m.beweField && requiredKeys.has(m.beweField),
		).length;
	}, [fieldMappings]);

	const totalRequired = REQUIRED_IMPORT_FIELDS.length;
	const isRequiredComplete = requiredLinked >= totalRequired;

	// Campos obligatorios faltantes
	const missingRequiredFields = useMemo(() => {
		const assignedKeys = new Set(
			fieldMappings.filter((m) => m.beweField).map((m) => m.beweField),
		);
		return REQUIRED_IMPORT_FIELDS.filter((f) => !assignedKeys.has(f.key));
	}, [fieldMappings]);

	// Detectar campos duplicados
	const duplicateFields = useMemo(() => {
		const counts: Record<string, number> = {};
		for (const m of fieldMappings) {
			if (m.beweField) {
				counts[m.beweField] = (counts[m.beweField] || 0) + 1;
			}
		}
		return new Set(
			Object.entries(counts)
				.filter(([, count]) => count > 1)
				.map(([key]) => key),
		);
	}, [fieldMappings]);

	// Campos ya asignados
	const assignedFields = useMemo(() => {
		return new Set(
			fieldMappings.filter((m) => m.beweField).map((m) => m.beweField),
		);
	}, [fieldMappings]);

	// Separar filas mapeadas y sin mapear
	const mappedRows = useMemo(
		() => fieldMappings.filter((m) => m.beweField),
		[fieldMappings],
	);

	const unmappedRows = useMemo(
		() => fieldMappings.filter((m) => !m.beweField),
		[fieldMappings],
	);

	// Verificar si "notes" está mapeado
	const isNotesMapped = useMemo(
		() => fieldMappings.some((m) => m.beweField === "notes"),
		[fieldMappings],
	);

	const handleFieldChange = useCallback(
		(sourceIndex: number, beweField: string | null) => {
			// Si se deselecciona una propiedad custom, eliminarla
			const currentMapping = fieldMappings.find((m) => m.sourceIndex === sourceIndex);
			if (currentMapping?.isCustomProperty && currentMapping.beweField && beweField !== currentMapping.beweField) {
				removeCustomProperty(currentMapping.beweField);
			}

			const updated: IFieldMapping[] = fieldMappings.map((m) =>
				m.sourceIndex === sourceIndex
					? { ...m, beweField, autoMatched: false, isCustomProperty: false, customPropertyType: undefined }
					: m,
			);
			setFieldMappings(updated);
		},
		[fieldMappings, setFieldMappings, removeCustomProperty],
	);

	// Iniciar creación de propiedad personalizada
	const handleStartCustomProperty = useCallback(
		(sourceIndex: number) => {
			const preview = rawData.slice(0, 5).map((row) => row[sourceIndex] || "").filter(Boolean);
			const detectedType = detectPropertyType(preview);
			setCustomTypeSelection(detectedType);
			setCreatingCustomFor(sourceIndex);
		},
		[rawData],
	);

	// Confirmar creación de propiedad personalizada
	const handleConfirmCustomProperty = useCallback(() => {
		if (creatingCustomFor === null) return;

		const mapping = fieldMappings.find((m) => m.sourceIndex === creatingCustomFor);
		if (!mapping) return;

		const columnName = mapping.sourceColumn || `Col ${creatingCustomFor + 1}`;
		const key = `${CUSTOM_PROPERTY_PREFIX}${columnName.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "")}`;

		addCustomProperty({
			key,
			label: columnName,
			type: customTypeSelection,
			sourceColumn: columnName,
		});

		const updated: IFieldMapping[] = fieldMappings.map((m) =>
			m.sourceIndex === creatingCustomFor
				? { ...m, beweField: key, autoMatched: false, isCustomProperty: true, customPropertyType: customTypeSelection }
				: m,
		);
		setFieldMappings(updated);
		setCreatingCustomFor(null);
	}, [creatingCustomFor, fieldMappings, customTypeSelection, addCustomProperty, setFieldMappings]);

	const handleValidate = useCallback(async () => {
		setIsValidating(true);
		try {
			const result = await validateAndSeparate(rawData, fieldMappings);
			setValidationResults(result.valid, result.invalid);
			setDuplicateRecords(result.duplicates);
			goToStep(EnumImportStep.CONFIRMATION);
		} finally {
			setIsValidating(false);
		}
	}, [
		rawData,
		fieldMappings,
		validateAndSeparate,
		setValidationResults,
		setDuplicateRecords,
		goToStep,
	]);

	const handleGoBack = () => {
		goToStep(EnumImportStep.ANALYSIS);
	};

	// Preview: primeros 3 valores de cada columna
	const getPreviewValues = (sourceIndex: number): string[] => {
		return rawData
			.slice(0, 3)
			.map((row) => row[sourceIndex] || "")
			.filter(Boolean);
	};

	const canProceed = isRequiredComplete && duplicateFields.size === 0;

	const getTypeLabel = (type: EnumCustomPropertyType) => {
		return PROPERTY_TYPE_OPTIONS.find((o) => o.key === type)?.label || type;
	};

	const renderMappingRow = (mapping: IFieldMapping) => {
		const isRequired =
			mapping.beweField &&
			REQUIRED_IMPORT_FIELDS.some((f) => f.key === mapping.beweField);
		const isDuplicate =
			mapping.beweField && duplicateFields.has(mapping.beweField);
		const preview = getPreviewValues(mapping.sourceIndex);
		const isAutoMapped = mapping.autoMatched && mapping.beweField;
		const isCustom = mapping.isCustomProperty;
		const isCreatingThis = creatingCustomFor === mapping.sourceIndex;

		return (
			<TableRow
				key={`map-${mapping.sourceIndex}`}
				className={isAutoMapped ? "bg-primary-50/50 dark:bg-primary-900/10" : isCustom ? "bg-secondary-50/50 dark:bg-secondary-900/10" : ""}
			>
				<TableCell>
					<div className="flex items-center gap-2">
						<span className="font-medium text-sm">
							{mapping.sourceColumn || `Col ${mapping.sourceIndex + 1}`}
						</span>
						{isAutoMapped && (
							<Chip color="success" variant="flat" size="sm">
								auto
							</Chip>
						)}
						{isCustom && (
							<Chip color="secondary" variant="flat" size="sm">
								{t("import_mapping_custom_new")}
							</Chip>
						)}
					</div>
				</TableCell>
				<TableCell>
					{isCreatingThis ? (
						<div className="flex flex-col gap-2">
							<p className="text-xs text-default-500">
								{t("import_mapping_custom_type_label")}: <span className="font-medium">{mapping.sourceColumn}</span>
							</p>
							<div className="flex items-center gap-2">
								{PROPERTY_TYPE_OPTIONS.map((opt) => (
									<Button
										key={opt.key}
										size="sm"
										variant={customTypeSelection === opt.key ? "solid" : "flat"}
										color={customTypeSelection === opt.key ? "secondary" : "default"}
										onPress={() => setCustomTypeSelection(opt.key)}
										startContent={<IconComponent icon={opt.icon} size="sm" />}
									>
										{opt.label}
									</Button>
								))}
							</div>
							<div className="flex items-center gap-2">
								<Button
									size="sm"
									color="secondary"
									onPress={handleConfirmCustomProperty}
								>
									{t("import_mapping_custom_confirm")}
								</Button>
								<Button
									size="sm"
									variant="light"
									onPress={() => setCreatingCustomFor(null)}
								>
									{t("import_exit_confirm_leave")}
								</Button>
							</div>
						</div>
					) : (
						<>
							<Select
								aria-label={`Mapeo para ${mapping.sourceColumn}`}
								selectedKeys={mapping.beweField ? [mapping.beweField] : []}
								onSelectionChange={(keys) => {
									const selected = Array.from(keys)[0] as string | undefined;
									if (selected === "__create_custom__") {
										handleStartCustomProperty(mapping.sourceIndex);
										return;
									}
									handleFieldChange(mapping.sourceIndex, selected || null);
								}}
								selectionMode="single"
								size="sm"
								className="min-w-40"
								placeholder={t("import_mapping_do_not_import")}
								color={
									isDuplicate
										? "danger"
										: isRequired
											? "success"
											: isCustom
												? "secondary"
												: "default"
								}
								classNames={{
									trigger: "z-10",
									popoverContent: "z-[9999]",
								}}
							>
								{[
									...ALL_IMPORT_FIELDS.map((field) => (
										<SelectItem
											key={field.key}
											textValue={`${field.label}${field.required ? " *" : ""}`}
											isDisabled={
												assignedFields.has(field.key) &&
												mapping.beweField !== field.key
											}
										>
											{field.label}
											{field.required ? " *" : ""}
										</SelectItem>
									)),
									...customProperties
										.filter((cp) => cp.key !== mapping.beweField)
										.map((cp) => (
											<SelectItem
												key={cp.key}
												textValue={cp.label}
												isDisabled={assignedFields.has(cp.key)}
											>
												<div className="flex items-center gap-2">
													{cp.label}
													<span className="text-xs text-secondary-500">({getTypeLabel(cp.type)})</span>
												</div>
											</SelectItem>
										)),
									<SelectItem
										key="__create_custom__"
										textValue={t("import_mapping_custom_create", { column: mapping.sourceColumn || `Col ${mapping.sourceIndex + 1}` })}
										className="border-t border-default-200 mt-1"
									>
										<div className="flex items-center gap-2 text-secondary-600 dark:text-secondary-400">
											<IconComponent icon="solar:add-circle-outline" size="sm" />
											{t("import_mapping_custom_create", { column: mapping.sourceColumn || `Col ${mapping.sourceIndex + 1}` })}
										</div>
									</SelectItem>,
								]}
							</Select>
							{isDuplicate && (
								<p className="text-xs text-danger mt-1">
									{t("import_mapping_duplicate_field_warning", {
										field:
											ALL_IMPORT_FIELDS.find(
												(f) => f.key === mapping.beweField,
											)?.label || "",
									})}
								</p>
							)}
						</>
					)}
				</TableCell>
				<TableCell>
					<div className="flex flex-col gap-0.5">
						{preview.map((val, idx) => (
							<span
								key={`prev-${idx}`}
								className="text-xs text-default-400 truncate max-w-48"
							>
								{val}
							</span>
						))}
					</div>
				</TableCell>
			</TableRow>
		);
	};

	return (
		<div className="flex flex-col gap-4 p-4">
			{/* Instrucciones */}
			<div className="space-y-1">
				<p className="text-sm text-default-700">
					{t("import_mapping_instructions")}
				</p>
				<p className="text-xs text-default-400">
					{t("import_mapping_required_fields")}
				</p>
			</div>

			{/* Contador de campos obligatorios + ignorados + custom */}
			<div className="flex items-center gap-3 flex-wrap">
				<Chip
					color={isRequiredComplete ? "success" : "danger"}
					variant="flat"
					size="sm"
				>
					{t("import_mapping_required_count", { count: requiredLinked, total: totalRequired })}
				</Chip>

				{unmappedRows.length > 0 && (
					<Chip color="default" variant="flat" size="sm">
						{t("import_mapping_ignored_count", {
							count: unmappedRows.length,
						})}
					</Chip>
				)}

				{customProperties.length > 0 && (
					<Chip color="secondary" variant="flat" size="sm">
						{t("import_mapping_custom_count", { count: customProperties.length })}
					</Chip>
				)}
			</div>

			{/* Banner de campos obligatorios faltantes */}
			{missingRequiredFields.length > 0 && (
				<div className="flex items-center gap-2 p-3 rounded-lg bg-warning-50 dark:bg-warning-900/20 border border-warning-200 dark:border-warning-800/30">
					<IconComponent
						icon="solar:danger-triangle-outline"
						size="sm"
						className="text-warning-600 dark:text-warning-400 shrink-0"
					/>
					<p className="text-xs text-warning-700 dark:text-warning-400">
						{t("import_mapping_missing_required", {
							fields: missingRequiredFields.map((f) => f.label).join(", "),
						})}
					</p>
				</div>
			)}

			{/* Banner IA para notas */}
			{isNotesMapped && (
				<div className="flex items-start gap-3 p-3 rounded-lg bg-[#FEF3C7] dark:bg-[#FEF3C7]/10 border border-[#FAD19E] dark:border-[#FAD19E]/30">
					<IconComponent
						icon="solar:magic-stick-3-outline"
						size="sm"
						className="text-[#B45309] dark:text-[#FAD19E] shrink-0 mt-0.5"
					/>
					<div className="flex flex-col gap-1">
						<p className="text-sm font-medium text-[#92400E] dark:text-[#FAD19E]">
							{t("import_mapping_notes_ai_title")}
						</p>
						<p className="text-xs text-[#92400E]/80 dark:text-[#FAD19E]/70">
							{t("import_mapping_notes_ai_description")}
						</p>
						<p className="text-xs text-[#92400E]/60 dark:text-[#FAD19E]/50">
							{t("import_mapping_notes_ai_limit")}
						</p>
					</div>
				</div>
			)}

			{/* Tabla de mapeo — filas mapeadas */}
			<Table
				aria-label="Mapeo de campos"
				classNames={{
					th: "bg-default-100 dark:bg-default-50/50 text-xs text-default-500 dark:text-default-400 font-medium",
				}}
			>
				<TableHeader>
					<TableColumn>{t("import_mapping_your_field")}</TableColumn>
					<TableColumn>{t("import_mapping_bewe_field")}</TableColumn>
					<TableColumn>{t("import_mapping_preview")}</TableColumn>
				</TableHeader>
				<TableBody>
					{mappedRows.map(renderMappingRow)}
				</TableBody>
			</Table>

			{/* Sección colapsable de columnas sin vincular */}
			{unmappedRows.length > 0 && (
				<div className="flex flex-col gap-2">
					<button
						type="button"
						onClick={() => setShowUnmapped(!showUnmapped)}
						className="flex items-center gap-2 text-xs text-default-500 hover:text-default-700 dark:hover:text-default-400 transition-colors self-start"
					>
						<IconComponent
							icon={showUnmapped ? "solar:alt-arrow-up-outline" : "solar:alt-arrow-down-outline"}
							size="sm"
						/>
						{showUnmapped
							? t("import_mapping_hide_unmapped")
							: t("import_mapping_show_unmapped", { count: unmappedRows.length })
						}
					</button>

					{showUnmapped && (
						<Table
							aria-label="Columnas sin vincular"
							classNames={{
								th: "bg-default-100 dark:bg-default-50/50 text-xs text-default-500 dark:text-default-400 font-medium",
							}}
						>
							<TableHeader>
								<TableColumn>{t("import_mapping_your_field")}</TableColumn>
								<TableColumn>{t("import_mapping_bewe_field")}</TableColumn>
								<TableColumn>{t("import_mapping_preview")}</TableColumn>
							</TableHeader>
							<TableBody>
								{unmappedRows.map(renderMappingRow)}
							</TableBody>
						</Table>
					)}
				</div>
			)}

			{/* Resumen de propiedades personalizadas */}
			{customProperties.length > 0 && (
				<div className="flex flex-col gap-2 p-3 rounded-lg bg-secondary-50 dark:bg-secondary-900/20 border border-secondary-200 dark:border-secondary-800/30">
					<div className="flex items-center gap-2">
						<IconComponent
							icon="solar:widget-add-outline"
							size="sm"
							className="text-secondary-600 dark:text-secondary-400"
						/>
						<p className="text-xs font-medium text-secondary-700 dark:text-secondary-400">
							{t("import_mapping_custom_summary", { count: customProperties.length })}
						</p>
					</div>
					<div className="flex flex-wrap gap-2">
						{customProperties.map((cp) => (
							<Chip
								key={cp.key}
								color="secondary"
								variant="flat"
								size="sm"
								onClose={() => removeCustomProperty(cp.key)}
							>
								{cp.label} ({getTypeLabel(cp.type)})
							</Chip>
						))}
					</div>
				</div>
			)}

			{/* Acciones */}
			<div className="flex items-center justify-between pt-2">
				<Button variant="light" size="sm" onPress={handleGoBack}>
					{t("import_analysis_reload")}
				</Button>

				<Button
					color="primary"
					onPress={handleValidate}
					isDisabled={!canProceed || isValidating}
					isLoading={isValidating}
				>
					{t("import_mapping_button_validate")}
				</Button>
			</div>
		</div>
	);
};
