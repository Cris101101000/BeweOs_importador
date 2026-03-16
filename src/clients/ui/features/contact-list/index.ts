/**
 * Contact List Feature
 *
 * Exports for the clients table/list functionality
 */

// Screens
export { ContactListScreen } from "./screens";

// Components
export { ClientsTable } from "./components/clients-table/clients-table.component";
export { ColumnManager } from "./components/column-manager/column-manager.component";
export { SaveViewModal } from "./components/save-view-modal/save-view-modal.component";
export { SavedViewsDropdown } from "./components/saved-views-dropdown/saved-views-dropdown.component";

// Hooks
export { useClientsByFilter } from "./hooks/use-clients-by-filter.hook";
export { useExportClientsData } from "./hooks/use-export-clients-data.hook";
export { useDeleteClients } from "./hooks/use-delete-clients.hook";
export { useDeleteClientsModal } from "./hooks/use-delete-clients-modal.hook";

// DependencyInjection
export * from "./DependencyInjection";
