import { useCallback } from "react";
import { Button, IconComponent } from "@beweco/aurora-ui";
import { useTranslate } from "@tolgee/react";

const CSV_HEADERS = "Nombre,Apellido,Email,Teléfono,País,Etiquetas";

const CSV_EXAMPLE_ROWS = [
	"Juan,Pérez,juan@ejemplo.com,+573001234567,Colombia,VIP",
	'María,López,maria@ejemplo.com,+5491155667788,Argentina,"Premium, Frecuente"',
	"Carlos,Silva,carlos@exemplo.com,+5511987654321,Brasil,Nuevo",
].join("\n");

/**
 * Genera y descarga un archivo CSV con BOM para UTF-8
 */
const downloadCsv = (content: string, filename: string) => {
	const BOM = "\uFEFF";
	const blob = new Blob([BOM + content], { type: "text/csv;charset=utf-8;" });
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
		<div className="flex flex-col gap-2">
			<p className="text-sm text-default-500 dark:text-default-400">
				{t("import_upload_template_label")}
			</p>
			<div className="flex items-center gap-3">
				<Button
					variant="flat"
					size="sm"
					className="rounded-full"
					startContent={
						<IconComponent
							icon="solar:document-text-outline"
							size="sm"
						/>
					}
					onPress={handleDownloadEmpty}
				>
					{t("import_upload_template_empty")}
				</Button>
				<Button
					variant="flat"
					size="sm"
					className="rounded-full"
					startContent={
						<IconComponent
							icon="solar:document-add-outline"
							size="sm"
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
