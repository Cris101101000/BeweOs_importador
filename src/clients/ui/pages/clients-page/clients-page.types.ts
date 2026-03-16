import type { ClientViewMode } from "@clients/domain/enums/client-view.enum";
import type React from "react";
import type { ClientsOutletContext } from "./clients-page.context";

/**
 * Props for the ClientsPageContent component
 */
export interface ClientsPageContentProps {
	viewMode: ClientViewMode;
	totalClients: number;
	isLoadingClients: boolean;
	isLoadingFields: boolean;
	outletContext: ClientsOutletContext;
	onViewModeChange: (key: React.Key) => void;
	onCreateCampaign: () => void;
	onOpenQuickContact: () => void;
	onOpenWizard: () => void;
}
