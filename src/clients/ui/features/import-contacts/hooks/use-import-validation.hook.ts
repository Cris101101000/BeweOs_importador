import { useCallback } from "react";
import type {
	IFieldMapping,
	IImportContact,
	IInvalidRecord,
} from "@clients/domain/interfaces/import-contact.interface";
import { REQUIRED_IMPORT_FIELDS } from "@clients/domain/constants/import-fields.constants";
import { ImportContactsAdapter } from "@clients/infrastructure/adapters/import-contacts.adapter";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PHONE_DIGITS = 7;
const MIN_NAME_LENGTH = 2;

/**
 * Convierte un string a Title Case
 */
const toTitleCase = (str: string): string => {
	return str
		.trim()
		.toLowerCase()
		.replace(/\b\w/g, (char) => char.toUpperCase());
};

/**
 * Limpia un número de teléfono (deja solo dígitos y +)
 */
const cleanPhone = (phone: string): string => {
	return phone.replace(/[^\d+]/g, "");
};

/**
 * Lista básica de países válidos (ISO + nombres comunes)
 */
const VALID_COUNTRIES = new Set([
	"argentina", "bolivia", "brasil", "brazil", "chile", "colombia",
	"costa rica", "cuba", "dominicana", "ecuador", "el salvador",
	"españa", "spain", "estados unidos", "usa", "us", "guatemala",
	"honduras", "méxico", "mexico", "nicaragua", "panamá", "panama",
	"paraguay", "perú", "peru", "puerto rico", "república dominicana",
	"uruguay", "venezuela",
	"ar", "bo", "br", "cl", "co", "cr", "cu", "do", "ec", "sv",
	"es", "us", "gt", "hn", "mx", "ni", "pa", "py", "pe", "pr", "uy", "ve",
]);

/**
 * Valida si un país es reconocido
 */
const isValidCountry = (country: string): boolean => {
	return VALID_COUNTRIES.has(country.toLowerCase().trim());
};

/**
 * Valida un registro individual y retorna las razones de invalidez
 */
const validateRecord = (record: Partial<IImportContact>): string[] => {
	const reasons: string[] = [];

	if (!record.firstName || record.firstName.trim().length < MIN_NAME_LENGTH) {
		reasons.push("Nombre inválido o vacío (mínimo 2 caracteres)");
	}

	if (!record.lastName || record.lastName.trim().length < MIN_NAME_LENGTH) {
		reasons.push("Apellido inválido o vacío (mínimo 2 caracteres)");
	}

	if (!record.email || !EMAIL_REGEX.test(record.email.trim())) {
		reasons.push("Email inválido o vacío");
	}

	if (record.phone) {
		const digits = record.phone.replace(/\D/g, "");
		if (digits.length < MIN_PHONE_DIGITS) {
			reasons.push("Teléfono inválido (mínimo 7 dígitos)");
		}
	} else {
		reasons.push("Teléfono vacío");
	}

	if (!record.country || !isValidCountry(record.country)) {
		reasons.push("País no reconocido o vacío");
	}

	return reasons;
};

/**
 * useImportValidation
 *
 * Valida registros después del mapeo de campos:
 * - Aplica fieldMappings a rawData
 * - Valida cada registro (email, teléfono, nombre, apellido, país)
 * - Normaliza datos (Title Case, limpieza de teléfono)
 * - Separa en válidos/inválidos
 * - Detecta duplicados via adapter
 */
export const useImportValidation = () => {
	const validateAndSeparate = useCallback(
		async (
			rawData: string[][],
			fieldMappings: IFieldMapping[],
		): Promise<{
			valid: IImportContact[];
			invalid: IInvalidRecord[];
			duplicates: Awaited<
				ReturnType<ImportContactsAdapter["detectDuplicates"]>
			>;
		}> => {
			const validRecords: IImportContact[] = [];
			const invalidRecords: IInvalidRecord[] = [];

			// Aplicar mappings a cada fila
			for (let i = 0; i < rawData.length; i++) {
				const row = rawData[i];
				const record: Partial<IImportContact> = {};

				for (const mapping of fieldMappings) {
					if (!mapping.beweField) continue;
					const value = row[mapping.sourceIndex] || "";

					if (mapping.beweField === "tags") {
						record.tags = value
							.split(",")
							.map((t) => t.trim())
							.filter(Boolean);
					} else {
						(record as Record<string, unknown>)[mapping.beweField] =
							value;
					}
				}

				// Normalizar
				if (record.firstName) {
					record.firstName = toTitleCase(record.firstName);
				}
				if (record.lastName) {
					record.lastName = toTitleCase(record.lastName);
				}
				if (record.email) {
					record.email = record.email.trim().toLowerCase();
				}
				if (record.phone) {
					record.phone = cleanPhone(record.phone);
				}
				if (record.country) {
					record.country = toTitleCase(record.country);
				}

				// Validar
				const reasons = validateRecord(record);

				if (reasons.length === 0) {
					// Verificar que todos los campos obligatorios están presentes
					const hasAllRequired = REQUIRED_IMPORT_FIELDS.every(
						(f) => {
							const val = (
								record as Record<string, unknown>
							)[f.key];
							return (
								val !== undefined &&
								val !== null &&
								String(val).trim() !== ""
							);
						},
					);

					if (hasAllRequired) {
						validRecords.push(record as IImportContact);
					} else {
						invalidRecords.push({
							rowIndex: i + 1,
							record,
							reasons: ["Faltan campos obligatorios"],
						});
					}
				} else {
					invalidRecords.push({
						rowIndex: i + 1,
						record,
						reasons,
					});
				}
			}

			// Detectar duplicados
			const adapter = new ImportContactsAdapter();
			const duplicates = await adapter.detectDuplicates(validRecords);

			// Quitar duplicados de la lista de válidos
			const duplicateEmails = new Set(
				duplicates.map((d) => d.record.email.toLowerCase()),
			);
			const uniqueValid = validRecords.filter(
				(r) => !duplicateEmails.has(r.email.toLowerCase()),
			);

			return {
				valid: uniqueValid,
				invalid: invalidRecords,
				duplicates,
			};
		},
		[],
	);

	return { validateAndSeparate };
};
