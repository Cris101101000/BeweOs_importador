import { ExportClientsUseCase } from "@clients/application/export-clients.usecase";
import type { IClientFilter } from "@clients/domain/interfaces/client-filter.interface";
import { ClientAdapter } from "@clients/infrastructure/adapters/client.adapter";
import { downloadBlob, generateTimestampFilename } from "@shared/utils";
import { useCallback } from "react";

interface UseExportClientsDataReturn {
	/** Export clients data for a company with optional selection and filters */
	exportClientsData: (
		customColumns?: string[],
		options?: { selectedClientIds?: string[]; filters?: IClientFilter }
	) => Promise<void>;
}

/**
 * Hook for exporting clients data - UI Layer only
 *
 * This hook is ultra-simplified to only handle:
 * - Loading states
 * - File download mechanics
 *
 * All business logic, validations, and notifications are handled by the use case.
 */
export const useExportClientsData = (): UseExportClientsDataReturn => {
	const exportClientsData = useCallback(
		async (
			customColumns?: string[],
			options?: { selectedClientIds?: string[]; filters?: IClientFilter }
		) => {
			// Create use case instance with adapter and notification service
			const clientAdapter = new ClientAdapter();
			const exportUseCase = new ExportClientsUseCase(clientAdapter);

			// Execute the use case - handles all validations, errors, and notifications
			const csvBlob = await exportUseCase.execute(customColumns, options);
			// Only handle file download (UI responsibility)
			const filename = generateTimestampFilename("contactos", ".csv");
			downloadBlob(csvBlob, filename);
		},
		[]
	);

	return {
		exportClientsData,
	};
};
