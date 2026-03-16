import {
	Pagination,
	type Selection,
	type SortDescriptor,
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
	useAuraToast,
} from "@beweco/aurora-ui";
import { DEFAULT_EXPORT_COLUMNS } from "@clients/domain/constants/export-columns.constants";
import type { IClient } from "@clients/domain/interfaces/client.interface";
import type { IField } from "@clients/domain/interfaces/field.interface";
import { useExportClientsData } from "../../hooks/use-export-clients-data.hook";
import { tableFiltersToClientFilter } from "@clients/ui/_shared/mappers/table-filters-to-client-filter.mapper";
import type { ClientsOutletContext } from "@clients/ui/pages/clients-page/clients-page.context";
import { EnumErrorType } from "@shared/domain/enums/enum-error-type.enum";
import {
	configureErrorToastWithTranslation,
	configureSuccessToast,
} from "@shared/utils";
import { useTranslate } from "@tolgee/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { FC, Key } from "react";
import { useOutletContext } from "react-router-dom";
import { ClientsEmptyState } from "@clients/ui/_shared/components/empty-state/clients-empty-state.component";
import { ClientsFilteredEmptyState } from "@clients/ui/_shared/components/empty-state/clients-filtered-empty-state.component";
import { SaveViewModal } from "../save-view-modal/save-view-modal.component";
import { useFilters } from "@clients/ui/_shared/contexts/filters.context";
import { useNavigateToClientDetail } from "@clients/ui/_shared/hooks/use-navigate-to-client-detail.hook";
import { mapSortDescriptorToOrder } from "@clients/ui/_shared/mappers/sort-descriptor-to-order.mapper";
import { ClientTableRow, ClientsTableSkeleton, ClientsTableTopContent } from "./_internal";
import type { ClientsTableProps } from "./interfaces";

/**
 * Maps IField array to table column format
 */
const mapFieldsToColumns = (fields: IField[]) => {
	return fields
		.filter((field) => field.isVisible)
		.map((field) => ({
			uid: field.key,
			name: field.label,
			sortable: true,
		}));
};

/**
 * ClientsTable Component
 *
 * A comprehensive data table component for displaying and managing client information.
 * Features include:
 * - Dynamic column generation from field configuration
 * - Sorting, filtering, and pagination
 * - Bulk selection and actions
 * - Multiple view states (loading, empty, filtered empty)
 * - Responsive design with proper accessibility
 *
 * @param items - Optional client items to display (fallback when context data unavailable)
 * @param onCreateClient - Callback function to handle client creation from empty state
 *
 * @example
 * ```tsx
 * <ClientsTable
 *   items={clientData}
 *   onCreateClient={() => setShowCreateModal(true)}
 * />
 * ```

 */
export const ClientsTable: FC<ClientsTableProps> = ({
	items: propsItems,
	onCreateClient,
}) => {
	const { t } = useTranslate();

	/* this is the page where we are currently at */
	const [page, setPage] = useState(1);
	/* this is the number of rows per page */
	const [rowsPerPage] = useState(20);
	/* this is the sort descriptor where we are sorting the table, by default is sorting by created date descending (newest first) */
	const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
		column: "createdAt",
		direction: "descending",
	});
	/* this is the state for the save view modal */
	const [isSaveViewOpen, setIsSaveViewOpen] = useState(false);
	/* this is the state for the selected keys */
	const [selectedKeys, setSelectedKeys] = useState<Selection>(
		new Set<string | number>()
	);

	// Context Data - this is the context data from the outlet
	const {
		fields,
		setFieldVisibility,
		isLoadingClients: isLoadingInitialClients,
	} = useOutletContext<ClientsOutletContext>();

	/* this is the context data from the filters context */
	const {
		appliedFilters,
		handleOpenFilterModal,
		handleApplyFilters,
		isLoadingClients: isLoadingFilteredClients,
		clientsResult,
		refetchClients,
		hasActiveFilters,
		handleResetFilters,
		getPage,
	} = useFilters();

	const { exportClientsData } = useExportClientsData();
	const { showToast } = useAuraToast();
	const { navigateToClientDetail } = useNavigateToClientDetail();

	// Loading state for export action to disable button and show spinner
	const [isExporting, setIsExporting] = useState(false);

	/* this is the derived state for the items */
	const items = clientsResult?.clients || propsItems || [];

	/**
	 * Effect to handle sort descriptor changes and update filters
	 * When the user changes sorting, we update the filters to trigger a new API call
	 */
	useEffect(() => {
		const orderValue = mapSortDescriptorToOrder(sortDescriptor);

		// Only update if the order value is different from current filters
		if (orderValue && orderValue !== appliedFilters.order) {
			const updatedFilters = {
				...appliedFilters,
				order: orderValue,
			};
			handleApplyFilters(updatedFilters);
		}
	}, [sortDescriptor, appliedFilters, handleApplyFilters]);
	/* this is the state for the loading */
	const isLoading = isLoadingFilteredClients || isLoadingInitialClients;
	/**
	 * Opens the save view modal.
	 */
	const handleSaveView = useCallback(() => {
		setIsSaveViewOpen(true);
	}, []);

	/**
	 * Returns the table header columns to display.
	 * Uses the current `fields` to generate columns with visibility handled by field.isVisible.
	 */
	const headerColumns = useMemo(() => {
		return mapFieldsToColumns(fields).map((item) => {
			if (item.uid === sortDescriptor.column) {
				return {
					...item,
					sortDirection: sortDescriptor.direction,
				};
			}
			return item;
		});
	}, [fields, sortDescriptor]);

	/**
	 * Gets visible columns that are allowed for export.
	 * Filters visible fields to only include those in DEFAULT_EXPORT_COLUMNS.
	 */
	const exportableColumns = useMemo(() => {
		const allowedColumns = DEFAULT_EXPORT_COLUMNS as readonly string[];
		return fields
			.filter((field) => field.isVisible)
			.map((field) => field.key)
			.filter((key) => allowedColumns.includes(key));
	}, [fields]);

	/**
	 * Calculates the total number of pages based on the number of items and rows per page.
	 * Uses the total from context if available for proper pagination with server-side data.
	 *
	 * @returns The total number of pages, at least 1.
	 */
	const pages =
		Math.ceil((clientsResult?.total || items.length) / rowsPerPage) || 1;

	// Sorting comparison functions removed - sorting is now handled by the server

	// Remove useless memoization - this was doing nothing
	const filterSelectedKeys = selectedKeys;

	/**
	 * Renders a table cell for a given client and column key.
	 * Delegates the rendering logic to the ClientTableRow component,
	 * which handles special cases and dynamic field rendering.
	 *
	 * @param client - The client data for the current row.
	 * @param columnKey - The key identifying the column to render.
	 * @returns A ReactNode representing the cell content.
	 */
	const renderCell = useCallback(
		(client: IClient, columnKey: Key) => {
			return (
				<ClientTableRow client={client} columnKey={columnKey} fields={fields} />
			);
		},
		[fields]
	);

	/**
	 * Optimized selection change handler
	 * Reduces complexity and improves performance for large datasets
	 */
	const onSelectionChange = useCallback(
		(keys: Selection) => {
			if (keys === "all") {
				// Select all visible items
				const allKeys = new Set(items.map((item: IClient) => String(item.id)));
				setSelectedKeys(allKeys);
			} else if (keys.size === 0) {
				// Clear selection
				setSelectedKeys(new Set<string | number>());
			} else {
				// Convert Selection to Set<string | number>
				const newKeys = new Set<string | number>();
				for (const key of keys) {
					newKeys.add(key as string | number);
				}

				// Maintain selections from other pages
				if (selectedKeys !== "all") {
					const currentPageIds = new Set(items.map((item) => String(item.id)));
					const previousSelections = selectedKeys as Set<string | number>;

					// Add selections from other pages
					for (const prevKey of previousSelections) {
						if (!currentPageIds.has(String(prevKey))) {
							newKeys.add(prevKey);
						}
					}
				}

				setSelectedKeys(newKeys);
			}
		},
		[items, selectedKeys]
	);

	/**
	 * Handles clients deletion by refetching data
	 */
	const handleClientsDeleted = useCallback(() => {
		// Clear selection after deletion
		setSelectedKeys(new Set<string | number>());
		// Trigger refetch from filters context
		refetchClients();
	}, [refetchClients]);

	const handleExport = useCallback(async () => {
		// Prevent concurrent exports or double clicks
		if (isExporting) return;
		setIsExporting(true);
		try {
			// Convert selectedKeys to string[] ids
			let selectedIds: string[] | undefined;
			if (filterSelectedKeys !== "all") {
				const setKeys = filterSelectedKeys as Set<string | number>;
				if (setKeys.size > 0) {
					selectedIds = Array.from(setKeys).map((k) => String(k));
				}
			}

			// Map applied table filters from context to domain filter
			const filters = tableFiltersToClientFilter(appliedFilters);

			await exportClientsData(
				exportableColumns.length > 0 ? exportableColumns : undefined,
				{
					selectedClientIds: selectedIds,
					filters,
				}
			);
			// Show success message from use case
			showToast(
				configureSuccessToast(
					t("export_clients_success", "Datos exportados exitosamente")
				)
			);
		} catch (error) {
			const errorMessage =
				error instanceof Error
					? error.message
					: "Error desconocido al exportar";

			showToast(
				configureErrorToastWithTranslation(
					EnumErrorType.Critical,
					t,
					errorMessage,
					"try_again"
				)
			);
		} finally {
			setIsExporting(false);
		}
	}, [
		exportClientsData,
		showToast,
		t,
		filterSelectedKeys,
		appliedFilters,
		isExporting,
		exportableColumns,
	]);

	// Content for the top of the table, with the search, filters, etc.
	const topContent = useMemo(() => {
		return (
			<ClientsTableTopContent
				filterSelectedKeys={filterSelectedKeys}
				fields={fields}
				setFieldVisibility={setFieldVisibility}
				handleSaveView={handleSaveView}
				handleOpenFilterModal={handleOpenFilterModal}
				onClientsDeleted={handleClientsDeleted}
				handleExport={handleExport}
				isExporting={isExporting}
			/>
		);
	}, [
		filterSelectedKeys,
		fields,
		setFieldVisibility,
		handleSaveView,
		handleOpenFilterModal,
		handleClientsDeleted,
		handleExport,
		isExporting,
	]);

	// Content for the bottom of the table, with the pagination
	const handlePageChange = useCallback(
		(nextPage: number) => {
			setPage(nextPage);
			getPage?.(nextPage, rowsPerPage);
		},
		[getPage, rowsPerPage]
	);

	const handleRowAction = useCallback(
		(key: Key) => {
			const clientId = key as string;
			const clientData = items.find((item) => String(item.id) === clientId);
			navigateToClientDetail(clientId, clientData);
		},
		[navigateToClientDetail, items]
	);

	const bottomContent = useMemo(() => {
		return (
			<div className="flex flex-col items-center justify-between gap-2 px-2 py-2 sm:flex-row">
				<Pagination
					isCompact
					showControls
					showShadow
					color="primary"
					page={page}
					total={pages}
					onChange={handlePageChange}
				/>
			</div>
		);
	}, [page, pages, handlePageChange]);

	// Memoize view state to prevent unnecessary recalculations
	// Uses "stale-while-revalidate" pattern: show existing data while loading if available
	const viewState = useMemo(() => {
		// Only show skeleton if loading AND no existing data (initial load)
		if (isLoading && items.length === 0) return "loading";
		if (items.length === 0) {
			if (hasActiveFilters) return "filtered-empty";
			if (onCreateClient) return "general-empty";
			return "table"; // Fallback to table view
		}
		return "table";
	}, [isLoading, items.length, hasActiveFilters, onCreateClient]);

	return (
		<div className="h-full w-full">
			{/* Always render topContent once at the top */}
			<div className="mb-4">{topContent}</div>

			{/* Conditional content based on single state - prevents multiple renders */}
			{viewState === "loading" ? (
				<ClientsTableSkeleton rowCount={10} />
			) : viewState === "filtered-empty" ? (
				<ClientsFilteredEmptyState
					onClearFilters={handleResetFilters}
					onOpenFilters={handleOpenFilterModal}
				/>
			) : viewState === "general-empty" && onCreateClient ? (
				<ClientsEmptyState onCreate={onCreateClient} />
			) : (
				<Table
					radius="none"
					isHeaderSticky
					aria-label={t(
						"clients_table_aria_label",
						"Tabla de contactos con filtros y paginación"
					)}
					bottomContent={bottomContent}
					bottomContentPlacement="outside"
					classNames={{
						td: "before:bg-transparent",
						wrapper: "border-none shadow-none p-1",
					}}
					selectedKeys={filterSelectedKeys}
					selectionMode="multiple"
					sortDescriptor={sortDescriptor}
					topContentPlacement="outside"
					onSelectionChange={onSelectionChange}
					onSortChange={setSortDescriptor}
					onRowAction={handleRowAction}
				>
					<TableHeader columns={headerColumns}>
						{(column) => (
							<TableColumn
								key={column.uid}
								align={"start"}
								allowsSorting={column.sortable}
							>
								{t(column.name)}
							</TableColumn>
						)}
					</TableHeader>
					<TableBody
						emptyContent={t(
							"clients_table_empty",
							"No se encontraron contactos"
						)}
						items={items}
					>
						{(item) => (
							<TableRow key={item.id} className="cursor-pointer">
								{(columnKey) => (
									<TableCell>{renderCell(item, columnKey)}</TableCell>
								)}
							</TableRow>
						)}
					</TableBody>
				</Table>
			)}

			{/* Save view modal with filters */}
			<SaveViewModal
				isOpen={isSaveViewOpen}
				onClose={() => setIsSaveViewOpen(false)}
				appliedFilters={appliedFilters}
			/>
		</div>
	);
};
