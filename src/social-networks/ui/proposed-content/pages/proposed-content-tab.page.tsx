import {
	Button,
	DrawerFilters,
	type DrawerFiltersConfig,
	IconComponent,
	useAuraToast,
} from "@beweco/aurora-ui";
import {
	ChipColor,
	ContentGenerationStatus,
	ContentOrigin,
	toCarouselItemFromContentGeneration,
	toCarouselItemsFromContentGenerations,
	useContentGeneration,
} from "@shared/features/linda/content-generation";
import { ContentOriginChip } from "../components/content-origin-chip";
import { GeneratingContentModal } from "../components/generating-content-modal";
import { IdeaStatus, useIdeaBank } from "@shared/features/linda/idea-bank";
import {
	AccordionListComponent,
	ContentPreviewModal,
	SocialMediaCarouselComponent,
} from "@shared/ui/components";
import type { SocialMediaCarouselItem } from "@shared/ui/components";
import { configureSuccessToast } from "@shared/utils/toast-config.utils";
import { useTranslate } from "@tolgee/react";
import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import type { ProposedContentIdeaItem } from "./proposed-content-tab.types";
import {
	CONTENT_GENERATION_STATUS_COMPLETED,
	CONTENT_GENERATION_STATUS_FAIL,
	POLLING_INTERVAL_MS,
} from "../constants/proposed-content-tab.constants";

/**
 * Mapea el tipo de SocialMediaCarouselItem al formato de plataforma esperado por ContentPreviewModal
 * Nota: 'whatsapp' no está soportado por SocialPlatform, por lo tanto se mapea a 'instagram'
 */
const mapCarouselTypeToPlatform = (
	type: string
): "instagram" | "facebook" | "tiktok" | "twitter" => {
	if (type.includes("instagram")) return "instagram";
	if (type.includes("facebook")) return "facebook";
	if (type.includes("tiktok")) return "tiktok";
	if (type.includes("twitter")) return "twitter";
	// WhatsApp no está soportado, fallback a Instagram
	return "instagram";
};

/**
 * Formatea una fecha para mostrar (recibe t para i18n del fallback)
 */
const formatSuggestedDate = (
	date: Date | string | undefined,
	notSpecifiedLabel: string
): string => {
	if (!date) return notSpecifiedLabel;
	const dateObj = typeof date === "string" ? new Date(date) : date;
	return dateObj.toLocaleDateString("es-ES", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
};

export function ProposedContentTabPage() {
	const navigate = useNavigate();
	const { showToast } = useAuraToast();
	const { t } = useTranslate();
	const {
		contentGenerations,
		loading,
		error,
		fetchContentGenerations,
		fetchContentGenerationById,
		deleteContent,
	} = useContentGeneration();

	// Hook para el banco de ideas
	const {
		ideas,
		total: totalIdeas,
		loading: loadingIdeas,
		error: errorIdeas,
		fetchPendingIdeas,
		getIdeaById,
		updateIdeaStatus,
	} = useIdeaBank();

	const [carouselItems, setCarouselItems] = useState<SocialMediaCarouselItem[]>(
		[]
	);
	const [proposedContentItems, setProposedContentItems] = useState<
		ProposedContentIdeaItem[]
	>([]);

	// Filter states
	const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

	// Preview modal state
	const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
	const [selectedItemForPreview, setSelectedItemForPreview] =
		useState<SocialMediaCarouselItem | null>(null);

	// Generating content modal state and idea ID for polling
	const [isGeneratingModalOpen, setIsGeneratingModalOpen] = useState(false);
	const [pollingIdeaId, setPollingIdeaId] = useState<string | null>(null);
	const pollingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

	// Loading state for content reload
	const [isReloadingContent, setIsReloadingContent] = useState(false);

	// Pagination state for Ideas (Banco de Linda)
	const [currentPageIdeas, setCurrentPageIdeas] = useState(1);
	const IDEAS_PER_PAGE = 20;

	// Fetch content generations on mount
	useEffect(() => {
		const loadContentGenerations = async () => {
			try {
				// Fetch only completed content
				await fetchContentGenerations({
					status: ContentGenerationStatus.COMPLETED,
					limit: 20,
				});
			} catch (err) {
				console.error("Error loading content generations:", err);
			}
		};

		loadContentGenerations();
	}, [fetchContentGenerations]);

	// Fetch ideas from banco de ideas - refetch when page changes
	useEffect(() => {
		const loadIdeas = async () => {
			try {
				const offset = (currentPageIdeas - 1) * IDEAS_PER_PAGE;
				await fetchPendingIdeas(IDEAS_PER_PAGE, offset);
			} catch (err) {
				console.error("Error loading ideas:", err);
			}
		};

		loadIdeas();
	}, [fetchPendingIdeas, currentPageIdeas]);

	// Update carousel items when content generations change
	useEffect(() => {
		console.log("🔄 useEffect: contentGenerations cambió", {
			total: contentGenerations?.length || 0,
			items: contentGenerations,
		});

		if (contentGenerations && contentGenerations.length > 0) {
			const rawItems =
				toCarouselItemsFromContentGenerations(contentGenerations);
			const items: SocialMediaCarouselItem[] = rawItems.map((item) => ({
				...item,
				...(item.origin && {
					chipContent: <ContentOriginChip origin={item.origin} />,
				}),
			}));
			console.log("✅ Actualizando carousel con", items.length, "items");
			setCarouselItems(items);
		} else {
			// Si no hay contenido, limpiar el carousel
			console.log("⚠️ No hay contenido generado, limpiando carousel");
			setCarouselItems([]);
		}
	}, [contentGenerations]);

	// Update proposed content items when ideas change
	useEffect(() => {
		if (ideas && ideas.length > 0) {
			const items: ProposedContentIdeaItem[] = ideas.map((idea) => ({
				id: idea.id,
				title: idea.suggestedTitle,
				description: idea.suggestedDescription,
				prompt: idea.suggestedPrompt,
				channels: idea.suggestedChannels,
				type: idea.type,
				contentType: idea.contentType,
				origin: ContentOrigin.BANK_OF_IDEAS, // Las ideas del banco siempre tienen este origin
				score: idea.evaluationScore,
				status: idea.status,
				priority: idea.priority,
				publishDate: idea.createdAt, // Usar createdAt como fecha sugerida
				expiryDate: idea.targetExpiryDate,
				rationale: idea.evaluationRationale,
				scoringBreakdown: idea.scoringBreakdown,
			}));
			setProposedContentItems(items);
		}
	}, [ideas]);

	const handleCarouselItemClick = (item: SocialMediaCarouselItem) => {
		console.log("Carousel item clicked:", item);
		// Navigate to create content wizard at final step (step 5 - Publicación) with item data for preview
		navigate("/social-networks/create-content", {
			state: {
				editMode: true,
				currentStep: 5,
				selectedContentType: item.type,
				generatedImage: item.imageUrl,
				generatedCaption: item.caption || "",
				itemId: item.id,
			},
		});
	};

	const handleDeleteCarouselItem = async (item: SocialMediaCarouselItem) => {
		try {
			// Update status to deleted in the backend
			await deleteContent(item.id);

			// Remove from local carousel state
			setCarouselItems((prevItems) =>
				prevItems.filter((carouselItem) => carouselItem.id !== item.id)
			);

			// Show success notification
			showToast(
				configureSuccessToast(
					t("social_networks_proposed_content_deleted_title"),
					t("social_networks_proposed_content_deleted_description")
				)
			);
		} catch (err) {
			console.error("Error deleting content:", err);

			// Get the specific error message from the backend
			const errorMessage =
				err instanceof Error
					? err.message
					: t("social_networks_proposed_delete_error_description");

			showToast({
				color: "danger",
				title: t("social_networks_proposed_delete_error_title"),
				description: errorMessage,
			});
		}
	};

	const handleEditCarouselItem = (item: SocialMediaCarouselItem) => {
		console.log("Editar item - Navegando a create-content:", item);

		// Navigate to create content wizard at final step (step 5 - Publicación) with item data for editing
		// Pasamos toda la información pre-llenada igual que en "Publicar"
		navigate("/social-networks/create-content", {
			state: {
				editMode: true,
				currentStep: 5,
				selectedContentType: item.type,
				generatedImage: item.imageUrl,
				generatedCaption: item.caption || "",
				contentTitle: item.title || item.name || "",
				itemId: item.id,
				fromProposedContent: true, // Flag to indicate this comes from proposed content
				readyToPublish: false, // En edición, no está listo para publicar automáticamente
			},
		});
	};

	const handlePublishCarouselItem = (item: SocialMediaCarouselItem) => {
		console.log("Publicar item - Navegando a create-content:", item);

		// Navigate to create content wizard at final step (step 5 - Publicación) with item data ready to publish
		// No publicamos en el backend todavía, solo navegamos para que el usuario revise
		navigate("/social-networks/create-content", {
			state: {
				editMode: true,
				currentStep: 5,
				selectedContentType: item.type,
				generatedImage: item.imageUrl,
				generatedCaption: item.caption || "",
				contentTitle: item.title || item.name || "",
				itemId: item.id,
				fromProposedContent: true, // Flag to indicate this comes from proposed content
				readyToPublish: true, // Flag to indicate this is ready to publish
			},
		});
	};

	const handlePreviewCarouselItem = (item: SocialMediaCarouselItem) => {
		console.log("Preview item:", item);
		setSelectedItemForPreview(item);
		setIsPreviewModalOpen(true);
	};

	const handlePageChangeIdeas = (page: number) => {
		setCurrentPageIdeas(page);
	};

	// Handler para aprobar idea y generar contenido
	const handleApproveIdea = async (item: ProposedContentIdeaItem) => {
		console.log("Aprobar idea:", item);
		try {
			setPollingIdeaId(item.id);
			setIsGeneratingModalOpen(true);
			await updateIdeaStatus(item.id, IdeaStatus.APPROVED);
		} catch (error) {
			setPollingIdeaId(null);
			setIsGeneratingModalOpen(false);
			const errorMessage =
				error instanceof Error
					? error.message
					: t("social_networks_proposed_connection_error_title");
			showToast({
				color: "danger",
				title: t("social_networks_proposed_connection_error_title"),
				description: errorMessage,
			});
		}
	};

	// Polling cada 5s mientras el modal de generación está abierto para comprobar content_generation_status
	const pollIdeaGenerationStatus = useCallback(async () => {
		console.log("🔄 Polling idea generation status:", pollingIdeaId);
		if (!pollingIdeaId) return;
		try {
			const { contentGenerationStatus, contentGenerationId } =
				await getIdeaById(pollingIdeaId);

			if (
				contentGenerationStatus === CONTENT_GENERATION_STATUS_COMPLETED &&
				contentGenerationId
			) {
				if (pollingIntervalRef.current) {
					clearInterval(pollingIntervalRef.current);
					pollingIntervalRef.current = null;
				}
				setPollingIdeaId(null);
				setIsGeneratingModalOpen(false);

				const content = await fetchContentGenerationById(contentGenerationId);
				if (content) {
					const carouselItem =
						toCarouselItemFromContentGeneration(content);
					navigate("/social-networks/create-content", {
						state: {
							editMode: true,
							currentStep: 5,
							selectedContentType: carouselItem.type,
							generatedImage: carouselItem.imageUrl,
							generatedCaption: carouselItem.caption || "",
							contentTitle: carouselItem.title || carouselItem.name || "",
							itemId: content.id,
							fromProposedContent: true,
							readyToPublish: false,
						},
					});
				}
				return;
			}

			if (contentGenerationStatus === CONTENT_GENERATION_STATUS_FAIL) {
				if (pollingIntervalRef.current) {
					clearInterval(pollingIntervalRef.current);
					pollingIntervalRef.current = null;
				}
				setPollingIdeaId(null);
				setIsGeneratingModalOpen(false);
				showToast(
					configureErrorToastWithTranslation(
						EnumErrorType.Critical,
						t,
						"content_generation_failed_title",
						"content_generation_failed_description"
					)
				);
			}
		} catch (err) {
			console.error("Error polling idea generation status:", err);
		}
	}, [pollingIdeaId, getIdeaById, fetchContentGenerationById, navigate, showToast, t]);

	useEffect(() => {
		if (!isGeneratingModalOpen || !pollingIdeaId) {
			if (pollingIntervalRef.current) {
				clearInterval(pollingIntervalRef.current);
				pollingIntervalRef.current = null;
			}
			return;
		}

		// Primera comprobación inmediata
		pollIdeaGenerationStatus();

		pollingIntervalRef.current = setInterval(() => {
			pollIdeaGenerationStatus();
		}, POLLING_INTERVAL_MS);

		return () => {
			if (pollingIntervalRef.current) {
				clearInterval(pollingIntervalRef.current);
				pollingIntervalRef.current = null;
			}
		};
	}, [isGeneratingModalOpen, pollingIdeaId, pollIdeaGenerationStatus]);

	// Handler para cerrar el modal y recargar el carousel
	const handleCloseGeneratingModal = async () => {
		try {
			console.log("🔄 Cerrando modal y recargando datos...");

			// Dejar de hacer polling y cerrar el modal
			setPollingIdeaId(null);
			setIsGeneratingModalOpen(false);

			// Activar loading de recarga
			setIsReloadingContent(true);

			// Mostrar notificación de recarga
			showToast(
				configureSuccessToast(
					t("social_networks_proposed_update_loading_title"),
					t("social_networks_proposed_update_loading_description")
				)
			);

			// Recarga inmediata
			console.log("📊 Primera recarga: carousel de contenido generado...");

			await fetchContentGenerations({
				status: ContentGenerationStatus.COMPLETED,
				limit: 20,
			});
			console.log("✅ Primera recarga completada");

			// Refrescar la lista de ideas pendientes con la paginación actual
			console.log("📋 Recargando lista de ideas pendientes...");
			const offset = (currentPageIdeas - 1) * IDEAS_PER_PAGE;
			await fetchPendingIdeas(IDEAS_PER_PAGE, offset);
			console.log("✅ Lista de ideas pendientes recargada");

			// Segunda recarga después de 2 segundos (por si el backend aún está procesando)
			console.log("⏳ Programando segunda recarga en 2 segundos...");
			setTimeout(async () => {
				console.log("📊 Segunda recarga: carousel de contenido generado...");
				await fetchContentGenerations({
					status: ContentGenerationStatus.COMPLETED,
					limit: 20,
				});
				console.log("✅ Segunda recarga completada");

				// Desactivar loading después de la segunda recarga
				setIsReloadingContent(false);
			}, 2000);
		} catch (error) {
			console.error("❌ Error al recargar datos:", error);
			setIsReloadingContent(false);
			showToast({
				color: "danger",
				title: t("social_networks_proposed_update_error_title"),
				description: t("social_networks_proposed_update_error_description"),
			});
		}
	};

	// Handler para descartar/rechazar idea
	const handleRejectIdea = async (item: ProposedContentIdeaItem) => {
		console.log("Rechazar idea:", item);
		try {
			await updateIdeaStatus(item.id, IdeaStatus.REJECTED);

			// Refrescar la lista de ideas para actualizar la tabla con la paginación actual
			const offset = (currentPageIdeas - 1) * IDEAS_PER_PAGE;
			await fetchPendingIdeas(IDEAS_PER_PAGE, offset);

			showToast(
				configureSuccessToast(
					t("social_networks_proposed_idea_discarded_title"),
					t("social_networks_proposed_idea_discarded_description")
				)
			);
		} catch (error) {
			const errorMessage =
				error instanceof Error
					? error.message
					: t("social_networks_proposed_connection_error_title");
			showToast({
				color: "danger",
				title: t("social_networks_proposed_connection_error_title"),
				description: errorMessage,
			});
		}
	};

	// Calculate total pages for ideas based on backend total
	const totalPagesIdeas = Math.ceil(totalIdeas / IDEAS_PER_PAGE);

	// DrawerFilters configuration
	const configDrawerFilters: DrawerFiltersConfig = {
		title: "Filtrar Contenido",
		description: "Filtra contenido por origen",
		data: [
			{
				key: "origins",
				title: "Origen",
				type: "multiselect",
				data: [
					{
						label: "Generación Automática",
						value: ContentOrigin.AUTO_CONTENT_GENERATION,
					},
					{ label: "Manual", value: ContentOrigin.MANUAL },
					{ label: "Banco de Ideas", value: ContentOrigin.BANK_OF_IDEAS },
				],
			},
		],
	};

	// Apply filters handler
	const handleApplyFilters = async (filters: Record<string, any>) => {
		console.log("📊 Filters del DrawerFilters:", filters);

		const originFilter = filters.origins;
		let origins: ContentOrigin | undefined = undefined;

		if (Array.isArray(originFilter) && originFilter.length > 0) {
			// Si hay múltiples seleccionados, usar el primero
			origins = originFilter[0];
		} else if (originFilter) {
			origins = originFilter;
		}

		setIsFilterDrawerOpen(false);

		// Fetch content with filter directly
		await fetchContentGenerations({
			status: ContentGenerationStatus.COMPLETED,
			limit: 20,
			origins,
		});
	};

	// Clear filters handler
	const handleClearFilters = async () => {
		console.log("🧹 Limpiando filtros del carousel");

		setIsFilterDrawerOpen(false);

		await fetchContentGenerations({
			status: ContentGenerationStatus.COMPLETED,
			limit: 20,
		});
	};

	return (
		<div className="relative mt-4">
			{/* Linda Info Banner - Positioned absolutely to not take vertical space */}
			<div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-center pointer-events-none">
				<div className="flex items-center gap-1 px-2 py-1 rounded-md bg-violet-50 text-violet-600 pointer-events-auto shadow-sm dark:bg-violet-950 dark:text-violet-300">
					<IconComponent
						icon="solar:star-fall-minimalistic-2-bold"
						className="w-3.5 h-3.5"
					/>
					<span className="text-xs font-medium">
						{t("social_networks_proposed_banner_text")}
					</span>
				</div>
			</div>

			{/* Filter Button */}
			<div className="flex justify-end mb-4">
				<Button
					variant="solid"
					className="bg-default-100 text-default-800"
					size="sm"
					onPress={() => setIsFilterDrawerOpen(true)}
					startContent={
						<IconComponent
							icon="solar:tuning-2-outline"
							className="text-default-800"
							size="sm"
						/>
					}
				>
					Filtros
				</Button>
			</div>

			{(loading && carouselItems.length === 0) || isReloadingContent ? (
				<div className="flex items-center justify-center py-12">
					<div className="text-center">
						<IconComponent
							icon="solar:refresh-circle-bold-duotone"
							className="w-8 h-8 mx-auto mb-2 animate-spin text-violet-600 dark:text-violet-400"
						/>
						<p className="text-sm text-foreground-500">
							{isReloadingContent
								? t("social_networks_proposed_updating")
								: t("social_networks_proposed_loading")}
						</p>
					</div>
				</div>
			) : error ? (
				<div className="flex items-center justify-center py-12">
					<div className="text-center">
						<IconComponent
							icon="solar:danger-circle-bold-duotone"
							className="w-8 h-8 mx-auto mb-2 text-danger"
						/>
						<p className="text-sm text-danger">{error}</p>
					</div>
				</div>
			) : (
				<SocialMediaCarouselComponent
					items={carouselItems}
					haveChip={true}
					onItemClick={handleCarouselItemClick}
					onEdit={handleEditCarouselItem}
					onDelete={handleDeleteCarouselItem}
					onPublish={handlePublishCarouselItem}
					onPreview={handlePreviewCarouselItem}
					className=""
					emptyStateRedirectPath="/redes-sociales/crear-contenido"
				/>
			)}

			{/* Preview Modal */}
			{selectedItemForPreview && (
				<ContentPreviewModal
					isOpen={isPreviewModalOpen}
					onClose={() => {
						setIsPreviewModalOpen(false);
						setSelectedItemForPreview(null);
					}}
					platform={mapCarouselTypeToPlatform(selectedItemForPreview.type)}
					imageUrl={selectedItemForPreview.imageUrl || ""}
					caption={selectedItemForPreview.caption || ""}
					title={selectedItemForPreview.title || selectedItemForPreview.name}
					variant="full"
					showHeader={true}
				/>
			)}
			{/* AccordionList Section - Ideas del Banco de Linda */}
			{loadingIdeas && proposedContentItems.length === 0 ? (
				<div className="flex items-center justify-center py-12 mt-4">
					<div className="text-center">
						<IconComponent
							icon="solar:refresh-circle-bold-duotone"
							className="w-8 h-8 mx-auto mb-2 animate-spin text-violet-600 dark:text-violet-400"
						/>
						<p className="text-sm text-foreground-500">
							{t("social_networks_proposed_loading_ideas")}
						</p>
					</div>
				</div>
			) : errorIdeas ? (
				<div className="flex items-center justify-center py-12 mt-4">
					<div className="text-center">
						<IconComponent
							icon="solar:danger-circle-bold-duotone"
							className="w-8 h-8 mx-auto mb-2 text-danger"
						/>
						<p className="text-sm text-danger">{errorIdeas}</p>
					</div>
				</div>
			) : proposedContentItems.length > 0 ? (
				<AccordionListComponent<ProposedContentIdeaItem>
					mode="accordion"
					items={proposedContentItems}
					sectionTitle={t("social_networks_proposed_section_title")}
					sectionIcon="solar:lightbulb-bolt-bold-duotone"
					showCount
					accordionVariant="splitted"
					selectionMode="multiple"
					header={{
						getTitle: (item: ProposedContentIdeaItem) => item.title,
						getMetadata: (item: ProposedContentIdeaItem) => {
							const metadata = [];

							// Chip de plataforma (type)
							if (item.type) {
								const typeLabel =
									item.type.charAt(0).toUpperCase() + item.type.slice(1);
								const typeColor =
									item.type === "instagram"
										? "secondary"
										: item.type === "facebook"
											? "primary"
											: item.type === "tiktok"
												? "default"
												: "success";
								metadata.push({
									key: "type",
									label: typeLabel,
									color: typeColor as ChipColor,
									variant: "flat" as const,
								});
							}

							// Chip de tipo de contenido (content_type)
							if (item.contentType) {
								const contentTypeLabel =
									item.contentType === "story"
										? "Story"
										: item.contentType === "post"
											? "Post"
											: item.contentType === "reel"
												? "Reel"
												: item.contentType === "video"
													? "Video"
													: item.contentType.charAt(0).toUpperCase() +
														item.contentType.slice(1);
								metadata.push({
									key: "content-type",
									label: contentTypeLabel,
									color: "default" as ChipColor,
									variant: "flat" as const,
								});
							}

							return metadata;
						},
					}}
					content={{
						render: (item: ProposedContentIdeaItem) => (
							<div className="pb-4">
								<div className="space-y-3">
									{/* Descripción */}
									<div>
										<p className="text-sm font-semibold text-foreground mb-2">
											{t("social_networks_proposed_description_label")}
										</p>
										<p className="text-sm text-default-600 leading-relaxed whitespace-pre-wrap">
											{item.description}
										</p>
									</div>

									{/* Fecha sugerida */}
									<div className="pt-2 border-t border-default-200">
										<p className="text-xs text-default-500">
											<strong>
												{t("social_networks_proposed_suggested_date")}
											</strong>{" "}
											{formatSuggestedDate(
												item.publishDate,
												t("social_networks_proposed_date_not_specified")
											)}
										</p>
									</div>

									{/* Botón de aprobar y generar contenido */}
									<div className="flex justify-end pt-2">
										<Button
											size="md"
											onPress={() => handleApproveIdea(item)}
											endContent={
												<IconComponent
													icon="solar:check-circle-bold"
													className="w-4 h-4"
												/>
											}
										>
											{t("social_networks_proposed_approve_generate")}
										</Button>
									</div>
								</div>
							</div>
						),
					}}
					actions={[
						{
							key: "reject",
							icon: "solar:trash-bin-minimalistic-outline",
							tooltip: t("social_networks_proposed_discard_idea"),
							color: "danger",
							onPress: handleRejectIdea,
						},
					]}
					pagination={{
						currentPage: currentPageIdeas,
						totalPages: totalPagesIdeas,
						onPageChange: handlePageChangeIdeas,
						showControls: true,
						isCompact: true,
					}}
					emptyState={{
						icon: "solar:inbox-line-bold-duotone",
						title: t("social_networks_proposed_no_ideas_title"),
						description: t("social_networks_proposed_no_ideas_description"),
					}}
					isLoading={loadingIdeas}
					className="mt-6"
				/>
			) : null}

			{/* Filter Drawer */}
			<DrawerFilters
				config={configDrawerFilters}
				onApplyFilters={handleApplyFilters}
				onClearFilters={handleClearFilters}
				isOpen={isFilterDrawerOpen}
				onOpenChange={setIsFilterDrawerOpen}
			/>

			<GeneratingContentModal
				isOpen={isGeneratingModalOpen}
				onClose={handleCloseGeneratingModal}
			/>
		</div>
	);
}
