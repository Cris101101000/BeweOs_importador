import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslate } from '@tolgee/react';
import { Button, IconComponent, useAuraToast } from '@beweco/aurora-ui';
import { PageHeader } from '@shared/ui/components/page-header';
import { SmartTagsTable } from '../components/smart-tags-table/smart-tags-table.tsx';
import { SmartTagsFiltersProvider } from '../contexts/smart-tags-filters.context';
import { 
	CreateSmartTagModal, 
	type CreateSmartTagFormData
 } from '../components/create-smart-tag-modal/create-smart-tag-modal.component.tsx';
import { 
	EditSmartTagModal, 
	type EditSmartTagFormData 
} from '../components/edit-smart-tag-modal/edit-smart-tag-modal.component.tsx';
import { DeleteSmartTagModal } from '../components/delete-smart-tag-modal/delete-smart-tag-modal.component.tsx';
import { useSmartTags } from '../hooks/use-smart-tags-hook.ts';
import { useSmartTagsFiltersConfig } from '../hooks/use-smart-tags-filters-config.hook.ts';
import type { 
	SmartTagsTableFilters, ISmartTag 
} from '../../domain/interfaces/smart-tags-interface.ts';
import type { SmartTagsFilters } from '../../infrastructure/adapters/smart-tags.adapter.ts';
import type { SmartTagTabKey } from '../../domain/types/smart-tags-table.types.ts';
import { SmartTagStatus } from '../../domain/enums/smart-tag-status.enum.ts';
import { 
	configureSuccessToast, 
	configureWarningToast, 
	configureErrorToastWithTranslation 
} from '../../../shared/utils/toast-config.utils.ts';
import { EnumErrorType } from '@shared/domain/enums';
import { mapToApplicableEntities } from '../../infrastructure/utils/applicable-entities-mapper.util.ts';
import { getApiValueFromEntity } from '../../infrastructure/utils/applicable-entity.util.ts';

export const SmartTagsPage = () => {
	const navigate = useNavigate();
	const { showToast } = useAuraToast();
	const { t } = useTranslate();

	const [selectedTab, setSelectedTab] = useState<SmartTagTabKey>("all");

	// Generate filters configuration
	const { filtersConfig } = useSmartTagsFiltersConfig();

	// State for search (separate from drawer filters)
	const [searchValue, setSearchValue] = useState<string>("");

	// State for API filters (from DrawerFilters)
	const [apiFilters, setApiFilters] = useState<Partial<SmartTagsFilters>>({});

	// State for server-side pagination
	const [currentPage, setCurrentPage] = useState(1);
	const ITEMS_PER_PAGE = 20;

	// Convert tab selection to applicableEntities filter
	// Uses dynamic dictionary mapping instead of hardcoded switch cases
	const getApplicableEntitiesFilter = (
		tab: SmartTagTabKey
	): string[] | undefined => {
		if (tab === "all") {
			return undefined; // No filter, show all
		}

		// Use dynamic dictionary to map tab value to API value
		const apiValue = getApiValueFromEntity(tab);
		return apiValue ? [apiValue] : undefined;
	};

	// Build filters object based on selected tab, API filters, search, and pagination
	const filters = useMemo(
		() => ({
			applicableEntities: getApplicableEntitiesFilter(selectedTab),
			...apiFilters, // Merge API filters from DrawerFilters
			// Add search as title filter if search value exists
			...(searchValue.trim() && { title: searchValue.trim() }),
			// Add pagination
			limit: ITEMS_PER_PAGE,
			offset: (currentPage - 1) * ITEMS_PER_PAGE,
		}),
		[selectedTab, apiFilters, searchValue, currentPage]
	);

	const {
		smartTags,
		pagination,
		isLoading: smartTagsLoading,
		createSmartTag,
		updateSmartTag,
		deleteSmartTag,
		deleteSmartTags,
		reload: refetchSmartTags,
	} = useSmartTags(filters);

	// State for smart tags filters (for context compatibility)
	const [appliedSmartTagsFilters, setAppliedSmartTagsFilters] = useState<
		Partial<SmartTagsTableFilters>
	>({});
	
	// Handle filters from DrawerFilters - filters are already mapped to API format by SmartTagsTableTop
	const handleApplyFilters = useCallback(
		(apiFiltersFromTop: Record<string, any>) => {
			setApiFilters(apiFiltersFromTop as Partial<SmartTagsFilters>);
			setAppliedSmartTagsFilters(apiFiltersFromTop as any);
			// Reset to first page when filters change
			setCurrentPage(1);
		},
		[]
	);

	// Handle clear filters
	const handleClearFilters = useCallback(() => {
		console.log("Clearing all smart tags filters");
		setApiFilters({});
		setAppliedSmartTagsFilters({});
		// Also clear search when clearing filters
		setSearchValue("");
		// Reset to first page
		setCurrentPage(1);
	}, []);

	// Handle search change (separate from drawer filters)
	const handleSearchChange = useCallback((search: string) => {
		setSearchValue(search);
		// Reset to first page when search changes
		setCurrentPage(1);
	}, []);

	// Handle page change for server-side pagination
	const handlePageChange = useCallback((page: number) => {
		setCurrentPage(page);
	}, []);

	// Handle tab change (reset page when tab changes)
	const handleTabChange = useCallback((tab: SmartTagTabKey) => {
		setSelectedTab(tab);
		setCurrentPage(1);
	}, []);

	// Modal states
	const [showCreateModal, setShowCreateModal] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [selectedTag, setSelectedTag] = useState<ISmartTag | null>(null);

	// Check if a similar tag already exists
	const checkDuplicateTag = useCallback(
		(tagName: string, excludeId?: string): ISmartTag | null => {
			const normalizedName = tagName.toLowerCase().trim();

			return (
				smartTags.find((tag) => {
					if (excludeId && tag.id === excludeId) return false;
					const existingName = tag.name.toLowerCase().trim();
					// Exact match or very similar (contains or is contained)
					return (
						existingName === normalizedName ||
						existingName.includes(normalizedName) ||
						normalizedName.includes(existingName)
					);
				}) || null
			);
		},
		[smartTags]
	);

	const handleCreateTag = useCallback(
		async (formData: CreateSmartTagFormData) => {
			// Check for duplicate or similar tags
			const duplicateTag = checkDuplicateTag(formData.name);
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

			// Parse keywords from comma-separated string to array
			const keywordsArray = formData.keywords
				? formData.keywords
						.split(",")
						.map((k) => k.trim())
						.filter((k) => k.length > 0)
				: [];

			// Map form data to ISmartTag structure
			// Note: API accepts only one type, so we use the first selected type
			const tagData = {
				name: formData.name.trim(),
				description: formData.description.trim(),
				keywords: keywordsArray,
				color: formData.color,
				type: formData.types[0], // Use first selected type
				status: SmartTagStatus.INACTIVE, // Default to INACTIVE as per API example
				applicableEntities: mapToApplicableEntities(
					formData.applicableEntities
				),
				isCustom: true, // User-created tags are custom
				isTemporary: formData.isTemporary,
				temporaryDuration:
					formData.isTemporary && formData.temporaryDuration
						? Number.parseInt(formData.temporaryDuration, 10)
						: undefined,
				// Pass applicableEntities array directly to mapper via temporary property
				_applicableEntitiesOverride: formData.applicableEntities,
			} as Omit<ISmartTag, "id" | "createdAt" | "updatedAt"> & {
				_applicableEntitiesOverride?: string[];
			};

			await createSmartTag(tagData);

			showToast(
				configureSuccessToast(
					t("smart_tags_toast_created_title", "Etiqueta creada"),
					t("smart_tags_toast_created_description", { name: formData.name })
				)
			);

			setShowCreateModal(false);

			// Refresh the tags list
			await refetchSmartTags();
		},
		[createSmartTag, checkDuplicateTag, showToast, refetchSmartTags]
	);

	const handleCreateNew = useCallback(() => {
		setShowCreateModal(true);
	}, []);

	const handleView = (tag: ISmartTag) => {
		navigate(`/intelligent-tags/${tag.id}`, {
			state: { tag },
		});
	};

	const handleEdit = useCallback((tag: ISmartTag) => {
		setSelectedTag(tag);
		setShowEditModal(true);
	}, []);

	const handleUpdateTag = useCallback(
		async (formData: EditSmartTagFormData) => {
			if (!selectedTag) {
				return;
			}

			// Only check for duplicates if the name has actually changed
			const nameHasChanged =
				formData.name.trim().toLowerCase() !==
				selectedTag.name.trim().toLowerCase();

			if (nameHasChanged) {
				// Check for duplicate or similar tags (excluding the current tag being edited)
				const duplicateTag = checkDuplicateTag(formData.name, selectedTag.id);

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
				await updateSmartTag(selectedTag.id, updates);

				showToast(
					configureSuccessToast(
						t("smart_tags_toast_updated_title", "Etiqueta actualizada"),
						t("smart_tags_toast_updated_description", { name: formData.name })
					)
				);

				setShowEditModal(false);
				setSelectedTag(null);

				// Refresh the tags list
				await refetchSmartTags();
			} catch (error) {
				// Error is already handled by the hook/adapter
				// Re-throw to prevent modal from closing
				throw error;
			}
		},
		[
			selectedTag,
			checkDuplicateTag,
			showToast,
			updateSmartTag,
			refetchSmartTags,
		]
	);

	const handleDelete = useCallback((tag: ISmartTag) => {
		setSelectedTag(tag);
		setShowDeleteModal(true);
	}, []);

	const handleConfirmDelete = useCallback(async () => {
		if (selectedTag) {
			await deleteSmartTag(selectedTag.id);
			showToast(
				configureSuccessToast(
					t("smart_tags_toast_deleted_title", "Etiqueta eliminada"),
					t(
						"smart_tags_toast_deleted_description",
						"La etiqueta inteligente se ha eliminado correctamente"
					)
				)
			);
			setShowDeleteModal(false);
			setSelectedTag(null);
		}
	}, [selectedTag, deleteSmartTag, showToast, t]);

	const handleDeleteTags = useCallback(
		async (tagIds: string[]) => {
			if (!tagIds || tagIds.length === 0) {
				return;
			}

			try {
				await deleteSmartTags(tagIds);
				const count = tagIds.length;
				showToast(
					configureSuccessToast(
						count === 1
							? t("smart_tags_toast_deleted_title", "Etiqueta eliminada")
							: t(
									"smart_tags_toast_deleted_plural_title",
									"Etiquetas eliminadas"
								),
						count === 1
							? t(
									"smart_tags_toast_deleted_description",
									"La etiqueta inteligente se ha eliminado correctamente"
								)
							: t("smart_tags_toast_deleted_plural_description", { count })
					)
				);
				// Refresh the tags list
				await refetchSmartTags();
			} catch (error) {
				// Error is already handled by the hook/adapter
				showToast(
					configureWarningToast(
						t("smart_tags_toast_delete_error_title", "Error al eliminar"),
						t(
							"smart_tags_toast_delete_error_description",
							"Hubo un error al eliminar las etiquetas. Por favor, intenta de nuevo."
						)
					)
				);
			}
		},
		[deleteSmartTags, showToast, refetchSmartTags, t]
	);

	return (
		<div className="space-y-3 p-6">
			{/* Header */}
			<PageHeader
				title={t("smart_tags_page_title", "Etiquetas Inteligentes")}
				metadata={[
					{
						key: "total",
						label: smartTagsLoading ? "..." : String(pagination.total),
						color: "default",
						variant: "flat",
					},
					{
						key: "ai",
						label: "AI",
						color: "primary",
						variant: "flat",
					},
				]}
				actions={
					<Button
						color="primary"
						size="sm"
						onPress={handleCreateNew}
						startContent={
							<IconComponent icon="solar:add-circle-bold" size="sm" />
						}
					>
						{t("smart_tags_create_new", "Nueva etiqueta")}
					</Button>
				}
			/>

			{/* Description */}
			<p className="text-sm text-default-600 leading-relaxed">
				{t(
					"smart_tags_page_description",
					"Estas etiquetas se generan automáticamente a partir del comportamiento del cliente en sus conversaciones con Linda y su interacción con las campañas. Linda analiza patrones de comunicación, preferencias y respuestas para clasificar y segmentar a tus clientes de manera inteligente."
				)}
			</p>

			{/* Smart Tags Table */}
			<SmartTagsFiltersProvider
				smartTagsData={{
					result: smartTags,
					isLoading: smartTagsLoading,
					refetch: refetchSmartTags,
				}}
				onApplyFilters={setAppliedSmartTagsFilters}
				onResetFilters={() => setAppliedSmartTagsFilters({})}
				appliedFilters={appliedSmartTagsFilters}
			>
				<SmartTagsTable
					tags={smartTags}
					isLoading={smartTagsLoading}
					onView={handleView}
					onEdit={handleEdit}
					onDelete={handleDelete}
					onDeleteTags={handleDeleteTags}
					onCreateNew={handleCreateNew}
					selectedTab={selectedTab}
					onTabChange={handleTabChange}
					filtersConfig={filtersConfig}
					currentFilters={apiFilters}
					onApplyFilters={handleApplyFilters}
					onClearFilters={handleClearFilters}
					searchValue={searchValue}
					onSearchChange={handleSearchChange}
					pagination={pagination}
					onPageChange={handlePageChange}
				/>
			</SmartTagsFiltersProvider>

			{/* Create Modal */}
			<CreateSmartTagModal
				isOpen={showCreateModal}
				onClose={() => setShowCreateModal(false)}
				onSubmit={handleCreateTag}
				isLoading={smartTagsLoading}
			/>

			{/* Edit Modal */}
			<EditSmartTagModal
				isOpen={showEditModal}
				onClose={() => {
					setShowEditModal(false);
					setSelectedTag(null);
				}}
				onSubmit={handleUpdateTag}
				tag={selectedTag}
				isLoading={smartTagsLoading}
			/>

			{/* Delete Modal */}
			<DeleteSmartTagModal
				isOpen={showDeleteModal}
				onClose={() => {
					setShowDeleteModal(false);
					setSelectedTag(null);
				}}
				onConfirm={handleConfirmDelete}
				tag={selectedTag}
				isLoading={smartTagsLoading}
			/>
		</div>
	);
};
