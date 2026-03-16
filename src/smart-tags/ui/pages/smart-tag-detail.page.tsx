import {
	Button,
	Chip,
	IconComponent,
	Tab,
	Tabs,
	Tooltip,
	useAuraToast,
} from "@beweco/aurora-ui";
import { useTranslate } from "@tolgee/react";
import React, { useMemo, useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
	configureSuccessToast,
	configureWarningToast,
} from "../../../shared/utils/toast-config.utils.ts";
import {
	APPLICABLE_ENTITY_CONFIG,
	type HistorySubTabKey,
} from "../../domain/constants/applicable-entity.config.ts";
import { STATISTICS_CARDS_CONFIG } from "../../domain/constants/statistics-cards.config.ts";
import { ApplicableEntity } from "../../domain/enums/applicable-entity.enum.ts";
import type { ISmartTag } from "../../domain/interfaces/smart-tags-interface.ts";
import type { IEnrichedTagAssignment } from "../../domain/interfaces/tag-assignment.interface.ts";
import { mapToApplicableEntities } from "../../infrastructure/utils/applicable-entities-mapper.util.ts";
import {
	getSmartTagTypeChipColor,
	getSmartTagTypeLabel,
} from "../../infrastructure/utils/smart-tag-types.util.ts";
import { AssignSmartTagModal } from "../components/assign-smart-tag-modal/index.ts";
import {
	type EditSmartTagFormData,
	EditSmartTagModal,
} from "../components/edit-smart-tag-modal/edit-smart-tag-modal.component.tsx";
import { ViewSkeleton } from "@shared/ui/components/view-skeleton";
import { TagHistoryTable } from "../components/tag-history-table";
import { useSmartTags } from "../hooks/use-smart-tags-hook.ts";
import { useTagAssignments } from "../hooks/use-tag-assignments.hook.ts";

export const SmartTagDetailPage: React.FC = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const params = useParams();
	const tagId = params.id;
	const { showToast } = useAuraToast();
	const { t } = useTranslate();
	const { getSmartTagById, updateSmartTag } = useSmartTags();

	// Hook for fetching tag assignments
	const {
		clientAssignments,
		conversationAssignments,
		noteAssignments,
		isLoadingClients,
		isLoadingConversations,
		isLoadingNotes,
		errorClients,
		errorConversations,
		errorNotes,
		fetchClientAssignments,
		fetchConversationAssignments,
		fetchNoteAssignments,
		counts,
	} = useTagAssignments();

	// Helper functions for tag type - using centralized configuration
	const getTypeLabel = getSmartTagTypeLabel;
	const getTypeColor = getSmartTagTypeChipColor;

	// State for tag fetched by ID
	const [fetchedTag, setFetchedTag] = useState<ISmartTag | null>(null);
	const [isLoadingById, setIsLoadingById] = useState(false);
	const [fetchError, setFetchError] = useState<string | null>(null);

	// Pagination state
	const [page, setPage] = useState(1);
	const rowsPerPage = 10;

	// History tabs state
	const [historyTab, setHistoryTab] = useState<"clients" | "statistics">(
		"clients"
	);

	// Sub-tabs for history - dynamic type from config
	const [historySubTab, setHistorySubTab] =
		useState<HistorySubTabKey>("clients");

	// Assignment modal state
	const [showAssignModal, setShowAssignModal] = useState(false);

	// Edit modal state
	const [showEditModal, setShowEditModal] = useState(false);

	// Get tag data from navigation state (used as placeholder while fetching fresh data)
	const tagFromState = useMemo(() => {
		return location.state?.tag || null;
	}, [location.state]) as ISmartTag | null;

	// Always fetch tag by ID to get fresh data (hybrid approach: use state as placeholder, fetch for accuracy)
	useEffect(() => {
		// Always fetch if we have a tagId and haven't fetched yet
		if (tagId && !fetchedTag && !isLoadingById) {
			setIsLoadingById(true);
			setFetchError(null);

			getSmartTagById(tagId)
				.then((tag) => {
					if (tag) {
						setFetchedTag(tag);
					} else {
						setFetchError(
							t("smart_tags_detail_not_found_title", "Etiqueta no encontrada")
						);
					}
				})
				.catch((err) => {
					const errorMessage =
						err instanceof Error
							? err.message
							: t(
									"smart_tags_detail_not_found_description",
									"No se pudo cargar la información de la etiqueta"
								);
					setFetchError(errorMessage);
					showToast({
						color: "danger",
						title: t("message_error", "Error"),
						description: errorMessage,
					});
				})
				.finally(() => {
					setIsLoadingById(false);
				});
		}
	}, [tagId]);

	// Use fetched tag (fresh data) if available, otherwise fallback to state (placeholder)
	const tag = fetchedTag || tagFromState;

	// Track the tagId for which assignments have been loaded to prevent infinite loops
	const [loadedTagId, setLoadedTagId] = useState<string | null>(null);

	// Fetch tag assignments when tag is loaded (only once per tagId)
	useEffect(() => {
		// Only fetch if we have a tag and haven't loaded for this tagId yet
		if (tagId && tag && loadedTagId !== tagId) {
			setLoadedTagId(tagId);

			// Fetch client assignments if tag applies to clients
			if (tag.applicableEntities.includes(ApplicableEntity.CLIENT)) {
				fetchClientAssignments(tagId);
			}
			// Fetch conversation assignments if tag applies to communications
			if (tag.applicableEntities.includes(ApplicableEntity.COMMUNICATION)) {
				fetchConversationAssignments(tagId);
			}
			// Fetch note assignments if tag applies to notes
			if (tag.applicableEntities.includes(ApplicableEntity.NOTE)) {
				fetchNoteAssignments(tagId);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [tagId, tag?.id]);

	// Get current assignments based on selected sub-tab
	const currentAssignments: IEnrichedTagAssignment[] = useMemo(() => {
		switch (historySubTab) {
			case "clients":
				return clientAssignments;
			case "conversations":
				return conversationAssignments;
			case "notes":
				return noteAssignments;
			default:
				return clientAssignments;
		}
	}, [
		historySubTab,
		clientAssignments,
		conversationAssignments,
		noteAssignments,
	]);

	// Is loading based on current tab
	const isLoadingAssignments = useMemo(() => {
		switch (historySubTab) {
			case "clients":
				return isLoadingClients;
			case "conversations":
				return isLoadingConversations;
			case "notes":
				return isLoadingNotes;
			default:
				return isLoadingClients;
		}
	}, [historySubTab, isLoadingClients, isLoadingConversations, isLoadingNotes]);

	// Error based on current tab
	const assignmentError = useMemo(() => {
		switch (historySubTab) {
			case "clients":
				return errorClients;
			case "conversations":
				return errorConversations;
			case "notes":
				return errorNotes;
			default:
				return errorClients;
		}
	}, [historySubTab, errorClients, errorConversations, errorNotes]);

	// Statistics calculations
	const statistics = useMemo(() => {
		const totalClients = counts.clients;
		const totalConversations = counts.conversations;
		const totalNotes = counts.notes;
		const totalUsage = totalClients + totalConversations + totalNotes;
		const campaignsUsage = 0; // TODO: Replace with real data from API

		return {
			totalUsage,
			totalClients,
			totalConversations,
			totalNotes,
			campaignsUsage,
			clientsPercentage:
				totalUsage > 0 ? Math.round((totalClients / totalUsage) * 100) : 0,
			conversationsPercentage:
				totalUsage > 0
					? Math.round((totalConversations / totalUsage) * 100)
					: 0,
			notesPercentage:
				totalUsage > 0 ? Math.round((totalNotes / totalUsage) * 100) : 0,
		};
	}, [counts]);

	// Counts for sub-tabs - using real data from hook
	const historyCounts = useMemo(
		() => ({
			clients: counts.clients,
			conversations: counts.conversations,
			notes: counts.notes,
		}),
		[counts]
	);

	// Reset page when changing tabs or sub-tabs
	React.useEffect(() => {
		setPage(1);
	}, [historyTab, historySubTab]);

	// Handle assignment - reload assignments after successful assignment
	const handleAssign = useCallback(
		(entityType: ApplicableEntity, selectedItems: string[]) => {
			console.log("Assigned tag to:", entityType, selectedItems);
			setShowAssignModal(false);

			// Reload assignments based on the entity type that was assigned
			if (tagId) {
				if (entityType === "client") {
					fetchClientAssignments(tagId);
				} else if (entityType === "communication") {
					fetchConversationAssignments(tagId);
				} else if (entityType === "note") {
					fetchNoteAssignments(tagId);
				}
			}
		},
		[
			tagId,
			fetchClientAssignments,
			fetchConversationAssignments,
			fetchNoteAssignments,
		]
	);

	// Check if a similar tag already exists
	const checkDuplicateTag = useCallback(
		(_tagName: string, _excludeId?: string): ISmartTag | null => {
			// Since we don't have the full list here, we'll skip duplicate check
			// This could be enhanced by fetching all tags if needed
			return null;
		},
		[]
	);

	// Handle opening edit modal
	const handleOpenEditModal = useCallback(() => {
		if (!tag) return;
		setShowEditModal(true);
	}, [tag]);

	// Handle update tag
	const handleUpdateTag = useCallback(
		async (formData: EditSmartTagFormData) => {
			if (!tag) {
				return;
			}

			// Only check for duplicates if the name has actually changed
			const nameHasChanged =
				formData.name.trim().toLowerCase() !== tag.name.trim().toLowerCase();

			if (nameHasChanged) {
				// Check for duplicate or similar tags (excluding the current tag being edited)
				const duplicateTag = checkDuplicateTag(formData.name, tag.id);

				if (duplicateTag) {
					showToast(
						configureWarningToast(
							t("smart_tags_toast_duplicate_title", "Etiqueta duplicada"),
							t("smart_tags_toast_duplicate_description", {
								name: duplicateTag.name,
							})
						)
					);
					throw new Error(
						t("smart_tags_toast_duplicate_title", "Etiqueta duplicada")
					);
				}
			}

			// Parse keywords from comma-separated string to array
			const keywordsArray = formData.keywords
				? formData.keywords
						.split(",")
						.map((k) => k.trim())
						.filter((k) => k.length > 0)
				: [];

			// Map form data to Partial<ISmartTag> structure for update
			const updates: Partial<ISmartTag> & {
				_applicableEntitiesOverride?: string[];
			} = {
				name: formData.name.trim(),
				description: formData.description.trim(),
				keywords: keywordsArray,
				color: formData.color,
				type: formData.type,
				status: formData.status,
				// Use applicableEntities array directly
				applicableEntities: mapToApplicableEntities(
					formData.applicableEntities
				),
				isTemporary: formData.isTemporary,
				temporaryDuration:
					formData.isTemporary && formData.temporaryDuration
						? Number.parseInt(formData.temporaryDuration, 10)
						: undefined,
				// Pass applicableEntities array directly to mapper via temporary property
				_applicableEntitiesOverride: formData.applicableEntities,
			};

			try {
				const updatedTag = await updateSmartTag(tag.id, updates);

				// Update the fetched tag with the updated data
				setFetchedTag(updatedTag);

				showToast(
					configureSuccessToast(
						t("smart_tags_toast_updated_title", "Etiqueta actualizada"),
						t("smart_tags_toast_updated_description", { name: formData.name })
					)
				);

				setShowEditModal(false);
			} catch (error) {
				// Error is already handled by the hook/adapter
				// Re-throw to prevent modal from closing
				throw error;
			}
		},
		[tag, checkDuplicateTag, showToast, updateSmartTag]
	);

	// Show skeleton while loading
	if (tagId && !tag && isLoadingById) {
		return (
			<>
				<ViewSkeleton className="p-6" />
			</>
		);
	}

	// Show error if tag not found or error occurred
	if (!tag && (fetchError || !tagId)) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
				<IconComponent
					icon="solar:danger-circle-bold"
					className="text-danger-500"
					width={64}
					height={64}
				/>
				<h2 className="text-xl font-semibold text-default-900">
					{t("smart_tags_detail_not_found_title", "Etiqueta no encontrada")}
				</h2>
				<p className="text-sm text-default-600">
					{fetchError ||
						t(
							"smart_tags_detail_not_found_description",
							"No se pudo cargar la información de la etiqueta"
						)}
				</p>
				<Button
					color="primary"
					onPress={() => navigate("/intelligent-tags")}
					startContent={<IconComponent icon="solar:arrow-left-outline" />}
				>
					{t("smart_tags_detail_back_to_list", "Volver a etiquetas")}
				</Button>
			</div>
		);
	}

	// If still no tag after all checks, show error
	if (!tag) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
				<IconComponent
					icon="solar:danger-circle-bold"
					className="text-danger-500"
					width={64}
					height={64}
				/>
				<h2 className="text-xl font-semibold text-default-900">
					{t("smart_tags_detail_not_found_title", "Etiqueta no encontrada")}
				</h2>
				<p className="text-sm text-default-600">
					{t(
						"smart_tags_detail_not_found_description",
						"No se pudo cargar la información de la etiqueta"
					)}
				</p>
				<Button
					color="primary"
					onPress={() => navigate("/intelligent-tags")}
					startContent={<IconComponent icon="solar:arrow-left-outline" />}
				>
					{t("smart_tags_detail_back_to_list", "Volver a etiquetas")}
				</Button>
			</div>
		);
	}

	return (
		<div className="w-full flex flex-col gap-4">
			{/* Back Button */}
			<Button
				variant="light"
				color="primary"
				size="sm"
				onPress={() => navigate('/intelligent-tags')}
				startContent={
					<IconComponent
					icon="solar:alt-arrow-left-linear"
					className="text-primary"
					size="sm"
					/>
			}
				className="w-fit font-medium hover:bg-primary-50 transition-all duration-200"
			>
				{t('smart_tags_detail_back', 'Volver')}
			</Button>

			{/* Main Info Card */}
			<div className="p-6 bg-white dark:bg-default-50 rounded-lg border border-default-200 shadow-sm">
				<div className="flex items-start justify-between gap-4 mb-4">
					<div className="flex-1">
						<div className="flex items-center gap-2 mb-2">
							<h1 className="text-lg font-semibold text-default-900">
								{tag.name}
							</h1>
							<Tooltip
								content={t("smart_tags_detail_edit_tooltip", "Editar etiqueta")}
								placement="top"
							>
								<Button
									isIconOnly
									variant="light"
									color="default"
									onPress={handleOpenEditModal}
									className="!w-5 !h-5 !min-w-5 !min-h-5 p-0 flex items-center justify-center"
								>
									<IconComponent
										icon="solar:pen-new-square-outline"
										className="text-default-400"
										style={{ width: "14px", height: "14px" }}
									/>
								</Button>
							</Tooltip>
						</div>
						<div className="flex flex-col gap-2">
							<div className="flex items-center gap-2 flex-wrap">
								<Chip
									size="sm"
									variant="flat"
									color={
										tag.status === "active"
											? "success"
											: tag.status === "draft"
												? "warning"
												: "danger"
									}
								>
									{tag.status === "active"
										? t("smart_tags_status_active", "Activa")
										: tag.status === "draft"
											? t("smart_tags_status_draft", "Deprecada")
											: t("smart_tags_status_inactive", "Inactiva")}
								</Chip>
								<Chip
									size="sm"
									variant="flat"
									className={getTypeColor(tag.type)}
								>
									{getTypeLabel(tag.type)}
								</Chip>
								{tag.isTemporary && (
									<Tooltip
										content={t("smart_tags_detail_temporary_tooltip", {
											days: tag.temporaryDuration,
										})}
										placement="top"
									>
										<Chip
											size="sm"
											variant="flat"
											color="warning"
											startContent={
												<IconComponent
													icon="solar:clock-circle-bold"
													size="sm"
												/>
											}
										>
											{t("smart_tags_detail_temporary_chip", {
												days: tag.temporaryDuration,
											})}
										</Chip>
									</Tooltip>
								)}
							</div>
							<div className="flex items-center gap-2">
								{tag.applicableEntities.map((entity, index) => {
									const config = APPLICABLE_ENTITY_CONFIG[entity];
									const label = config?.translationKey
										? t(config.translationKey, entity)
										: entity;
									return (
										<React.Fragment key={entity}>
											{index > 0 && (
												<span className="text-sm text-default-400 mx-1">•</span>
											)}
											<span className="text-sm text-default-700">{label}</span>
										</React.Fragment>
									);
								})}
							</div>
						</div>
					</div>
					<Tooltip
						content={t(
							"smart_tags_detail_assign_disabled_tooltip",
							"No se puede asignar una etiqueta inactiva"
						)}
						isDisabled={tag.status !== "inactive"}
					>
						<Button
							variant="light"
							color="primary"
							onPress={() => setShowAssignModal(true)}
							startContent={<IconComponent icon="solar:add-circle-outline" />}
							isDisabled={tag.status !== "active"}
						>
							{t("smart_tags_detail_assign_button", "Asignar etiqueta")}
						</Button>
					</Tooltip>
				</div>

				{/* Description */}
				<div className="mb-4">
					<p className="text-sm text-default-900 leading-relaxed">
						{tag.description}
					</p>
				</div>

				{/* Keywords */}
				<div>
					<h3 className="text-sm font-semibold text-default-900 mb-2 tracking-wide">
						{t("smart_tags_detail_keywords_title", "Palabras clave")}
					</h3>
					<div className="flex flex-wrap gap-2">
						{tag.keywords.map((keyword, index) => (
							<Chip
								key={index}
								size="sm"
								variant="bordered"
								className="text-xs border-1"
							>
								{keyword}
							</Chip>
						))}
					</div>
				</div>
			</div>

			{/* Usage History Section */}
			<div className="p-6 bg-white dark:bg-default-50 rounded-lg border border-default-200 shadow-sm">
				{/* Main Tabs */}
				<div className="mb-6">
					<Tabs
						selectedKey={historyTab}
						onSelectionChange={(key) =>
							setHistoryTab(key as "clients" | "statistics")
						}
					>
						<Tab
							key="clients"
							title={t("smart_tags_detail_tab_history", "Historial de uso")}
						/>
						<Tab
							key="statistics"
							title={t("smart_tags_detail_tab_statistics", "Estadísticas")}
						/>
					</Tabs>
				</div>

				{/* Sub-tabs with underlined style - only visible when in historyTab */}
				{historyTab === "clients" && (
					<div className="mb-4">
						<Tabs
							selectedKey={historySubTab}
							onSelectionChange={(key) =>
								setHistorySubTab(key as HistorySubTabKey)
							}
							variant="underlined"
							classNames={{
								tabList: "gap-6",
								cursor: "bg-primary",
								tab: "h-10",
							}}
						>
							<Tab
								key="clients"
								title={
									<div className="flex items-center gap-2">
										<span>
											{t("smart_tags_detail_subtab_clients", "Clientes")}
										</span>
										{historyCounts.clients > 0 && (
											<Chip
												size="sm"
												className="bg-primary-100 text-primary-700"
												variant="flat"
											>
												{historyCounts.clients}
											</Chip>
										)}
									</div>
								}
							/>
							<Tab
								key="conversations"
								title={
									<div className="flex items-center gap-2">
										<span>
											{t(
												"smart_tags_detail_subtab_conversations",
												"Conversaciones"
											)}
										</span>
										{historyCounts.conversations > 0 && (
											<Chip
												size="sm"
												className="bg-purple-100 text-purple-700"
												variant="flat"
											>
												{historyCounts.conversations}
											</Chip>
										)}
									</div>
								}
							/>
							<Tab
								key="notes"
								title={
									<div className="flex items-center gap-2">
										<span>{t("smart_tags_detail_subtab_notes", "Notas")}</span>
										{historyCounts.notes > 0 && (
											<Chip
												size="sm"
												className="bg-amber-100 text-amber-700"
												variant="flat"
											>
												{historyCounts.notes}
											</Chip>
										)}
									</div>
								}
							/>
						</Tabs>
					</div>
				)}

				{/* Statistics Tab Content */}
				{historyTab === "statistics" && (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
						{STATISTICS_CARDS_CONFIG.map((card) => (
							<div
								key={card.key}
								className="p-3 bg-white dark:bg-default-50 rounded-lg border border-default-200"
							>
								<div className="flex items-start justify-between mb-2">
									<div className="flex items-center gap-2">
										<p className="text-sm text-default-700 font-medium">
											{t(card.titleKey)}
										</p>
										<Tooltip content={t(card.tooltipKey)}>
											<IconComponent
												icon="solar:info-circle-line-duotone"
												className="text-default-400"
												width={16}
												height={16}
											/>
										</Tooltip>
									</div>
									<div className={`p-2 ${card.iconBgColor} rounded-lg`}>
										<IconComponent
											icon={card.icon}
											className={card.iconColor}
											width={20}
											height={20}
										/>
									</div>
								</div>
								<p className="text-3xl font-bold text-default-900">
									{statistics[card.valueKey]}
								</p>
							</div>
						))}
					</div>
				)}

				{/* History Table */}
				{historyTab === "clients" && (
					<TagHistoryTable
						assignments={currentAssignments}
						isLoading={isLoadingAssignments}
						error={assignmentError}
						page={page}
						onPageChange={setPage}
						rowsPerPage={rowsPerPage}
						historySubTab={historySubTab}
					/>
				)}
			</div>

			{/* Assignment Modal */}
			{tagId && (
				<AssignSmartTagModal
					isOpen={showAssignModal}
					onClose={() => setShowAssignModal(false)}
					tagId={tagId}
					onAssign={handleAssign}
				/>
			)}

			{/* Edit Modal */}
			<EditSmartTagModal
				isOpen={showEditModal}
				onClose={() => {
					setShowEditModal(false);
				}}
				onSubmit={handleUpdateTag}
				tag={tag}
				isLoading={isLoadingById}
			/>
		</div>
	);
};

export default SmartTagDetailPage;
