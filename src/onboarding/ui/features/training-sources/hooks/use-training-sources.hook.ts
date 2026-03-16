import { useAuraToast } from "@beweco/aurora-ui";
import { useCallback, useMemo, useState } from "react";
import { ExtractSimpleBrandGuide, RetriveUrl, StartTraining, UploadFiles } from "../DependencyInjection";
import { useTrainingSourcesStore } from "../store";
import type { TrainingSourceType } from "./types";
import { useWebsiteSource } from "./use-website-source.hook";
import { useFileSource } from "./use-file-source.hook";
import { useTextSource } from "./use-text-source.hook";

export const useTrainingSources = () => {
	const trainingData = useTrainingSourcesStore((state) => state.data);
	const setTrainingData = useTrainingSourcesStore((state) => state.setData);
	const { showToast } = useAuraToast();

	const {
		websiteUrl,
		isWebsiteUrlValid,
		websiteValidationMessage,
		websiteUrlToPersist,
		handleWebsiteChange,
		handleAddWebsite: handleAddWebsiteSource,
	} = useWebsiteSource(trainingData.websiteUrl ?? "");

	const {
		uploadedFiles,
		handleUploadFiles: handleUploadFilesSource,
		handleRemoveFile,
	} = useFileSource(trainingData.uploadedFiles);

	const {
		textInput,
		setTextInput,
		handleAddText: handleAddTextSource,
	} = useTextSource(trainingData.textInput);

	const [expandedCard, setExpandedCard] = useState<TrainingSourceType | null>(
		null
	);
	const [isLoading, setIsLoading] = useState(false);

	const selectedSources = useMemo<TrainingSourceType[]>(() => {
		const selected: TrainingSourceType[] = [];

		if (websiteUrlToPersist) {
			selected.push("website");
		}
		if (uploadedFiles.length > 0) {
			selected.push("files");
		}
		if (textInput.trim().length >= 60) {
			selected.push("text");
		}

		return selected;
	}, [textInput, uploadedFiles.length, websiteUrlToPersist]);

	const handleToggleExpand = useCallback((type: TrainingSourceType) => {
		setExpandedCard((prev) => (prev === type ? null : type));
	}, []);

	const handleCollapse = useCallback(() => {
		setExpandedCard(null);
	}, []);

	const handleAddWebsite = useCallback(() => {
		handleAddWebsiteSource();
		setExpandedCard(null);
	}, [handleAddWebsiteSource]);

	const handleUploadFiles = useCallback(
		(files: File[]) => {
			handleUploadFilesSource(files);
			setExpandedCard(null);
		},
		[handleUploadFilesSource]
	);

	const handleAddText = useCallback(() => {
		handleAddTextSource();
		setExpandedCard(null);
	}, [handleAddTextSource]);

	const handlePersist = useCallback(() => {
		setTrainingData({
			websiteUrl: websiteUrlToPersist,
			uploadedFiles,
			textInput: textInput.trim(),
		});
	}, [setTrainingData, textInput, uploadedFiles, websiteUrlToPersist]);

	const handleExtractBrandGuide = useCallback(async (): Promise<boolean> => {
		const result = await ExtractSimpleBrandGuide({ url: websiteUrlToPersist ?? "" });
		if (!result.isSuccess) {
			showToast({
				color: "warning",
				title: "No se pudo extraer la marca desde la URL",
				description: "Intenta nuevamente",
			});
			return false;
		}
		return true;
	}, [websiteUrlToPersist, showToast]);

	const handleSave = useCallback(async (): Promise<boolean> => {
		setIsLoading(true);

		const urlsToTrain: string[] = [];
		
		if (websiteUrlToPersist) {
			const success = await handleExtractBrandGuide();

			if (!success) {
				setIsLoading(false);
				return false;
			}

			urlsToTrain.push(websiteUrlToPersist);
			
			const retriveResult = await RetriveUrl(websiteUrlToPersist);
			if (retriveResult.isSuccess && retriveResult.value) {
				const subUrls = retriveResult.value
				.slice(0, 10)
				.map((subUrl) => subUrl.url);
				urlsToTrain.push(...subUrls);
			}
		}

		if (uploadedFiles.length > 0) {
			const uploadResult = await UploadFiles(uploadedFiles);
			if (!uploadResult.isSuccess) {
				showToast({
					color: "danger",
					title: "Error al subir archivos",
					description: "Intenta nuevamente",
				});
				setIsLoading(false);
				return false;
			}
		}

		if (urlsToTrain.length > 0) {
			const trainingResult = await StartTraining(urlsToTrain);
			if (!trainingResult.isSuccess) {
				showToast({
					color: "danger",
					title: "Error al iniciar entrenamiento",
					description: "Intenta nuevamente",
				});
				setIsLoading(false);
				return false;
			}
		}

		handlePersist();
		setIsLoading(false);
		return true;
	}, [uploadedFiles, websiteUrlToPersist, handlePersist, showToast]);

	return {
		websiteUrl,
		setWebsiteUrl: handleWebsiteChange,
		isWebsiteUrlValid,
		websiteValidationMessage,
		uploadedFiles,
		textInput,
		setTextInput,
		expandedCard,
		selectedSources,
		isLoading,
		handleToggleExpand,
		handleCollapse,
		handleAddWebsite,
		handleAddText,
		handleUploadFiles,
		handleRemoveFile,
		handlePersist,
		handleSave,
		handleExtractBrandGuide,
	};
};
