import { IntegrationStatus } from "../enums/integration-status.enum";

/**
 * Configuración de estados de integración
 * Mapea directamente los valores del backend a su representación visual
 */
export const INTEGRATION_STATUS_CONFIG = {
	// Estados del backend
	[IntegrationStatus.REGISTERING]: {
		translationKey: "integration_status_registering",
		defaultLabel: "Verificación Pendiente",
		description: "Pendiente de aprobación por Meta",
		icon: "⏳",
		color: "warning" as const,
	},
	[IntegrationStatus.ENABLED]: {
		translationKey: "integration_status_enabled",
		defaultLabel: "Activo",
		description: "Conectado y funcionando",
		icon: "✅",
		color: "success" as const,
	},
	[IntegrationStatus.DISABLED]: {
		translationKey: "integration_status_disabled",
		defaultLabel: "Inactivo",
		description: "Configurado pero desactivado",
		icon: "⏸️",
		color: "default" as const,
	},
	//TODO: otros posibles estados, confirmar con el back
	[IntegrationStatus.NOT_CONFIGURED]: {
		translationKey: "integration_status_not_configured",
		defaultLabel: "Sin Configurar",
		description: "Integración no configurada",
		icon: "⚙️",
		color: "default" as const,
	},
	[IntegrationStatus.ERROR]: {
		translationKey: "integration_status_error",
		defaultLabel: "Error",
		description: "Error de conexión o token expirado",
		icon: "❌",
		color: "danger" as const,
	},
	[IntegrationStatus.EXPIRED]: {
		translationKey: "integration_status_expired",
		defaultLabel: "Expirado",
		description: "Token de acceso expirado",
		icon: "⌛",
		color: "danger" as const,
	},
	[IntegrationStatus.COMING_SOON]: {
		translationKey: "integration_status_coming_soon",
		defaultLabel: "Próximamente",
		description: "Funcionalidad en desarrollo",
		icon: "🚀",
		color: "secondary" as const,
	},
} as const;

/**
 * Type for integration status configuration values
 */
export type IntegrationStatusConfig =
	(typeof INTEGRATION_STATUS_CONFIG)[IntegrationStatus];
