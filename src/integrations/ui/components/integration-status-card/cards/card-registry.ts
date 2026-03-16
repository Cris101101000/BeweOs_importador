import type { FC } from "react";
import { IntegrationStatus } from "../../../../domain";
import type { UnifiedCardProps } from "../integration-status-card.types";

import ComingSoonCard from "./coming-soon-card.component";
import DefaultCard from "./default-card.component";
import DisabledCard from "./disabled-card.component";
import EnabledCard from "./enabled-card.component";
import ErrorCard from "./error-card.component";
import ExpiredCard from "./expired-card.component";
// Importar todas las cards
import NotConfiguredCard from "./not-configured-card.component";
import RegisteringCard from "./registering-card.component";

/**
 * Registry/Diccionario de cards por estado
 * Mapea cada IntegrationStatus a su componente correspondiente
 */
export const CARD_REGISTRY: Record<IntegrationStatus, FC<UnifiedCardProps>> = {
	[IntegrationStatus.NOT_CONFIGURED]: NotConfiguredCard,
	[IntegrationStatus.REGISTERING]: RegisteringCard,
	[IntegrationStatus.ENABLED]: EnabledCard,
	[IntegrationStatus.DISABLED]: DisabledCard,
	[IntegrationStatus.ERROR]: ErrorCard,
	[IntegrationStatus.EXPIRED]: ExpiredCard,
	[IntegrationStatus.COMING_SOON]: ComingSoonCard,
};

/**
 * Obtiene el componente de card apropiado para un estado dado
 * @param status - Estado de la integración
 * @returns Componente de card correspondiente o DefaultCard si no existe
 */
export const getCardComponent = (
	status: IntegrationStatus
): FC<UnifiedCardProps> => {
	return CARD_REGISTRY[status] || DefaultCard;
};
