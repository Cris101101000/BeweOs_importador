import { useCallback } from "react";
import { Button, IconComponent } from "@beweco/aurora-ui";
import { useTranslate } from "@tolgee/react";

const SEP = ";";

const CSV_HEADERS = `Nombre${SEP}Apellido${SEP}Email${SEP}Teléfono${SEP}País${SEP}Etiquetas`;

const CSV_EXAMPLE_ROWS = [
	`Juan${SEP}Pérez${SEP}juan@ejemplo.com${SEP}+573001234567${SEP}Colombia${SEP}VIP`,
	`María${SEP}López${SEP}maria@ejemplo.com${SEP}+5491155667788${SEP}Argentina${SEP}Premium; Frecuente`,
	`Carlos${SEP}Silva${SEP}carlos@exemplo.com${SEP}+5511987654321${SEP}Brasil${SEP}Nuevo`,
].join("\n");

/**
 * Genera y descarga un archivo CSV con BOM UTF-8 y punto y coma como separador.
 * Punto y coma es el estándar para Excel en español/portugués.
 */
const downloadCsv = (content: string, filename: string) => {
	const encoder = new TextEncoder();
	const bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
	const encoded = encoder.encode(content);
	const blob = new Blob([bom, encoded], { type: "text/csv;charset=utf-8;" });
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = url;
	link.download = filename;
	link.click();
	URL.revokeObjectURL(url);
};

/**
 * DownloadTemplate
 *
 * Componente que ofrece dos botones para descargar plantillas CSV:
 * una vacía (solo headers) y otra con filas de ejemplo.
 */
export const DownloadTemplate = () => {
	const { t } = useTranslate();

	const handleDownloadEmpty = useCallback(() => {
		downloadCsv(CSV_HEADERS, "plantilla-importacion-bewe.csv");
	}, []);

	const handleDownloadWithExamples = useCallback(() => {
		const content = `${CSV_HEADERS}\n${CSV_EXAMPLE_ROWS}`;
		downloadCsv(content, "plantilla-importacion-bewe-ejemplos.csv");
	}, []);

	return (
		<div className="flex flex-col items-center gap-2">
			<p className="text-xs text-default-400">
				{t("import_upload_template_label")}
			</p>
			<div className="flex flex-col sm:flex-row items-center gap-3">
				<Button
					variant="light"
					size="sm"
					className="rounded-full text-default-500 dark:text-default-400"
					startContent={
						<IconComponent
							icon="solar:document-text-outline"
							size="sm"
							className="text-default-400"
						/>
					}
					onPress={handleDownloadEmpty}
				>
					{t("import_upload_template_empty")}
				</Button>
				<Button
					variant="light"
					size="sm"
					className="rounded-full text-default-500 dark:text-default-400"
					startContent={
						<IconComponent
							icon="solar:file-download-outline"
							size="sm"
							className="text-default-400"
						/>
					}
					onPress={handleDownloadWithExamples}
				>
					{t("import_upload_template_examples")}
				</Button>
			</div>
		</div>
	);
};
