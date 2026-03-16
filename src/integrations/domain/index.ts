// Enums
export { IntegrationStatus } from "./enums/integration-status.enum";
export { IntegrationPlatform } from "./enums/integration-platform.enum";

// Constants
export { INTEGRATION_STATUS_CONFIG } from "./constants/integration-status.constants";
export type { IntegrationStatusConfig } from "./constants/integration-status.constants";
export {
	INTEGRATION_TYPE_CONFIG,
	getIntegrationTypeConfig,
	isIntegrationTypeSupported,
} from "./constants/integration-platform.constants";
export type { IntegrationTypeConfig } from "./constants/integration-platform.constants";

// Interfaces
export type { IIntegration } from "./interfaces/integration.interface";
export type { IIntegrationConfig } from "./interfaces/integration.interface";
export type { IIntegrationMetadata } from "./interfaces/integration.interface";
export type { IIntegrationSetupStep } from "./interfaces/integration.interface";
export type { IIntegrationSyncMonitor } from "./interfaces/integration.interface";
export type { IWhatsAppBusinessConfig } from "./interfaces/integration.interface";
export type { IIntegrationError } from "./interfaces/integration.interface";

// Integration Center
export type { IIntegrationCenterItem } from "./interfaces/integration-center.interface";
export { IntegrationCenterType } from "./interfaces/integration-center.interface";

// Ports
export type { IIntegrationPort } from "./ports/integration.port";
export type { IWhatsAppBusinessPort } from "./ports/integration.port";
export type { IIntegrationSetupPort } from "./ports/integration.port";
export type { IIntegrationNotificationPort } from "./ports/integration.port";
