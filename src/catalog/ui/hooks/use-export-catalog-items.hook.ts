import { ExportCatalogItemsUseCase } from "@catalog/application/export-catalog-items.usecase";
import type { EnumCatalogType } from "@catalog/domain/enums/catalog-type.enum";
import type { ICatalogFilters } from "@catalog/domain/interfaces/catalog-filter.interface";
import { CatalogAdapter } from "@catalog/infrastructure/adapters/catalog.adapter";
import { downloadBlob, generateTimestampFilename } from "@shared/utils";
import { useCallback } from "react";

interface UseExportCatalogItemsReturn {
	/** Export catalog items data with optional filters */
	exportCatalogItems: (
		filters?: ICatalogFilters | Record<string, any>,
		options?: { type?: EnumCatalogType; filenamePrefix?: string }
	) => Promise<void>;
}

/**
 * Hook for exporting catalog items data - UI Layer only
 *
 * This hook is simplified to only handle:
 * - Loading states
 * - File download mechanics
 *
 * All business logic, validations, and notifications are handled by the use case.
 */
export const useExportCatalogItems = (): UseExportCatalogItemsReturn => {
	const exportCatalogItems = useCallback(
		async (
			filters?: ICatalogFilters | Record<string, any>,
			options?: { type?: EnumCatalogType; filenamePrefix?: string }
		) => {
			try {
				// Create use case instance with adapter
				const catalogAdapter = new CatalogAdapter();

				const exportUseCase = new ExportCatalogItemsUseCase(catalogAdapter);

				// Prepare filters with type if provided
				const exportFilters = {
					...filters,
					...(options?.type && { type: options.type }),
				};

				// Execute the use case - handles all validations, errors, and notifications
				// Pass catalog type for type-specific column filtering (e.g., services exclude duplicated time columns)
				const csvBlob = await exportUseCase.execute(
					exportFilters,
					options?.type
				);

				// Only handle file download (UI responsibility)
				const prefix = options?.filenamePrefix || "catalog";
				const filename = generateTimestampFilename(prefix, ".csv");

				downloadBlob(csvBlob, filename);
			} catch (error) {
				throw error;
			}
		},
		[]
	);

	return {
		exportCatalogItems,
	};
};
