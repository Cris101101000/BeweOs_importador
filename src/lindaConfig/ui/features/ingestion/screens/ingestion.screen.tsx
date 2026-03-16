import { Button, Card, H3, P, useAuraToast } from "@beweco/aurora-ui";
import { EnumErrorType } from "@shared/domain/enums";
import { useConfirmDeleteModal } from "@shared/ui/store/useConfirmDeleteModal";
import {
	configureErrorToastWithTranslation,
	configureSuccessToast,
} from "@shared/utils";
import { useTranslate } from "@tolgee/react";
import type React from "react";
import { useCallback, useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";

import { useTrainingStatus, useUrlExploration } from "../hooks";
// Store & Hooks
import { selectTotalSubUrls, useIngestionStore } from "../store";

import { ScrapedUrlsMapper } from "src/shared/features/linda/ingestion/infrastructure/mappers/scraped-urls.mapper";
import {
	DeleteAsset,
	GetFiles,
	GetScrapedUrls,
	GetTrainingStatus,
	StartTraining,
	UploadFiles,
} from "../DependencyInjection";
import { FileUploadSection } from "../components/file-upload-section";
import { TrainingStatusModal } from "../components/training-status-modal";
import { UrlExplorationModal } from "../components/url-exploration-modal";
// Components
import { UrlLoadingSection } from "../components/url-loading-section";

export const IngestionScreen: React.FC = () => {
	const { showToast } = useAuraToast();
	const { t } = useTranslate();
	const [isLoading, setIsLoading] = useState(false);

	// Store state with shallow comparison
	const { loadedUrls, loadedDocuments } = useIngestionStore(
		useShallow((state) => ({
			loadedUrls: state.loadedUrls,
			loadedDocuments: state.loadedDocuments,
		}))
	);
	const totalSubUrls = useIngestionStore(selectTotalSubUrls);

	// Store actions (stable references)
	const setLoadedUrls = useIngestionStore((state) => state.setLoadedUrls);
	const removeLoadedUrl = useIngestionStore((state) => state.removeLoadedUrl);
	const setLoadedDocuments = useIngestionStore(
		(state) => state.setLoadedDocuments
	);
	const addLoadedDocuments = useIngestionStore(
		(state) => state.addLoadedDocuments
	);
	const removeLoadedDocument = useIngestionStore(
		(state) => state.removeLoadedDocument
	);

	const loadData = async () => {
		// Load files
		const responseFiles = await GetFiles();

		if (!responseFiles.isSuccess) {
			showToast(
				configureErrorToastWithTranslation(
					EnumErrorType.Critical,
					t,
					"Error al cargar archivos"
				)
			);
		}

		setLoadedDocuments(responseFiles.value || []);

		// Load scraped URLs
		const responseScrapedUrls = await GetScrapedUrls();
		if (!responseScrapedUrls.isSuccess) {
			showToast(
				configureErrorToastWithTranslation(
					EnumErrorType.Critical,
					t,
					"Error al cargar URLs procesadas"
				)
			);
		}

		setLoadedUrls(
			ScrapedUrlsMapper.toLoadedUrlList(responseScrapedUrls.value || [])
		);
	};

	// Training Status hook
	const {
		isOpen: isTrainingModalOpen,
		status: trainingStatus,
		openModal: openTrainingModal,
		startPolling,
	} = useTrainingStatus({
		getTrainingStatus: GetTrainingStatus,
		onComplete: () => {
			showToast(
				configureSuccessToast(
					"Entrenamiento completado",
					"Linda ha aprendido la nueva información correctamente"
				)
			);
			loadData();
		},
		onError: () => {
			showToast(
				configureErrorToastWithTranslation(
					EnumErrorType.Critical,
					t,
					"Error en el entrenamiento"
				)
			);
		},
	});

	useEffect(() => {
		loadData();
	}, []);

	// URL Exploration hook
	const {
		exploration,
		selectedCount,
		exploreUrl,
		confirmSelection,
		cancelExploration,
		toggleSubUrlSelection,
		filterUrlsBySearch,
	} = useUrlExploration();

	// Global confirm delete modal
	const { openModal: openDeleteModal } = useConfirmDeleteModal();

	// Handle URL removal with confirmation
	const handleRemoveUrl = useCallback(
		(id: string) => {
			const urlToRemove = loadedUrls.find((url) => url.id === id);
			if (urlToRemove) {
				const isFromDatabase = urlToRemove.source === "database";
				openDeleteModal({
					title: isFromDatabase ? "Eliminar URL procesada" : "Eliminar URL",
					description: `¿Estás seguro de que deseas eliminar la URL "${urlToRemove.url}" y todas sus sub-URLs?\n\nEsta acción no se puede deshacer.`,
					onConfirm: async () => {
						console.log(
							"urlToRemove?.idScrapedUrls >>",
							urlToRemove?.idScrapedUrls
						);

						for (const idScrapedUrl of urlToRemove?.idScrapedUrls || []) {
							const deleteResult = await DeleteAsset(idScrapedUrl);
							if (!deleteResult.isSuccess) {
								showToast(
									configureErrorToastWithTranslation(
										EnumErrorType.Critical,
										t,
										"Error al eliminar asset"
									)
								);
								return;
							}
						}

						removeLoadedUrl(id);
						showToast(
							configureSuccessToast("URLs procesadas eliminadas correctamente")
						);
					},
				});
			}
		},
		[
			loadedUrls,
			openDeleteModal,
			removeLoadedUrl,
			showToast,
			t,
			openTrainingModal,
			startPolling,
		]
	);

	// Handle document removal with confirmation (only for documents saved in DB)
	const handleRemoveDocument = useCallback(
		(id: string) => {
			const docToRemove = loadedDocuments.find((doc) => doc.id === id);
			if (!docToRemove) return;

			// If document is NOT saved in DB (no accessUrl), remove directly without confirmation
			if (!docToRemove.accessUrl) {
				removeLoadedDocument(id);
				return;
			}

			// Document is saved in DB, show confirmation modal
			openDeleteModal({
				title: "Eliminar documento",
				description: `¿Estás seguro de que deseas eliminar el documento "${docToRemove.name}"?\n\nEsta acción no se puede deshacer.`,
				onConfirm: async () => {
					const deleteResult = await DeleteAsset(id);

					if (!deleteResult.isSuccess) {
						showToast(
							configureErrorToastWithTranslation(
								EnumErrorType.Critical,
								t,
								"Error al eliminar documento"
							)
						);
						return;
					}

					removeLoadedDocument(id);
					showToast(configureSuccessToast("Documento eliminado correctamente"));
				},
			});
		},
		[loadedDocuments, openDeleteModal, removeLoadedDocument, showToast, t]
	);

	const handleSaveChanges = useCallback(async () => {
		const localDocs = loadedDocuments.filter((doc) => doc.file);

		setIsLoading(true);

		const files = localDocs.map((doc) => doc.file as File);
		if (files.length > 0) {
			const uploadResult = await UploadFiles(files);
			if (!uploadResult.isSuccess) {
				showToast(
					configureErrorToastWithTranslation(
						EnumErrorType.Critical,
						t,
						"Error al guardar archivos"
					)
				);
				setIsLoading(false);
				return;
			}
		}

		// Collect URLs from loadedUrls (including selected sub-URLs)
		const urlsToTrain: string[] = [];
		for (const loadedUrl of loadedUrls) {
			// Add main URL
			urlsToTrain.push(loadedUrl.url);
			// Add selected sub-URLs (subUrls is already string[])
			for (const subUrl of loadedUrl.subUrls) {
				urlsToTrain.push(subUrl);
			}
		}

		// Open training modal and start training
		openTrainingModal();
		setIsLoading(false);

		const trainingResult = await StartTraining(urlsToTrain);
		if (!trainingResult.isSuccess) {
			showToast(
				configureErrorToastWithTranslation(
					EnumErrorType.Critical,
					t,
					"Error al iniciar el entrenamiento"
				)
			);
			return;
		}

		// Start polling for status
		startPolling();
	}, [
		loadedDocuments,
		loadedUrls,
		setLoadedDocuments,
		showToast,
		t,
		openTrainingModal,
		startPolling,
	]);

	const hasContent = loadedDocuments.length > 0 || loadedUrls.length > 0;

	return (
		<>
			<div className="space-y-6">
				<Card className="p-6">
					<H3>Cargar Información del Negocio</H3>
					<P className="text-gray-600 mb-6">
						Sube archivos o proporciona una URL para que Linda aprenda sobre tu
						negocio
					</P>

					<div className="space-y-6">
						{/* URL Loading Section */}
						<UrlLoadingSection
							loadedUrls={loadedUrls}
							totalSubUrls={totalSubUrls}
							onExploreUrl={exploreUrl}
							onRemoveUrl={handleRemoveUrl}
						/>

						{/* File Upload Section */}
						<FileUploadSection
							documents={loadedDocuments}
							onUpload={addLoadedDocuments}
							onRemoveDocument={handleRemoveDocument}
						/>

						{/* Save Changes Section */}
						{hasContent && (
							<div className="pt-4 border-t border-gray-200 flex justify-end">
								<Button
									color="primary"
									onPress={handleSaveChanges}
									isLoading={isLoading}
									isDisabled={
										isLoading ||
										(!loadedDocuments.some((doc) => doc.file) &&
											!loadedUrls.some((url) => url.source === "local"))
									}
								>
									Guardar cambios
								</Button>
							</div>
						)}
					</div>
				</Card>
			</div>

			{/* URL Exploration Modal */}
			<UrlExplorationModal
				exploration={exploration}
				onClose={cancelExploration}
				onConfirm={confirmSelection}
				onToggleSubUrl={toggleSubUrlSelection}
				filterUrlsBySearch={filterUrlsBySearch}
				selectedCount={selectedCount}
			/>

			{/* Training Status Modal */}
			<TrainingStatusModal
				isOpen={isTrainingModalOpen}
				status={trainingStatus}
			/>
		</>
	);
};
