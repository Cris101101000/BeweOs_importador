import {
	Accordion,
	AccordionItem,
	Button,
	Chip,
	Progress,
	Select,
	SelectItem,
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
} from "@beweco/aurora-ui";
import { EnumProcessStatus } from "@clients/domain/enums/import-status.enum";
import { EnumDuplicateAction } from "@clients/domain/interfaces/import-contact.interface";
import { useTranslate } from "@tolgee/react";
import { type FC, useCallback, useMemo, useState } from "react";
import { useImportDownloads } from "../../hooks/use-import-downloads.hook";
import { useImportProgress } from "../../hooks/use-import-progress.hook";
import { useImportStore } from "../../store/useImportStore";
import { HealthScore } from "../_shared/health-score/health-score.component";
import { ImportProgressLog } from "../_shared/import-progress-log/import-progress-log.component";

export const ConfirmationStep: FC = () => {
	const { t } = useTranslate();
	const { startImport } = useImportProgress();
	const { downloadInvalidRecords, downloadFullReport } = useImportDownloads();

	const {
		validRecords,
		duplicateRecords,
		invalidRecords,
		processStatus,
		progress,
		logEntries,
		result,
		setDuplicateAction,
		setBulkDuplicateAction,
	} = useImportStore();

	const totalToImport = useMemo(() => {
		const updateCount = duplicateRecords.filter(
			(d) => d.action === EnumDuplicateAction.UPDATE
		).length;
		const createNewCount = duplicateRecords.filter(
			(d) => d.action === EnumDuplicateAction.CREATE_NEW
		).length;
		return validRecords.length + updateCount + createNewCount;
	}, [validRecords, duplicateRecords]);

	// Fase IDLE: resumen + duplicados + botón importar
	if (processStatus === EnumProcessStatus.IDLE) {
		return (
			<div className="flex flex-col gap-6 p-4">
				{/* Health Score */}
				<HealthScore
					validCount={validRecords.length}
					duplicateCount={duplicateRecords.length}
					invalidCount={invalidRecords.length}
				/>

				{/* Descargar inválidos */}
				{invalidRecords.length > 0 && (
					<div className="space-y-1">
						<Button
							variant="light"
							size="sm"
							color="danger"
							onPress={downloadInvalidRecords}
						>
							{t("import_confirm_download_invalid", {
								count: invalidRecords.length,
							})}
						</Button>
						<p className="text-xs text-default-400">
							{t("import_confirm_download_invalid_hint")}
						</p>
					</div>
				)}

				{/* Duplicados */}
				{duplicateRecords.length > 0 && (
					<Accordion variant="bordered">
						<AccordionItem
							key="duplicates"
							title={t("import_confirm_duplicate_policy", {
								count: duplicateRecords.length,
							})}
						>
							{/* Acciones rápidas */}
							<div className="flex gap-2 mb-4">
								<Button
									size="sm"
									variant="flat"
									color="primary"
									onPress={() =>
										setBulkDuplicateAction(EnumDuplicateAction.UPDATE)
									}
								>
									{t("import_confirm_update_all")}
								</Button>
								<Button
									size="sm"
									variant="flat"
									color="default"
									onPress={() =>
										setBulkDuplicateAction(EnumDuplicateAction.SKIP)
									}
								>
									{t("import_confirm_skip_all")}
								</Button>
							</div>

							{/* Tabla de duplicados */}
							<Table aria-label="Duplicados" isStriped>
								<TableHeader>
									<TableColumn>Email</TableColumn>
									<TableColumn>{t("import_confirm_action_update")}</TableColumn>
									<TableColumn>{t("import_confirm_no_changes")}</TableColumn>
								</TableHeader>
								<TableBody>
									{duplicateRecords.map((dup) => (
										<TableRow key={dup.record.email}>
											<TableCell>
												<span className="text-sm">{dup.record.email}</span>
											</TableCell>
											<TableCell>
												<Select
													aria-label={`Acción para ${dup.record.email}`}
													selectedKeys={[dup.action]}
													onSelectionChange={(keys) => {
														const selected = Array.from(keys)[0] as string;
														if (selected) {
															setDuplicateAction(
																dup.record.email,
																selected as typeof dup.action
															);
														}
													}}
													size="sm"
													className="min-w-32"
												>
													<SelectItem key={EnumDuplicateAction.UPDATE}>
														{t("import_confirm_action_update")}
													</SelectItem>
													<SelectItem key={EnumDuplicateAction.SKIP}>
														{t("import_confirm_action_skip")}
													</SelectItem>
													<SelectItem key={EnumDuplicateAction.CREATE_NEW}>
														{t("import_confirm_action_create_new")}
													</SelectItem>
												</Select>
											</TableCell>
											<TableCell>
												<span className="text-xs text-default-400">
													{dup.changesDetail}
												</span>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</AccordionItem>
					</Accordion>
				)}

				{/* Botón importar */}
				<div className="flex justify-end">
					<Button
						color="primary"
						size="lg"
						onPress={startImport}
						isDisabled={totalToImport === 0}
					>
						{t("import_confirm_button_import", {
							count: totalToImport,
						})}
					</Button>
				</div>
			</div>
		);
	}

	// Fase PROCESSING: barra de progreso + log
	if (processStatus === EnumProcessStatus.PROCESSING) {
		return (
			<div className="flex flex-col gap-6 p-4">
				<h3 className="text-lg font-semibold text-default-800">
					{t("import_processing_title")}
				</h3>

				<Progress
					value={progress}
					color="primary"
					size="lg"
					showValueLabel
					className="w-full"
				/>

				<ImportProgressLog entries={logEntries} />

				<p className="text-sm text-warning-600 dark:text-warning-400 text-center">
					{t("import_processing_do_not_close")}
				</p>
			</div>
		);
	}

	// Fase DONE: resultado final
	if (processStatus === EnumProcessStatus.DONE && result) {
		return (
			<div className="flex flex-col gap-6 p-4">
				<h3 className="text-lg font-semibold text-success-600 dark:text-success-400">
					{t("import_result_completed")}
				</h3>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div className="p-4 rounded-lg bg-success-50 dark:bg-success-900/20 text-center">
						<p className="text-2xl font-bold text-success-600">
							{result.created}
						</p>
						<p className="text-sm text-success-700 dark:text-success-400">
							{t("import_result_created", { count: result.created })}
						</p>
					</div>
					<div className="p-4 rounded-lg bg-warning-50 dark:bg-warning-900/20 text-center">
						<p className="text-2xl font-bold text-warning-600">
							{result.updated}
						</p>
						<p className="text-sm text-warning-700 dark:text-warning-400">
							{t("import_result_updated", { count: result.updated })}
						</p>
					</div>
					<div className="p-4 rounded-lg bg-danger-50 dark:bg-danger-900/20 text-center">
						<p className="text-2xl font-bold text-danger-600">
							{result.failed}
						</p>
						<p className="text-sm text-danger-700 dark:text-danger-400">
							{t("import_result_failed", { count: result.failed })}
						</p>
					</div>
				</div>

				<ImportProgressLog entries={logEntries} />

				<div className="flex items-center gap-3 justify-center">
					<Button variant="flat" size="sm" onPress={downloadFullReport}>
						{t("import_result_download_report")}
					</Button>
					{result.failed > 0 && (
						<Button
							variant="flat"
							size="sm"
							color="danger"
							onPress={downloadInvalidRecords}
						>
							{t("import_result_download_errors")}
						</Button>
					)}
				</div>
			</div>
		);
	}

	// Fase ERROR
	return (
		<div className="flex flex-col gap-6 p-4 items-center">
			<p className="text-danger-600 dark:text-danger-400 text-center">
				{t("import_upload_error_format")}
			</p>

			<ImportProgressLog entries={logEntries} />

			<Button color="primary" onPress={startImport}>
				{t("import_confirm_button_import", { count: totalToImport })}
			</Button>
		</div>
	);
};
