import { EnumDurationType } from "../../domain/enums/duration-type.enum";

/**
 * Parsed duration result for UI consumption
 */
export interface IParsedDuration {
	value: number;
	type: EnumDurationType;
}

/**
 * Parses a duration string from user input to extract numeric value and type
 * This is UI/presentation logic - interprets user input format
 *
 * @example
 * parseDurationString("30 minutos") // { value: 30, type: MINUTES }
 * parseDurationString("2 horas")    // { value: 2, type: HOURS }
 */
export const parseDurationString = (
	duration: string | undefined
): IParsedDuration => {
	if (!duration) {
		return { value: 0, type: EnumDurationType.MINUTES };
	}

	const cleanText = duration.trim().toLowerCase();
	const match = cleanText.match(/^(\d+)\s*(.*)$/);

	if (!match) {
		return { value: 0, type: EnumDurationType.MINUTES };
	}

	const [, valueStr, unitStr] = match;
	const value = Number.parseInt(valueStr, 10);

	// Determine type based on unit string (UI interpretation)
	const isHours =
		unitStr.includes("hora") ||
		unitStr.includes("hour") ||
		unitStr.includes("h");
	const type = isHours ? EnumDurationType.HOURS : EnumDurationType.MINUTES;

	return { value: Number.isNaN(value) ? 0 : value, type };
};

/**
 * Formats duration for display in UI
 * This is presentation logic - generates human-readable strings
 *
 * @example
 * formatDuration(1, EnumDurationType.HOURS)   // "1 hora"
 * formatDuration(2, EnumDurationType.HOURS)   // "2 horas"
 */
export const formatDuration = (
	value: number,
	type: EnumDurationType
): string => {
	if (value === 0) return "";

	if (type === EnumDurationType.HOURS) {
		return value === 1 ? `${value} hora` : `${value} horas`;
	}
	return value === 1 ? `${value} minuto` : `${value} minutos`;
};

