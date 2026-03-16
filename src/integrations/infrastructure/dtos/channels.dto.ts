/**
 * Channels API DTOs
 * Based on README-channels-api.md documentation
 */

// =============================================================================
// API Enums
// =============================================================================

export enum ChannelType {
	EMAIL = "email",
	WHATSAPP = "whatsapp",
	INSTAGRAM = "instagram",
}

export enum ChannelProvider {
	SENDGRID = "sendgrid",
	GUPSHUP = "gupshup",
	META_INSTAGRAM = "meta_instagram",
}

export enum ChannelStatus {
	PENDING = "pending",
	ACTIVE = "active",
	INACTIVE = "inactive",
	MAINTENANCE = "maintenance",
	ERROR = "error",
}

export enum ChannelDirection {
	OUTBOUND = "outbound",
	INBOUND = "inbound",
}

// =============================================================================
// List Registered Channels (GET /channels)
// =============================================================================

export interface ChannelDto {
	id: string;
	name: string;
	type: ChannelType;
	isActive: boolean;
	agencyId?: string;
	companyId?: string;
	createdBy: string;
	createdAt: string;
	updatedAt: string;
	provider: ChannelProvider;
	status: ChannelStatus;
	direction: ChannelDirection;
	providerInfo?: Record<string, unknown>;
}

export interface ListChannelsResponseDto {
	channels: ChannelDto[];
	total: number;
}

export interface ChannelFiltersDto {
	type?: ChannelType;
	provider?: ChannelProvider;
	agencyId?: string;
	companyId?: string;
	isActive?: boolean;
}

// =============================================================================
// Available Channels (GET /channels/available)
// =============================================================================

export interface ProviderInfoDto {
	provider: ChannelProvider;
	requiresExternalRegistration: boolean;
	registrationFields?: string[];
}

export interface AvailableChannelDto {
	type: ChannelType;
	providers: ProviderInfoDto[];
}

export interface AvailableChannelsResponseDto {
	channels: AvailableChannelDto[];
}

// =============================================================================
// Registration Config (GET /channels/registration-config)
// =============================================================================

export interface WhatsAppRegistrationConfigDto {
	configurationId: string;
	solutionId: string;
}

export interface InstagramRegistrationConfigDto {
	authorizationUrl: string;
}

export interface GenericRegistrationConfigDto {
	requiresExternalRegistration: false;
	message: string;
}

export type ProviderRegistrationConfigDto =
	| WhatsAppRegistrationConfigDto
	| InstagramRegistrationConfigDto
	| GenericRegistrationConfigDto;

export interface RegistrationConfigResponseDto {
	type: ChannelType;
	provider: ChannelProvider;
	config: ProviderRegistrationConfigDto;
}

export interface RegistrationConfigParamsDto {
	type: ChannelType;
	provider: ChannelProvider;
	state?: string;
}

// =============================================================================
// Requirements (GET /channels/requirements)
// =============================================================================

export interface RequirementsResponseDto {
	type: ChannelType;
	provider: ChannelProvider;
	requiresExternalRegistration: boolean;
	supportedProviders: ChannelProvider[];
	registrationFields?: string[];
	description?: string;
}

// =============================================================================
// Create Channel (POST /channels)
// =============================================================================

export interface GupshupEmbeddedSignupDataDto {
	phone_number_id: string;
	waba_id: string;
	business_id: string;
}

export interface GupshupConfigDto {
	embeddedSignupData: GupshupEmbeddedSignupDataDto;
}

export interface MetaInstagramConfigDto {
	authCode: string;
}

export type ProviderConfigDto =
	| GupshupConfigDto
	| MetaInstagramConfigDto
	| Record<string, never>;

export interface CreateChannelRequestDto {
	agencyId?: string;
	companyId?: string;
	type: ChannelType;
	provider: ChannelProvider;
	channelName: string;
	platformId: string;
	config?: ProviderConfigDto;
}

export interface CreateChannelResponseDto {
	success: boolean;
	channelId?: string;
	externalChannelId?: string;
	error?: string;
	message?: string;
	metadata?: {
		authorizationUrl?: string;
		[key: string]: unknown;
	};
	timestamp: string;
}

// =============================================================================
// Type Guards
// =============================================================================

export function isWhatsAppConfig(
	config: ProviderRegistrationConfigDto
): config is WhatsAppRegistrationConfigDto {
	return "configurationId" in config && "solutionId" in config;
}

export function isInstagramConfig(
	config: ProviderRegistrationConfigDto
): config is InstagramRegistrationConfigDto {
	return "authorizationUrl" in config;
}

export function isGenericConfig(
	config: ProviderRegistrationConfigDto
): config is GenericRegistrationConfigDto {
	return (
		"requiresExternalRegistration" in config &&
		config.requiresExternalRegistration === false
	);
}
