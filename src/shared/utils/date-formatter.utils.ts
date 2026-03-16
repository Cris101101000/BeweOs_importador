import { type Locale, format, isValid, parse } from "date-fns";
import { enUS } from "date-fns/locale";

/**
 * Common date format patterns used throughout the application
 */
export const DATE_FORMATS = {
	/**
	 * US format: "May 05, 1993"
	 */
	usStandard: "MMM dd, yyyy",
	/**
	 * Short format: "May 05"
	 */
	short: "MMM dd",
	/**
	 * Long format: "May 05, 1993"
	 */
	long: "MMMM dd, yyyy",
	/**
	 * Numeric format: "05/05/1993"
	 */
	numeric: "MM/dd/yyyy",
	/**
	 * ISO format: "1993-05-05"
	 */
	iso: "yyyy-MM-dd",
	/**
	 * European format: "05 May 1993"
	 */
	european: "dd MMM yyyy",
	/**
	 * Display format: "May 05, 1993"
	 */
	display: "MMM dd, yyyy",
} as const;

/**
 * Input date format pattern for parsing DD/MM/YYYY strings
 */
export const INPUT_DATE_FORMAT = "dd/MM/yyyy";

/**
 * Generic function to format a date string from DD/MM/YYYY format to any desired format
 * @param dateString - Date string in DD/MM/YYYY format (e.g., "05/05/1993")
 * @param formatPattern - Target format pattern (use DATE_FORMATS constants or custom pattern)
 * @param locale - Locale for month names (default: English US)
 * @returns Formatted date string or original string if invalid
 *
 * @example
 * formatDate("05/05/1993", DATE_FORMATS.usStandard) // Returns "May 05, 1993"
 * formatDate("15/12/1990", DATE_FORMATS.long) // Returns "December 15, 1990"
 * formatDate("25/07/1992", DATE_FORMATS.short) // Returns "Jul 25"
 * formatDate("invalid", DATE_FORMATS.display) // Returns "invalid"
 */
export const formatDate = (
	dateString: string,
	formatPattern: string = DATE_FORMATS.display,
	locale: Locale = enUS
): string => {
	try {
		// Parse the date from DD/MM/YYYY format
		const parsedDate = parse(dateString, INPUT_DATE_FORMAT, new Date());

		// Check if the parsed date is valid
		if (!isValid(parsedDate)) {
			console.warn(`Invalid date string: "${dateString}"`);
			return dateString; // Return original string if invalid
		}

		// Format to the desired pattern
		return format(parsedDate, formatPattern, { locale });
	} catch (error) {
		console.error(`Error formatting date "${dateString}":`, error);
		return dateString; // Return original string if any error occurs
	}
};

/**
 * Convenience functions for common date formatting scenarios
 */

/**
 * Formats a date for display in standard US format (May 05, 1993)
 * @param dateString - Date string in DD/MM/YYYY format
 * @param locale - Locale for month names (default: English US)
 * @returns Formatted date string
 *
 * @example
 * formatDateForDisplay("05/05/1993") // Returns "May 05, 1993"
 * formatDateForDisplay("15/12/1990") // Returns "Dec 15, 1990"
 */
export const formatDateForDisplay = (
	dateString: string,
	locale: Locale = enUS
): string => formatDate(dateString, DATE_FORMATS.display, locale);

/**
 * Formats a date in short format (May 05)
 * @param dateString - Date string in DD/MM/YYYY format
 * @param locale - Locale for month names (default: English US)
 * @returns Formatted short date string
 *
 * @example
 * formatDateShort("05/05/1993") // Returns "May 05"
 * formatDateShort("15/12/1990") // Returns "Dec 15"
 */
export const formatDateShort = (
	dateString: string,
	locale: Locale = enUS
): string => formatDate(dateString, DATE_FORMATS.short, locale);

/**
 * Formats a date in long format (December 15, 1990)
 * @param dateString - Date string in DD/MM/YYYY format
 * @param locale - Locale for month names (default: English US)
 * @returns Formatted long date string
 *
 * @example
 * formatDateLong("05/05/1993") // Returns "May 05, 1993"
 * formatDateLong("15/12/1990") // Returns "December 15, 1990"
 */
export const formatDateLong = (
	dateString: string,
	locale: Locale = enUS
): string => formatDate(dateString, DATE_FORMATS.long, locale);

/**
 * Formats a date to ISO format (1993-05-05)
 * @param dateString - Date string in DD/MM/YYYY format
 * @returns ISO formatted date string
 *
 * @example
 * formatDateToISO("05/05/1993") // Returns "1993-05-05"
 * formatDateToISO("15/12/1990") // Returns "1990-12-15"
 */
export const formatDateToISO = (dateString: string): string =>
	formatDate(dateString, DATE_FORMATS.iso, enUS);

/**
 * Formats a Date object or ISO string directly to display format
 * @param date - Date object or ISO string
 * @param formatPattern - Format pattern (default: display)
 * @param locale - Locale for month names (default: English US)
 * @returns Formatted date string or "-" if invalid
 *
 * @example
 * formatDateObjectToDisplay(new Date()) // Returns "Nov 05, 2024"
 * formatDateObjectToDisplay("2024-11-05T10:30:00Z") // Returns "Nov 05, 2024"
 * formatDateObjectToDisplay(new Date(), DATE_FORMATS.short) // Returns "Nov 05"
 */
export const formatDateObjectToDisplay = (
	date: Date | string,
	formatPattern: string = DATE_FORMATS.display,
	locale: Locale = enUS
): string => {
	try {
		const dateObj = typeof date === "string" ? new Date(date) : date;

		if (!isValid(dateObj)) {
			console.warn(`Invalid date object: "${date}"`);
			return "-";
		}

		return format(dateObj, formatPattern, { locale });
	} catch (error) {
		console.error(`Error formatting date object "${date}":`, error);
		return "-";
	}
};

/**
 * Validation and utility functions
 */

/**
 * Validates if a date string is in DD/MM/YYYY format and represents a valid date
 * @param dateString - Date string to validate
 * @returns True if valid, false otherwise
 *
 * @example
 * isValidDateString("05/05/1993") // Returns true
 * isValidDateString("32/13/1993") // Returns false
 * isValidDateString("invalid")    // Returns false
 */
export const isValidDateString = (dateString: string): boolean => {
	if (!dateString || typeof dateString !== "string") {
		return false;
	}

	try {
		const parsedDate = parse(dateString, INPUT_DATE_FORMAT, new Date());
		return isValid(parsedDate);
	} catch (error) {
		return false;
	}
};

/**
 * Validates if a Date object or ISO string is valid
 * @param date - Date object or ISO string to validate
 * @returns True if valid, false otherwise
 *
 * @example
 * isValidDate(new Date()) // Returns true
 * isValidDate("2024-11-05") // Returns true
 * isValidDate("invalid") // Returns false
 */
export const isValidDate = (date: Date | string): boolean => {
	try {
		const dateObj = typeof date === "string" ? new Date(date) : date;
		return isValid(dateObj);
	} catch (error) {
		return false;
	}
};

/**
 * Formats an ISO date string to a readable display format
 * Specifically designed for API responses with ISO date strings like "1985-03-15T00:00:00.000Z"
 * @param isoDateString - ISO date string from API
 * @param formatPattern - Format pattern (default: display format "MMM dd, yyyy")
 * @param locale - Locale for month names (default: English US)
 * @returns Formatted date string or "-" if invalid
 *
 * @example
 * formatISODateForDisplay("1985-03-15T00:00:00.000Z") // Returns "Mar 15, 1985"
 * formatISODateForDisplay("1990-12-25T10:30:00.000Z") // Returns "Dec 25, 1990"
 * formatISODateForDisplay("invalid-date") // Returns "-"
 */
export const formatISODateForDisplay = (
	isoDateString: string,
	formatPattern: string = DATE_FORMATS.display,
	locale: Locale = enUS
): string => {
	try {
		if (!isoDateString) {
			return "-";
		}

		const dateObj = new Date(isoDateString);

		if (!isValid(dateObj)) {
			console.warn(`Invalid ISO date string: "${isoDateString}"`);
			return "-";
		}

		return format(dateObj, formatPattern, { locale });
	} catch (error) {
		console.error(`Error formatting ISO date "${isoDateString}":`, error);
		return "-";
	}
};

/**
 * Legacy function for backward compatibility - use formatDateForDisplay instead
 * @deprecated Use formatDateForDisplay instead
 */
export const formatBirthdate = formatDateForDisplay;
