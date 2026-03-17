import { UploadFileComponent } from "@/shared/ui/components/UploadFile/UploadFile";
import { Button, Textarea, useAuraToast } from "@beweco/aurora-ui";
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

export const UploadStep: FC = () => {
	const { t } = useTranslate();
	const { showToast } = useAuraToast();
	const [isAnalyzing, setIsAnalyzing] = useState(false);

	const {
		file,
		pastedText,
		setFile,
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
		<div className="flex flex-col gap-6 p-4">
			{/* Dropzone */}
			<UploadFileComponent
				size="large"
				accept={ACCEPTED_FILE_TYPES}
				maxSize={MAX_FILE_SIZE_BYTES}
				onUpload={handleFileUpload}
				onError={handleFileError}
				translations={{
					dropzoneText: t("import_upload_dropzone_title"),
					dropzoneSubText: t("import_upload_dropzone_subtitle"),
				}}
			/>

			{/* Mostrar nombre del archivo seleccionado */}
			{file && (
				<div className="text-sm text-default-500 text-center">
					{file.name} ({(file.size / 1024).toFixed(1)} KB)
				</div>
			)}

			{/* Separador */}
			<div className="flex items-center gap-4">
				<div className="flex-1 h-px bg-default-200" />
				<span className="text-sm text-default-400">
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
				minRows={4}
				maxRows={8}
				className="w-full"
			/>

			{/* Formatos aceptados */}
			<p className="text-xs text-default-400 text-center">
				{t("import_upload_formats_hint")}
			</p>

			{/* Descargar plantillas */}
			<div className="flex justify-center">
				<DownloadTemplate />
			</div>

			{/* Botón Analizar */}
			<div className="flex justify-end">
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
