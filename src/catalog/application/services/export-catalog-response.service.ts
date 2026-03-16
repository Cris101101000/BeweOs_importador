import type { ICatalogExportResponse } from "@catalog/domain/interfaces/catalog-export.interface";

interface ConvertToBlobOptions {
	/** Column names to exclude from the CSV output */
	columnsToExclude?: string[];
}

/**
 * Export Catalog Response Service
 *
 * Handles the conversion and processing of export responses
 * in the application layer
 */
export class ExportCatalogResponseService {
	/**
	 * Converts base64 CSV content to downloadable Blob
	 * @param exportResponse - Export response with base64 content
	 * @param options - Optional configuration for column filtering
	 * @returns Blob ready for download as CSV file
	 */
	public convertToBlob(
		exportResponse: ICatalogExportResponse,
		options?: ConvertToBlobOptions
	): Blob {
		try {
			// Clean base64 string (remove whitespace, newlines, etc.)
			const base64Content = exportResponse.csvContent
				.trim()
				.replace(/\s/g, "");

			// Decode base64 to bytes, then decode as UTF-8 to preserve special characters (ñ, á, é, etc.)
			let csvContent: string;
			try {
				const binaryString = atob(base64Content);
				const bytes = new Uint8Array(binaryString.length);
				for (let i = 0; i < binaryString.length; i++) {
					bytes[i] = binaryString.charCodeAt(i);
				}
				csvContent = new TextDecoder("utf-8").decode(bytes);
			} catch (decodeError) {
				throw new Error(
					`Failed to decode base64 content: ${decodeError instanceof Error ? decodeError.message : "Unknown error"}`
				);
			}

			// Validate that decoded content looks like CSV
			if (!csvContent || csvContent.length === 0) {
				throw new Error("Decoded CSV content is empty");
			}

			// Filter out excluded columns if specified
			if (options?.columnsToExclude && options.columnsToExclude.length > 0) {
				csvContent = this.removeColumns(csvContent, options.columnsToExclude);
			}

			// Add UTF-8 BOM for Excel compatibility (ensures proper encoding recognition)
			const BOM = "\uFEFF";
			const csvWithBOM = BOM + csvContent;

			// Create blob with explicit CSV MIME type
			const blob = new Blob([csvWithBOM], {
				type: "text/csv;charset=utf-8",
			});

			return blob;
		} catch (error) {
			throw new Error(
				`Failed to convert export response to CSV blob: ${error instanceof Error ? error.message : "Unknown error"}`
			);
		}
	}

	/**
	 * Removes specified columns from CSV content
	 * @param csvContent - Raw CSV string
	 * @param columnsToExclude - Array of column header names to remove
	 * @returns CSV string with excluded columns removed
	 */
	private removeColumns(
		csvContent: string,
		columnsToExclude: string[]
	): string {
		const lines = csvContent.split("\n");
		if (lines.length === 0) return csvContent;

		// Parse header row to find column indices to exclude
		const headers = this.parseCsvLine(lines[0]);
		const excludeIndices = new Set<number>();

		for (const columnName of columnsToExclude) {
			const index = headers.findIndex(
				(header) => header.trim().toLowerCase() === columnName.toLowerCase()
			);
			if (index !== -1) {
				excludeIndices.add(index);
			}
		}

		// If no columns found to exclude, return original content
		if (excludeIndices.size === 0) return csvContent;

		// Filter columns from each row
		const filteredLines = lines.map((line) => {
			if (line.trim() === "") return line;
			const fields = this.parseCsvLine(line);
			const filteredFields = fields.filter(
				(_, index) => !excludeIndices.has(index)
			);
			return filteredFields.join(",");
		});

		return filteredLines.join("\n");
	}

	/**
	 * Parses a CSV line respecting quoted fields that may contain commas
	 * @param line - Single CSV line
	 * @returns Array of field values
	 */
	private parseCsvLine(line: string): string[] {
		const fields: string[] = [];
		let current = "";
		let inQuotes = false;

		for (let i = 0; i < line.length; i++) {
			const char = line[i];

			if (char === '"') {
				if (inQuotes && line[i + 1] === '"') {
					// Escaped quote inside quoted field
					current += '"';
					i++;
				} else {
					// Toggle quote state
					inQuotes = !inQuotes;
					current += char;
				}
			} else if (char === "," && !inQuotes) {
				fields.push(current);
				current = "";
			} else {
				current += char;
			}
		}
		fields.push(current);

		return fields;
	}
}
