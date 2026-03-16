// Adapters
export { IntegrationAdapter } from "./adapters/integration.adapter";
export { WhatsAppBusinessAdapter } from "./adapters/whatsapp-business.adapter";

// DTOs
export {
	// Enums
	ChannelType,
	ChannelProvider,
	ChannelStatus,
	ChannelDirection,
	// List Channels
	type ChannelDto,
	type ListChannelsResponseDto,
	type ChannelFiltersDto,
	// Available Channels
	type ProviderInfoDto,
	type AvailableChannelDto,
	type AvailableChannelsResponseDto,
	// Registration Config
	type WhatsAppRegistrationConfigDto,
	type InstagramRegistrationConfigDto,
	type GenericRegistrationConfigDto,
	type ProviderRegistrationConfigDto,
	type RegistrationConfigResponseDto,
	type RegistrationConfigParamsDto,
	// Requirements
	type RequirementsResponseDto,
	// Create Channel
	type GupshupEmbeddedSignupDataDto,
	type GupshupConfigDto,
	type MetaInstagramConfigDto,
	type ProviderConfigDto,
	type CreateChannelRequestDto,
	type CreateChannelResponseDto,
	// Type Guards
	isWhatsAppConfig,
	isInstagramConfig,
	isGenericConfig,
} from "./dtos";

// Mappers
export {
	mapCenterItemToIntegration,
	mapCenterItemsToIntegrations,
} from "./mappers/integration-center-item.mapper";

export {
	mapChannelStatusToIntegrationStatus,
	mapChannelTypeToIntegrationCenterType,
	mapChannelToIntegrationCenterItem,
	mapChannelsToIntegrationCenterItems,
} from "./mappers/channel-to-integration.mapper";

// Mocks
export {
	getAllIntegrationsCenterResponseMock,
	getIntegrationsResponseMock,
	getWhatsAppBusinessActiveMock,
	getWhatsAppBusinessPendingMock,
} from "./mocks/integrations-response.mock";
