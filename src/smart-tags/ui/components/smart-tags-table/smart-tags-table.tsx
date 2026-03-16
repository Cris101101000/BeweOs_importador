import {
	Button,
	Chip,
	IconComponent,
	Pagination,
	type Selection,
	type SortDescriptor,
	Tab,
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
	Tabs,
	Tooltip,
} from "@beweco/aurora-ui";
import { useTranslate } from "@tolgee/react";
import React, { useState, useMemo, useCallback, useEffect } from "react";
import { APPLICABLE_ENTITY_CONFIG } from "../../../domain/constants/applicable-entity.config";
import type { ISmartTag } from "../../../domain/interfaces/smart-tags-interface";
import {
	DEFAULT_TAG_FIELDS,
	type SmartTagField,
	type SmartTagsTableProps,
	isValidSmartTagTabKey,
} from "../../../domain/types/smart-tags-table.types";
import { getApplicableEntityValues } from "../../../infrastructure/utils/applicable-entity.util";
import {
	getSmartTagTypeChipColor,
	getSmartTagTypeLabel,
} from "../../../infrastructure/utils/smart-tag-types.util";
import { useSmartTagsFilters } from "../../contexts/smart-tags-filters.context";
import { SmartTagsTableTop } from "../smart-tags-filter-drawer/_internal/smart-tags-table-top.component";
import { SmartTagsFilterDrawer } from "../smart-tags-filter-drawer/smart-tags-filter-drawer.component";
import { ViewSkeleton } from "@shared/ui/components/view-skeleton";

export const SmartTagsTable: React.FC<SmartTagsTableProps> = ({
	tags,
	isLoading = false,
	onView,
	onEdit,
	onDelete,
	onDeleteTags,
	onCreateNew,
	selectedTab: selectedTabProp = "all",
	onTabChange: onTabChangeProp,
	filtersConfig,
	currentFilters,
	onApplyFilters,
	onClearFilters,
	searchValue = "",
	onSearchChange,
	pagination,
	onPageChange,
}) => {
	const { t } = useTranslate();

	// Use server-side pagination if provided
	const useServerPagination =
		pagination !== undefined && onPageChange !== undefined;
	// Get filters context
	const {
		handleOpenFilterDrawer,
		isFilterOpen,
		handleCloseFilterDrawer,
		handleApplyFilters,
		appliedFilters,
	} = useSmartTagsFilters();

	// Column management state
	const [fields, setFields] = useState<SmartTagField[]>(DEFAULT_TAG_FIELDS);

	// Tabs state - use prop if provided, otherwise use local state
	const [localSelectedTab, setLocalSelectedTab] = useState<string>("all");
	const selectedTab =
		selectedTabProp !== undefined ? selectedTabProp : localSelectedTab;
	const setSelectedTab = onTabChangeProp || setLocalSelectedTab;

	// Generate tabs dynamically from enum
	const tabs = useMemo(() => {
		const allTab = {
			key: "all",
			title: t("smart_tags_tab_all", "Todas"),
		};

		const entityTabs = getApplicableEntityValues().map((entity) => {
			const translationKey = APPLICABLE_ENTITY_CONFIG[entity]?.translationKey;
			const capitalizedFallback =
				entity.charAt(0).toUpperCase() + entity.slice(1).toLowerCase();
			const title = translationKey
				? t(translationKey, capitalizedFallback)
				: capitalizedFallback;

			return {
				key: entity,
				title,
				entity,
			};
		});

		return [allTab, ...entityTabs];
	}, [t]);

	// Selection state
	const [selectedKeys, setSelectedKeys] = useState<Selection>(
		new Set<string>()
	);

	// Sorting state
	const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
		column: "name",
		direction: "ascending",
	});

	// Pagination state
	const [page, setPage] = useState(1);
	const rowsPerPage = 10;

	// Handle column visibility change
	const handleFieldVisibilityChange = useCallback(
		(fieldKey: string, visible: boolean) => {
			setFields((prevFields) =>
				prevFields.map((field) =>
					field.key === fieldKey ? { ...field, isVisible: visible } : field
				)
			);
		},
		[]
	);

	// Update 'assignedTo' column visibility based on selected tab
	useEffect(() => {
		setFields((prevFields) =>
			prevFields.map((field) =>
				field.key === "assignedTo"
					? { ...field, isVisible: selectedTab === "all" }
					: field
			)
		);
	}, [selectedTab]);

	// Reset pagination to page 1 when tab changes
	useEffect(() => {
		setPage(1);
	}, [selectedTab]);

	// Smart tag type helpers - using centralized configuration with translation
	const getTypeColor = getSmartTagTypeChipColor;
	const getTypeLabel = getSmartTagTypeLabel;

	// Sort tags directly (filtering will be handled by TopContent component later)
	const sortedTags = useMemo(() => {
		return [...tags].sort((a, b) => {
			const column = sortDescriptor.column as
				| keyof ISmartTag
				| "origin"
				| "assignedTo";
			let first: string | number | Date | boolean;
			let second: string | number | Date | boolean;

			// Handle special columns
			if (column === "origin") {
				first = a.isCustom;
				second = b.isCustom;
			} else if (column === "status") {
				// Define order for status: active > draft > inactive
				const statusOrder = { active: 0, draft: 1, inactive: 2 };
				first = statusOrder[a.status as keyof typeof statusOrder] ?? 3;
				second = statusOrder[b.status as keyof typeof statusOrder] ?? 3;
			} else if (column === "type") {
				// Sort by type label for better readability
				first = getTypeLabel(a.type);
				second = getTypeLabel(b.type);
			} else if (column === "assignedTo") {
				// Sort by number of applicable entities (more entities = higher priority)
				const getAssignmentPriority = (tag: ISmartTag) => {
					const entityCount = tag.applicableEntities.length;
					return -entityCount;
				};
				first = getAssignmentPriority(a);
				second = getAssignmentPriority(b);
			} else {
				first = a[column as keyof ISmartTag] as string | number | Date;
				second = b[column as keyof ISmartTag] as string | number | Date;
			}

			// Handle different column types
			if (column === "createdAt") {
				first = new Date(first as Date).getTime();
				second = new Date(second as Date).getTime();
			} else if (column === "usageCount") {
				first = Number(first);
				second = Number(second);
			} else if (typeof first === "string" && typeof second === "string") {
				first = first.toLowerCase();
				second = second.toLowerCase();
			} else if (typeof first === "boolean" && typeof second === "boolean") {
				// For origin: false (Linda AI) comes before true (Manual) in ascending
				first = first ? 1 : 0;
				second = second ? 1 : 0;
			}

			const cmp = first < second ? -1 : first > second ? 1 : 0;
			return sortDescriptor.direction === "descending" ? -cmp : cmp;
		});
	}, [tags, sortDescriptor]);

	// Paginate sorted tags - use server pagination if available
	const paginatedTags = useMemo(() => {
		if (useServerPagination) {
			// Server-side pagination: tags already come paginated from the server
			return sortedTags;
		}

		// Client-side pagination (fallback)
		const start = (page - 1) * rowsPerPage;
		const end = start + rowsPerPage;
		return sortedTags.slice(start, end);
	}, [sortedTags, page, rowsPerPage, useServerPagination]);

	// Calculate total pages - use server pagination if available
	const totalPages = useMemo(() => {
		if (useServerPagination && pagination) {
			return pagination.totalPages;
		}
		return Math.ceil(sortedTags.length / rowsPerPage);
	}, [useServerPagination, pagination, sortedTags.length, rowsPerPage]);

	// Current page - use server pagination if available
	const currentPage =
		useServerPagination && pagination ? pagination.page : page;

	// Handle page change
	const handlePageChangeInternal = useCallback(
		(newPage: number) => {
			if (useServerPagination && onPageChange) {
				onPageChange(newPage);
			} else {
				setPage(newPage);
			}
		},
		[useServerPagination, onPageChange]
	);

	// Get visible columns only
	const visibleColumns = useMemo(() => {
		return fields.filter((field) => field.isVisible);
	}, [fields]);

	// Render cell content
	const renderCell = useCallback(
		(tag: ISmartTag, columnKey: React.Key) => {
			switch (columnKey) {
				case "color":
					return (
						<div
							className="w-4 h-4 rounded-full"
							style={{ backgroundColor: tag.color }}
							title={tag.color}
						/>
					);
				case "name":
					return (
						<span className="text-sm font-medium text-default-900">
							{tag.name}
						</span>
					);
				case "status":
					return (
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
					);
				case "type":
					return (
						<Chip size="sm" variant="flat" className={getTypeColor(tag.type)}>
							{getTypeLabel(tag.type)}
						</Chip>
					);
				case "assignedTo":
					return (
						<div className="flex items-center gap-2">
							{tag.applicableEntities.map((entity, index) => {
								const config = APPLICABLE_ENTITY_CONFIG[entity];
								const label = config?.translationKey
									? t(config.translationKey, entity)
									: entity;
								return (
									<React.Fragment key={entity}>
										{index > 0 && (
											<span className="text-sm text-default-400">•</span>
										)}
										<span className="text-sm text-default-700">{label}</span>
									</React.Fragment>
								);
							})}
						</div>
					);
				case "origin":
					return tag.isCustom ? (
						<Chip
							size="sm"
							variant="flat"
							color="default"
							className="bg-blue-50 text-blue-700 border-blue-200"
							startContent={
								<IconComponent
									icon="solar:user-bold"
									size="sm"
									className="text-blue-600"
								/>
							}
						>
							{t("smart_tags_origin_manual", "Manual")}
						</Chip>
					) : (
						<Chip
							size="sm"
							variant="flat"
							color="secondary"
							className="bg-purple-50 text-purple-700 border-purple-200"
							startContent={
								<IconComponent
									icon="solar:magic-stick-3-bold"
									size="sm"
									className="text-purple-600"
								/>
							}
						>
							{t("smart_tags_origin_ai", "Linda AI")}
						</Chip>
					);
				case "description":
					return (
						<span className="text-sm text-default-600 line-clamp-2">
							{tag.description}
						</span>
					);
				case "keywords":
					return (
						<div className="flex flex-wrap gap-1">
							{tag.keywords.slice(0, 3).map((keyword, index) => (
								<Chip
									key={index}
									size="sm"
									variant="bordered"
									className="text-xs"
								>
									{keyword}
								</Chip>
							))}
							{tag.keywords.length > 3 && (
								<Chip size="sm" variant="flat" className="text-xs">
									+{tag.keywords.length - 3}
								</Chip>
							)}
						</div>
					);
				case "usageCount":
					return (
						<span className="text-sm text-default-700 font-medium">
							{tag.usageCount}
						</span>
					);
				case "createdAt":
					return (
						<span className="text-sm text-default-600">
							{new Date(tag.createdAt).toLocaleDateString("es-ES", {
								day: "2-digit",
								month: "2-digit",
								year: "numeric",
							})}
						</span>
					);
				case "actions":
					return (
						<div className="flex items-center gap-1">
							<Tooltip
								content={t("smart_tags_table_tooltip_view", "Ver detalles")}
							>
								<Button
									variant="light"
									color="default"
									size="sm"
									isIconOnly
									onPress={() => onView(tag)}
									startContent={
										<IconComponent
											icon="solar:eye-outline"
											size="sm"
											className="text-default-600"
										/>
									}
									className="min-w-2 w-auto h-auto"
								/>
							</Tooltip>
							<Tooltip content={t("smart_tags_table_tooltip_edit", "Editar")}>
								<Button
									variant="light"
									color="default"
									size="sm"
									isIconOnly
									onPress={() => onEdit(tag)}
									startContent={
										<IconComponent
											icon="solar:pen-new-square-outline"
											size="sm"
											className="text-default-400"
										/>
									}
								/>
							</Tooltip>
							{/* Only show delete button for custom (manual) tags */}
							{tag.isCustom && (
								<Tooltip
									content={t("smart_tags_table_tooltip_delete", "Eliminar")}
								>
									<Button
										variant="light"
										size="sm"
										color="danger"
										isIconOnly
										onPress={() => onDelete(tag)}
										startContent={
											<IconComponent
												icon="solar:trash-bin-minimalistic-outline"
												size="sm"
											/>
										}
									/>
								</Tooltip>
							)}
						</div>
					);
				default:
					return null;
			}
		},
		[onView, onEdit, onDelete]
	);

	// Disable selection for Linda AI tags (only custom/manual tags can be selected and deleted)
	const disabledKeys = useMemo(() => {
		return new Set(tags.filter((tag) => !tag.isCustom).map((tag) => tag.id));
	}, [tags]);

	// Row action handler - view tag details
	const handleRowAction = useCallback((key: React.Key) => {
		const tag = tags.find(t => t.id === String(key));
		if (tag) {
			onView(tag);
		}
	}, [tags, onView]);

	// Handle bulk delete
	const handleBulkDelete = useCallback(async () => {
		if (!onDeleteTags) {
			console.warn("onDeleteTags handler not provided");
			return;
		}

		// Convert selectedKeys to array of IDs
		let tagIds: string[] = [];

		if (selectedKeys === "all") {
			// If 'all' is selected, get IDs of all selectable tags (only custom tags)
			tagIds = tags.filter((tag) => tag.isCustom).map((tag) => tag.id);
		} else {
			// Convert Set to array
			tagIds = Array.from(selectedKeys as Set<string>);
		}

		if (tagIds.length === 0) {
			console.warn("No tags selected for deletion");
			return;
		}

		try {
			await onDeleteTags(tagIds);
			// Clear selection after successful deletion
			setSelectedKeys(new Set<string>());
		} catch (error) {
			console.error("Error deleting tags:", error);
			// Error handling is done by the parent component (toast notifications, etc.)
		}
	}, [selectedKeys, tags, onDeleteTags]);

	return (
		<div className="w-full space-y-4">
			{/* Table */}
			{isLoading ? (
				<ViewSkeleton variant="table" />
			) : (
				<>
					{/* Tabs - Dynamically generated from ApplicableEntity enum */}
					<Tabs
						selectedKey={selectedTab}
						onSelectionChange={(key) => {
							const tabKey = String(key);
							if (isValidSmartTagTabKey(tabKey)) {
								setSelectedTab(tabKey);
							}
						}}
					>
						{tabs.map((tab) => (
							<Tab key={tab.key} className="w-40" title={tab.title} />
						))}
					</Tabs>

					{/* Top Controls Bar */}
					<SmartTagsTableTop
						filterSelectedKeys={selectedKeys}
						fields={fields}
						setFieldVisibility={handleFieldVisibilityChange}
						handleOpenFilterDrawer={handleOpenFilterDrawer}
						onCreateNew={onCreateNew}
						onBulkDelete={handleBulkDelete}
						filtersConfig={filtersConfig}
						currentFilters={currentFilters}
						onApplyFilters={onApplyFilters}
						onClearFilters={onClearFilters}
						searchValue={searchValue}
						onSearchChange={onSearchChange}
					/>

					<Table
						aria-label={t(
							"smart_tags_table_aria",
							"Tabla de etiquetas inteligentes"
						)}
						sortDescriptor={sortDescriptor}
						onSortChange={setSortDescriptor}
						selectionMode="multiple"
						selectedKeys={selectedKeys}
						onSelectionChange={setSelectedKeys}
						disabledKeys={disabledKeys}
						onRowAction={handleRowAction}
						classNames={{
							wrapper: "min-h-[400px]",
						}}
					>
						<TableHeader columns={visibleColumns}>
							{(column) => (
								<TableColumn
									key={column.key}
									allowsSorting={column.sortable}
									width={column.width}
								>
									{column.label}
								</TableColumn>
							)}
						</TableHeader>
						<TableBody
							items={paginatedTags}
							emptyContent={
								<div className="text-center py-12">
									<IconComponent
										icon="solar:hashtag-square-outline"
										size="lg"
										className="text-default-300 mx-auto mb-3"
									/>
									<h4 className="text-lg font-semibold text-default-700 mb-2">
										{t(
											"smart_tags_table_empty_title",
											"No tienes etiquetas configuradas"
										)}
									</h4>
									<p className="text-default-500 mb-4">
										{t(
											"smart_tags_table_empty_description",
											"Crea tu primera etiqueta para clasificar automáticamente las conversaciones"
										)}
									</p>
									<Button color="primary" onPress={onCreateNew}>
										{t(
											"smart_tags_table_empty_button",
											"Crear primera etiqueta"
										)}
									</Button>
								</div>
							}
						>
							{(item) => (
								<TableRow key={item.id}>
									{(columnKey) => (
										<TableCell>{renderCell(item, columnKey)}</TableCell>
									)}
								</TableRow>
							)}
						</TableBody>
					</Table>
				</>
			)}

			{/* Pagination */}
			{totalPages > 1 && (
				<div className="flex justify-center">
					<Pagination
						total={totalPages}
						page={currentPage}
						onChange={handlePageChangeInternal}
						showControls
					/>
				</div>
			)}

			{/* Filter Drawer */}
			<SmartTagsFilterDrawer
				isOpen={isFilterOpen}
				onClose={handleCloseFilterDrawer}
				onApplyFilters={handleApplyFilters}
				currentFilters={appliedFilters}
			/>
		</div>
	);
};
