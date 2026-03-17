import { useCallback } from "react";
import type { IFieldMapping } from "@clients/domain/interfaces/import-contact.interface";
import {
	ALL_IMPORT_FIELDS,
	type IImportField,
} from "@clients/domain/constants/import-fields.constants";

/**
 * Intenta detectar el campo Bewe por patrones en el contenido de las celdas.
 * Es una función pura fuera del hook para evitar problemas con `this`.
 */
function matchByContent(
	columnData: string[],
	assignedFields: Set<string>,
): string | null {
	const sampleValues = columnData
		.filter((v) => v && v.trim().length > 0)
		.slice(0, 10);

	if (sampleValues.length === 0) return null;

	// Detectar email por presencia de @
	if (!assignedFields.has("email")) {
		const emailCount = sampleValues.filter((v) => v.includes("@")).length;
		if (emailCount / sampleValues.length >= 0.5) {
			return "email";
		}
	}

	// Detectar teléfono por patrón de dígitos
	if (!assignedFields.has("phone")) {
		const phoneCount = sampleValues.filter((v) => {
			const digits = v.replace(/\D/g, "");
			return digits.length >= 7;
		}).length;
		if (phoneCount / sampleValues.length >= 0.5) {
			return "phone";
		}
	}

	return null;
}

/**
 * Intenta hacer match exacto o por sinónimos de un header contra los campos disponibles.
 */
function matchBySynonym(
	header: string,
	assignedFields: Set<string>,
): string | null {
	const normalizedHeader = header.toLowerCase().trim();

	for (const field of ALL_IMPORT_FIELDS) {
		if (assignedFields.has(field.key)) continue;

		// Match exacto con la key
		if (normalizedHeader === field.key.toLowerCase()) {
			return field.key;
		}

		// Match exacto con el label
		if (normalizedHeader === field.label.toLowerCase()) {
			return field.key;
		}

		// Match por sinónimos
		const matched = field.synonyms.some(
			(synonym) => synonym.toLowerCase() === normalizedHeader,
		);
		if (matched) {
			return field.key;
		}
	}

	return null;
}

/**
 * useFieldMapping
 *
 * Hook para auto-mapear headers del archivo a campos de Bewe.
 * Estrategia: 1) match exacto, 2) sinónimos (es/en/pt), 3) contenido.
 */
export const useFieldMapping = () => {
	const autoMatch = useCallback(
		(headers: string[], rawData: string[][]): IFieldMapping[] => {
			const assignedFields = new Set<string>();
			const mappings: IFieldMapping[] = headers.map((header, index) => ({
				sourceColumn: header,
				sourceIndex: index,
				beweField: null,
				autoMatched: false,
			}));

			// Paso 1 y 2: Match por nombre exacto y sinónimos
			for (const mapping of mappings) {
				const matched = matchBySynonym(
					mapping.sourceColumn,
					assignedFields,
				);
				if (matched) {
					mapping.beweField = matched;
					mapping.autoMatched = true;
					assignedFields.add(matched);
				}
			}

			// Paso 3: Match por contenido para los que quedaron sin asignar
			for (const mapping of mappings) {
				if (mapping.beweField) continue;

				const columnData = rawData.map(
					(row) => row[mapping.sourceIndex] || "",
				);
				const matched = matchByContent(columnData, assignedFields);
				if (matched) {
					mapping.beweField = matched;
					mapping.autoMatched = true;
					assignedFields.add(matched);
				}
			}

			return mappings;
		},
		[],
	);

	return { autoMatch };
};
