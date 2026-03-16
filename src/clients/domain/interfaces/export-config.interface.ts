/**
 * Export Configuration Interface
 *
 * Defines the structure for client data export configuration
 */
import type { IClientFilter } from "./client-filter.interface";
export interface IExportConfigRequest {
	/** List of columns to include in the export */
	columns?: string[];
	/** Maximum number of records to export */
	limit: number;
	/** Whether to include headers in the CSV */
	includeHeaders: boolean;
	/** Optional list of explicitly selected client IDs to export */
	selectedClientIds?: string[];
	/** Optional filters snapshot applied at export time */
	filters?: IClientFilter;
}

/**
 * Export Response Interface
 *
 * Represents the response structure from the export API endpoint
 */
export interface IExportResponse {
	/** Base64 encoded CSV content */
	csvContent: string;
	/** Generated filename for the export */
	filename: string;
	/** Total number of records exported */
	totalRecords: number;
	/** File size in bytes */
	fileSizeBytes: number;
	/** Timestamp when the export was generated */
	generatedAt: string;
	/** Array of column names included in the export */
	columns: string[];
	/** MIME type of the exported file */
	mimeType: string;
}
