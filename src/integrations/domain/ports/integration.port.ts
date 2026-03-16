import type { IntegrationPlatform } from "../enums/integration-platform.enum";
import type { IntegrationStatus } from "../enums/integration-status.enum";
import type {
	IIntegration,
	IIntegrationSetupStep,
	IIntegrationSyncMonitor,
} from "../interfaces/integration.interface";

export interface IIntegrationPort {
	getIntegrations(): Promise<IIntegration[]>;
	updateIntegrationStatus(
		id: string,
		status: IntegrationStatus
	): Promise<IIntegration>;
}

export interface IWhatsAppBusinessPort {
	initiateOAuth(): Promise<string>; // Retorna la URL de autorización
	handleOAuthCallback(code: string): Promise<IIntegration>;
	refreshToken(
		refreshToken: string
	): Promise<{ accessToken: string; expiresAt: Date }>;
	verifyPhoneNumber(phoneId: string): Promise<boolean>;
	getSyncMonitor(integrationId: string): Promise<IIntegrationSyncMonitor>;
	validateExistingLine(): Promise<boolean>; // RN-01: Verificar si ya existe una línea activa
}

export interface IIntegrationSetupPort {
	getSetupSteps(
		platform: IntegrationPlatform
	): Promise<IIntegrationSetupStep[]>;
	markStepCompleted(stepId: string): Promise<void>;
	completeSetup(integrationId: string): Promise<void>;
}

export interface IIntegrationNotificationPort {
	notifyTokenExpiration(
		integrationId: string,
		daysUntilExpiration: number
	): Promise<void>;
	notifySyncFailure(integrationId: string, error: string): Promise<void>;
	notifySetupCompletion(integrationId: string): Promise<void>;
}
