import { useCallback } from "react";
import type { IFieldMapping } from "@clients/domain/interfaces/import-contact.interface";
import {
	ALL_IMPORT_FIELDS,
	REQUIRED_IMPORT_FIELDS,
} from "@clients/domain/constants/import-fields.constants";

/**
 * Palabras clave que indican que una columna NO es teléfono
 */
const PHONE_BLACKLIST_KEYWORDS = [
	"dni", "cedula", "cédula", "documento", "identificacion",
	"identificación", "nit", "rut", "curp", "pasaporte", "passport",
	"id", "codigo", "código", "numero de documento", "fijo",
];

/**
 * Palabras clave que indican que una columna NO es email
 */
const EMAIL_BLACKLIST_KEYWORDS = [
	"envío", "envio", "envíos", "envios", "suscrito", "suscrita",
	"newsletter", "marketing", "notificacion", "notificación",
	"acepta", "permite", "opt", "consent",
];

/**
 * Normaliza texto eliminando asteriscos, paréntesis, corchetes y puntuación.
 */
function normalizeText(text: string): string {
	return text
		.replace(/\(.*?\)/g, "")
		.replace(/\[.*?\]/g, "")
		.replace(/[*:;.,]/g, "")
		.toLowerCase()
		.trim();
}

/**
 * Normaliza para comparación parcial: elimina espacios, guiones, underscores.
 */
function normalizeForPartial(text: string): string {
	return normalizeText(text).replace(/[\s_\-–—]/g, "");
}

function containsBlacklistWord(text: string, blacklist: string[]): boolean {
	const normalized = text.toLowerCase().trim();
	return blacklist.some((kw) => normalized.includes(kw));
}

/**
 * Match exacto: compara texto normalizado contra key, label y sinónimos.
 */
function matchExact(
	text: string,
	assignedFields: Set<string>,
): string | null {
	const normalized = normalizeText(text);
	if (!normalized || normalized.length < 2) return null;

	for (const field of ALL_IMPORT_FIELDS) {
		if (assignedFields.has(field.key)) continue;

		if (normalized === field.key.toLowerCase()) return field.key;
		if (normalized === field.label.toLowerCase()) return field.key;

		const matched = field.synonyms.some(
			(s) => s.toLowerCase() === normalized,
		);
		if (matched) return field.key;
	}

	return null;
}

/**
 * Match parcial: el texto contiene algún sinónimo como substring.
 * Prioriza el match más largo y aplica blacklist contextual.
 */
function matchPartial(
	text: string,
	assignedFields: Set<string>,
): string | null {
	const normalized = normalizeForPartial(text);
	if (!normalized || normalized.length < 3) return null;

	let bestMatch: { key: string; length: number } | null = null;

	for (const field of ALL_IMPORT_FIELDS) {
		if (assignedFields.has(field.key)) continue;

		if (field.key === "email" && containsBlacklistWord(text, EMAIL_BLACKLIST_KEYWORDS)) continue;
		if (field.key === "phone" && containsBlacklistWord(text, PHONE_BLACKLIST_KEYWORDS)) continue;

		const allTerms = [
			field.key.toLowerCase(),
			field.label.toLowerCase(),
			...field.synonyms.map((s) => s.toLowerCase()),
		];

		for (const term of allTerms) {
			const normalizedTerm = term.replace(/[\s_\-–—]/g, "");
			if (normalizedTerm.length >= 3 && normalized.includes(normalizedTerm)) {
				if (!bestMatch || normalizedTerm.length > bestMatch.length) {
					bestMatch = { key: field.key, length: normalizedTerm.length };
				}
				break;
			}
		}
	}

	return bestMatch?.key ?? null;
}

/**
 * PASO CLAVE: Escanea las primeras filas de datos buscando etiquetas de campos.
 * Muchos archivos Excel tienen filas de instrucciones antes de los datos reales,
 * donde aparecen los nombres de campos ("Nombre*", "Primer apellido", "Email", etc.)
 *
 * Retorna un mapa: índice de columna → campo Bewe detectado
 */
function detectLabelsInData(
	rawData: string[][],
	assignedFields: Set<string>,
): Map<number, string> {
	const result = new Map<number, string>();
	const localAssigned = new Set(assignedFields);

	// Escanear las primeras 3 filas de datos
	const rowsToScan = Math.min(3, rawData.length);

	// Primero buscar matches exactos en todas las filas
	for (let rowIdx = 0; rowIdx < rowsToScan; rowIdx++) {
		const row = rawData[rowIdx];
		if (!row) continue;

		for (let colIdx = 0; colIdx < row.length; colIdx++) {
			if (result.has(colIdx)) continue;
			const cellValue = row[colIdx];
			if (!cellValue || cellValue.trim().length === 0) continue;

			const matched = matchExact(cellValue, localAssigned);
			if (matched) {
				result.set(colIdx, matched);
				localAssigned.add(matched);
			}
		}
	}

	// Luego buscar matches parciales para los que no se encontraron
	for (let rowIdx = 0; rowIdx < rowsToScan; rowIdx++) {
		const row = rawData[rowIdx];
		if (!row) continue;

		for (let colIdx = 0; colIdx < row.length; colIdx++) {
			if (result.has(colIdx)) continue;
			const cellValue = row[colIdx];
			if (!cellValue || cellValue.trim().length === 0) continue;
			// Solo considerar valores que parecen etiquetas (no datos reales)
			// Las etiquetas suelen ser texto corto sin muchos números
			const digits = cellValue.replace(/\D/g, "").length;
			const isLikelyLabel = cellValue.length < 60 && digits / cellValue.length < 0.3;
			if (!isLikelyLabel) continue;

			const matched = matchPartial(cellValue, localAssigned);
			if (matched) {
				result.set(colIdx, matched);
				localAssigned.add(matched);
			}
		}
	}

	return result;
}

/**
 * Detecta email por presencia de @ y teléfono por patrón de dígitos.
 * Ignora las primeras filas que parecen etiquetas/instrucciones.
 */
function matchByContent(
	header: string,
	columnData: string[],
	assignedFields: Set<string>,
): string | null {
	// Filtrar valores que parecen datos reales (no etiquetas)
	const sampleValues = columnData
		.filter((v) => {
			if (!v || v.trim().length === 0) return false;
			// Descartar valores que parecen etiquetas/instrucciones
			const normalized = normalizeText(v);
			const isLabel = matchExact(v, new Set()) !== null || matchPartial(v, new Set()) !== null;
			if (isLabel) return false;
			return true;
		})
		.slice(0, 10);

	if (sampleValues.length === 0) return null;

	// Email: presencia de @
	if (!assignedFields.has("email")) {
		if (!containsBlacklistWord(header, EMAIL_BLACKLIST_KEYWORDS)) {
			const emailCount = sampleValues.filter((v) => v.includes("@")).length;
			if (emailCount / sampleValues.length >= 0.4) {
				return "email";
			}
		}
	}

	// Teléfono: dígitos >= 7
	if (!assignedFields.has("phone")) {
		if (!containsBlacklistWord(header, PHONE_BLACKLIST_KEYWORDS)) {
			const phoneCount = sampleValues.filter((v) => {
				const digits = v.replace(/\D/g, "");
				return digits.length >= 7 && digits.length <= 15;
			}).length;
			if (phoneCount / sampleValues.length >= 0.4) {
				return "phone";
			}
		}
	}

	return null;
}

/**
 * Resuelve conflictos: si múltiples columnas matchearon al mismo campo,
 * mantiene la primera por posición y libera las demás.
 */
function resolveConflicts(mappings: IFieldMapping[]): void {
	const fieldToFirstIndex = new Map<string, number>();

	for (const mapping of mappings) {
		if (!mapping.beweField) continue;

		const existing = fieldToFirstIndex.get(mapping.beweField);
		if (existing !== undefined) {
			mapping.beweField = null;
			mapping.autoMatched = false;
		} else {
			fieldToFirstIndex.set(mapping.beweField, mapping.sourceIndex);
		}
	}
}

/**
 * Recalcula el set de campos asignados a partir de los mappings actuales.
 */
function getAssignedFields(mappings: IFieldMapping[]): Set<string> {
	const assigned = new Set<string>();
	for (const m of mappings) {
		if (m.beweField) assigned.add(m.beweField);
	}
	return assigned;
}

/**
 * useFieldMapping
 *
 * Hook para auto-mapear headers del archivo a campos de Bewe.
 *
 * Estrategia (prioridad descendente):
 * 1. Match exacto/sinónimos en headers normalizados
 * 2. Match parcial en headers (con blacklist contextual)
 * 3. Resolución de conflictos (prioridad por posición)
 * 4. Detección de etiquetas en primeras filas de datos ← CLAVE para archivos con instrucciones
 * 5. Match por contenido (email @, teléfono dígitos)
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

			// ── Paso 1: Match exacto por headers ──
			for (const mapping of mappings) {
				const matched = matchExact(mapping.sourceColumn, assignedFields);
				if (matched) {
					mapping.beweField = matched;
					mapping.autoMatched = true;
					assignedFields.add(matched);
				}
			}

			// ── Paso 2: Match parcial en headers ──
			for (const mapping of mappings) {
				if (mapping.beweField) continue;
				const matched = matchPartial(mapping.sourceColumn, assignedFields);
				if (matched) {
					mapping.beweField = matched;
					mapping.autoMatched = true;
					assignedFields.add(matched);
				}
			}

			// ── Paso 2.5: Resolver conflictos por posición ──
			resolveConflicts(mappings);
			const assignedAfterHeaders = getAssignedFields(mappings);

			// ── Paso 3: Detectar etiquetas en las primeras filas de datos ──
			// Esto resuelve archivos donde los headers son genéricos ("Col 2")
			// pero los datos contienen filas con los nombres reales de campos
			const labelsFromData = detectLabelsInData(rawData, assignedAfterHeaders);

			for (const mapping of mappings) {
				if (mapping.beweField) continue;

				const detectedField = labelsFromData.get(mapping.sourceIndex);
				if (detectedField && !assignedAfterHeaders.has(detectedField)) {
					mapping.beweField = detectedField;
					mapping.autoMatched = true;
					assignedAfterHeaders.add(detectedField);
				}
			}

			// ── Paso 4: Match por contenido de celdas (email, teléfono) ──
			const assignedFinal = getAssignedFields(mappings);

			for (const mapping of mappings) {
				if (mapping.beweField) continue;

				const columnData = rawData.map(
					(row) => row[mapping.sourceIndex] || "",
				);
				const matched = matchByContent(
					mapping.sourceColumn,
					columnData,
					assignedFinal,
				);
				if (matched) {
					mapping.beweField = matched;
					mapping.autoMatched = true;
					assignedFinal.add(matched);
				}
			}

			return mappings;
		},
		[],
	);

	return { autoMatch };
};
