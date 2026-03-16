/**
 * ContactListScreen
 *
 * Main screen for displaying clients in a table format.
 * Handles the table view with search, filters, and action buttons.
 *
 * @component
 */

import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";

import { ClientsTable } from "../components/clients-table/clients-table.component";
import { useFilters } from "@clients/ui/_shared/contexts/filters.context";
import type { ClientsOutletContext } from "@clients/ui/pages/clients-page/clients-page.context";

export const ContactListScreen = () => {
	const { clients, handleOpenWizard } =
		useOutletContext<ClientsOutletContext>();
	const { refetchClients } = useFilters();

	// Refetch clients when entering Table view to ensure fresh data from backend
	// This ensures data is always reloaded when navigating back from Kanban or other views
	// The table uses "stale-while-revalidate" pattern: shows existing data while loading new data
	useEffect(() => {
		refetchClients();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []); // Empty deps - only run on mount to trigger refetch

	return (
		<div className="space-y-4">
			<ClientsTable items={clients} onCreateClient={handleOpenWizard} />
		</div>
	);
};
