import type { IExportResponse } from "@clients/domain/interfaces/export-config.interface";

/**
 * Export Response Service
 *
 * Handles the conversion and processing of export responses
 * in the application layer
 */
export class ExportResponseService {
	/**
	 * Converts base64 CSV content to downloadable Blob
	 * @param exportResponse - Export response with base64 content
	 * @returns Blob ready for download
	 */
	public convertToBlob(exportResponse: IExportResponse): Blob {
		// Decode base64 content
		const csvContent = atob(exportResponse.csvContent);

		// Create blob with appropriate MIME type
		return new Blob([csvContent], {
			type: exportResponse.mimeType || "text/csv;charset=utf-8",
		});
	}
}
