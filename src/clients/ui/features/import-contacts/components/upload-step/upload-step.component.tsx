import { UploadFileComponent } from "@shared/ui/components/UploadFile/UploadFile";
import { Button, IconComponent, Textarea, useAuraToast } from "@beweco/aurora-ui";
import { ValidateImportFileUseCase } from "@clients/application/validate-import-file.usecase";
import {
	ACCEPTED_FILE_TYPES,
	MAX_FILE_SIZE_BYTES,
	MAX_PASTE_CHARACTERS,
} from "@clients/domain/constants/import-fields.constants";
import { EnumImportStep } from "@clients/domain/enums/import-status.enum";
import { ImportContactsAdapter } from "@clients/infrastructure/adapters/import-contacts.adapter";
import { EnumErrorType } from "@shared/domain/enums/enum-error-type.enum";
import { configureErrorToastWithTranslation } from "@shared/utils";
import { useTranslate } from "@tolgee/react";
import { type FC, useCallback, useState } from "react";
import { useImportStore } from "../../store/useImportStore";
import { DownloadTemplate } from "../_shared/download-template/download-template.component";

/**
 * Formatea bytes a una cadena legible (KB, MB)
 */
const formatFileSize = (bytes: number): string => {
	if (bytes < 1024 * 1024) {
		return `${(bytes / 1024).toFixed(1)} KB`;
	}
	return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

/**
 * Retorna el icono según la extensión del archivo
 */
const getFileIcon = (filename: string): string => {
	const ext = filename.split(".").pop()?.toLowerCase();
	switch (ext) {
		case "csv":
			return "solar:document-text-outline";
		case "xlsx":
		case "xls":
			return "solar:file-text-outline";
		case "pdf":
			return "solar:file-text-outline";
		default:
			return "solar:document-outline";
	}
};

export const UploadStep: FC = () => {
	const { t } = useTranslate();
	const { showToast } = useAuraToast();
	const [isAnalyzing, setIsAnalyzing] = useState(false);

	const {
		file,
		pastedText,
		setFile,
		clearFile,
		setPastedText,
		setRawData,
		setExtractionSource,
		goToStep,
	} = useImportStore();

	const handleFileUpload = useCallback(
		(files: File[]) => {
			const uploadedFile = files[0];
			if (!uploadedFile) return;

			if (uploadedFile.size > MAX_FILE_SIZE_BYTES) {
				showToast(
					configureErrorToastWithTranslation(
						EnumErrorType.Critical,
						t,
						t("import_upload_error_size"),
						"try_again"
					)
				);
				return;
			}

			setFile(uploadedFile);
		},
		[setFile, showToast, t]
	);

	const handleFileError = useCallback(
		(error: string) => {
			showToast(
				configureErrorToastWithTranslation(
					EnumErrorType.Critical,
					t,
					error,
					"try_again"
				)
			);
		},
		[showToast, t]
	);

	const handleRemoveFile = useCallback(() => {
		clearFile();
	}, [clearFile]);

	const handleAnalyze = useCallback(async () => {
		if (!file && !pastedText.trim()) return;

		setIsAnalyzing(true);

		try {
			const adapter = new ImportContactsAdapter();
			const useCase = new ValidateImportFileUseCase(adapter);

			const result = file
				? await useCase.executeWithFile(file)
				: await useCase.executeWithText(pastedText);

			if (result.data.length === 0) {
				showToast(
					configureErrorToastWithTranslation(
						EnumErrorType.Critical,
						t,
						t("import_upload_error_empty"),
						"try_again"
					)
				);
				return;
			}

			setRawData(result.data, result.headers);
			setExtractionSource(result.extractionSource);
			goToStep(EnumImportStep.ANALYSIS);
		} catch {
			showToast(
				configureErrorToastWithTranslation(
					EnumErrorType.Critical,
					t,
					t("import_upload_error_format"),
					"try_again"
				)
			);
		} finally {
			setIsAnalyzing(false);
		}
	}, [
		file,
		pastedText,
		setRawData,
		setExtractionSource,
		goToStep,
		showToast,
		t,
	]);

	const hasInput = !!file || pastedText.trim().length > 0;

	return (
		<div className="flex flex-col gap-4 p-4">
			{/* Dropzone o archivo cargado */}
			{file ? (
				<div className="flex items-center gap-3 rounded-lg border border-default-200 bg-default-50 dark:bg-default-100/50 p-4">
					<div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
						<IconComponent
							icon={getFileIcon(file.name)}
							size="md"
							className="text-primary"
						/>
					</div>
					<div className="flex-1 min-w-0">
						<p className="text-sm font-medium text-default-700 dark:text-default-600 truncate">
							{file.name}
						</p>
						<p className="text-xs text-default-400">
							{formatFileSize(file.size)}
						</p>
					</div>
					<button
						type="button"
						onClick={handleRemoveFile}
						className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-default-200 dark:hover:bg-default-200/50 transition-colors"
						aria-label={t("common_remove")}
					>
						<IconComponent
							icon="solar:close-circle-outline"
							size="sm"
							className="text-default-400"
						/>
					</button>
				</div>
			) : (
				<UploadFileComponent
					size="large"
					acceptedFiles={ACCEPTED_FILE_TYPES}
					maxFileSize={MAX_FILE_SIZE_BYTES}
					onUpload={handleFileUpload}
					onError={handleFileError}
					className="hover:border-primary/50 hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors"
					translations={{
						uploadText: t("import_upload_dropzone_title"),
						subText: t("import_upload_dropzone_subtitle"),
					}}
				/>
			)}

			{/* Separador "o pega texto" */}
			<div className="flex items-center gap-3">
				<div className="flex-1 h-px bg-default-200" />
				<span className="text-xs text-default-400 whitespace-nowrap">
					{t("import_upload_or_separator")}
				</span>
				<div className="flex-1 h-px bg-default-200" />
			</div>

			{/* Textarea para texto plano */}
			<Textarea
				placeholder={t("import_upload_paste_placeholder")}
				value={pastedText}
				onValueChange={(val) => {
					if (val.length <= MAX_PASTE_CHARACTERS) {
						setPastedText(val);
					}
				}}
				minRows={3}
				maxRows={6}
				className="w-full"
				classNames={{
					inputWrapper: "border-default-200 focus-within:border-primary dark:border-default-100",
				}}
				isDisabled={!!file}
			/>

			{/* Descargar plantillas */}
			<div className="flex justify-center">
				<DownloadTemplate />
			</div>

			{/* Botón Analizar */}
			<div className="flex justify-end pt-2">
				<Button
					color="primary"
					onPress={handleAnalyze}
					isDisabled={!hasInput || isAnalyzing}
					isLoading={isAnalyzing}
				>
					{isAnalyzing
						? t("import_upload_analyzing")
						: t("import_upload_button_analyze")}
				</Button>
			</div>
		</div>
	);
};
