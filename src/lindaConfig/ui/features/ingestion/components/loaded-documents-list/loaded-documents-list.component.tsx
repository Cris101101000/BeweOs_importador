import { Button, Chip, IconComponent } from "@beweco/aurora-ui";
import type React from "react";
import type { IFile } from "src/shared/features/linda/ingestion/domain/interfaces/files";

interface LoadedDocumentsListProps {
	documents: IFile[];
	onRemoveDocument: (id: string) => void;
}

/**
 * Format date to localized string
 */
const formatDate = (date: Date | string): string => {
	const dateObj = typeof date === "string" ? new Date(date) : date;
	return dateObj.toLocaleString("es-ES", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});
};

/**
 * Check if document is saved in database
 */
const isDocumentSaved = (doc: IFile): boolean => !!doc.accessUrl;

export const LoadedDocumentsList: React.FC<LoadedDocumentsListProps> = ({
	documents,
	onRemoveDocument,
}) => {
	if (documents.length === 0) {
		return null;
	}

	return (
		<div className="mt-4 space-y-2">
			<p className="text-sm text-gray-600 font-medium">Documentos cargados:</p>
			<div className="space-y-2">
				{documents.map((doc) => {
					const isSaved = isDocumentSaved(doc);

					return (
						<div
							key={doc.id}
							className={`flex items-center gap-3 p-3 border rounded-lg transition-colors ${
								isSaved
									? "bg-gray-50 border-gray-200 hover:bg-gray-100"
									: "bg-warning-50 border-warning-200 hover:bg-warning-100"
							}`}
						>
							<div
								className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
									doc.type === "pdf" ? "bg-red-500" : "bg-green-500"
								}`}
							>
								<IconComponent
									icon={
										doc.type === "pdf"
											? "solar:document-bold"
											: "solar:document-text-bold"
									}
									size="sm"
									className="text-white"
								/>
							</div>
							<div className="flex-1 min-w-0">
								<div className="flex items-center gap-2">
									<p className="text-sm font-medium text-gray-900 truncate">
										{doc.name}
									</p>
									<Chip
										size="sm"
										variant="flat"
										color={isSaved ? "success" : "warning"}
										startContent={
											<IconComponent
												icon={
													isSaved
														? "solar:cloud-check-bold"
														: "solar:cloud-upload-bold"
												}
												size="sm"
											/>
										}
									>
										{isSaved ? "Guardado" : "Pendiente"}
									</Chip>
								</div>
								<p className="text-xs text-gray-500">
									{doc.type.toUpperCase()} • {doc.formattedSize} • Cargado:{" "}
									{formatDate(doc.createdAt)}
								</p>
							</div>
							<Button
								variant="light"
								size="sm"
								color="danger"
								isIconOnly
								onPress={() => onRemoveDocument(doc.id)}
								startContent={
									<IconComponent
										icon="solar:trash-bin-minimalistic-outline"
										size="sm"
									/>
								}
							/>
						</div>
					);
				})}
			</div>
		</div>
	);
};
