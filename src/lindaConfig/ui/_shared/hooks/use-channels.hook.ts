import { useCallback, useEffect, useMemo, useState } from "react";
import { GetIntegrationsUseCase } from "src/integrations/application";
import {
	type IIntegration,
	IntegrationPlatform,
	IntegrationStatus,
} from "src/integrations/domain";
import { IntegrationAdapter } from "src/integrations/infrastructure";

export type ChannelType = "web" | "instagram" | "whatsapp";

export interface IChannelStatus {
	web: boolean;
	whatsapp: boolean;
	instagram: boolean;
}

export interface IChannelActiveStatus {
	web: boolean;
	whatsapp: boolean;
	instagram: boolean;
}

export interface IChannelAccounts {
	whatsapp?: string;
	instagram?: string;
}

export interface IUseChannelsReturn {
	channelStatus: IChannelStatus;
	channelActiveStatus: IChannelActiveStatus;
	channelAccounts: IChannelAccounts;
	isLoading: boolean;
	error: string | null;
	reload: () => Promise<void>;
}

/**
 * Hook para obtener el estado de los canales de integración
 * Reutiliza el IntegrationAdapter del módulo de integrations
 */
export const useChannels = (): IUseChannelsReturn => {
	const [integrations, setIntegrations] = useState<IIntegration[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Inicializar adapter y use case
	const integrationAdapter = useMemo(() => new IntegrationAdapter(), []);
	const getIntegrationsUseCase = useMemo(
		() => new GetIntegrationsUseCase(integrationAdapter),
		[integrationAdapter]
	);

	// Cargar integraciones
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

	// Cargar datos iniciales
	useEffect(() => {
		loadIntegrations();
	}, [loadIntegrations]);

	// Encontrar integración por plataforma
	const findIntegration = useCallback(
		(platform: IntegrationPlatform): IIntegration | undefined => {
			return integrations.find((i) => i.platform === platform);
		},
		[integrations]
	);

	// Determinar si un canal está integrado (registrado en la API)
	const isIntegrated = useCallback(
		(platform: IntegrationPlatform): boolean => {
			const integration = findIntegration(platform);
			if (!integration) return false;
			return integration.status !== IntegrationStatus.NOT_CONFIGURED;
		},
		[findIntegration]
	);

	// Determinar si un canal está activo
	const isActive = useCallback(
		(platform: IntegrationPlatform): boolean => {
			const integration = findIntegration(platform);
			if (!integration) return false;
			return integration.status === IntegrationStatus.ENABLED;
		},
		[findIntegration]
	);

	// Obtener el handler (número de teléfono o username)
	const getHandler = useCallback(
		(platform: IntegrationPlatform): string | undefined => {
			const integration = findIntegration(platform);
			if (!integration) return undefined;
			return integration.config?.phoneNumber;
		},
		[findIntegration]
	);

	// Mapear estados de canales
	const channelStatus: IChannelStatus = useMemo(
		() => ({
			web: true, // Web siempre está "integrado" porque usa script embed
			whatsapp: isIntegrated(IntegrationPlatform.WHATSAPP_BUSINESS),
			instagram:
				isIntegrated(IntegrationPlatform.INSTAGRAM_BUSINESS) ||
				isIntegrated(IntegrationPlatform.INSTAGRAM),
		}),
		[isIntegrated]
	);

	// Mapear estados activos
	const channelActiveStatus: IChannelActiveStatus = useMemo(
		() => ({
			web: true, // Web siempre está activo si existe el script
			whatsapp: isActive(IntegrationPlatform.WHATSAPP_BUSINESS),
			instagram:
				isActive(IntegrationPlatform.INSTAGRAM_BUSINESS) ||
				isActive(IntegrationPlatform.INSTAGRAM),
		}),
		[isActive]
	);

	// Mapear cuentas/handlers
	const channelAccounts: IChannelAccounts = useMemo(() => {
		const whatsappIntegration = findIntegration(
			IntegrationPlatform.WHATSAPP_BUSINESS
		);
		const instagramIntegration =
			findIntegration(IntegrationPlatform.INSTAGRAM_BUSINESS) ||
			findIntegration(IntegrationPlatform.INSTAGRAM);

		return {
			whatsapp: whatsappIntegration?.config?.phoneNumber,
			instagram: instagramIntegration?.config?.phoneNumber, // Instagram usa el mismo campo en config
		};
	}, [findIntegration]);

	return {
		channelStatus,
		channelActiveStatus,
		channelAccounts,
		isLoading,
		error,
		reload: loadIntegrations,
	};
};

