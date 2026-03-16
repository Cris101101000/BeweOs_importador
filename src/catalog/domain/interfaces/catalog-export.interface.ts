/**
 * Catalog Export Response Interface
 */
export interface ICatalogExportResponse {
	csvContent: string;
	filename: string;
	totalRecords: number;
	totalAvailable: number;
	wasPartialExport: boolean;
	fileSizeBytes: number;
	generatedAt: string;
	mimeType: string;
}
