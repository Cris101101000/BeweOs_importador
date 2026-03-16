import type { IntegrationPlatform } from "../enums/integration-platform.enum";
import type { IntegrationStatus } from "../enums/integration-status.enum";

export interface IIntegration {
	id: string;
	name: string;
	icon: string;
	status: IntegrationStatus;
	platform: IntegrationPlatform;
	config?: IIntegrationConfig;
	metadata?: IIntegrationMetadata;
	createdAt: Date;
	updatedAt: Date;
	/** Clave de traducción para el nombre (usar con t()) */
	nameKey: string;
	/** Clave de traducción para la descripción (usar con t()) */
	descriptionKey: string;
}

export interface IIntegrationConfig {
	accessToken?: string;
	wabaId?: string;
	phoneId?: string;
	phoneNumber?: string;
	verifiedPhoneNumber?: boolean;
	expiresAt?: Date;
	refreshToken?: string;
}

export interface IIntegrationMetadata {
	lastSync?: Date | string;
	messages24h?: number;
	webhookUrl?: string;
	setupCompleted?: boolean;
	oauthRedirectUrl?: string;
	features?: string[];
	isComingSoon?: boolean;
}

export interface IIntegrationSetupStep {
	id: string;
	title: string;
	description: string;
	completed: boolean;
	webhookEvent?: string;
	order: number;
}

export interface IIntegrationSyncMonitor {
	status: IntegrationStatus;
	lastSync: Date;
	messages24h: number;
	errorCount: number;
	nextSync: Date;
	tokenExpiresIn: number; // días
}

export interface IWhatsAppBusinessConfig extends IIntegrationConfig {
	verifiedPhoneNumber: boolean;
	phoneNumber: string;
	wabaId: string;
	phoneId: string;
	accessToken: string;
	refreshToken?: string;
	expiresAt: Date;
}

export interface IIntegrationError {
	code: string;
	message: string;
	details?: string;
	actionRequired?: boolean;
	kbArticleUrl?: string;
}
