/**
 * Contact Details Feature
 *
 * Exports for the client details/profile functionality
 */

// Screens
export { ContactDetailsScreen, ClientDetailsSkeleton } from "./screens";

// Components
export {
	ClientInfoCard,
	type ClientInfoCardFormData,
} from "./components/client-info-card/client-info-card.component";
export { ClientNotFound } from "./components/client-not-found/client-not-found.component";
export { CreateNoteModal } from "./components/create-note-modal/create-note-modal.component";
export { ManageTagsModal } from "./components/manage-tags-modal/manage-tags-modal.component";

// Hooks
export { useClientById } from "./hooks/use-client-by-id.hook";
export { useClientNotes } from "./hooks/use-client-notes.hook";
export { useClientCommunications } from "./hooks/use-client-communications.hook";
export { useClientDataFetch } from "./hooks/use-client-data-fetch.hook";
export { useClientModals } from "./hooks/use-client-modals.hook";
export { useHistoryActions } from "./hooks/use-history-actions.hook";

// DependencyInjection
export * from "./DependencyInjection";
