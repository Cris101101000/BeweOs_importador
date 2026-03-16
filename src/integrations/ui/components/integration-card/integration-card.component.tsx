import type { FC } from "react";
import type { IIntegration } from "../../../domain";
import { IntegrationStatusCard } from "../integration-status-card";

interface IntegrationCardProps {
	integration: IIntegration;
	onToggle: (integrationId: string, isActive: boolean) => void;
	onManage?: (integrationId: string) => void;
	onConnect?: (integrationId: string) => void;
	onNotify?: (integrationId: string) => void;
	onMoreInfo?: (integrationId: string) => void;
	onGuideClick?: (integrationId: string) => void;
}

/**
 * IntegrationCard - Wrapper del IntegrationStatusCard para compatibilidad
 * Usa el componente dinámico IntegrationStatusCard internamente
 */
const IntegrationCard: FC<IntegrationCardProps> = ({
	integration,
	onToggle,
	onConnect,
}) => {
	return (
		<IntegrationStatusCard
			integration={integration}
			onToggle={onToggle}
			onConnect={onConnect}
			onReauthorize={onConnect} // Reautorizar usa el mismo callback de connect
		/>
	);
};

export default IntegrationCard;
