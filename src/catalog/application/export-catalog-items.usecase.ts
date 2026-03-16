import { EnumCatalogType } from "@catalog/domain/enums/catalog-type.enum";
import type { ICatalogFilters } from "@catalog/domain/interfaces/catalog-filter.interface";
import type { ICatalogPort } from "@catalog/domain/ports/catalog.port";
import { ExportCatalogResponseService } from "./services/export-catalog-response.service";

/** Columns to exclude from service exports (duplicated time information) */
const SERVICE_COLUMNS_TO_EXCLUDE = ["formattedDuration", "durationInMinutes"];

/**
 * Export Catalog Items Use Case
 *
 * Handles the business logic for exporting catalog items (products or services)
 * to CSV format
 */
export class ExportCatalogItemsUseCase {
	private readonly exportResponseService = new ExportCatalogResponseService();

	/**
	 * Constructor for ExportCatalogItemsUseCase.
	 * @param catalogPort - The catalog port implementing the export logic (infrastructure layer).
	 */
	constructor(private readonly catalogPort: ICatalogPort) {}

	/**
	 * Executes the export operation for catalog items.
	 *
	 * @param filters - Optional filters to apply to the export (search, categories, price range, etc.)
	 * @param catalogType - Optional catalog type to apply type-specific column filtering
	 * @returns A promise resolving to a Blob containing the CSV data ready for download.
	 */
	async execute(
		filters?: ICatalogFilters | Record<string, any>,
		catalogType?: EnumCatalogType
	): Promise<Blob> {
		// Get export response from port
		const exportResponse = await this.catalogPort.exportCatalogItems(filters);

		// Only exclude duplicated time columns for service exports
		const columnsToExclude =
			catalogType === EnumCatalogType.Service
				? SERVICE_COLUMNS_TO_EXCLUDE
				: undefined;

		const blob = this.exportResponseService.convertToBlob(exportResponse, {
			columnsToExclude,
		});
		return blob;
	}
}
