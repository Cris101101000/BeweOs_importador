import { ImportContactsUseCase } from "@clients/application/import-contacts.usecase";
import { EnumProcessStatus } from "@clients/domain/enums/import-status.enum";
import { EnumLogEntryType } from "@clients/domain/interfaces/import-contact.interface";
import { ImportContactsAdapter } from "@clients/infrastructure/adapters/import-contacts.adapter";
import { useCallback } from "react";
import { useImportStore } from "../store/useImportStore";

/**
 * useImportProgress
 *
 * Orquesta el procesamiento de importación:
 * 1. Cambia processStatus a PROCESSING
 * 2. Llama al use case con callback de progreso
 * 3. Actualiza el store con resultado o error
 */
export const useImportProgress = () => {
	const startImport = useCallback(async () => {
		const state = useImportStore.getState();
		const {
			validRecords,
			duplicateRecords,
			setProcessStatus,
			setProgress,
			addLogEntry,
			setResult,
		} = state;

		setProcessStatus(EnumProcessStatus.PROCESSING);
		setProgress(0);
		addLogEntry("Iniciando importación...", EnumLogEntryType.INFO);

		try {
			const adapter = new ImportContactsAdapter();
			const useCase = new ImportContactsUseCase(adapter);

			const result = await useCase.execute(
				validRecords,
				duplicateRecords,
				(progress: number, log: string) => {
					const currentState = useImportStore.getState();
					currentState.setProgress(progress);
					currentState.addLogEntry(log, EnumLogEntryType.LOADING);
				}
			);

			const finalState = useImportStore.getState();
			finalState.setResult(result);
			finalState.setProgress(100);
			finalState.addLogEntry(
				`Importación completada: ${result.created} creados, ${result.updated} actualizados, ${result.failed} errores`,
				EnumLogEntryType.SUCCESS
			);
			finalState.setProcessStatus(EnumProcessStatus.DONE);
		} catch (error) {
			const errorState = useImportStore.getState();
			errorState.addLogEntry(
				`Error: ${error instanceof Error ? error.message : "Error desconocido"}`,
				EnumLogEntryType.ERROR
			);
			errorState.setProcessStatus(EnumProcessStatus.ERROR);
		}
	}, []);

	return { startImport };
};
