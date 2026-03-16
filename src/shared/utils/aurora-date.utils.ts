import type { DateValue, RangeValue } from "@beweco/aurora-ui";
import { CalendarDate } from "@internationalized/date";
import { format, parse } from "date-fns";
import { INPUT_DATE_FORMAT, isValidDateString } from "./date-formatter.utils";

/**
 * Aurora UI DateValue conversion utilities
 *
 * These utilities handle conversion between string dates and Aurora UI DateValue format.
 * Aurora UI uses the @internationalized/date library for date handling.
 */

/**
 * Converts a string date value to Aurora UI DateValue format
 *
 * @param dateString - Date string in DD/MM/YYYY format or undefined
 * @returns DateValue object or undefined
 *
 * @example
 * ```typescript
 * const dateValue = convertStringToDateValue("15/05/1990");
 * const nullValue = convertStringToDateValue("invalid-date"); // returns undefined
 * const emptyValue = convertStringToDateValue(null); // returns undefined
 * ```
 */
export const convertStringToDateValue = (
	dateString: string | undefined
): DateValue | undefined => {
	if (!dateString) return undefined;

	// Use existing validation utility
	if (!isValidDateString(dateString)) {
		console.warn(`Invalid date string: "${dateString}"`);
		return undefined;
	}

	try {
		// Parse the date using existing utility constant
		const parsedDate = parse(dateString, INPUT_DATE_FORMAT, new Date());

		// Extract year, month, day for CalendarDate
		const year = parsedDate.getFullYear();
		const month = parsedDate.getMonth() + 1; // getMonth() returns 0-11, CalendarDate expects 1-12
		const day = parsedDate.getDate();

		// Create CalendarDate using @internationalized/date and cast to DateValue
		return new CalendarDate(year, month, day) as unknown as DateValue;
	} catch (error) {
		console.error(`Error converting date "${dateString}":`, error);
		return undefined;
	}
};

/**
 * Converts Aurora UI DateValue back to string format
 *
 * @param dateValue - DateValue from Aurora UI DatePicker, or null/undefined
 * @returns Date string in DD/MM/YYYY format or undefined
 *
 * @example
 * ```typescript
 * const dateString = convertDateValueToString(dateValue); // "15/05/1990"
 * const nullValue = convertDateValueToString(null); // undefined
 * const undefinedValue = convertDateValueToString(undefined); // undefined
 * ```
 */
export const convertDateValueToString = (
	dateValue: DateValue | undefined | null
): string | undefined => {
	// Handle null, undefined, or falsy values
	if (!dateValue) return undefined;

	try {
		// Validate that dateValue has the expected structure
		if (
			typeof dateValue !== "object" ||
			!("year" in dateValue) ||
			!("month" in dateValue) ||
			!("day" in dateValue)
		) {
			console.warn("Invalid DateValue structure:", dateValue);
			return undefined;
		}

		// CalendarDate has year, month, day properties
		const { year, month, day } = dateValue;

		// Validate numeric values
		if (
			typeof year !== "number" ||
			typeof month !== "number" ||
			typeof day !== "number"
		) {
			console.warn("Invalid DateValue properties:", { year, month, day });
			return undefined;
		}

		// Create a date object and format it using existing utility constant
		// month is 1-based in CalendarDate, Date constructor expects 0-based
		const date = new Date(year, month - 1, day);

		// Validate the created date
		if (Number.isNaN(date.getTime())) {
			console.warn("Invalid date created from DateValue:", {
				year,
				month,
				day,
			});
			return undefined;
		}

		// Format the date
		const formattedDate = format(date, INPUT_DATE_FORMAT);

		// Use existing utility for validation
		if (!isValidDateString(formattedDate)) {
			console.warn("Invalid formatted date:", formattedDate);
			return undefined;
		}

		return formattedDate;
	} catch (error) {
		console.error("Error converting DateValue:", error);
		return undefined;
	}
};

/**
 * Converts a Date object to Aurora UI DateValue format
 * Uses CalendarDate for date-only values without time components
 *
 * @param date - JavaScript Date object
 * @returns DateValue object or undefined if date is invalid
 *
 * @example
 * ```typescript
 * const dateValue = convertDateToDateValue(new Date("2024-01-15"));
 * const nullValue = convertDateToDateValue(null); // returns undefined
 * ```
 */
export const convertDateToDateValue = (
	date: Date | undefined | null
): DateValue | undefined => {
	if (!date || !(date instanceof Date) || Number.isNaN(date.getTime())) {
		return undefined;
	}

	try {
		// Extract year, month, day for CalendarDate (date-only, no time)
		const year = date.getFullYear();
		const month = date.getMonth() + 1; // getMonth() returns 0-11, CalendarDate expects 1-12
		const day = date.getDate();

		// Create CalendarDate using @internationalized/date and cast to DateValue
		return new CalendarDate(year, month, day) as unknown as DateValue;
	} catch (error) {
		console.error("Error converting Date to DateValue:", error);
		return undefined;
	}
};

/**
 * Converts a date range (from/to Date objects) to RangeValue<DateValue>
 *
 * @param fromDate - Start date
 * @param toDate - End date
 * @returns RangeValue<DateValue> or single DateValue if dates are the same, or undefined
 *
 * @example
 * ```typescript
 * const range = convertDateRangeToDateValueRange(lastMonth.from, lastMonth.to);
 * ```
 */
export const convertDateRangeToDateValueRange = (
	fromDate?: Date,
	toDate?: Date
): DateValue | RangeValue<DateValue> | undefined => {
	if (!fromDate && !toDate) return undefined;

	const fromDateValue = fromDate ? convertDateToDateValue(fromDate) : undefined;
	const toDateValue = toDate ? convertDateToDateValue(toDate) : undefined;

	// If only one date, return single DateValue
	if (!fromDateValue && toDateValue) return toDateValue;
	if (fromDateValue && !toDateValue) return fromDateValue;

	// If both dates exist, check if they're the same
	if (fromDateValue && toDateValue && fromDate && toDate) {
		// Check if dates are the same (compare date components only)
		if (
			fromDate.getFullYear() === toDate.getFullYear() &&
			fromDate.getMonth() === toDate.getMonth() &&
			fromDate.getDate() === toDate.getDate()
		) {
			return fromDateValue;
		}

		// Return range for different dates
		return {
			start: fromDateValue,
			end: toDateValue,
		};
	}

	return undefined;
};

/**
 * Legacy aliases for backward compatibility
 * @deprecated Use convertStringToDateValue instead
 */
export const convertToDateValue = convertStringToDateValue;

/**
 * Legacy aliases for backward compatibility
 * @deprecated Use convertDateValueToString instead
 */
export const convertFromDateValue = convertDateValueToString;
