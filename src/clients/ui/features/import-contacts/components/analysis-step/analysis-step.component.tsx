import {
	Button,
	Checkbox,
	Chip,
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
} from "@beweco/aurora-ui";
import { PREVIEW_ROWS } from "@clients/domain/constants/import-fields.constants";
import { EnumImportStep } from "@clients/domain/enums/import-status.enum";
import { useTranslate } from "@tolgee/react";
import { type FC, useMemo } from "react";
import { useFieldMapping } from "../../hooks/use-field-mapping.hook";
import { useImportStore } from "../../store/useImportStore";

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
		setRawData,
		setFieldMappings,
		goToStep,
	} = useImportStore();

	const previewData = useMemo(() => rawData.slice(0, PREVIEW_ROWS), [rawData]);

	const handleToggleHeaders = (checked: boolean) => {
		if (checked) {
			setHasHeaders(true);
		} else {
			// La primera fila pasa a ser datos, no encabezados
			setHasHeaders(false);
		}
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
		<div className="flex flex-col gap-6 p-4">
			{/* Resumen */}
			<div className="flex flex-wrap items-center gap-4">
				<p className="text-sm text-default-700">
					{t("import_analysis_records_detected", {
						count: totalRecords,
						columns: detectedHeaders.length,
					})}
				</p>

				{file && (
					<p className="text-sm text-default-500">
						{t("import_analysis_source_file", {
							filename: file.name,
							size: `${(file.size / 1024).toFixed(1)} KB`,
						})}
					</p>
				)}

				{extractionSource === "ai" && (
					<Chip color="warning" size="sm" variant="flat">
						{t("import_analysis_extracted_by_ai")}
					</Chip>
				)}
			</div>

			{/* Warning una sola columna */}
			{isSingleColumn && (
				<div className="p-3 rounded-lg bg-warning-50 dark:bg-warning-900/20 text-warning-700 dark:text-warning-400 text-sm">
					{t("import_analysis_single_column_warning")}
				</div>
			)}

			{/* Tabla preview */}
			<div className="overflow-auto">
				<Table aria-label="Preview de datos importados" isStriped>
					<TableHeader>
						{detectedHeaders.map((header, idx) => (
							<TableColumn key={`col-${idx}`}>
								{header || `Col ${idx + 1}`}
							</TableColumn>
						))}
					</TableHeader>
					<TableBody>
						{previewData.map((row, rowIdx) => (
							<TableRow key={`row-${rowIdx}`}>
								{detectedHeaders.map((_header, colIdx) => (
									<TableCell key={`cell-${rowIdx}-${colIdx}`}>
										{row[colIdx] || ""}
									</TableCell>
								))}
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>

			{/* Info filas */}
			<p className="text-xs text-default-400">
				{t("import_analysis_preview_showing", {
					shown: Math.min(PREVIEW_ROWS, totalRecords),
					total: totalRecords,
				})}
			</p>

			{/* Checkbox de encabezados */}
			<Checkbox
				isSelected={!hasHeaders}
				onValueChange={(checked) => handleToggleHeaders(!checked)}
				size="sm"
			>
				{t("import_analysis_no_headers")}
			</Checkbox>

			{/* Acciones */}
			<div className="flex items-center justify-between">
				<Button variant="light" size="sm" onPress={handleGoBack}>
					{t("import_analysis_reload")}
				</Button>

				<Button
					color="primary"
					onPress={handleProceedToMapping}
					isDisabled={totalRecords === 0}
				>
					{t("import_analysis_button_map")}
				</Button>
			</div>
		</div>
	);
};
