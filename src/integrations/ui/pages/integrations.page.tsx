import { Alert, P, Spinner } from "@beweco/aurora-ui";
import { PageHeader } from "@shared/ui/components/page-header";
import { useTranslate } from "@tolgee/react";
import type { FC } from "react";
import { useState } from "react";
import { IntegrationStatus } from "../../domain";
import {
	IntegrationCard,
	MetaConnectionModal,
	WhatsAppConnectionModal,
	WhatsAppDeactivateModal,
	WhatsAppSetupIntroModal,
	WhatsAppSetupModal,
} from "../components";
import { useIntegrations } from "../hooks";

const IntegrationsPage: FC = () => {
	const { t } = useTranslate();
	const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
	const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
	const [selectedIntegrationToDeactivate, setSelectedIntegrationToDeactivate] =
		useState<string | null>(null);
	const [isDeactivating, setIsDeactivating] = useState(false);
	const [isMetaModalOpen, setIsMetaModalOpen] = useState(false);
	const [selectedMetaPlatform, setSelectedMetaPlatform] = useState("");

	const {
		integrations,
		isLoading,
		error,
		isWhatsAppModalOpen,
		isSetupIntroModalOpen,
		isConnecting,
		handleToggleIntegration,
		handleWhatsAppConnect,
		handleInstagramConnect,
		handleManageIntegration,
		handleNotifyInstagram,
		handleMoreInfoInstagram,
		setIsWhatsAppModalOpen,
		setIsSetupIntroModalOpen,
		setError,
	} = useIntegrations();

	// Función para manejar la apertura del modal de desactivación
	const handleToggleWithConfirmation = (
		integrationId: string,
		isActive: boolean
	) => {
		const integration = integrations.find((i) => i.id === integrationId);

		// Si es una integración activa que se va a desactivar, mostrar modal de confirmación
		if (integration?.status === IntegrationStatus.ENABLED && !isActive) {
			setSelectedIntegrationToDeactivate(integrationId);
			setIsDeactivateModalOpen(true);
		} else {
			// Para otros casos, usar la función original
			handleToggleIntegration(integrationId, isActive);
		}
	};

	// Función para confirmar la desactivación
	const handleConfirmDeactivation = async () => {
		if (!selectedIntegrationToDeactivate) return;

		try {
			setIsDeactivating(true);
			await handleToggleIntegration(selectedIntegrationToDeactivate, false);
			setIsDeactivateModalOpen(false);
			setSelectedIntegrationToDeactivate(null);
		} catch (err) {
			console.error("Error deactivating integration:", err);
		} finally {
			setIsDeactivating(false);
		}
	};

	// Función para cancelar la desactivación
	const handleCancelDeactivation = () => {
		setIsDeactivateModalOpen(false);
		setSelectedIntegrationToDeactivate(null);
	};

	// Función para iniciar el proceso de configuración desde el modal de introducción
	const handleStartSetup = () => {
		setIsSetupIntroModalOpen(false);
		setIsProfileModalOpen(true);
	};

	const handleConnectClick = (integrationId: string) => {
		const integration = integrations.find((i) => i.id === integrationId);

		if (!integration) return;

		// Instagram: Redirigir directamente a OAuth (sin modal)
		if (
			integration.platform === "instagram_business" ||
			integration.platform === "instagram" ||
			integration.id === "instagram-default"
		) {
			handleInstagramConnect();
			return;
		}

		// WhatsApp: Mostrar modal con información
		if (integration.platform === "whatsapp_business") {
			setIsWhatsAppModalOpen(true);
			return;
		}

		// Otros: Usar WhatsApp como fallback (legacy)
		handleWhatsAppConnect();
	};

	const handleMetaConnect = () => {
		// Este handler ya no se usa, pero lo mantenemos por compatibilidad
		handleWhatsAppConnect();
		setIsMetaModalOpen(false);
	};

	if (isLoading) {
		return (
			<div className="flex h-full items-center justify-center">
				<Spinner size="lg" />
			</div>
		);
	}

	return (
		<div className="space-y-8">
			{/* Main Content */}
			<main className="space-y-6">
				{/* Header */}
				<PageHeader
					title={t("integrations_title", "Integraciones")}
				/>
				<P className="text-default-600">
					{t(
						"integrations_subtitle",
						"Conecta tus servicios favoritos para automatizar y mejorar tu flujo de trabajo"
					)}
				</P>

				{/* Error Alert */}
				{error && (
					<Alert
						color="danger"
						title={t("error_title", "Error")}
						description={error}
						isClosable
						onClose={() => setError(null)}
					/>
				)}

				{/* Integration Cards Grid - 2 columns */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
					{integrations.map((integration) => (
						<IntegrationCard
							key={integration.id}
							integration={integration}
							onToggle={handleToggleWithConfirmation}
							onManage={handleManageIntegration}
							onConnect={handleConnectClick}
							onNotify={handleNotifyInstagram}
							onMoreInfo={handleMoreInfoInstagram}
							onGuideClick={() => setIsProfileModalOpen(true)}
						/>
					))}
				</div>
			</main>

			{/* WhatsApp Setup Intro Modal */}
			<WhatsAppSetupIntroModal
				isOpen={isSetupIntroModalOpen}
				onClose={() => setIsSetupIntroModalOpen(false)}
				onStartSetup={handleStartSetup}
			/>

			{/* WhatsApp Connection Modal */}
			<WhatsAppConnectionModal
				isOpen={isWhatsAppModalOpen}
				onClose={() => setIsWhatsAppModalOpen(false)}
				onConnect={handleWhatsAppConnect}
				isLoading={isConnecting}
			/>

			{/* Meta Connection Modal (New) */}
			<MetaConnectionModal
				isOpen={isMetaModalOpen}
				onClose={() => setIsMetaModalOpen(false)}
				onConnect={handleMetaConnect}
				platformName={selectedMetaPlatform}
				isLoading={isConnecting}
			/>

			{/* WhatsApp Setup Modal */}
			<WhatsAppSetupModal
				isOpen={isProfileModalOpen}
				onClose={() => setIsProfileModalOpen(false)}
			/>

			{/* WhatsApp Deactivate Modal */}
			<WhatsAppDeactivateModal
				isOpen={isDeactivateModalOpen}
				onClose={handleCancelDeactivation}
				onConfirm={handleConfirmDeactivation}
				isLoading={isDeactivating}
				phoneNumber={
					selectedIntegrationToDeactivate
						? integrations.find((i) => i.id === selectedIntegrationToDeactivate)
								?.config?.phoneNumber
						: undefined
				}
			/>
		</div>
	);
};

export default IntegrationsPage;
