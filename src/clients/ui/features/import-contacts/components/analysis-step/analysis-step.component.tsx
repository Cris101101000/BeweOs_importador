import {
	Button,
	Checkbox,
	Chip,
	IconComponent,
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
} from "@beweco/aurora-ui";
import {
	PREVIEW_ROWS,
	REQUIRED_IMPORT_FIELDS,
} from "@clients/domain/constants/import-fields.constants";
import { EnumImportStep } from "@clients/domain/enums/import-status.enum";
import { useTranslate } from "@tolgee/react";
import { type FC, useMemo } from "react";
import { useFieldMapping } from "../../hooks/use-field-mapping.hook";
import { useImportStore } from "../../store/useImportStore";

/**
 * Máximo de columnas a mostrar en el preview para evitar overflow horizontal.
 * Priorizamos las que matchean con campos obligatorios.
 */
const MAX_PREVIEW_COLUMNS = 5;

/**
 * Retorna el icono según la extensión del archivo
 */
const getFileIcon = (filename: string): string => {
	const ext = filename.split(".").pop()?.toLowerCase();
	switch (ext) {
		case "csv":
			return "solar:document-text-outline";
		case "xlsx":
		case "xls":
			return "solar:file-text-outline";
		case "pdf":
			return "solar:file-text-outline";
		default:
			return "solar:document-outline";
	}
};

/**
 * Formatea bytes a una cadena legible (KB, MB)
 */
const formatFileSize = (bytes: number): string => {
	if (bytes < 1024 * 1024) {
		return `${(bytes / 1024).toFixed(1)} KB`;
	}
	return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

/**
 * Detecta los índices de las columnas que matchean con campos obligatorios.
 */
const getRelevantColumnIndices = (headers: string[]): number[] => {
	const requiredSynonyms = REQUIRED_IMPORT_FIELDS.flatMap((f) => [
		f.key.toLowerCase(),
		f.label.toLowerCase(),
		...f.synonyms.map((s) => s.toLowerCase()),
	]);

	const matchedIndices: number[] = [];
	const unmatchedIndices: number[] = [];

	for (let i = 0; i < headers.length; i++) {
		const normalized = headers[i].toLowerCase().trim();
		if (requiredSynonyms.includes(normalized)) {
			matchedIndices.push(i);
		} else {
			unmatchedIndices.push(i);
		}
	}

	// Primero las obligatorias, luego las opcionales hasta completar el máximo
	const result = [...matchedIndices];
	for (const idx of unmatchedIndices) {
		if (result.length >= MAX_PREVIEW_COLUMNS) break;
		result.push(idx);
	}

	return result.sort((a, b) => a - b);
};

export const AnalysisStep: FC = () => {
	const { t } = useTranslate();
	const { autoMatch } = useFieldMapping();

	const {
		rawData,
		detectedHeaders,
		hasHeaders,
		extractionSource,
		totalRecords,
		file,
		setHasHeaders,
		setFieldMappings,
		goToStep,
	} = useImportStore();

	const previewData = useMemo(() => rawData.slice(0, PREVIEW_ROWS), [rawData]);

	const visibleIndices = useMemo(
		() => getRelevantColumnIndices(detectedHeaders),
		[detectedHeaders],
	);

	const hiddenColumns = detectedHeaders.length - visibleIndices.length;

	const handleToggleHeaders = (checked: boolean) => {
		setHasHeaders(!checked);
	};

	const handleProceedToMapping = () => {
		const mappings = autoMatch(detectedHeaders, rawData);
		setFieldMappings(mappings);
		goToStep(EnumImportStep.MAPPING);
	};

	const handleGoBack = () => {
		goToStep(EnumImportStep.UPLOAD);
	};

	const isSingleColumn = detectedHeaders.length === 1;

	return (
		<div className="flex flex-col gap-4 px-2 py-4 sm:p-4 min-w-0 max-w-full">
			{/* Tarjeta del archivo cargado + métricas */}
			<div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-start gap-3 min-w-0">
				{/* Tarjeta archivo */}
				{file && (
					<div className="flex items-center gap-3 rounded-xl border border-default-200 dark:border-default-100 bg-default-50 dark:bg-default-100/30 px-4 py-3 min-w-0 max-w-full">
						<div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 shrink-0">
							<IconComponent
								icon={getFileIcon(file.name)}
								size="sm"
								className="text-primary"
							/>
						</div>
						<div className="min-w-0">
							<p className="text-sm font-medium text-default-700 dark:text-default-500 truncate">
								{file.name}
							</p>
							<div className="flex items-center gap-2">
								<span className="text-xs text-default-400">
									{formatFileSize(file.size)}
								</span>
								<button
									type="button"
									onClick={handleGoBack}
									className="text-xs text-primary hover:underline"
								>
									{t("import_analysis_change_file")}
								</button>
							</div>
						</div>
						{extractionSource === "ai" && (
							<Chip color="warning" size="sm" variant="flat" className="shrink-0">
								{t("import_analysis_extracted_by_ai")}
							</Chip>
						)}
					</div>
				)}

				{/* Metric cards */}
				<div className="flex flex-row items-center gap-3">
					<div className="flex flex-col items-center rounded-xl border border-default-200 dark:border-default-100 bg-default-50 dark:bg-default-100/30 px-4 sm:px-5 py-3 min-w-[80px] sm:min-w-[100px]">
						<span className="text-lg sm:text-xl font-bold text-default-800 dark:text-default-500">
							{totalRecords.toLocaleString()}
						</span>
						<span className="text-[11px] sm:text-xs text-default-400">
							{t("import_analysis_label_records")}
						</span>
					</div>
					<div className="flex flex-col items-center rounded-xl border border-default-200 dark:border-default-100 bg-default-50 dark:bg-default-100/30 px-4 sm:px-5 py-3 min-w-[80px] sm:min-w-[100px]">
						<span className="text-lg sm:text-xl font-bold text-default-800 dark:text-default-500">
							{detectedHeaders.length}
						</span>
						<span className="text-[11px] sm:text-xs text-default-400">
							{t("import_analysis_label_columns")}
						</span>
					</div>
				</div>
			</div>

			{/* Warning una sola columna */}
			{isSingleColumn && (
				<div className="p-3 rounded-lg bg-warning-50 dark:bg-warning-900/20 text-warning-700 dark:text-warning-400 text-sm">
					{t("import_analysis_single_column_warning")}
				</div>
			)}

			{/* Info filas + checkbox encabezados en la misma línea */}
			<div className="flex flex-wrap items-center justify-between gap-2">
				<p className="text-xs text-default-400">
					{t("import_analysis_preview_showing", {
						shown: Math.min(PREVIEW_ROWS, totalRecords),
						total: totalRecords,
					})}
					{hiddenColumns > 0 &&
						` · +${hiddenColumns} ${hiddenColumns === 1 ? "columna" : "columnas"} más`}
				</p>

				<Checkbox
					isSelected={!hasHeaders}
					onValueChange={(checked) => handleToggleHeaders(checked)}
					size="sm"
				>
					<span className="text-xs">{t("import_analysis_no_headers")}</span>
				</Checkbox>
			</div>

			{/* Tabla preview con scroll horizontal */}
			<div className="overflow-x-auto rounded-lg border border-default-200 dark:border-default-100">
				<Table
					aria-label="Preview de datos importados"
					isCompact
					removeWrapper
					classNames={{
						table: "w-full",
						th: "bg-default-100 dark:bg-default-50/50 text-xs text-default-500 dark:text-default-400 font-medium",
						td: "text-xs",
					}}
				>
					<TableHeader>
						{visibleIndices.map((colIdx) => (
							<TableColumn key={`col-${colIdx}`}>
								<span className="truncate block max-w-[100px] sm:max-w-[180px]">
									{detectedHeaders[colIdx] || `Col ${colIdx + 1}`}
								</span>
							</TableColumn>
						))}
					</TableHeader>
					<TableBody>
						{previewData.map((row, rowIdx) => (
							<TableRow key={`row-${rowIdx}`}>
								{visibleIndices.map((colIdx) => (
									<TableCell key={`cell-${rowIdx}-${colIdx}`}>
										{row[colIdx] ? (
											<span className="truncate block max-w-[100px] sm:max-w-[180px] text-default-700 dark:text-default-500">
												{row[colIdx]}
											</span>
										) : (
											<span className="text-default-300 dark:text-default-200">
												—
											</span>
										)}
									</TableCell>
								))}
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>

			{/* Footer: nota de campos + botón mapear */}
			<div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
				<p className="text-xs text-default-400">
					{t("import_analysis_fields_note")}
				</p>
				<Button
					color="primary"
					onPress={handleProceedToMapping}
					isDisabled={totalRecords === 0}
					className="w-full sm:w-auto shrink-0"
				>
					{t("import_analysis_button_map")}
				</Button>
			</div>
		</div>
	);
};
