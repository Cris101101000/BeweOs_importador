/**
 * useClientsPageData Hook
 *
 * Encapsulates the data fetching and state management logic
 * for the clients page. This follows the architecture pattern
 * of keeping business logic in hooks, not in pages.
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useAuraToast } from "@beweco/aurora-ui";
import {
	CLIENT_VIEW_PATHS,
	ClientViewMode,
} from "@clients/domain/enums/client-view.enum";
import { PAGINATION } from "@clients/domain/constants/pagination.constants";
import type { IClientFilter } from "@clients/domain/interfaces/client-filter.interface";
import type { IClient } from "@clients/domain/interfaces/client.interface";
import type { IField } from "@clients/domain/interfaces/field.interface";
import { EnumErrorType } from "@shared/domain/enums/enum-error-type.enum";
import { useClientCreationWizard } from "@shared/ui/contexts/client-creation-wizard-context/client-creation-wizard.context";
import { useQuickContactModal } from "@clients/ui/_shared/contexts";
import { useAiTags } from "@shared/ui/components/client-creation-wizard/hooks/use-ai-tags.hook";
import { configureErrorToastWithTranslation } from "@shared/utils";
import { useTranslate } from "@tolgee/react";
import type { IClientCreationFormData } from "@shared/ui/components/client-creation-wizard/client-creation-wizard.types";

import { useClientsByFilter } from "./use-clients-by-filter.hook";
import { tableFiltersToClientFilter } from "@clients/ui/_shared/mappers/table-filters-to-client-filter.mapper";
import { clientFilterToTableFilters } from "@clients/ui/_shared/mappers/client-filter-to-table-filters.mapper";
import type { ClientsTableFilters } from "@clients/ui/_shared/components/clients-filter-drawer/clients-filter-drawer.types";
import type { ClientsOutletContext } from "@clients/ui/pages/clients-page/clients-page.context";

/**
 * Default table columns configuration
 * Keys must match the switch cases in ClientTableRow component
 */
const DEFAULT_FIELDS: IField[] = [
	{ key: "contact", label: "clients_column_contact", isVisible: true, canHide: false },
	{ key: "email", label: "clients_column_email", isVisible: true, dataType: "TEXT" },
	{ key: "phone", label: "clients_column_phone", isVisible: true },
	{ key: "status", label: "clients_column_status", isVisible: true },
	{ key: "ai_tags", label: "clients_column_tags", isVisible: true },
	{ key: "potency", label: "clients_column_potency", isVisible: true },
	{
		key: "last_communication",
		label: "clients_column_last_communication",
		isVisible: true,
		dataType: "DATE",
	},
	{ key: "gender", label: "clients_column_gender", isVisible: false },
	{ key: "created_channel", label: "clients_column_created_channel", isVisible: false },
	{ key: "createdAt", label: "clients_column_created_at", isVisible: false, dataType: "DATE" },
	{ key: "birthdate", label: "clients_column_birthdate", isVisible: false, dataType: "DATE" },
	{ key: "quick_actions", label: "clients_column_actions", isVisible: true, canHide: false },
];

/**
 * Creates a handler for client creation success
 */
const createClientCreatedHandler = (
	updateClientFilters: (filters: IClientFilter) => void
) => {
	return () => {
		updateClientFilters({
			limit: PAGINATION.limit,
			offset: 0,
		});
	};
};

export const useClientsPageData = () => {
	const { openWizard } = useClientCreationWizard();
	const { openModal: openQuickContactModal } = useQuickContactModal();
	const location = useLocation();
	const navigate = useNavigate();
	const { aiTags } = useAiTags();
	const { showToast } = useAuraToast();
	const { t } = useTranslate();

	// State for table columns configuration
	const [fields, setFields] = useState<IField[]>(DEFAULT_FIELDS);

	// Handler for toggling field visibility
	const setFieldVisibility = useCallback(
		(fieldKey: string, visible: boolean) => {
			setFields((prev) =>
				prev.map((field) =>
					field.key === fieldKey ? { ...field, isVisible: visible } : field
				)
			);
		},
		[]
	);

	// Memoize initial table filters
	const initialTableFilters = useMemo(() => {
		return clientFilterToTableFilters({});
	}, []);

	// State for managing applied table filters
	const [appliedTableFilters, setAppliedTableFilters] =
		useState<Partial<ClientsTableFilters>>(initialTableFilters);

	// Memoize initial filters
	const initialFilters = useMemo(
		() => ({
			limit: PAGINATION.limit,
			offset: 0,
		}),
		[]
	);

	const {
		result: clientsResult,
		isLoading: isLoadingClients,
		error: clientsError,
		refetch: refetchClients,
		setFilters: updateClientFilters,
		getPage,
	} = useClientsByFilter(initialFilters);

	// Handler for successful client creation
	const handleClientCreated = useMemo(
		() => createClientCreatedHandler(updateClientFilters),
		[updateClientFilters]
	);

	// Handler for wizard creation
	const handleClientCreatedFromWizard = useCallback(
		(_client: IClientCreationFormData) => {
			handleClientCreated();
		},
		[handleClientCreated]
	);

	// Opens the client creation wizard
	const handleOpenWizard = useCallback(() => {
		openWizard(handleClientCreatedFromWizard);
	}, [openWizard, handleClientCreatedFromWizard]);

	// Handles campaign creation (TODO)
	const handleCreateCampaign = useCallback(() => {
		// TODO: Implement campaign creation flow
	}, []);

	// Opens the quick contact modal
	const handleOpenQuickContact = useCallback(() => {
		openQuickContactModal(handleClientCreated);
	}, [openQuickContactModal, handleClientCreated]);

	// Handles filter application
	const handleApplyFilters = useCallback(
		(filters: Partial<ClientsTableFilters>) => {
			setAppliedTableFilters(filters);
			const domainFilters = tableFiltersToClientFilter(filters);

			const updatedFilters: IClientFilter = {
				limit: PAGINATION.limit,
				offset: 0,
				...domainFilters,
			};

			updateClientFilters(updatedFilters);
		},
		[updateClientFilters]
	);

	// Handles filter reset
	const handleResetFilters = useCallback(() => {
		setAppliedTableFilters(initialTableFilters);
		updateClientFilters(initialFilters);
	}, [updateClientFilters, initialFilters, initialTableFilters]);

	// Derived data
	const clients: IClient[] = useMemo(
		() => clientsResult?.clients || [],
		[clientsResult?.clients]
	);

	const tableColumns: IField[] = useMemo(() => fields, [fields]);

	const totalClients = useMemo(
		() => clientsResult?.total || 0,
		[clientsResult?.total]
	);

	// Outlet context for child routes
	const outletContext = useMemo<ClientsOutletContext>(
		() => ({
			clients,
			fields: tableColumns,
			isLoadingFields: isLoadingClients,
			setFieldVisibility,
			handleOpenWizard,
			totalClients,
			isLoadingClients,
			clientsError,
			refetchClients,
		}),
		[
			clients,
			tableColumns,
			isLoadingClients,
			setFieldVisibility,
			handleOpenWizard,
			totalClients,
			clientsError,
			refetchClients,
		]
	);

	// Current view mode based on URL
	const viewMode: ClientViewMode = useMemo(() => {
		return location.pathname.includes(ClientViewMode.Kanban)
			? ClientViewMode.Kanban
			: ClientViewMode.Table;
	}, [location.pathname]);

	// Handle view mode change
	const handleViewModeChange = useCallback(
		(key: React.Key) => {
			const next = key as ClientViewMode;
			navigate(CLIENT_VIEW_PATHS[next]);
		},
		[navigate]
	);

	// Redirect to default table view if accessing base route
	useEffect(() => {
		if (location.pathname === "/clients" || location.pathname === "/clients/") {
			navigate(CLIENT_VIEW_PATHS.table, { replace: true });
		}
	}, [location.pathname, navigate]);

	// Show error toast on clients loading error
	useEffect(() => {
		if (clientsError) {
			showToast(
				configureErrorToastWithTranslation(
					EnumErrorType.Critical,
					t,
					t("error_loading_clients", "Error al cargar los contactos"),
					"try_again"
				)
			);
		}
	}, [clientsError, showToast, t]);

	// Stable callbacks
	const stableCallbacks = useMemo(
		() => ({
			onViewModeChange: handleViewModeChange,
			onCreateCampaign: handleCreateCampaign,
			onOpenQuickContact: handleOpenQuickContact,
			onOpenWizard: handleOpenWizard,
		}),
		[
			handleViewModeChange,
			handleCreateCampaign,
			handleOpenQuickContact,
			handleOpenWizard,
		]
	);

	// Filters provider props
	const filtersProviderProps = useMemo(
		() => ({
			availableTags: aiTags,
			clientsData: {
				result: clientsResult,
				isLoading: isLoadingClients,
				error: clientsError,
				refetch: refetchClients,
			},
			onApplyFilters: handleApplyFilters,
			onResetFilters: handleResetFilters,
			appliedFilters: appliedTableFilters,
			getPage,
		}),
		[
			aiTags,
			clientsResult,
			isLoadingClients,
			clientsError,
			refetchClients,
			handleApplyFilters,
			handleResetFilters,
			appliedTableFilters,
			getPage,
		]
	);

	return {
		viewMode,
		totalClients,
		isLoadingClients,
		outletContext,
		stableCallbacks,
		filtersProviderProps,
		refetchClients,
	};
};
