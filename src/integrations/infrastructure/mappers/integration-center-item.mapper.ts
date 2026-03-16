import { getIntegrationTypeConfig } from "../../domain/constants/integration-platform.constants";
import { IntegrationPlatform } from "../../domain/enums/integration-platform.enum";
import { IntegrationStatus } from "../../domain/enums/integration-status.enum";
import type { IIntegrationCenterItem } from "../../domain/interfaces/integration-center.interface";
import type { IIntegration } from "../../domain/interfaces/integration.interface";

/**
 * Mapper para convertir IIntegrationCenterItem (API) a IIntegration (UI)
 *
 * @param item - Item del Integration Center desde el API
 * @returns Integración formateada para la UI
 */
export const mapCenterItemToIntegration = (
	item: IIntegrationCenterItem
): IIntegration => {
	const typeConfig = getIntegrationTypeConfig(item.type);

	// Fallback para tipos no configurados
	const platform =
		typeConfig?.platform ?? IntegrationPlatform.WHATSAPP_BUSINESS;
	const icon = typeConfig?.icon ?? "default";
	const nameKey = typeConfig?.nameKey ?? "integration";
	const descriptionKey =
		typeConfig?.descriptionKey ?? "integration_description";

	// Si viene del backend (REGISTERING, ENABLED, DISABLED), ya está configurado
	// Solo NOT_CONFIGURED significa que no tiene setup
	const isConfigured = [
		IntegrationStatus.REGISTERING,
		IntegrationStatus.ENABLED,
		IntegrationStatus.DISABLED,
		IntegrationStatus.ERROR,
		IntegrationStatus.EXPIRED,
	].includes(item.status);

	return {
		id: item.id,
		name: item.name,
		icon,
		status: item.status,
		platform,
		config: {
			phoneNumber: item.handler,
			verifiedPhoneNumber: item.status === IntegrationStatus.ENABLED,
		},
		metadata: {
			setupCompleted: isConfigured,
			isComingSoon: item.status === IntegrationStatus.COMING_SOON,
		},
		createdAt: new Date(item.createdAt),
		updatedAt: new Date(item.updatedAt),
		nameKey,
		descriptionKey,
	};
};

/**
 * Mapper para convertir lista de IIntegrationCenterItem a IIntegration[]
 *
 * @param items - Lista de items del Integration Center desde el API
 * @returns Lista de integraciones formateadas para la UI
 */
export const mapCenterItemsToIntegrations = (
	items: IIntegrationCenterItem[]
): IIntegration[] => {
	return items.map(mapCenterItemToIntegration);
};
