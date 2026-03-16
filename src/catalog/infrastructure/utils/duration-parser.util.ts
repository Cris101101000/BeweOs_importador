import {
	DURATION_WORD_MAPPING,
	EnumServiceMeasureUnit,
} from "@catalog/domain/enums/service-measure-unit.enum";

export interface ParsedDuration {
	value: number;
	unit: EnumServiceMeasureUnit;
}

/**
 * Parses a duration in text format (e.g., "5 minutes", "2 hours", "1 day")
 * and converts it into a numeric value and unit of measure
 */
export function parseDuration(durationText: string): ParsedDuration {
	if (!durationText || typeof durationText !== "string") {
		return {
			value: 1,
			unit: EnumServiceMeasureUnit.Minuto,
		};
	}

	const cleanText = durationText.trim().toLowerCase();
	const match = cleanText.match(/^(\d+(?:\.\d+)?)\s*(.+)$/);

	if (!match) {
		const numberMatch = cleanText.match(/\d+(?:\.\d+)?/);
		if (numberMatch) {
			return {
				value: Number.parseFloat(numberMatch[0]),
				unit: EnumServiceMeasureUnit.Minuto, // Default a minutos
			};
		}

		return {
			value: 1,
			unit: EnumServiceMeasureUnit.Minuto,
		};
	}

	const [, valueStr, unitStr] = match;
	const value = Number.parseFloat(valueStr);

	const normalizedUnitStr = unitStr
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "") // Remove accents
		.toLowerCase();

	const unit =
		DURATION_WORD_MAPPING[normalizedUnitStr] ||
		DURATION_WORD_MAPPING[unitStr] ||
		EnumServiceMeasureUnit.Minuto;

	return {
		value: isNaN(value) ? 1 : value,
		unit,
	};
}
