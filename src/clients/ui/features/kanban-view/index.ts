/**
 * Kanban View Feature
 *
 * Exports for the Kanban board functionality
 */

// Screens
export { KanbanScreen } from "./screens";

// Components
export { KanbanClientCard } from "./components/kanban-client-card/kanban-client-card.component";

// Hooks
export { useKanbanColumns } from "./hooks/use-kanban-columns.hook";
export { useUpdateClientStatus } from "./hooks/use-update-client-status.hook";

// DependencyInjection
export * from "./DependencyInjection";
