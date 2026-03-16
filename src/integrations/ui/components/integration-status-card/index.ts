// Componente principal
export { default as IntegrationStatusCard } from "./integration-status-card.component";

// Tipos
export type {
	IntegrationStatusCardProps,
	BaseIntegrationCardProps,
	ToggleableCardProps,
	ConnectableCardProps,
	ReauthorizableCardProps,
	UnifiedCardProps,
} from "./integration-status-card.types";

// Cards individuales y registry (para uso avanzado)
export {
	BaseIntegrationCard,
	NotConfiguredCard,
	RegisteringCard,
	EnabledCard,
	DisabledCard,
	ErrorCard,
	ExpiredCard,
	ComingSoonCard,
	DefaultCard,
	CARD_REGISTRY,
	getCardComponent,
} from "./cards";

// Platform icons
export { getPlatformIcon } from "./platform-icons";
