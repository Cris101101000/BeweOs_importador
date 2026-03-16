import {
	Button,
	Divider,
	DrawerFilters,
	type DrawerFiltersProps,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
	IconComponent,
	Input,
	type Selection,
} from "@beweco/aurora-ui";
import { ColumnManager } from "@clients/ui/features/contact-list/components/column-manager/column-manager.component";
import { useTranslate } from "@tolgee/react";
import { type FC, useCallback, useEffect, useRef, useState } from "react";
import type { SmartTagField } from "../../../../domain/types/smart-tags-table.types";
import {
	countActiveFiltersFlexible,
	mapDrawerFiltersToSmartTagsFilter,
} from "../../../../infrastructure/mappers/drawer-filters-to-smart-tags-filter.mapper";
import { useSmartTagsFilters } from "../../../contexts/smart-tags-filters.context";

interface SmartTagsTableTopProps {
	filterSelectedKeys: Selection;
	fields: SmartTagField[];
	setFieldVisibility: (fieldKey: string, visible: boolean) => void;
	handleOpenFilterDrawer: () => void;
	onCreateNew: () => void;
	onBulkDelete?: () => void | Promise<void>;
	filtersConfig?: DrawerFiltersProps["config"];
	currentFilters?: Record<string, any>;
	onApplyFilters?: (filters: any) => void;
	onClearFilters?: () => void;
	searchValue?: string;
	onSearchChange?: (search: string) => void;
}

/**
 * SmartTagsTableTopContent Component
 *
 * Renders the top section of the smart tags table with:
 * - Search input with debouncing
 * - Selected items counter and bulk actions
 * - Filter controls
 * - Column management
 * - Create new tag button
 */
export const SmartTagsTableTop: FC<SmartTagsTableTopProps> = ({
	filterSelectedKeys,
	fields,
	setFieldVisibility,
	handleOpenFilterDrawer,
	onCreateNew,
	onBulkDelete,
	filtersConfig,
	currentFilters,
	onApplyFilters,
	onClearFilters,
	searchValue: searchValueProp = "",
	onSearchChange,
}) => {
	const { t } = useTranslate();

	// Get filters context (for backward compatibility)
	const { handleApplyFilters: contextHandleApplyFilters, appliedFilters } =
		useSmartTagsFilters();

	// State for DrawerFilters
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);

	// Calculate active filters count
	const activeFiltersCount = currentFilters
		? countActiveFiltersFlexible(currentFilters)
		: 0;

	// Handle apply filters from DrawerFilters
	const handleApplyFiltersFromDrawer = useCallback(
		(drawerFilters: Record<string, any>) => {
			// Map DrawerFilters format to API format
			const apiFilters = mapDrawerFiltersToSmartTagsFilter(drawerFilters);
			console.log("Smart tags filters applied:", apiFilters);

			// Use provided handler or context handler
			if (onApplyFilters) {
				onApplyFilters(apiFilters);
			} else {
				// Fallback to context handler if no prop provided
				contextHandleApplyFilters(apiFilters as any);
			}
			setIsDrawerOpen(false);
		},
		[onApplyFilters, contextHandleApplyFilters]
	);

	// Handle clear filters from DrawerFilters
	const handleClearFiltersFromDrawer = useCallback(() => {
		console.log("Clearing all smart tags filters");
		if (onClearFilters) {
			onClearFilters();
		}
		setIsDrawerOpen(false);
	}, [onClearFilters]);

	// Handle cancel from DrawerFilters
	const handleCancelFilters = useCallback(() => {
		console.log("Canceling filter changes");
		setIsDrawerOpen(false);
	}, []);

	// State for search functionality (local state for debouncing)
	const [localSearchValue, setLocalSearchValue] =
		useState<string>(searchValueProp);

	// Ref para manejar debouncing de search
	const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	// Sincroniza el valor local con el valor externo (resetea al limpiar search)
	useEffect(() => {
		setLocalSearchValue(searchValueProp);
	}, [searchValueProp]);

	// Función debounced para search
	const debouncedSearch = useCallback(
		(searchTerm: string) => {
			if (searchTimeoutRef.current) {
				clearTimeout(searchTimeoutRef.current);
			}

			searchTimeoutRef.current = setTimeout(() => {
				// Use provided handler or fallback to context
				if (onSearchChange) {
					onSearchChange(searchTerm.trim() || "");
				} else {
					// Fallback to context handler for backward compatibility
					contextHandleApplyFilters({
						search: searchTerm.trim() || undefined,
					} as any);
				}
			}, 600); // 600ms de debounce para búsqueda - buena práctica para UX
		},
		[onSearchChange, contextHandleApplyFilters]
	);

	// Cleanup del timeout en unmount
	useEffect(() => {
		return () => {
			if (searchTimeoutRef.current) {
				clearTimeout(searchTimeoutRef.current);
			}
		};
	}, []);

	/**
	 * Handles search input change with debouncing
	 * @param value - The search input value
	 */
	const handleSearchChange = useCallback(
		(value: string) => {
			setLocalSearchValue(value);
			debouncedSearch(value);
		},
		[debouncedSearch]
	);

	// Check if there are selected tags
	const hasSelectedTags =
		filterSelectedKeys === "all" || filterSelectedKeys.size > 0;
	const selectedCount =
		filterSelectedKeys === "all" ? 0 : filterSelectedKeys.size;

	/**
	 * Opens the bulk delete action
	 */
	const handleOpenBulkDelete = async () => {
		if (onBulkDelete) {
			await onBulkDelete();
		}
	};

	return (
		<div className="flex items-center gap-4 overflow-auto px-[6px] py-[4px] justify-between">
			{/* Left section: Search and selection info */}
			<div className="flex items-center gap-3">
				<Input
					className="flex-1 max-w-xs min-w-52"
					endContent={
						<IconComponent
							icon="solar:magnifer-outline"
							className="text-default-400"
							size="sm"
						/>
					}
					placeholder={t(
						"smart_tags_search_placeholder",
						"Buscar etiquetas..."
					)}
					value={localSearchValue}
					onValueChange={handleSearchChange}
				/>
				{hasSelectedTags && (
					<>
						<Divider className="h-5" orientation="vertical" />
						<div className="text-default-800 text-sm whitespace-nowrap">
							{filterSelectedKeys === "all"
								? t("smart_tags_all_selected", "Todas seleccionadas")
								: t("smart_tags_selected_count", {
										count: selectedCount || 0,
									})}
						</div>
						<Dropdown>
							<DropdownTrigger>
								<Button
									className="bg-default-100 text-default-800"
									endContent={
										<IconComponent
											className="text-default-400"
											icon="solar:alt-arrow-down-outline"
										/>
									}
									size="sm"
									variant="flat"
								>
									{t("smart_tags_selected_actions", "Acciones")}
								</Button>
							</DropdownTrigger>
							<DropdownMenu
								aria-label="Selected Actions"
								onAction={(key) => {
									if (key === "delete") {
										handleOpenBulkDelete();
									}
								}}
							>
								<DropdownItem
									key="delete"
									className="text-danger"
									textValue={t("smart_tags_action_delete", "Eliminar")}
								>
									{t("smart_tags_action_delete", "Eliminar")}
								</DropdownItem>
							</DropdownMenu>
						</Dropdown>
					</>
				)}
			</div>

			{/* Right section: Table controls */}
			<div className="flex items-center gap-4">
				{/* DrawerFilters Integration */}
				{filtersConfig && (
					<>
						<DrawerFilters
							config={filtersConfig as DrawerFiltersProps["config"]}
							onApplyFilters={handleApplyFiltersFromDrawer}
							onClearFilters={handleClearFiltersFromDrawer}
							onCancel={handleCancelFilters}
							isOpen={isDrawerOpen}
							onOpenChange={setIsDrawerOpen}
						/>
						{/* Filter button */}
						<Button
							variant="solid"
							className="bg-default-100 text-default-800"
							color="default"
							onPress={() => setIsDrawerOpen(true)}
							aria-label={t("button_filter", "Filtros")}
							size="sm"
							startContent={
								activeFiltersCount > 0 && (
									<span className="bg-primary text-primary-foreground text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
										{activeFiltersCount}
									</span>
								)
							}
							endContent={
								<IconComponent
									icon="solar:tuning-2-outline"
									size="sm"
									className="text-default-800"
								/>
							}
						>
							{t("button_filter", "Filtros")}
						</Button>
					</>
				)}

				{/* Fallback filter button if no filtersConfig */}
				{!filtersConfig && (
					<Button
						variant="solid"
						className="bg-default-100 text-default-800"
						color="default"
						onPress={handleOpenFilterDrawer}
						aria-label={t("button_filter", "Filtros")}
						size="sm"
						startContent={
							<IconComponent
								icon="solar:tuning-2-outline"
								size="sm"
								className="text-default-800"
							/>
						}
					>
						{t("button_filter", "Filtros")}
					</Button>
				)}

				{/* Column manager */}
				<ColumnManager
					fields={fields}
					onFieldVisibilityChange={setFieldVisibility}
					className="bg-default-100 text-default-800"
				/>
			</div>
		</div>
	);
};
