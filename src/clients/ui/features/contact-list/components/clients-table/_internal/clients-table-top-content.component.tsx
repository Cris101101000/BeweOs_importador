import {
	Button,
	Divider,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
	IconComponent,
	Input,
	type Selection,
	useAuraToast,
} from "@beweco/aurora-ui";
import { getUserId } from "@beweco/utils-js";
import { DeleteViewUseCase } from "@clients/application/delete-view.usecase";
import type { IField } from "@clients/domain/interfaces/field.interface";
import { ViewAdapter } from "@clients/infrastructure/adapters/view.adapter";
import type { ClientsTableFilters } from "@clients/ui/_shared/components/clients-filter-drawer/clients-filter-drawer.types";
import { useFilters } from "@clients/ui/_shared/contexts/filters.context";
import { useViewsContext } from "@clients/ui/_shared/contexts/views.context";
import { clientFilterToTableFilters } from "@clients/ui/_shared/mappers/client-filter-to-table-filters.mapper";
import { countActiveClientsFilters } from "@clients/ui/_shared/mappers/drawer-filters-to-clients-filter.mapper";
import { useDeleteClientsModal } from "@clients/ui/features/contact-list/hooks/use-delete-clients-modal.hook";
import { EnumErrorType } from "@shared/domain/enums/enum-error-type.enum";
import { ConfirmDeleteModal } from "@shared/ui/components/confirm-delete-modal/confirm-delete-modal";
import { ResponsiveButton } from "@shared/ui/components/responsive-button";
import { useConfirmDeleteModal } from "@shared/ui/store/useConfirmDeleteModal";
import {
	configureErrorToastWithTranslation,
	configureSuccessToast,
} from "@shared/utils";
import { useTranslate } from "@tolgee/react";
import {
	type FC,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { ColumnManager } from "../../column-manager/column-manager.component";
import { SavedViewsDropdown } from "../../saved-views-dropdown/saved-views-dropdown.component";

interface ClientsTableTopContentProps {
	filterSelectedKeys: Selection;
	fields: IField[];
	setFieldVisibility: (fieldKey: string, visible: boolean) => void;
	handleSaveView: () => void;
	handleOpenFilterModal: () => void;
	handleExport: () => void;
	handleOpenImportModal?: () => void;
	onClientsDeleted?: () => void;
	isExporting?: boolean;
}

/**
 * ClientsTableTopContent Component
 *
 * Renders the top section of the clients table with:
 * - Selected items counter and bulk actions
 * - Save view, filters, and column management controls
 */
export const ClientsTableTopContent: FC<ClientsTableTopContentProps> = ({
	filterSelectedKeys,
	fields,
	setFieldVisibility,
	handleSaveView,
	handleOpenFilterModal,
	handleExport,
	handleOpenImportModal,
	onClientsDeleted,
	isExporting = false,
}) => {
	const { t } = useTranslate();

	// Hook for delete functionality with modal
	const {
		isModalOpen,
		isDeleting,
		openModal,
		closeModal,
		confirmDelete,
		modalTitle,
		modalDescription,
		clientCount,
	} = useDeleteClientsModal();

	const { openModal: openConfirmViewDelete } = useConfirmDeleteModal();

	const { refetch } = useViewsContext();

	// Get filters context
	const {
		hasActiveFilters,
		handleApplyFilters,
		appliedFilters,
		handleResetFilters,
	} = useFilters();
	const { showToast } = useAuraToast();

	// Calculate active filters count
	const activeFiltersCount = useMemo(() => {
		return countActiveClientsFilters(appliedFilters);
	}, [appliedFilters]);

	// Get views from context (no need for session data here as context handles it)
	const { views, isLoading: isLoadingViews } = useViewsContext();

	// State to track the currently selected view
	const [selectedViewId, setSelectedViewId] = useState<string | null>(null);

	// State for search functionality
	const [searchValue, setSearchValue] = useState<string>("");

	// Ref para manejar debouncing de search
	const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
	// Ref para rastrear si había filtros activos anteriormente
	const prevHasActiveFiltersRef = useRef<boolean>(hasActiveFilters);

	// Función debounced para search
	const debouncedSearch = useCallback(
		(searchTerm: string) => {
			if (searchTimeoutRef.current) {
				clearTimeout(searchTimeoutRef.current);
			}

			searchTimeoutRef.current = setTimeout(() => {
				// Aplicar búsqueda a través del contexto de filtros
				handleApplyFilters({
					search: searchTerm.trim() || undefined,
				});
			}, 600); // 600ms de debounce para búsqueda - buena práctica para UX
		},
		[handleApplyFilters]
	);

	// Cleanup del timeout en unmount
	useEffect(() => {
		return () => {
			if (searchTimeoutRef.current) {
				clearTimeout(searchTimeoutRef.current);
			}
		};
	}, []);

	// Sincroniza el valor local con los filtros aplicados (resetea al limpiar filtros)
	useEffect(() => {
		setSearchValue(appliedFilters.search || "");
	}, [appliedFilters.search]);

	// Resetea la vista seleccionada cuando se limpian los filtros explícitamente
	useEffect(() => {
		// Esto detecta cuando se llama explícitamente a "limpiar filtros"
		if (
			prevHasActiveFiltersRef.current &&
			!hasActiveFilters &&
			selectedViewId !== null
		) {
			setSelectedViewId(null);
		}
		// Actualizar el ref con el estado actual
		prevHasActiveFiltersRef.current = hasActiveFilters;
	}, [hasActiveFilters, selectedViewId]);

	/**
	 * Handles view selection from the dropdown
	 * @param viewKey - The selected view key/id
	 */
	const handleViewSelect = useCallback(
		(viewKey: string) => {
			const selectedView = views.find(
				(view) => (view.id || view.name) === viewKey
			);

			if (selectedView) {
				setSelectedViewId(selectedView.id || selectedView.name);
				const tableFilters = clientFilterToTableFilters(selectedView.filters);
				handleApplyFilters(tableFilters as ClientsTableFilters); // Cast partial to full type as handleApplyFilters handles partial filters
			}
		},
		[views, handleApplyFilters]
	);

	const handleViewDelete = useCallback((viewKey: string, viewName: string) => {
		openConfirmViewDelete({
			title: t("clients_view_delete_title", "Eliminar vista"),
			description: t(
				"clients_view_delete_description",
				"¿Estás seguro de que deseas eliminar esta vista?"
			),
			itemName: viewName,
			onSuccess: () => {
				showToast(
					configureSuccessToast(
						t("clients_view_deleted_success", "Vista eliminada exitosamente")
					)
				);
			},
			onError: (error) => {
				showToast(
					configureErrorToastWithTranslation(
						EnumErrorType.Critical,
						t,
						error instanceof Error ? error.message : "try_again",
						"try_again"
					)
				);
			},
			onConfirm: async () => {
				const deleteViewUseCase = new DeleteViewUseCase(new ViewAdapter());
				await deleteViewUseCase.execute(viewKey, getUserId() || "");

				return await refetch();
			},
		});
	}, []);

	/**
	 * Handles search input change with debouncing
	 * @param value - The search input value
	 */
	const handleSearchChange = useCallback(
		(value: string) => {
			setSearchValue(value);
			debouncedSearch(value);
		},
		[debouncedSearch]
	);

	/**
	 * Handles clearing all filters
	 * Resets filters and clears selected view
	 */
	const handleClearFilters = useCallback(() => {
		handleResetFilters();
		setSelectedViewId(null);
	}, [handleResetFilters]);

	// Convert selected keys to array of client IDs
	const selectedClientIds = useMemo(() => {
		if (filterSelectedKeys === "all") {
			// For "all" selection, we would need access to all client IDs
			// This would typically come from the parent component
			return [];
		}
		return Array.from(filterSelectedKeys).map((key) => String(key));
	}, [filterSelectedKeys]);

	/**
	 * Opens the delete confirmation modal for selected clients
	 */
	const handleOpenDeleteModal = async () => {
		if (selectedClientIds.length === 0) return;
		openModal(selectedClientIds);
	};

	/**
	 * Executes the deletion of clients after confirmation
	 */
	const handleConfirmDelete = async () => {
		try {
			const success = await confirmDelete();
			if (success) {
				// Solo mostrar éxito y ejecutar callback si la eliminación fue exitosa
				showToast(
					configureSuccessToast(
						t("clients_deleted_success", { count: selectedClientIds.length })
					)
				);
			} else {
				// Si confirmDelete() retorna false, mostrar error
				const errorMessage = t("clients_deleted_error", {
					count: selectedClientIds.length,
				});
				showToast(
					configureErrorToastWithTranslation(
						EnumErrorType.Critical,
						t,
						errorMessage,
						"try_again"
					)
				);
			}
			onClientsDeleted?.();
		} catch (error) {
			const errorMessage = t("clients_deleted_error", {
				count: selectedClientIds.length,
			});
			showToast(
				configureErrorToastWithTranslation(
					EnumErrorType.Critical,
					t,
					errorMessage,
					error instanceof Error ? error.message : "try_again"
				)
			);
		} finally {
			// Cerrar el modal siempre, independientemente del resultado
			closeModal();
		}
	};

	return (
		<div className="flex items-center gap-4 overflow-auto px-[6px] py-[4px] justify-between">
			{/* Left section: Selection info */}
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
					placeholder={t("clients_search_placeholder", "Buscar contactos...")}
					// size="sm"
					value={searchValue}
					onValueChange={handleSearchChange}
				/>
				{(filterSelectedKeys === "all" || filterSelectedKeys.size > 0) && (
					<>
						<Divider className="h-5" orientation="vertical" />
						<div className="text-default-800 text-sm whitespace-nowrap">
							{filterSelectedKeys === "all"
								? t("clients_all_selected", "Todos seleccionados")
								: t("clients_selected_count", {
										count: filterSelectedKeys.size || 0,
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
									{t("clients_selected_actions", "Acciones")}
								</Button>
							</DropdownTrigger>
							<DropdownMenu
								aria-label="Selected Actions"
								onAction={(key) => {
									if (key === "delete") {
										handleOpenDeleteModal();
									}
								}}
							>
								{/* <DropdownItem
									key="export"
									textValue={t("clients_action_export", "Exportar")}
								>
									{t("clients_action_export", "Exportar")}
								</DropdownItem> */}
								<DropdownItem
									key="delete"
									className="text-danger"
									textValue={t("clients_action_delete", "Eliminar")}
								>
									{t("clients_action_delete", "Eliminar")}
								</DropdownItem>
							</DropdownMenu>
						</Dropdown>
					</>
				)}
			</div>

			{/* Right section: Table controls */}
			<div className="flex items-center gap-4">
				{/* Save view button - enable only when filters are applied or search results */}
				<ResponsiveButton
					icon="solar:folder-favourite-bookmark-outline"
					text={t("clients_button_save_view", "Guardar vista")}
					variant="solid"
					color="primary"
					ariaLabel={t("clients_button_save_view")}
					isDisabled={!hasActiveFilters}
					size="sm"
					onPress={handleSaveView}
				/>

				{/* Clear filters button */}
				<ResponsiveButton
					icon="solar:refresh-outline"
					text={t("clients_button_clear_filters", "Limpiar filtros")}
					variant="solid"
					className="bg-default-100 text-default-800"
					color="default"
					ariaLabel={t("clients_button_clear_filters", "Limpiar filtros")}
					iconClassName="text-default-800"
					size="sm"
					isDisabled={!hasActiveFilters}
					onPress={handleClearFilters}
				/>

				{/* List saved views dropdown */}
				<SavedViewsDropdown
					views={views}
					className="bg-default-100 text-default-800"
					selectedView={selectedViewId || undefined}
					disabled={isLoadingViews}
					onViewSelect={handleViewSelect}
					onViewDelete={handleViewDelete}
				/>

				{/* Filter button*/}
				<ResponsiveButton
					icon="solar:tuning-2-outline"
					text={t("button_filter", "Filtros")}
					variant="solid"
					className="bg-default-100 text-default-800"
					color="default"
					onPress={handleOpenFilterModal}
					ariaLabel={t("button_filter", "Filtros")}
					iconClassName="text-default-800"
					size="sm"
					endContent={
						activeFiltersCount > 0 && (
							<span className="bg-primary text-primary-foreground text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
								{activeFiltersCount}
							</span>
						)
					}
				/>

				{/* Column manager */}
				<ColumnManager
					fields={fields}
					onFieldVisibilityChange={setFieldVisibility}
					className="bg-default-100 text-default-800"
				/>
				{handleOpenImportModal && (
					<Button
						variant="solid"
						color="primary"
						className="bg-default-100 text-default-800"
						size="sm"
						onPress={handleOpenImportModal}
						aria-label={t("import_contacts_title", "Importar contactos")}
						isIconOnly
						startContent={
							<IconComponent
								icon="solar:upload-minimalistic-outline"
								size="sm"
							/>
						}
					/>
				)}
				<Button
					variant="solid"
					color="primary"
					className="bg-default-100 text-default-800"
					size="sm"
					onPress={handleExport}
					aria-label={t("button_export", "Exportar")}
					isIconOnly
					isLoading={isExporting}
					isDisabled={isExporting}
					startContent={
						!isExporting ? (
							<IconComponent
								icon="solar:download-minimalistic-outline"
								size="sm"
							/>
						) : undefined
					}
				/>
			</div>

			{/* Delete Confirmation Modal */}
			<ConfirmDeleteModal
				isOpen={isModalOpen}
				onClose={closeModal}
				onConfirm={handleConfirmDelete}
				title={modalTitle}
				description={modalDescription}
				itemName={clientCount > 1 ? `${clientCount} contactos` : undefined}
				isLoading={isDeleting}
			/>
		</div>
	);
};
