/**
 * Response DTO for export catalog operation
 */

export interface ExportCatalogResponseDto {
	csvContent: string;
	filename: string;
	totalRecords: number;
	totalAvailable: number;
	wasPartialExport: boolean;
	fileSizeBytes: number;
	generatedAt: string;
	mimeType: string;
}
