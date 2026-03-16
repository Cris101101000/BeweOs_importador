/**
 * Utility functions for formatting duration between API format and display format
 */

/**
 * Formats duration from API response (measureValue + measureUnit) to display format
 * @param measureValue - Duration value from API (e.g., 45)
 * @param measureUnit - Duration unit from API (e.g., "minuto", "hora")
 * @returns Formatted duration string (e.g., "45 minutos", "2 horas")
 * Respects the original unit without conversions
 */
export const formatDurationFromApi = (
	measureValue: number | undefined,
	measureUnit: string | undefined
): string => {
	if (!measureValue || !measureUnit) {
		return "";
	}

	const unit = measureUnit.toLowerCase();

	// Format based on the original unit
	if (unit.includes("hora") || unit.includes("hour")) {
		return measureValue === 1 ? "1 hora" : `${measureValue} horas`;
	} else if (
		unit.includes("minuto") ||
		unit.includes("min") ||
		unit.includes("minute")
	) {
		return measureValue === 1 ? "1 minuto" : `${measureValue} minutos`;
	}

	// Default to minutes if unit is not recognized
	return measureValue === 1 ? "1 minuto" : `${measureValue} minutos`;
};

/**
 * Parses duration from display format to API format
 * @param durationText - Duration text from input (e.g., "45 minutos", "2 horas")
 * @returns Object with measureValue and measureUnit for API
 * Respects the exact unit the user entered without conversions
 */
export const parseDurationToApi = (
	durationText: string
): {
	measureValue: number;
	measureUnit: string;
} => {
	if (!durationText?.trim()) {
		return { measureValue: 0, measureUnit: "minuto" };
	}

	const text = durationText.trim().toLowerCase();

	// Extract number from text like "45 minutos", "2 horas", "30 min", etc.
	const numberMatch = text.match(/(\d+(?:\.\d+)?)/);
	if (!numberMatch) {
		return { measureValue: 0, measureUnit: "minuto" };
	}

	const number = Number.parseFloat(numberMatch[1]);

	// Determine unit based on what user entered
	if (text.includes("hora") || text.includes("hour")) {
		return {
			measureValue: Math.round(number),
			measureUnit: "hora",
		};
	} else if (
		text.includes("minuto") ||
		text.includes("min") ||
		text.includes("minute")
	) {
		return {
			measureValue: Math.round(number),
			measureUnit: "minuto",
		};
	}

	// Default to minutes if no unit specified
	return {
		measureValue: Math.round(number),
		measureUnit: "minuto",
	};
};
