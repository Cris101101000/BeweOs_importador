/**
 * Shared UI exports for the clients module
 *
 * Contains components, hooks, contexts, and mappers used by multiple features
 */

// Components
export { ResponsiveButton } from "@shared/ui/components/responsive-button";
export { ClientsEmptyState } from "./components/empty-state/clients-empty-state.component";
export { ClientsFilteredEmptyState } from "./components/empty-state/clients-filtered-empty-state.component";
export { ClientsFilterDrawer } from "./components/clients-filter-drawer/clients-filter-drawer.component";

// Contexts
export { FiltersProvider, useFilters } from "./contexts/filters.context";
export { ViewsProvider, useViewsContext } from "./contexts/views.context";
export { CreateNoteModalProvider, useCreateNoteModal } from "./contexts/create-note-modal.context";
export { ManageTagsModalProvider, useManageTagsModal } from "./contexts/manage-tags-modal.context";

// Hooks
export { useNavigateToClientDetail } from "./hooks/use-navigate-to-client-detail.hook";
export { useModalState } from "./hooks/use-modal-state.hook";
export { useDeleteModals } from "./hooks/use-delete-modals.hook";

// Mappers
export { tableFiltersToClientFilter } from "./mappers/table-filters-to-client-filter.mapper";
export { clientFilterToTableFilters } from "./mappers/client-filter-to-table-filters.mapper";
export { countActiveClientsFilters } from "./mappers/drawer-filters-to-clients-filter.mapper";
export { mapSortDescriptorToOrder } from "./mappers/sort-descriptor-to-order.mapper";

// Types
export type { ClientsTableFilters } from "./components/clients-filter-drawer/clients-filter-drawer.types";
