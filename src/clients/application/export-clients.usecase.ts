/**
 * Use case for exporting clients data.
 *
 * This class encapsulates the business logic required to export client data for a given company.
 * It builds the export configuration using default values and any custom columns provided,
 * then delegates the actual export operation to the injected client port.
 */
import { DEFAULT_EXPORT_COLUMNS } from "@clients/domain/constants/export-columns.constants";
import { DEFAULT_EXPORT_CONFIG } from "@clients/domain/constants/export-config.constants";
import type { IClientFilter } from "../domain/interfaces/client-filter.interface";
import type { IExportConfigRequest } from "../domain/interfaces/export-config.interface";
import type { IClientPort } from "../domain/ports/client.port";
import { ExportResponseService } from "./services/export-response.service";

export class ExportClientsUseCase {
	private readonly exportResponseService = new ExportResponseService();

	/**
	 * Constructor for ExportClientsUseCase.
	 * @param clientPort - The client port implementing the export logic (infrastructure layer).
	 */
	constructor(private readonly clientPort: IClientPort) {}

	/**
	 * Executes the export operation for clients data.
	 *
	 * @param customColumns - Optional array of column names to include in the export.
	 * @param options - Optional options including selected IDs and current filters
	 * @returns A promise resolving to a Blob containing the CSV data ready for download.
	 */
	async execute(
		customColumns?: string[],
		options?: { selectedClientIds?: string[]; filters?: IClientFilter }
	): Promise<Blob> {
		// Build export configuration with business logic
		const exportConfig: IExportConfigRequest = {
			columns: customColumns || [...DEFAULT_EXPORT_COLUMNS],
			limit: DEFAULT_EXPORT_CONFIG.limit,
			includeHeaders: DEFAULT_EXPORT_CONFIG.includeHeaders,
			...(options?.selectedClientIds && {
				selectedClientIds: options.selectedClientIds,
			}),
			...(options?.filters && { filters: options.filters }),
		};

		// Get export response from port
		const exportResponse =
			await this.clientPort.exportClientsData(exportConfig);

		// Convert response to downloadable blob
		return this.exportResponseService.convertToBlob(exportResponse);
	}
}
