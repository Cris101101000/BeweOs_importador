import type { ICatalogExportResponse } from "@catalog/domain/interfaces/catalog-export.interface";
import type { ExportCatalogResponseDto } from "../dtos/export-catalog.dto";

/**
 * Maps export response DTO to domain interface
 * @param responseDto - DTO from API response
 * @returns ICatalogExportResponse - Domain export response
 */
export const toCatalogExportResponseFromDto = (
	responseDto: ExportCatalogResponseDto
): ICatalogExportResponse => {
	return {
		csvContent: responseDto.csvContent,
		filename: responseDto.filename,
		totalRecords: responseDto.totalRecords,
		totalAvailable: responseDto.totalAvailable,
		wasPartialExport: responseDto.wasPartialExport,
		fileSizeBytes: responseDto.fileSizeBytes,
		generatedAt: responseDto.generatedAt,
		mimeType: responseDto.mimeType,
	};
};
