/**
 * Utility functions for string normalization and key generation
 */

/**
 * Converts an arbitrary label to a snake_case key without accents.
 * Examples:
 *  - "Nombre de Columna" -> "nombre_de_columna"
 *  - "Última comunicación" -> "ultima_comunicacion"
 */
export function toKeyFromLabel(label: string): string {
	return label
		.toLowerCase()
		.trim()
		.replace(/[àáäâãå]/g, "a")
		.replace(/[èéëê]/g, "e")
		.replace(/[ìíïî]/g, "i")
		.replace(/[òóöôõ]/g, "o")
		.replace(/[ùúüû]/g, "u")
		.replace(/ñ/g, "n")
		.replace(/ç/g, "c")
		.replace(/[^a-z0-9]+/g, "_")
		.replace(/^_|_$/g, "");
}
