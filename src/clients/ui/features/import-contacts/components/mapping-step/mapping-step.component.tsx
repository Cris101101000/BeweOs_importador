import {
	Button,
	Chip,
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
import { useTranslate } from "@tolgee/react";
import { type FC, useCallback, useMemo, useState } from "react";
import { useImportValidation } from "../../hooks/use-import-validation.hook";
import { useImportStore } from "../../store/useImportStore";

export const MappingStep: FC = () => {
	const { t } = useTranslate();
	const [isValidating, setIsValidating] = useState(false);
	const { validateAndSeparate } = useImportValidation();

	const {
		detectedHeaders,
		rawData,
		fieldMappings,
		setFieldMappings,
		setValidationResults,
		setDuplicateRecords,
		goToStep,
	} = useImportStore();

	// Contar campos obligatorios vinculados
	const requiredLinked = useMemo(() => {
		const requiredKeys = new Set(REQUIRED_IMPORT_FIELDS.map((f) => f.key));
		return fieldMappings.filter(
			(m) => m.beweField && requiredKeys.has(m.beweField)
		).length;
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
				.map(([key]) => key)
		);
	}, [fieldMappings]);

	// Campos ya asignados (para evitar mostrarlos como opción)
	const assignedFields = useMemo(() => {
		return new Set(
			fieldMappings.filter((m) => m.beweField).map((m) => m.beweField)
		);
	}, [fieldMappings]);

	const handleFieldChange = useCallback(
		(sourceIndex: number, beweField: string | null) => {
			const updated: IFieldMapping[] = fieldMappings.map((m) =>
				m.sourceIndex === sourceIndex
					? { ...m, beweField, autoMatched: false }
					: m
			);
			setFieldMappings(updated);
		},
		[fieldMappings, setFieldMappings]
	);

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

	const canProceed = requiredLinked >= 5 && duplicateFields.size === 0;

	return (
		<div className="flex flex-col gap-6 p-4">
			{/* Instrucciones */}
			<div className="space-y-1">
				<p className="text-sm text-default-700">
					{t("import_mapping_instructions")}
				</p>
				<p className="text-xs text-default-400">
					{t("import_mapping_required_fields")}
				</p>
			</div>

			{/* Contador de campos obligatorios */}
			<div className="flex items-center gap-3">
				<Chip
					color={requiredLinked >= 5 ? "success" : "warning"}
					variant="flat"
					size="sm"
				>
					{t("import_mapping_required_count", { count: requiredLinked })}
				</Chip>

				{fieldMappings.filter((m) => !m.beweField).length > 0 && (
					<Chip color="default" variant="flat" size="sm">
						{t("import_mapping_ignored_count", {
							count: fieldMappings.filter((m) => !m.beweField).length,
						})}
					</Chip>
				)}
			</div>

			{/* Tabla de mapeo */}
			<Table aria-label="Mapeo de campos" isStriped>
				<TableHeader>
					<TableColumn>{t("import_mapping_your_field")}</TableColumn>
					<TableColumn>{t("import_mapping_bewe_field")}</TableColumn>
					<TableColumn>{t("import_mapping_preview")}</TableColumn>
				</TableHeader>
				<TableBody>
					{fieldMappings.map((mapping) => {
						const isRequired =
							mapping.beweField &&
							REQUIRED_IMPORT_FIELDS.some((f) => f.key === mapping.beweField);
						const isDuplicate =
							mapping.beweField && duplicateFields.has(mapping.beweField);
						const preview = getPreviewValues(mapping.sourceIndex);

						return (
							<TableRow key={`map-${mapping.sourceIndex}`}>
								<TableCell>
									<div className="flex items-center gap-2">
										<span className="font-medium text-sm">
											{mapping.sourceColumn || `Col ${mapping.sourceIndex + 1}`}
										</span>
										{mapping.autoMatched && mapping.beweField && (
											<Chip color="success" variant="flat" size="sm">
												{t("import_mapping_auto_matched")}
											</Chip>
										)}
									</div>
								</TableCell>
								<TableCell>
									<Select
										aria-label={`Mapeo para ${mapping.sourceColumn}`}
										selectedKeys={mapping.beweField ? [mapping.beweField] : []}
										onSelectionChange={(keys) => {
											const selected = Array.from(keys)[0] as
												| string
												| undefined;
											handleFieldChange(mapping.sourceIndex, selected || null);
										}}
										size="sm"
										className="min-w-40"
										placeholder={t("import_mapping_do_not_import")}
										color={
											isDuplicate
												? "danger"
												: isRequired
													? "success"
													: "default"
										}
									>
										{ALL_IMPORT_FIELDS.map((field) => (
											<SelectItem
												key={field.key}
												isDisabled={
													assignedFields.has(field.key) &&
													mapping.beweField !== field.key
												}
											>
												{field.label}
												{field.required ? " *" : ""}
											</SelectItem>
										))}
									</Select>
									{isDuplicate && (
										<p className="text-xs text-danger mt-1">
											{t("import_mapping_duplicate_field_warning", {
												field:
													ALL_IMPORT_FIELDS.find(
														(f) => f.key === mapping.beweField
													)?.label || "",
											})}
										</p>
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
					})}
				</TableBody>
			</Table>

			{/* Acciones */}
			<div className="flex items-center justify-between">
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
