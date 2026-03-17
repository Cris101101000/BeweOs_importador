import Papa from "papaparse";
import { useCallback } from "react";
import { useImportStore } from "../store/useImportStore";

const INVALID_HEADERS = [
	"Fila",
	"Nombre",
	"Apellido",
	"Email",
	"Teléfono",
	"País",
	"Razón del error",
];

const REPORT_HEADERS = [
	"Nombre",
	"Apellido",
	"Email",
	"Teléfono",
	"País",
	"Estado",
	"Detalle",
];

/**
 * Genera y descarga un archivo CSV
 */
const generateCSVDownload = (content: string, filename: string) => {
	const blob = new Blob([`\uFEFF${content}`], {
		type: "text/csv;charset=utf-8;",
	});
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = url;
	link.download = filename;
	link.click();
	URL.revokeObjectURL(url);
};

/**
 * useImportDownloads
 *
 * Proporciona funciones para descargar reportes CSV:
 * - downloadInvalidRecords: registros inválidos con columna "Razón del error"
 * - downloadFullReport: reporte completo con estado de cada registro
 */
export const useImportDownloads = () => {
	const downloadInvalidRecords = useCallback(() => {
		const { invalidRecords } = useImportStore.getState();

		const rows = invalidRecords.map((record) => [
			record.rowIndex,
			record.record.firstName || "",
			record.record.lastName || "",
			record.record.email || "",
			record.record.phone || "",
			record.record.country || "",
			record.reasons.join("; "),
		]);

		const csv = Papa.unparse({ fields: INVALID_HEADERS, data: rows });
		generateCSVDownload(csv, "registros-invalidos.csv");
	}, []);

	const downloadFullReport = useCallback(() => {
		const { validRecords, duplicateRecords, invalidRecords } =
			useImportStore.getState();

		const rows: string[][] = [];

		for (const record of validRecords) {
			rows.push([
				record.firstName,
				record.lastName,
				record.email,
				record.phone,
				record.country,
				"Creado",
				"",
			]);
		}

		for (const dup of duplicateRecords) {
			rows.push([
				dup.record.firstName,
				dup.record.lastName,
				dup.record.email,
				dup.record.phone,
				dup.record.country,
				`Duplicado (${dup.action})`,
				dup.changesDetail,
			]);
		}

		for (const record of invalidRecords) {
			rows.push([
				record.record.firstName || "",
				record.record.lastName || "",
				record.record.email || "",
				record.record.phone || "",
				record.record.country || "",
				"Error",
				record.reasons.join("; "),
			]);
		}

		const csv = Papa.unparse({ fields: REPORT_HEADERS, data: rows });
		generateCSVDownload(csv, "reporte-importacion.csv");
	}, []);

	return { downloadInvalidRecords, downloadFullReport };
};
