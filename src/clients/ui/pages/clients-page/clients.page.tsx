/**
 * ClientsPage Component
 *
 * Main route component for client management.
 * This page ONLY orchestrates features and providers.
 * All business logic is delegated to the useClientsPageData hook.
 *
 * @component
 * @example
 * ```tsx
 * // Used in router configuration
 * <Route path="/clients" element={<ClientsPage />} />
 * ```
 */

import type { FC } from "react";
import { useMemo } from "react";

// Feature imports
import { useClientsPageData } from "@clients/ui/features/contact-list/hooks/use-clients-page-data.hook";

// Shared imports
import {
	CreateNoteModalProvider,
	FiltersProvider,
	ManageTagsModalProvider,
	QuickContactModalProvider,
	ViewsProvider,
} from "@clients/ui/_shared/contexts";

// Page content component
import { ClientsPageContent } from "./clients-page-content.component";

/**
 * Internal component that orchestrates the clients page.
 * Uses the useClientsPageData hook for all business logic.
 */
const ClientsPageInternal: FC = () => {
	const {
		viewMode,
		totalClients,
		isLoadingClients,
		outletContext,
		stableCallbacks,
		filtersProviderProps,
		refetchClients,
	} = useClientsPageData();

	// Memoize the context providers to prevent unnecessary re-renders
	const contextProviders = useMemo(
		() => (
			<CreateNoteModalProvider>
				<ManageTagsModalProvider onTagsUpdated={refetchClients}>
					<ClientsPageContent
						viewMode={viewMode}
						totalClients={totalClients}
						isLoadingClients={isLoadingClients}
						isLoadingFields={isLoadingClients}
						outletContext={outletContext}
						{...stableCallbacks}
					/>
				</ManageTagsModalProvider>
			</CreateNoteModalProvider>
		),
		[
			viewMode,
			totalClients,
			isLoadingClients,
			outletContext,
			stableCallbacks,
			refetchClients,
		]
	);

	return (
		<ViewsProvider>
			<FiltersProvider {...filtersProviderProps}>
				{contextProviders}
			</FiltersProvider>
		</ViewsProvider>
	);
};

/**
 * ClientsPage component - Main route component for client management.
 *
 * This component only sets up the necessary providers and delegates
 * all logic to child components and hooks following the architecture.
 */
export const ClientsPage: FC = () => {
	return (
		<QuickContactModalProvider>
			<ClientsPageInternal />
		</QuickContactModalProvider>
	);
};
