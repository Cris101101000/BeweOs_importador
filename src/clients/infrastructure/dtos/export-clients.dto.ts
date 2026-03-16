/**
 * Export Clients DTOs
 *
 * Data Transfer Objects for client export functionality
 */

/**
 * Request DTO for exporting clients data
 * Represents the structure sent to the API endpoint
 */
export interface ExportClientsRequestDto {
	/** List of columns to include in the export */
	columns: string[];
	/** Maximum number of records to export */
	limit: number;
	/** Whether to include headers in the CSV */
	includeHeaders: boolean;
	/** Optional explicit selected client IDs to export */
	selectedClientIds?: string[];
	/** Optional filters snapshot used to scope export */
	filters?: import("./get-clients-by-filter.dto").GetClientsByFilterRequestDto;
}

/**
 * Response DTO for export clients operation
 * Represents the structure returned by the API endpoint
 */
export interface ExportClientsResponseDto {
	/** Base64 encoded CSV content */
	csvContent: string;
	/** Generated filename for the export */
	filename: string;
	/** Total number of records exported */
	totalRecords: number;
	/** File size in bytes */
	fileSizeBytes: number;
	/** Timestamp when the export was generated (ISO string) */
	generatedAt: string;
	/** Array of column names included in the export */
	columns: string[];
	/** MIME type of the exported file */
	mimeType: string;
}
