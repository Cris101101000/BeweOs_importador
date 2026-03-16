/**
 * Export Configuration Constants
 *
 * Defines default configuration values for client data export
 */

/**
 * Default export configuration
 * These are the standard settings used when no custom configuration is provided
 */
export const DEFAULT_EXPORT_CONFIG = {
	/** Default maximum number of records to export */
	limit: 1000,
	/** Whether to include column headers in the CSV by default */
	includeHeaders: true,
} as const;
