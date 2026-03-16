import type {
	IExportConfigRequest,
	IExportResponse,
} from "@clients/domain/interfaces/export-config.interface";
import type { ExportClientsResponseDto } from "../dtos/export-clients.dto";
import type { GetClientsByFilterRequestDto } from "../dtos/get-clients-by-filter.dto";
import { toGetClientsByFilterRequestDto } from "./client-filter.mapper";

/**
 * Export Clients Mapper
 *
 * Uses the same filter DTO and param names as GET /clients so export
 * sends the same query params as when filtering the list.
 */

const EXPORT_CSV_MAX_LIMIT = 2000;

/**
 * Builds the same query DTO used by GET /clients, with limit capped for export.
 * Used by GET /clients/export-csv so it receives the same params as the list.
 */
export const buildExportQueryParams = (
	exportConfig: IExportConfigRequest
): GetClientsByFilterRequestDto => {
	const limit = Math.min(
		Math.max(1, exportConfig.limit),
		EXPORT_CSV_MAX_LIMIT
	);

	if (!exportConfig.filters) {
		return { limit };
	}

	const dto = toGetClientsByFilterRequestDto(exportConfig.filters);
	return { ...dto, limit };
};

/**
 * Maps export response DTO (CsvExportResponseDto) to domain interface.
 */
export const toExportResponseFromDto = (
	responseDto: ExportClientsResponseDto
): IExportResponse => {
	return {
		csvContent: responseDto.csvContent,
		filename: responseDto.filename,
		totalRecords: responseDto.totalRecords,
		fileSizeBytes: responseDto.fileSizeBytes,
		generatedAt: responseDto.generatedAt,
		columns: responseDto.columns ?? [],
		mimeType: responseDto.mimeType,
	};
};
