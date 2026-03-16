import { useTranslate } from "@tolgee/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
	ConnectWhatsAppBusinessUseCase,
	GetIntegrationsUseCase,
	GetSyncMonitorUseCase,
} from "../../application";
import {
	type IIntegration,
	type IIntegrationSyncMonitor,
	IntegrationPlatform,
	IntegrationStatus,
} from "../../domain";
import {
	IntegrationAdapter,
	WhatsAppBusinessAdapter,
} from "../../infrastructure";
import { useFacebookSDK } from "./use-facebook-sdk.hook";
import { useInstagramOAuth } from "./use-instagram-oauth.hook";
import { useWhatsAppSignup } from "./use-whatsapp-signup.hook";

export const useIntegrations = () => {
	const { t } = useTranslate();
	const [integrations, setIntegrations] = useState<IIntegration[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [selectedIntegration, setSelectedIntegration] =
		useState<IIntegration | null>(null);
	const [syncMonitor, setSyncMonitor] =
		useState<IIntegrationSyncMonitor | null>(null);
	const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
	const [isSetupIntroModalOpen, setIsSetupIntroModalOpen] = useState(false);
	const [isConnecting, setIsConnecting] = useState(false);

	// ==========================================================================
	// Facebook SDK and Channel Registration Hooks
	// ==========================================================================

	// Initialize Facebook SDK for WhatsApp Embedded Signup
	const {
		isReady: fbSdkReady,
		isLoading: fbSdkLoading,
		error: fbSdkError,
		FB,
	} = useFacebookSDK();

	// WhatsApp Embedded Signup hook
	const {
		isLoading: isWhatsAppSignupLoading,
		error: whatsAppSignupError,
		success: whatsAppSignupSuccess,
		channelId: whatsAppChannelId,
		initiateSignup: initiateWhatsAppSignup,
		reset: resetWhatsAppSignup,
	} = useWhatsAppSignup(FB, fbSdkReady);

	// Instagram OAuth hook
	const {
		isLoading: isInstagramOAuthLoading,
		error: instagramOAuthError,
		success: instagramOAuthSuccess,
		channelId: instagramChannelId,
		initiateOAuth: initiateInstagramOAuth,
		reset: resetInstagramOAuth,
	} = useInstagramOAuth();

	// ==========================================================================
	// Use Cases and Adapters
	// ==========================================================================

	// Inicializar casos de uso con useMemo para evitar recreación en cada render
	const integrationAdapter = useMemo(() => new IntegrationAdapter(), []);
	const whatsAppAdapter = useMemo(() => new WhatsAppBusinessAdapter(), []);

	const getIntegrationsUseCase = useMemo(
		() => new GetIntegrationsUseCase(integrationAdapter),
		[integrationAdapter]
	);

	const connectWhatsAppUseCase = useMemo(
		() =>
			new ConnectWhatsAppBusinessUseCase(whatsAppAdapter, integrationAdapter),
		[whatsAppAdapter, integrationAdapter]
	);

	const getSyncMonitorUseCase = useMemo(
		() =>
			new GetSyncMonitorUseCase(whatsAppAdapter, {
				notifyTokenExpiration: async (
					integrationId: string,
					daysUntilExpiration: number
				) => {
					// TODO: Implementar notificación de expiración de token
					console.log(
						`Token expires in ${daysUntilExpiration} days for integration ${integrationId}`
					);
				},
				notifySyncFailure: async (integrationId: string, error: string) => {
					// TODO: Implementar notificación de fallo de sincronización
					console.log(
						`Sync failure for integration ${integrationId}: ${error}`
					);
				},
				notifySetupCompletion: async (integrationId: string) => {
					// TODO: Implementar notificación de completado de configuración
					console.log(`Setup completed for integration ${integrationId}`);
				},
			}),
		[whatsAppAdapter]
	);

	// ==========================================================================
	// Data Loading
	// ==========================================================================

	// Cargar integraciones desde el adapter
	const loadIntegrations = useCallback(async () => {
		try {
			setIsLoading(true);
			setError(null);
			const data = await getIntegrationsUseCase.execute();
			setIntegrations(data);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Error loading integrations"
			);
		} finally {
			setIsLoading(false);
		}
	}, [getIntegrationsUseCase]);

	// Cargar monitor de sincronización
	const loadSyncMonitor = useCallback(
		async (integrationId: string) => {
			try {
				const monitor = await getSyncMonitorUseCase.execute(integrationId);
				setSyncMonitor(monitor);
			} catch (err) {
				console.error("Error loading sync monitor:", err);
			}
		},
		[getSyncMonitorUseCase]
	);

	// ==========================================================================
	// Integration Toggle Handler
	// ==========================================================================

	// Manejar toggle de integración
	const handleToggleIntegration = useCallback(
		async (integrationId: string, isActive: boolean) => {
			try {
				const integration = integrations.find((i) => i.id === integrationId);
				if (!integration) return;

				if (
					integration.platform === IntegrationPlatform.WHATSAPP_BUSINESS &&
					isActive
				) {
					// RN-01: Verificar si ya existe una línea activa
					try {
						await connectWhatsAppUseCase.execute();
						setIsWhatsAppModalOpen(true);
					} catch (err) {
						if (
							err instanceof Error &&
							err.message === "Ya existe una línea activa"
						) {
							// Mostrar toast de error
							setError(t("integrations_error_existing_line"));
						} else {
							setError(
								err instanceof Error ? err.message : "Error connecting WhatsApp"
							);
						}
					}
				} else {
					// Actualizar estado de la integración
					const updatedIntegrations = integrations.map((i) =>
						i.id === integrationId
							? {
									...i,
									status: isActive
										? IntegrationStatus.ENABLED
										: IntegrationStatus.DISABLED,
								}
							: i
					);
					setIntegrations(updatedIntegrations);
				}
			} catch (err) {
				setError(
					err instanceof Error ? err.message : "Error toggling integration"
				);
			}
		},
		[integrations, connectWhatsAppUseCase, t]
	);

	// ==========================================================================
	// WhatsApp Connection Handlers
	// ==========================================================================

	// Manejar conexión de WhatsApp usando Embedded Signup
	const handleWhatsAppConnect = useCallback(async () => {
		try {
			setIsConnecting(true);
			resetWhatsAppSignup();

			// Use the new Embedded Signup flow
			await initiateWhatsAppSignup();
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Error connecting WhatsApp"
			);
			setIsWhatsAppModalOpen(false);
		} finally {
			setIsConnecting(false);
		}
	}, [initiateWhatsAppSignup, resetWhatsAppSignup]);

	// Legacy OAuth handler (kept for backward compatibility)
	const handleOAuthCallback = useCallback(
		async (code: string) => {
			try {
				const integration = await connectWhatsAppUseCase.handleCallback(code);

				// Actualizar la lista de integraciones
				setIntegrations((prev) =>
					prev.map((i) =>
						i.platform === IntegrationPlatform.WHATSAPP_BUSINESS
							? { ...i, ...integration }
							: i
					)
				);

				// Cargar monitor de sincronización
				await loadSyncMonitor(integration.id);
			} catch (err) {
				setError(err instanceof Error ? err.message : "Error completing OAuth");
			}
		},
		[connectWhatsAppUseCase, loadSyncMonitor]
	);

	// ==========================================================================
	// Instagram Connection Handlers
	// ==========================================================================

	// Manejar conexión de Instagram usando OAuth
	const handleInstagramConnect = useCallback(async () => {
		try {
			setIsConnecting(true);
			resetInstagramOAuth();

			// Use the Instagram OAuth flow
			await initiateInstagramOAuth();
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Error connecting Instagram"
			);
		} finally {
			setIsConnecting(false);
		}
	}, [initiateInstagramOAuth, resetInstagramOAuth]);

	// Manejar notificación de Instagram (legacy - now replaced with actual connection)
	const handleNotifyInstagram = useCallback(
		(_integrationId: string) => {
			// Now we can actually connect Instagram
			handleInstagramConnect();
		},
		[handleInstagramConnect]
	);

	// Manejar más información de Instagram
	const handleMoreInfoInstagram = useCallback((_integrationId: string) => {
		// TODO: Abrir enlace a documentación o KB
		window.open(process.env.REACT_APP_INSTAGRAM_INTEGRATION_HELP_URL, "_blank");
	}, []);

	// ==========================================================================
	// Integration Management Handlers
	// ==========================================================================

	// Manejar gestión de integración
	const handleManageIntegration = useCallback(
		(integrationId: string) => {
			const integration = integrations.find((i) => i.id === integrationId);
			if (integration) {
				setSelectedIntegration(integration);
				loadSyncMonitor(integrationId);
			}
		},
		[integrations, loadSyncMonitor]
	);

	// Reautorizar token
	const handleReauthorize = useCallback(async () => {
		if (!selectedIntegration) return;

		try {
			setIsConnecting(true);

			if (
				selectedIntegration.platform === IntegrationPlatform.WHATSAPP_BUSINESS
			) {
				// Use Embedded Signup for reauthorization
				await initiateWhatsAppSignup();
			} else if (
				selectedIntegration.platform === IntegrationPlatform.INSTAGRAM_BUSINESS
			) {
				// Use OAuth for Instagram reauthorization
				await initiateInstagramOAuth();
			} else {
				// Fallback to legacy OAuth
				const oauthUrl = await connectWhatsAppUseCase.execute();
				window.location.href = oauthUrl;
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "Error reauthorizing");
		} finally {
			setIsConnecting(false);
		}
	}, [
		selectedIntegration,
		connectWhatsAppUseCase,
		initiateWhatsAppSignup,
		initiateInstagramOAuth,
	]);

	// ==========================================================================
	// Effects
	// ==========================================================================

	// Cargar datos iniciales
	useEffect(() => {
		loadIntegrations();
	}, [loadIntegrations]);

	// Handle WhatsApp signup success
	useEffect(() => {
		if (whatsAppSignupSuccess && whatsAppChannelId) {
			// Reload integrations to get the new channel
			loadIntegrations();
			setIsWhatsAppModalOpen(false);
		}
	}, [whatsAppSignupSuccess, whatsAppChannelId, loadIntegrations]);

	// Handle Instagram OAuth success
	useEffect(() => {
		if (instagramOAuthSuccess && instagramChannelId) {
			// Reload integrations to get the new channel
			loadIntegrations();
		}
	}, [instagramOAuthSuccess, instagramChannelId, loadIntegrations]);

	// Propagate errors from signup hooks
	useEffect(() => {
		if (whatsAppSignupError) {
			setError(whatsAppSignupError);
		}
	}, [whatsAppSignupError]);

	useEffect(() => {
		if (instagramOAuthError) {
			setError(instagramOAuthError);
		}
	}, [instagramOAuthError]);

	useEffect(() => {
		if (fbSdkError) {
			console.warn("Facebook SDK error:", fbSdkError);
		}
	}, [fbSdkError]);

	// Manejar callback de OAuth desde URL (legacy support)
	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search);
		const code = urlParams.get("code");
		const urlError = urlParams.get("error");

		// Skip if Instagram OAuth is handling this
		const isInstagramCallback = sessionStorage.getItem(
			"instagram_oauth_pending"
		);
		if (isInstagramCallback) {
			return;
		}

		if (code) {
			handleOAuthCallback(code);
			// Limpiar URL
			window.history.replaceState({}, document.title, window.location.pathname);
		} else if (urlError) {
			setError("OAuth authorization was cancelled");
			// Limpiar URL
			window.history.replaceState({}, document.title, window.location.pathname);
		}
	}, [handleOAuthCallback]);

	// ==========================================================================
	// Return Values
	// ==========================================================================

	return {
		// State
		integrations,
		isLoading,
		error,
		selectedIntegration,
		syncMonitor,
		isWhatsAppModalOpen,
		isSetupIntroModalOpen,
		isConnecting:
			isConnecting || isWhatsAppSignupLoading || isInstagramOAuthLoading,

		// Facebook SDK state
		fbSdkReady,
		fbSdkLoading,

		// WhatsApp signup state
		isWhatsAppSignupLoading,
		whatsAppSignupSuccess,

		// Instagram OAuth state
		isInstagramOAuthLoading,
		instagramOAuthSuccess,

		// Handlers
		handleToggleIntegration,
		handleWhatsAppConnect,
		handleInstagramConnect,
		handleManageIntegration,
		handleNotifyInstagram,
		handleMoreInfoInstagram,
		handleReauthorize,

		// Setters
		setIsWhatsAppModalOpen,
		setIsSetupIntroModalOpen,
		setError,

		// Reset functions
		resetWhatsAppSignup,
		resetInstagramOAuth,
	};
};
