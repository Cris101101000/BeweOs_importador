/**
 * File Download Utilities
 *
 * Simple utilities for downloading files in the browser
 */

/**
 * Downloads a blob as a file
 * @param blob - The blob to download
 * @param filename - The filename for the download
 */
export const downloadBlob = (blob: Blob, filename: string): void => {
	let finalFilename = filename;
	const isCsvBlob =
		blob.type.includes("csv") ||
		blob.type === "text/csv" ||
		blob.type === "text/csv;charset=utf-8";
	const isCsvFilename = filename.endsWith(".csv");

	if (isCsvBlob && !isCsvFilename) {
		// Remove any existing extension and add .csv
		finalFilename = filename.replace(/\.[^/.]+$/, "") + ".csv";
		console.log("📥 downloadBlob: Fixed filename extension", {
			original: filename,
			final: finalFilename,
		});
	}

	// If blob type is JSON but we want CSV, recreate blob with CSV MIME type
	let finalBlob = blob;
	if (blob.type.includes("json") && isCsvFilename) {
		finalBlob = new Blob([blob], {
			type: "text/csv;charset=utf-8",
		});
	}

	// Ensure CSV blobs have correct MIME type
	if (isCsvBlob && !finalBlob.type.includes("csv")) {
		finalBlob = new Blob([finalBlob], {
			type: "text/csv;charset=utf-8",
		});
	}

	const url = URL.createObjectURL(finalBlob);
	const link = document.createElement("a");

	link.href = url;
	link.download = finalFilename;
	link.style.visibility = "hidden";

	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);

	// Clean up
	URL.revokeObjectURL(url);
};

/**
 * Generates a filename with current timestamp
 * @param prefix - File prefix (e.g., "contactos")
 * @param extension - File extension (e.g., ".csv")
 * @returns Generated filename with timestamp
 */
export const generateTimestampFilename = (
	prefix = "export",
	extension = ".csv"
): string => {
	const now = new Date();
	const dateStr = now.toISOString().split("T")[0]; // YYYY-MM-DD
	const timeStr = now.toTimeString().split(" ")[0].replace(/:/g, "-"); // HH-MM-SS

	return `${prefix}_${dateStr}_${timeStr}${extension}`;
};
