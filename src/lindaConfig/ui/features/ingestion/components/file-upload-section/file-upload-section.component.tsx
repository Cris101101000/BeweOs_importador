import { Chip, H4, UploadFile, useAuraToast } from "@beweco/aurora-ui";
import { EnumErrorType } from "@shared/domain/enums";
import { configureErrorToastWithTranslation } from "@shared/utils";
import { useTranslate } from "@tolgee/react";
import type React from "react";
import { useCallback } from "react";
import type { IFile } from "src/shared/features/linda/ingestion/domain/interfaces/files";
import type { DocumentType } from "../../store";
import { INGESTION_CONSTANTS } from "../../store";
import { LoadedDocumentsList } from "../loaded-documents-list";

/**
 * Format file size to human readable format
 */
const formatFileSize = (bytes: number): string => {
	if (bytes === 0) return "0 Bytes";
	const k = 1024;
	const sizes = ["Bytes", "KB", "MB", "GB"];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return `${(Math.round((bytes / k ** i) * 100) / 100).toFixed(2)} ${sizes[i]}`;
};

interface FileUploadSectionProps {
	documents: IFile[];
	onUpload: (docs: IFile[]) => void;
	onRemoveDocument: (id: string) => void;
}

export const FileUploadSection: React.FC<FileUploadSectionProps> = ({
	documents = [],
	onUpload,
	onRemoveDocument,
}) => {
	const { showToast } = useAuraToast();
	const { t } = useTranslate();

	// Filtrar solo documentos con contexto linda_clients que NO sean scrapeados (URLs)
	const lindaClientsDocs = documents.filter(
		(doc) => doc.contexts?.includes("linda_clients") && !doc.isScraped
	);

	const isLimitReached =
		lindaClientsDocs.length >= INGESTION_CONSTANTS.MAX_DOCUMENTS;
	const remainingSlots = Math.max(
		1,
		INGESTION_CONSTANTS.MAX_DOCUMENTS - lindaClientsDocs.length
	);

	const handleFileUpload = useCallback(
		async (files: File[]) => {
			const validFiles: File[] = [];
			const errors: string[] = [];

			for (const file of files) {
				// Check if we've reached max documents (using lindaClientsDocs count)
				if (
					lindaClientsDocs.length + validFiles.length >=
					INGESTION_CONSTANTS.MAX_DOCUMENTS
				) {
					errors.push(
						`Máximo ${INGESTION_CONSTANTS.MAX_DOCUMENTS} documentos permitidos`
					);
					break;
				}

				// Check file size
				if (file.size > INGESTION_CONSTANTS.MAX_FILE_SIZE) {
					errors.push(`${file.name}: Tamaño máximo 5MB`);
					continue;
				}

				// Check file type
				const fileExtension = file.name.split(".").pop()?.toLowerCase();
				if (fileExtension !== "pdf" && fileExtension !== "txt") {
					errors.push(`${file.name}: Solo se permiten archivos PDF y TXT`);
					continue;
				}

				validFiles.push(file);
			}

			// Show errors if any
			if (errors.length > 0) {
				showToast(
					configureErrorToastWithTranslation(
						EnumErrorType.Critical,
						t,
						errors.join("\n")
					)
				);
			}

			// Create document objects and call onUpload
			if (validFiles.length > 0) {
				const newDocs: IFile[] = validFiles.map((file) => ({
					id: `${Date.now().toString()}-${Math.random()}`,
					name: file.name,
					type: (file.name.endsWith(".pdf") ? "pdf" : "txt") as DocumentType,
					size: file.size,
					formattedSize: formatFileSize(file.size),
					file: file,
					createdAt: new Date(),
					contexts: ["linda_clients"],
				}));

				onUpload(newDocs);
			}
		},
		[lindaClientsDocs.length, onUpload]
	);

	return (
		<div>
			<div className="flex items-center gap-3 mb-3">
				<H4>Subir Archivos</H4>
				<Chip size="sm" variant="flat" color="primary">
					{lindaClientsDocs.length}/{INGESTION_CONSTANTS.MAX_DOCUMENTS}{" "}
					documentos
				</Chip>
			</div>

			{/* Always show upload component */}
			<div
				className={
					isLimitReached
						? "opacity-50 pointer-events-none w-[300px]"
						: "w-[300px]"
				}
			>
				<UploadFile
					key={`upload-${documents.length}`}
					acceptedFiles=".txt,.pdf"
					maxFiles={remainingSlots}
					onUpload={handleFileUpload}
					multiple={true}
					disabled={isLimitReached}
					translations={{
						uploadText: isLimitReached
							? `Límite alcanzado (${INGESTION_CONSTANTS.MAX_DOCUMENTS}/${INGESTION_CONSTANTS.MAX_DOCUMENTS})`
							: "Arrastra archivos aquí o haz clic para seleccionar",
						subText: isLimitReached
							? "Elimina documentos existentes para subir nuevos"
							: "Formatos permitidos: TXT y PDF | Tamaño máximo por archivo: 5MB",
					}}
				/>
			</div>

			<LoadedDocumentsList
				documents={lindaClientsDocs}
				onRemoveDocument={onRemoveDocument}
			/>
		</div>
	);
};
