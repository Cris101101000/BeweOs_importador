/**
 * KanbanScreen
 *
 * Displays client data in a Kanban board format with status-based columns.
 * Features:
 * - Drag and drop: Move clients between columns to change their status
 * - Status-based filtering: Shows only selected status columns with data
 * - Filter persistence: Maintains filters when switching from Table view
 * - Empty state management: Non-selected columns appear empty but visible
 *
 * @component
 */

import {
	IconComponent,
	Input,
	Kanban,
	type KanbanColumnType,
	type KanbanMoveEvent,
	type KanbanItem,
} from "@beweco/aurora-ui";

import type { EnumClientStatus } from "@clients/domain/enums/client-status.enum";
import type { IClient } from "@clients/domain/interfaces/client.interface";
import { useTranslate } from "@tolgee/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useFilters } from "@clients/ui/_shared/contexts/filters.context";
import { useNavigateToClientDetail } from "@clients/ui/_shared/hooks/use-navigate-to-client-detail.hook";
import { countActiveClientsFilters } from "@clients/ui/_shared/mappers/drawer-filters-to-clients-filter.mapper";
import { tableFiltersToClientFilter } from "@clients/ui/_shared/mappers/table-filters-to-client-filter.mapper";

import { KanbanClientCard } from "../components/kanban-client-card/kanban-client-card.component";
import { ResponsiveButton } from "@shared/ui/components/responsive-button";
import { useKanbanColumns } from "../hooks/use-kanban-columns.hook";
import { useUpdateClientStatus } from "../hooks/use-update-client-status.hook";
import { KanbanViewSkeleton } from "../components/kanban-skeleton/kanban-skeleton.component";

/**
 * Converts internal columns to KanbanColumnType format from aura-ui
 */
const mapToKanbanColumns = (
	columns: ReturnType<typeof useKanbanColumns>["columns"]
): KanbanColumnType<IClient>[] => {
	const colorMap: Record<string, KanbanColumnType<IClient>["countBadgeColor"]> =
		{
			green: "success",
			purple: "secondary",
			blue: "primary",
			red: "danger",
		};

	return columns.map((column) => ({
		id: column.id,
		title: column.title,
		items: column.clients.map((client) => ({
			id: client.id || "",
			data: client,
		})),
		countBadgeColor: colorMap[column.color] || "default",
		emptyMessage: undefined,
		hasMore: column.hasMore,
		isLoading: column.isLoading,
	}));
};

export const KanbanScreen = () => {
	const {
		handleOpenFilterModal,
		handleApplyFilters,
		appliedFilters,
		hasActiveFilters,
		handleResetFilters,
	} = useFilters();
	const { t } = useTranslate();
	const { navigateToClientDetail } = useNavigateToClientDetail();
	const { updateClientStatus } = useUpdateClientStatus();

	const [searchValue, setSearchValue] = useState<string>("");
	const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	const debouncedSearch = useCallback(
		(searchTerm: string) => {
			if (searchTimeoutRef.current) {
				clearTimeout(searchTimeoutRef.current);
			}

			searchTimeoutRef.current = setTimeout(() => {
				handleApplyFilters({ search: searchTerm.trim() || undefined });
			}, 600);
		},
		[handleApplyFilters]
	);

	useEffect(() => {
		return () => {
			if (searchTimeoutRef.current) {
				clearTimeout(searchTimeoutRef.current);
			}
		};
	}, []);

	useEffect(() => {
		setSearchValue(appliedFilters.search || "");
	}, [appliedFilters.search]);

	const baseFilter = useMemo(
		() => tableFiltersToClientFilter(appliedFilters),
		[appliedFilters]
	);

	const {
		columns,
		isInitialLoading,
		moveClientBetweenColumns,
		loadMoreClients,
	} = useKanbanColumns(baseFilter);

	const activeFiltersCount = useMemo(() => {
		return countActiveClientsFilters(appliedFilters);
	}, [appliedFilters]);

	const handleSearchChange = useCallback(
		(value: string) => {
			setSearchValue(value);
			debouncedSearch(value);
		},
		[debouncedSearch]
	);

	const handleClearFilters = useCallback(() => {
		handleResetFilters();
	}, [handleResetFilters]);

	const filteredColumns = useMemo(() => {
		const selectedStatuses = appliedFilters?.status?.selectedStatuses || [];

		if (selectedStatuses.length === 0) {
			return columns;
		}

		return columns.map((column) => {
			const isColumnSelected = selectedStatuses.includes(
				column.id as EnumClientStatus
			);

			if (isColumnSelected) {
				return column;
			}

			return {
				...column,
				clients: [],
				total: 0,
				hasMore: false,
			};
		});
	}, [columns, appliedFilters]);

	const kanbanColumns = useMemo(
		() => mapToKanbanColumns(filteredColumns),
		[filteredColumns]
	);

	const handleItemMove = useCallback(
		async (event: KanbanMoveEvent<IClient>) => {
			const { item, fromColumnId, toColumnId, toIndex } = event;

			if (fromColumnId === toColumnId) {
				return;
			}

			moveClientBetweenColumns(item.data, fromColumnId, toColumnId, toIndex);

			try {
				await updateClientStatus(
					item.data.id || "",
					toColumnId as EnumClientStatus
				);
			} catch (error) {
				moveClientBetweenColumns(item.data, toColumnId, fromColumnId, 0);
				console.error("Error updating client status:", error);
			}
		},
		[moveClientBetweenColumns, updateClientStatus]
	);

	const renderClientCard = useCallback(
		(item: KanbanItem<IClient>) => (
			<KanbanClientCard
				client={item.data}
				onClick={(client) => navigateToClientDetail(client.id || "", client)}
			/>
		),
		[navigateToClientDetail]
	);

	const kanbanTranslations = useMemo(
		() => ({
			dropHere: t("kanban_drop_here", "Soltar aquí"),
			emptyMessage: t("kanban_column_empty", "No hay clientes en esta columna"),
		}),
		[t]
	);

	return (
		<div className="flex flex-col gap-6 h-full">
			{/* Header section */}
			<div className="flex items-center gap-4 overflow-auto px-[6px] py-[4px] justify-between">
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
						value={searchValue}
						onValueChange={handleSearchChange}
					/>
				</div>

				<div className="flex items-center gap-4">
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
				</div>
			</div>

			{isInitialLoading ? (
				<KanbanViewSkeleton />
			) : (
				<Kanban<IClient>
					columns={kanbanColumns}
					renderItem={renderClientCard}
					onItemMove={handleItemMove}
					onLoadMore={loadMoreClients}
					columnWidth="280px"
					columnGap="md"
					columnMaxHeight="calc(100vh - 200px)"
					horizontalScroll
					translations={kanbanTranslations}
					cardClassName="p-0"
				/>
			)}
		</div>
	);
};
