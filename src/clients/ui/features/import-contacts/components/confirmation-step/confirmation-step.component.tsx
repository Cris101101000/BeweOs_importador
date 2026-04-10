import {
	Accordion,
	AccordionItem,
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
import { EnumImportStep, EnumProcessStatus } from "@clients/domain/enums/import-status.enum";
import { EnumDuplicateAction } from "@clients/domain/interfaces/import-contact.interface";
import { ImportLogService } from "@clients/infrastructure/services/local-contacts-storage.service";
import { useTranslate } from "@tolgee/react";
import { type FC, useCallback, useMemo, useState } from "react";
import { useImportDownloads } from "../../hooks/use-import-downloads.hook";
import { useImportProgress } from "../../hooks/use-import-progress.hook";
import { useImportStore } from "../../store/useImportStore";
import { HealthScore } from "../_shared/health-score/health-score.component";
import { ImportProgressLog } from "../_shared/import-progress-log/import-progress-log.component";

const PAGE_SIZE = 30;

export const ConfirmationStep: FC = () => {
	const { t } = useTranslate();
	const { startImport } = useImportProgress();
	const { downloadInvalidRecords, downloadFullReport } = useImportDownloads();

	const [invalidVisible, setInvalidVisible] = useState(PAGE_SIZE);
	const [duplicateVisible, setDuplicateVisible] = useState(PAGE_SIZE);
	const [validVisible, setValidVisible] = useState(PAGE_SIZE);

	const {
		validRecords,
		duplicateRecords,
		invalidRecords,
		processStatus,
		progress,
		logEntries,
		result,
		file,
		setDuplicateAction,
		setBulkDuplicateAction,
		goToStep,
		reset,
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

	const visibleValid = useMemo(
		() => validRecords.slice(0, validVisible),
		[validRecords, validVisible],
	);

	const visibleInvalid = useMemo(
		() => invalidRecords.slice(0, invalidVisible),
		[invalidRecords, invalidVisible],
	);

	const visibleDuplicates = useMemo(
		() => duplicateRecords.slice(0, duplicateVisible),
		[duplicateRecords, duplicateVisible],
	);

	const handleShowMoreValid = useCallback(() => {
		setValidVisible((prev) => prev + PAGE_SIZE);
	}, []);

	const handleShowMoreInvalid = useCallback(() => {
		setInvalidVisible((prev) => prev + PAGE_SIZE);
	}, []);

	const handleShowMoreDuplicates = useCallback(() => {
		setDuplicateVisible((prev) => prev + PAGE_SIZE);
	}, []);

	// ── Fase IDLE: resumen + acciones ──
	if (processStatus === EnumProcessStatus.IDLE) {
		return (
			<div className="flex flex-col gap-5 px-2 py-4 sm:p-4">
				{/* Health Score con barra proporcional */}
				<HealthScore
					validCount={validRecords.length}
					duplicateCount={duplicateRecords.length}
					invalidCount={invalidRecords.length}
				/>

				{/* Vista previa de registros válidos */}
				{validRecords.length > 0 && (
					<Accordion variant="bordered">
						<AccordionItem
							key="valid-preview"
							title={
								<div className="flex items-center gap-3">
									<div className="flex items-center justify-center w-8 h-8 rounded-lg bg-success-50 dark:bg-success-900/20 shrink-0">
										<IconComponent
											icon="solar:eye-outline"
											size="sm"
											className="text-success"
										/>
									</div>
									<div className="text-left">
										<p className="text-sm font-medium text-success-600 dark:text-success-400">
											{t("import_confirm_preview_valid", {
												count: validRecords.length,
											})}
										</p>
										<p className="text-xs text-default-400">
											{t("import_confirm_preview_hint")}
										</p>
									</div>
								</div>
							}
							classNames={{
								base: "border-success-200 dark:border-success-800/30",
							}}
						>
							<div className="overflow-x-auto">
							<Table
								aria-label="Vista previa de registros válidos"
								isCompact
								removeWrapper
								classNames={{
									th: "bg-default-100 dark:bg-default-50/50 text-xs text-default-500 font-medium",
								}}
							>
								<TableHeader>
									<TableColumn>#</TableColumn>
									<TableColumn>Nombre</TableColumn>
									<TableColumn>Email</TableColumn>
									<TableColumn>Teléfono</TableColumn>
								</TableHeader>
								<TableBody>
									{visibleValid.map((rec, idx) => (
										<TableRow key={`valid-${idx}`}>
											<TableCell>
												<span className="text-xs text-default-400">{idx + 1}</span>
											</TableCell>
											<TableCell>
												<span className="text-xs truncate block max-w-[160px]">
													{rec.firstName} {rec.lastName || ""}
												</span>
											</TableCell>
											<TableCell>
												<span className="text-xs truncate block max-w-[180px]">
													{rec.email || "—"}
												</span>
											</TableCell>
											<TableCell>
												<span className="text-xs truncate block max-w-[120px]">
													{rec.phone || "—"}
												</span>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
							</div>

							{/* Paginación válidos */}
							<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mt-3">
								<p className="text-xs text-default-400">
									Mostrando {Math.min(validVisible, validRecords.length)} de {validRecords.length}
								</p>
								{validVisible < validRecords.length && (
									<Button
										variant="light"
										size="sm"
										onPress={handleShowMoreValid}
									>
										{t("import_confirm_show_more")}
									</Button>
								)}
							</div>
						</AccordionItem>
					</Accordion>
				)}

				{/* Tarjeta de errores accionable */}
				{invalidRecords.length > 0 && (
					<Accordion variant="bordered">
						<AccordionItem
							key="invalid"
							title={
								<button
									type="button"
									onClick={downloadInvalidRecords}
									className="flex items-center gap-3 w-full group"
								>
									<div className="flex items-center justify-center w-8 h-8 rounded-lg bg-danger-50 dark:bg-danger-900/20 shrink-0">
										<IconComponent
											icon="solar:download-minimalistic-outline"
											size="sm"
											className="text-danger"
										/>
									</div>
									<div className="text-left">
										<p className="text-sm font-medium text-danger-600 dark:text-danger-400 group-hover:underline">
											{t("import_confirm_download_invalid", {
												count: invalidRecords.length,
											})}
										</p>
										<p className="text-xs text-default-400">
											{t("import_confirm_download_invalid_hint")}
										</p>
									</div>
								</button>
							}
							classNames={{
								base: "border-danger-200 dark:border-danger-800/30",
							}}
						>
							<div className="overflow-x-auto">
							<Table
								aria-label="Registros inválidos"
								isCompact
								removeWrapper
								classNames={{
									th: "bg-default-100 dark:bg-default-50/50 text-xs text-default-500 font-medium",
								}}
							>
								<TableHeader>
									<TableColumn>Fila</TableColumn>
									<TableColumn>Nombre</TableColumn>
									<TableColumn>Email</TableColumn>
									<TableColumn>Teléfono</TableColumn>
									<TableColumn>{t("import_confirm_invalid_reason")}</TableColumn>
								</TableHeader>
								<TableBody>
									{visibleInvalid.map((inv) => (
										<TableRow key={`inv-${inv.rowIndex}`}>
											<TableCell>
												<span className="text-xs">{inv.rowIndex}</span>
											</TableCell>
											<TableCell>
												<span className="text-xs truncate block max-w-[120px]">
													{inv.record.firstName || "—"} {inv.record.lastName || ""}
												</span>
											</TableCell>
											<TableCell>
												<span className="text-xs truncate block max-w-[150px]">
													{inv.record.email || "—"}
												</span>
											</TableCell>
											<TableCell>
												<span className="text-xs truncate block max-w-[100px]">
													{inv.record.phone || "—"}
												</span>
											</TableCell>
											<TableCell>
												<div className="flex flex-col gap-0.5">
													{inv.reasons.map((reason, idx) => (
														<Chip
															key={`reason-${inv.rowIndex}-${idx}`}
															color="danger"
															variant="flat"
															size="sm"
														>
															{reason}
														</Chip>
													))}
												</div>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
							</div>

							{/* Paginación inválidos */}
							<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mt-3">
								<p className="text-xs text-default-400">
									{t("import_confirm_invalid_showing_partial", {
										shown: Math.min(invalidVisible, invalidRecords.length),
										total: invalidRecords.length,
									})}
								</p>
								{invalidVisible < invalidRecords.length && (
									<Button
										variant="light"
										size="sm"
										onPress={handleShowMoreInvalid}
									>
										{t("import_confirm_show_more")}
									</Button>
								)}
							</div>
						</AccordionItem>
					</Accordion>
				)}

				{/* Duplicados con explicación del merge */}
				{duplicateRecords.length > 0 && (
					<Accordion variant="bordered">
						<AccordionItem
							key="duplicates"
							title={
								<div className="flex flex-col gap-1">
									<span className="text-sm">
										{t("import_confirm_duplicate_policy", {
											count: duplicateRecords.length,
										})}
									</span>
									<span className="text-xs text-default-400">
										{t("import_confirm_merge_explanation")}
									</span>
								</div>
							}
						>
							{/* Acciones rápidas */}
							<div className="flex flex-wrap gap-2 mb-4">
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

							{/* Tabla de duplicados — paginada */}
							<div className="overflow-x-auto">
							<Table
								aria-label="Duplicados"
								isCompact
								removeWrapper
								classNames={{
									th: "bg-default-100 dark:bg-default-50/50 text-xs text-default-500 font-medium",
								}}
							>
								<TableHeader>
									<TableColumn>Email</TableColumn>
									<TableColumn>{t("import_confirm_action_update")}</TableColumn>
									<TableColumn>{t("import_confirm_no_changes")}</TableColumn>
								</TableHeader>
								<TableBody>
									{visibleDuplicates.map((dup) => (
										<TableRow key={dup.record.email}>
											<TableCell>
												<span className="text-xs">{dup.record.email}</span>
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
													classNames={{
														trigger: "z-10",
														popoverContent: "z-[9999]",
													}}
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
							</div>

							{/* Paginación duplicados */}
							<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mt-3">
								<p className="text-xs text-default-400">
									{t("import_confirm_showing_count", {
										shown: Math.min(duplicateVisible, duplicateRecords.length),
										total: duplicateRecords.length,
									})}
								</p>
								{duplicateVisible < duplicateRecords.length && (
									<Button
										variant="light"
										size="sm"
										onPress={handleShowMoreDuplicates}
									>
										{t("import_confirm_show_more")}
									</Button>
								)}
							</div>
						</AccordionItem>
					</Accordion>
				)}

				{/* Resumen de la acción antes de confirmar */}
				<div className="rounded-xl bg-default-100 dark:bg-default-50/30 p-4 space-y-2">
					<p className="text-sm text-default-700 dark:text-default-500">
						{t("import_confirm_action_summary_title")}
					</p>
					<ul className="space-y-1 text-xs text-default-500 dark:text-default-400">
						{validRecords.length > 0 && (
							<li className="flex items-center gap-2">
								<IconComponent icon="solar:check-circle-outline" size="sm" className="text-success shrink-0" />
								{t("import_confirm_summary_new", { count: validRecords.length })}
							</li>
						)}
						{duplicateRecords.filter((d) => d.action === EnumDuplicateAction.UPDATE).length > 0 && (
							<li className="flex items-center gap-2">
								<IconComponent icon="solar:refresh-outline" size="sm" className="text-warning shrink-0" />
								{t("import_confirm_summary_merge", {
									count: duplicateRecords.filter((d) => d.action === EnumDuplicateAction.UPDATE).length,
								})}
							</li>
						)}
						{invalidRecords.length > 0 && (
							<li className="flex items-center gap-2">
								<IconComponent icon="solar:close-circle-outline" size="sm" className="text-danger shrink-0" />
								{t("import_confirm_summary_skip_invalid", { count: invalidRecords.length })}
							</li>
						)}
					</ul>
				</div>

				{/* Botón importar */}
				<div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
					<Button
						variant="light"
						size="sm"
						onPress={() => goToStep(EnumImportStep.MAPPING)}
						startContent={<IconComponent icon="solar:arrow-left-outline" size="sm" />}
					>
						{t("import_confirm_back_to_mapping")}
					</Button>
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

	// ── Fase PROCESSING ──
	if (processStatus === EnumProcessStatus.PROCESSING) {
		// Calcular el ángulo del anillo SVG
		const radius = 54;
		const circumference = 2 * Math.PI * radius;
		const strokeDashoffset = circumference - (progress / 100) * circumference;

		return (
			<div className="flex flex-col items-center gap-6 px-2 py-4 sm:p-4">
				{/* Indicador circular */}
				<div className="relative flex items-center justify-center">
					<svg
					width="140"
					height="140"
					viewBox="0 0 120 120"
					className="-rotate-90"
					role="progressbar"
					aria-valuenow={Math.round(progress)}
					aria-valuemin={0}
					aria-valuemax={100}
					aria-label={t("import_processing_title")}
				>
						{/* Fondo del anillo */}
						<circle
							cx="60"
							cy="60"
							r={radius}
							fill="none"
							stroke="currentColor"
							strokeWidth="8"
							className="text-default-100 dark:text-default-50/20"
						/>
						{/* Progreso */}
						<circle
							cx="60"
							cy="60"
							r={radius}
							fill="none"
							stroke="currentColor"
							strokeWidth="8"
							strokeLinecap="round"
							strokeDasharray={circumference}
							strokeDashoffset={strokeDashoffset}
							className="text-primary transition-all duration-500"
						/>
					</svg>
					{/* Porcentaje centrado */}
					<div className="absolute inset-0 flex flex-col items-center justify-center">
						<span className="text-2xl font-bold text-default-800 dark:text-default-500">
							{Math.round(progress)}%
						</span>
					</div>
				</div>

				<h3 className="text-base font-medium text-default-700 dark:text-default-500">
					{t("import_processing_title")}
				</h3>

				{/* Stepper vertical */}
				<div className="w-full max-w-md">
					<ImportProgressLog entries={logEntries} />
				</div>

				{/* Aviso de no cerrar */}
				<div className="flex items-center gap-3 rounded-xl bg-default-100 dark:bg-default-50/30 px-4 py-3 w-full max-w-md">
					<IconComponent
						icon="solar:clock-circle-outline"
						size="md"
						className="text-default-400 shrink-0"
					/>
					<p className="text-xs text-default-500 dark:text-default-400">
						{t("import_processing_do_not_close")}
					</p>
				</div>
			</div>
		);
	}

	// ── Fase DONE ──
	if (processStatus === EnumProcessStatus.DONE && result) {
		return (
			<div className="flex flex-col gap-5 px-2 py-4 sm:p-4">
				{/* Estado de éxito centrado */}
				<div className="flex flex-col items-center gap-3 py-4">
					<div className="flex items-center justify-center w-16 h-16 rounded-full bg-success-100 dark:bg-success-900/20">
						<IconComponent
							icon="solar:check-circle-bold"
							className="text-success"
							style={{ fontSize: "36px" }}
						/>
					</div>
					<div className="text-center">
						<h3 className="text-lg font-semibold text-default-800 dark:text-default-500">
							{t("import_result_completed")}
						</h3>
						{file && (
							<p className="text-xs text-default-400 mt-1">
								{file.name}
							</p>
						)}
					</div>
				</div>

				{/* Métricas neutras */}
				<div className="grid grid-cols-3 gap-2 sm:gap-3">
					<div className="flex flex-col items-center gap-1 sm:flex-row sm:items-center sm:gap-3 rounded-xl border border-default-200 dark:border-default-100 bg-default-50 dark:bg-default-100/30 px-2 py-3 sm:px-4">
						<IconComponent icon="solar:check-circle-outline" size="md" className="text-success" />
						<div className="flex flex-col items-center sm:items-start">
							<span className="text-lg sm:text-xl font-bold text-default-800 dark:text-default-500">
								{result.created}
							</span>
							<span className="text-[10px] sm:text-xs text-default-400 text-center sm:text-left">
								{t("import_result_created", { count: result.created })}
							</span>
						</div>
					</div>
					<div className="flex flex-col items-center gap-1 sm:flex-row sm:items-center sm:gap-3 rounded-xl border border-default-200 dark:border-default-100 bg-default-50 dark:bg-default-100/30 px-2 py-3 sm:px-4">
						<IconComponent icon="solar:refresh-outline" size="md" className="text-warning" />
						<div className="flex flex-col items-center sm:items-start">
							<span className="text-lg sm:text-xl font-bold text-default-800 dark:text-default-500">
								{result.updated}
							</span>
							<span className="text-[10px] sm:text-xs text-default-400 text-center sm:text-left">
								{t("import_result_updated", { count: result.updated })}
							</span>
						</div>
					</div>
					<div className="flex flex-col items-center gap-1 sm:flex-row sm:items-center sm:gap-3 rounded-xl border border-default-200 dark:border-default-100 bg-default-50 dark:bg-default-100/30 px-2 py-3 sm:px-4">
						<IconComponent icon="solar:close-circle-outline" size="md" className="text-danger" />
						<div className="flex flex-col items-center sm:items-start">
							<span className="text-lg sm:text-xl font-bold text-default-800 dark:text-default-500">
								{result.failed}
							</span>
							<span className="text-[10px] sm:text-xs text-default-400 text-center sm:text-left">
								{t("import_result_failed", { count: result.failed })}
							</span>
						</div>
					</div>
				</div>

				{/* Log colapsable */}
				{logEntries.length > 0 && (
					<Accordion variant="light">
						<AccordionItem
							key="log"
							title={
								<span className="text-xs text-default-400">
									{t("import_result_view_log")}
								</span>
							}
						>
							<ImportProgressLog entries={logEntries} />
						</AccordionItem>
					</Accordion>
				)}

				{/* Reporte como tarjeta accionable */}
				<button
					type="button"
					onClick={downloadFullReport}
					className="flex items-center gap-3 rounded-xl border border-default-200 dark:border-default-100 bg-default-50 dark:bg-default-100/30 px-4 py-3 w-full text-left hover:bg-default-100 dark:hover:bg-default-100/50 transition-colors group"
				>
					<div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-900/20 shrink-0">
						<IconComponent
							icon="solar:download-minimalistic-outline"
							size="sm"
							className="text-primary"
						/>
					</div>
					<div>
						<p className="text-sm font-medium text-default-700 dark:text-default-500 group-hover:underline">
							{t("import_result_download_report")}
						</p>
						<p className="text-xs text-default-400">
							{t("import_result_report_description")}
						</p>
					</div>
				</button>

				{/* Errores descargables */}
				{result.failed > 0 && (
					<button
						type="button"
						onClick={downloadInvalidRecords}
						className="flex items-center gap-3 rounded-xl border border-danger-200 dark:border-danger-800/30 bg-default-50 dark:bg-default-100/30 px-4 py-3 w-full text-left hover:bg-danger-50 dark:hover:bg-danger-900/10 transition-colors group"
					>
						<div className="flex items-center justify-center w-8 h-8 rounded-lg bg-danger-50 dark:bg-danger-900/20 shrink-0">
							<IconComponent
								icon="solar:download-minimalistic-outline"
								size="sm"
								className="text-danger"
							/>
						</div>
						<div>
							<p className="text-sm font-medium text-danger-600 dark:text-danger-400 group-hover:underline">
								{t("import_result_download_errors")}
							</p>
							<p className="text-xs text-default-400">
								{t("import_confirm_download_invalid_hint")}
							</p>
						</div>
					</button>
				)}


				{/* Historial de importaciones */}
				<Accordion variant="light">
					<AccordionItem
						key="import-history"
						title={
							<span className="text-xs text-default-400">
								Historial de importaciones
							</span>
						}
					>
						<div className="flex flex-col gap-2">
							{ImportLogService.getInstance().getAll().slice(0, 10).map((log) => (
								<div
									key={log.id}
									className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 p-2 rounded-lg bg-default-50 dark:bg-default-100/30 text-xs"
								>
									<div className="flex flex-col gap-0.5">
										<span className="font-medium text-default-700 dark:text-default-500">
											{log.fileName}
										</span>
										<span className="text-default-400">
											{new Date(log.date).toLocaleString()}
										</span>
									</div>
									<div className="flex flex-wrap items-center gap-2 sm:gap-3">
										<span className="text-success">{log.created} creados</span>
										<span className="text-warning">{log.updated} actualizados</span>
										{log.failed > 0 && (
											<span className="text-danger">{log.failed} errores</span>
										)}
									</div>
								</div>
							))}
							{ImportLogService.getInstance().getAll().length === 0 && (
								<p className="text-xs text-default-400 text-center py-2">
									No hay importaciones registradas
								</p>
							)}
						</div>
					</AccordionItem>
				</Accordion>
				{/* Doble acción en footer */}
				<div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-2">
					<Button
						variant="light"
						onPress={reset}
					>
						{t("import_result_import_another")}
					</Button>
				</div>
			</div>
		);
	}

	// ── Fase ERROR ──
	return (
		<div className="flex flex-col gap-6 px-2 py-4 sm:p-4 items-center">
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
