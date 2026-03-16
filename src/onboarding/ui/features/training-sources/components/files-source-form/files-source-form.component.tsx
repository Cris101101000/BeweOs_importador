import { Button, UploadFile, useAuraToast } from "@beweco/aurora-ui";

const MAX_FILES = 5;

interface FilesSourceFormProps {
	uploadedFiles: File[];
	onUploadFiles: (files: File[]) => void;
	onRemoveFile: (index: number) => void;
}

export const FilesSourceForm = ({
	uploadedFiles,
	onUploadFiles,
	onRemoveFile,
}: FilesSourceFormProps) => {
	const isAtLimit = uploadedFiles.length >= MAX_FILES;
	const { showToast } = useAuraToast();

	const handleError = (error: string) => {
		showToast({
			color: "warning",
			title: error,
		});
	};

	return (
		<div className="space-y-2">
			{uploadedFiles.length > 0 ? (
				<div className="space-y-1">
					<p className="text-xs text-gray-500 dark:text-gray-400 text-right">
						{uploadedFiles.length}/{MAX_FILES} archivos
					</p>
					<div className="max-h-48 overflow-y-auto space-y-1 pr-1">
					{uploadedFiles.map((file, index) => (
						<div
							key={`${file.name}-${index.toString()}`}
							className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700"
						>
							<div className="flex items-center gap-2 flex-1 min-w-0">
								<p className="text-sm font-medium text-gray-900 dark:text-white truncate">
									{file.name}
								</p>
								<p className="text-xs text-gray-500 dark:text-gray-400">
									{(file.size / 1024).toFixed(2)} KB
								</p>
							</div>
							<Button
								size="sm"
								color="danger"
								variant="light"
								onPress={() => onRemoveFile(index)}
							>
								Eliminar
							</Button>
						</div>
					))}
					</div>
				</div>
			) : null}
			{isAtLimit ? (
				<p className="text-sm text-center text-gray-500 dark:text-gray-400 py-3 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
					Has alcanzado el límite de {MAX_FILES} archivos
				</p>
			) : (
				<UploadFile
					acceptedFiles=".pdf"
					maxFiles={MAX_FILES - uploadedFiles.length}
					multiple={true}
					size="large"
					text={
						uploadedFiles.length > 0
							? "+ Agregar más archivos"
							: "Haz clic o arrastra y suelta tus archivos aqui"
					}
					subText={`PDF (máx. ${MAX_FILES} archivos)`}
					icon="solar:cloud-upload-bold"
					onUpload={onUploadFiles}
					onError={handleError}
				/>
			)}
		</div>
	);
};
