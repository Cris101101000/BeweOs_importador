// React & Router
import { useCallback, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

// External Libraries
import { useTranslate } from "@tolgee/react";

// UI Components
import { Tab, Tabs, type ChipColor } from "@beweco/aurora-ui";
import { ResponsiveButton } from "@shared/ui/components/responsive-button";

import { HISTORY_CONFIG } from "@clients/domain/constants/history.constants";
import { GetClientByIdUseCase } from "@clients/application/get-client-by-id.usecase";
import type { IClient } from "@clients/domain/interfaces/client.interface";
import { getClientFullName } from "@clients/domain/utils/client-name.utils";
import { ClientAdapter } from "@clients/infrastructure/adapters/client.adapter";
// Client Components & Hooks
import { ClientNotFound } from "@clients/ui/features/contact-details/components/client-not-found/client-not-found.component";
import { ConversationsTab } from "@clients/ui/features/contact-details/components/conversations-tab"		
import { GeneralDataTab } from "@clients/ui/features/contact-details/components/general-data";
import { NotesTab } from "@clients/ui/features/contact-details/components/notes-tab";
import { useClientActions } from "@clients/ui/features/contact-details/hooks/use-client-actions.hook";
import { useClientById } from "@clients/ui/features/contact-details/hooks/use-client-by-id.hook";
import { useClientModals } from "@clients/ui/features/contact-details/hooks/use-client-modals.hook";

// Context Providers
import { CreateNoteModalProvider } from "@clients/ui/_shared/contexts/create-note-modal.context";
import { ManageTagsModalProvider } from "@clients/ui/_shared/contexts/manage-tags-modal.context";
import type { EditContactFormData } from "@clients/ui/features/contact-details/types/edit-contact-form-data";
// Shared Components & Utils
import { useSession } from "@shared/ui/contexts/session-context/session-context";
import {
	DATE_FORMATS,
	formatDate,
	formatDateObjectToDisplay,
} from "@shared/utils/date-formatter.utils";

import { ConfirmDeleteModal } from "@shared/ui/components/confirm-delete-modal/confirm-delete-modal";
import { PageHeader } from "@shared/ui/components/page-header";
// Screens
import { ClientDetailsSkeleton } from "@clients/ui/features/contact-details/screens/client-details-skeleton.component";
import { STATUS_CLIENT } from "@clients/domain/constants/status-client.constants";

type ClientDetailsTabKey =
	// | "summary"
	| "communications"	
	| "comunications2"
	| "notes"
	| "general";

const getClientByIdUseCase = (() => {
	const adapter = new ClientAdapter();
	return new GetClientByIdUseCase(adapter);
})();

async function fetchClientById(id: string): Promise<IClient> {
	return getClientByIdUseCase.execute(id);
}

const ClientDetailsPage = () => {
	const { t } = useTranslate();
	const navigate = useNavigate();
	const location = useLocation();
	const params = useParams();
	const clientId = params.id ?? null;

	const providedClientData = location.state?.clientData ?? null;
	const [updatedClientData, setUpdatedClientData] = useState<IClient | null>(
		null
	);
	const [activeTab, setActiveTab] = useState<ClientDetailsTabKey>("general");

	const currentClientData = updatedClientData || providedClientData;

	const { client, isLoading, refetch } = useClientById(clientId, {
		clientData: currentClientData,
		preventFetch: !!currentClientData,
	});
	const { updateClient, deleteClient, isDeletingClient } = useClientActions();
	const { isDeleteModalOpen, openDeleteModal, closeDeleteModal } =
		useClientModals();
	const { agency } = useSession();

	const handleBack = useCallback(() => {
		sessionStorage.setItem("cameFromClientDetail", "true");
		navigate("/clients", { state: { fromDetail: true }, replace: false });
	}, [navigate]);

	const forceRefetch = useCallback(async () => {
		if (currentClientData && clientId && agency?.id) {
			try {
				const freshClient = await fetchClientById(clientId);
				setUpdatedClientData(freshClient);
			} catch {
				await refetch();
			}
		} else {
			await refetch();
		}
	}, [currentClientData, clientId, agency?.id, refetch]);

	const lastCommunicationDisplay = useMemo(() => {
		if (!client?.lastCommunication) return "-";
		const value = client.lastCommunication;
		return value.includes("/")
			? formatDate(value, DATE_FORMATS.display)
			: formatDateObjectToDisplay(value, DATE_FORMATS.display);
	}, [client?.lastCommunication]);

	const handleUpdateClient = useCallback(
		async (data: EditContactFormData) => {
			if (!client?.id) return;
			try {
				await updateClient(client.id, data);
				const freshClient = await fetchClientById(client.id);
				setUpdatedClientData(freshClient);
			} catch {
				// Error is already logged and displayed by useClientActions
			}
		},
		[client?.id, updateClient]
	);

	const handleDeleteClient = useCallback(async () => {
		if (!client?.id) return;
		try {
			await deleteClient(client.id);
			navigate(-1);
		} catch {
			// Error is already logged and displayed by useClientActions
		}
	}, [client?.id, deleteClient, navigate]);

	const handleTabChange = useCallback((key: string | number) => {
		setActiveTab(key as ClientDetailsTabKey);
	}, []);

	const [tagsRefreshKey, setTagsRefreshKey] = useState(0);
	const handleTagsUpdated = useCallback(() => {
		setTagsRefreshKey((k) => k + 1);
		forceRefetch();
	}, [forceRefetch]);

	if (isLoading) {
		return <ClientDetailsSkeleton />;
	}

	if (!client) {
		return <ClientNotFound onGoBack={() => navigate(-1)} />;
	}

	return (
		<CreateNoteModalProvider>
				<ManageTagsModalProvider onTagsUpdated={handleTagsUpdated}>
					<div className="w-full flex flex-col gap-4">
						{/* Header */}
					<PageHeader
						onBack={handleBack}
						title={getClientFullName(client)}
						metadata={[
							{
								key: "status",
								label: t(
									STATUS_CLIENT[client.status?.translationKey || "status_unknown"]
										.translationKey
								),
								color: client.status?.color as ChipColor,
								variant: "flat",
							},
						]}
						actions={
							<ResponsiveButton
								color="danger"
								variant="light"
								size="sm"
								onPress={openDeleteModal}
								icon="solar:trash-bin-trash-bold"
								text={t("button_delete", "Eliminar")}
							/>
						}
					/>
						{/* Body */}
						<div className="flex flex-col gap-4">
							<Tabs
								aria-label={t("client_details_tabs", "Detalle del cliente")}
								selectedKey={activeTab}
								onSelectionChange={handleTabChange}
								className="w-full"
							>
								{/* <Tab
									key="summary"
									title={t("summary_linda", "Resumen Linda")}
								/> */}
								<Tab
									key="general"
									title={t("general_data", "Información Básica")}
								/>
								<Tab
									key={HISTORY_CONFIG.tabs.communications}
									title={t(
										"conversations_history",
										"Historial de conversaciones"
									)}
								/>
								<Tab
									key={HISTORY_CONFIG.tabs.notes}
									title={t("notes_history", "Historial de notas")}
								/>
							</Tabs>
							{/* Resumen linda TODO */}
							{/* {activeTab === "summary" && (
								<SummaryTab client={client} />
							)} */}
							{activeTab === "general" && (
							<GeneralDataTab
								client={client}
								onSave={handleUpdateClient}
								lastCommunicationDisplay={
									lastCommunicationDisplay
								}
								tagsRefreshKey={tagsRefreshKey}
							/>
							)}
							{activeTab === HISTORY_CONFIG.tabs.communications && (
								<ConversationsTab client={client} />
							)}
							{activeTab === HISTORY_CONFIG.tabs.notes && (
								<NotesTab client={client} />
							)}
						</div>

						<ConfirmDeleteModal
							isOpen={isDeleteModalOpen}
							onClose={closeDeleteModal}
							onConfirm={handleDeleteClient}
							title={t(
								"delete_client_title",
								"¿Quieres eliminar este cliente?"
							)}
							description={t(
								"delete_client_description",
								"Esta acción no se puede deshacer. ¿Estás seguro de que deseas eliminar este cliente?"
							)}
							itemName={getClientFullName(client)}
							isLoading={isDeletingClient}
						/>
					</div>
				</ManageTagsModalProvider>
			</CreateNoteModalProvider>
	);
};

export default ClientDetailsPage;
