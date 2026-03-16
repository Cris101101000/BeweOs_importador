import { IntegrationPlatform } from "../enums/integration-platform.enum";
import { IntegrationCenterType } from "../interfaces/integration-center.interface";

/**
 * Configuración de cada tipo de integración
 * Mapea IntegrationCenterType a su configuración completa
 */
export interface IntegrationTypeConfig {
	platform: IntegrationPlatform;
	icon: string;
	nameKey: string;
	descriptionKey: string;
}

/**
 * Diccionario de configuración por tipo de integración
 * Permite agregar nuevas integraciones de forma dinámica
 */
export const INTEGRATION_TYPE_CONFIG: Record<
	IntegrationCenterType,
	IntegrationTypeConfig
> = {
	[IntegrationCenterType.WHATSAPP]: {
		platform: IntegrationPlatform.WHATSAPP_BUSINESS,
		icon: "whatsapp",
		nameKey: "integrations_platform_whatsapp_name",
		descriptionKey: "integrations_platform_whatsapp_description",
	},
	[IntegrationCenterType.INSTAGRAM]: {
		platform: IntegrationPlatform.INSTAGRAM_BUSINESS,
		icon: "instagram",
		nameKey: "integrations_platform_instagram_name",
		descriptionKey: "integrations_platform_instagram_description",
	},
	// TODO: Agregar más tipos cuando estén disponibles
	// [IntegrationCenterType.TELEGRAM]: {
	// 	platform: IntegrationPlatform.TELEGRAM,
	// 	icon: "telegram",
	// 	nameKey: "integrations_platform_telegram_name",
	// 	descriptionKey: "integrations_platform_telegram_description",
	// },
	// [IntegrationCenterType.FACEBOOK]: {
	// 	platform: IntegrationPlatform.FACEBOOK,
	// 	icon: "facebook",
	// 	nameKey: "integrations_platform_facebook_name",
	// 	descriptionKey: "integrations_platform_facebook_description",
	// },
	// [IntegrationCenterType.GOOGLE_BUSINESS]: {
	// 	platform: IntegrationPlatform.GOOGLE_BUSINESS,
	// 	icon: "google-business",
	// 	nameKey: "integrations_platform_google_business_name",
	// 	descriptionKey: "integrations_platform_google_business_description",
	// },
	// [IntegrationCenterType.METRICOOL]: {
	// 	platform: IntegrationPlatform.METRICOOL,
	// 	icon: "metricool",
	// 	nameKey: "integrations_platform_metricool_name",
	// 	descriptionKey: "integrations_platform_metricool_description",
	// },
} as const;

/**
 * Obtiene la configuración de un tipo de integración
 * @param type - Tipo de integración del API
 * @returns Configuración del tipo o undefined si no existe
 */
export const getIntegrationTypeConfig = (
	type: IntegrationCenterType
): IntegrationTypeConfig | undefined => {
	return INTEGRATION_TYPE_CONFIG[type];
};

/**
 * Verifica si un tipo de integración está soportado
 * @param type - Tipo de integración del API
 * @returns true si el tipo está configurado
 */
export const isIntegrationTypeSupported = (
	type: IntegrationCenterType
): boolean => {
	return type in INTEGRATION_TYPE_CONFIG;
};
