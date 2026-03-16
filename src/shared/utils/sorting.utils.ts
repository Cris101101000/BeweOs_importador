import { compareAsc, isValid, parse, parseISO } from "date-fns";

/**
 * Parses a date string trying multiple formats
 * Returns a valid Date object or null if parsing fails
 */
const parseMultipleFormats = (dateString: string): Date | null => {
	if (!dateString) return null;

	// Common date formats to try
	const formats = [
		// ISO format
		() => parseISO(dateString),
		// DD/MM/YYYY format
		() => parse(dateString, "dd/MM/yyyy", new Date()),
		// MM/DD/YYYY format
		() => parse(dateString, "MM/dd/yyyy", new Date()),
		// YYYY-MM-DD format
		() => parse(dateString, "yyyy-MM-dd", new Date()),
		// DD-MM-YYYY format
		() => parse(dateString, "dd-MM-yyyy", new Date()),
		// Native Date constructor
		() => new Date(dateString),
	];

	for (const parseFunction of formats) {
		try {
			const date = parseFunction();
			if (isValid(date)) {
				return date;
			}
		} catch {
			// Continue to next format
		}
	}

	return null;
};

/**
 * Compares two date strings for sorting purposes
 * Returns negative value if a < b, positive if a > b, 0 if equal
 * Null/undefined/invalid dates are sorted to the end
 * Handles multiple date formats: ISO, DD/MM/YYYY, MM/DD/YYYY, etc.
 */
export const compareDates = (a?: string | null, b?: string | null): number => {
	// Handle null/undefined cases
	if (!a && !b) return 0;
	if (!a) return 1; // nulls go to the end
	if (!b) return -1;

	try {
		const dateA = parseMultipleFormats(a);
		const dateB = parseMultipleFormats(b);

		// Handle invalid dates
		if (!dateA && !dateB) return 0;
		if (!dateA) return 1; // invalid dates go to the end
		if (!dateB) return -1;

		// Compare valid dates (ascending order)
		return compareAsc(dateA, dateB);
	} catch (error) {
		// Fallback to string comparison if date parsing fails
		console.warn("Date parsing error:", error);
		return a.localeCompare(b);
	}
};
